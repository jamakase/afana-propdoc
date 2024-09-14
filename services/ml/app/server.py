from app.models.qa import InputChat, OutputChat
from app.routes.file import FileProcessingRequest, _process_file
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain.schema.runnable import (
    RunnableParallel,
    RunnablePassthrough,
    RunnableBranch,
)
from langserve import add_routes
from packages.llm import LLMInstance
from packages.prompts import prompt
from packages.retriever import Retriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda
from sentence_transformers import CrossEncoder
from operator import itemgetter
from langchain_core.messages import HumanMessage


from .config import config

llm_instance = LLMInstance(config)
retriever_instance = Retriever(
    llm_instance.get_embeddings(),
    host=config.QDRANT_HOST,
    collection_name=config.QDRANT_COLLECTION_NAME,
    api_key=config.QDRANT_API_KEY,
)

cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-12-v2")

retriever = retriever_instance.get_retriever()
retriever.search_kwargs["k"] = 20


def rerank_documents_with_crossencoder(query_and_docs):
    docs = query_and_docs["docs"]
    query = query_and_docs["question"]
    scores = cross_encoder.predict([(query, doc.page_content) for doc in docs])
    ranked_docs = [
        doc for _, doc in sorted(zip(scores, docs), key=lambda x: x[0], reverse=True)
    ]
    return {"docs": ranked_docs[:3], "question": query}


def join_docs(docs):
    return " ".join([doc.page_content for doc in docs])


def extract_image_info(docs):
    return [
        f"https://storage.yandexcloud.net/afana-propdoc-production/s3%3A//afana-propdoc-production/docs_extracted_data/{url.replace('_processed', '').replace('P-60.13330.2020.pdf-5', 'P-60.13330.2020.pdf').replace('unstructured_data/', '')}"
        for doc in docs
        for url in doc.metadata.get("Table", []) + doc.metadata.get("Picture", [])
    ]


def route(info):
    if not info["image_urls"]:
        return prompt
    else:
        for image_url in info["image_urls"]:
            prompt += HumanMessage(content=f"Image: {image_url}")
        return prompt


qa_chain = (
    RunnableParallel({"docs": retriever, "question": itemgetter("question")})
    | RunnableLambda(rerank_documents_with_crossencoder)
    | RunnableParallel(
        {
            "context": itemgetter("docs") | RunnableLambda(join_docs),
            "question": itemgetter("question"),
            "image_urls": itemgetter("docs") | RunnableLambda(extract_image_info),
        }
    )
    # | RunnableBranch(
    #     (lambda x: x["image_urls"], prompt),
    #     prompt
    # )
    | prompt
    | llm_instance.get_llm()
    | StrOutputParser()
    | (lambda x: {"result": x})
).with_types(input_type=InputChat, output_type=OutputChat)

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="Spin up a simple api server using Langchain's Runnable interfaces",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Add routes for the QA chain instead of just the retriever
add_routes(app, path="/llm", runnable=llm_instance.get_llm())
add_routes(app, qa_chain)
add_routes(
    app,
    RunnableLambda(_process_file).with_types(input_type=FileProcessingRequest),
    config_keys=["configurable"],
    path="/pdf",
)

retriever_chain = retriever_instance.get_retriever() | (
    lambda docs: [doc.page_content for doc in docs]
)

add_routes(app, path="/search", runnable=retriever_chain)

vqa_chain = (
    RunnableParallel(
        {
            "context": retriever_instance.get_retriever(),
            "question": RunnablePassthrough(),
        }
    )
    | RunnableLambda(lambda x: x.replace("s3://afana-propdoc-production", "https://"))
    | prompt
    | llm_instance.get_llm()
).with_types(input_type=InputChat, output_type=OutputChat)

add_routes(app, path="/vqa", runnable=vqa_chain)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=config.PORT)
