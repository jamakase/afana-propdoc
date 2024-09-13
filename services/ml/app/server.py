from app.models.qa import InputChat, OutputChat
from app.routes.file import FileProcessingRequest, _process_file
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain.schema.runnable import RunnableParallel, RunnablePassthrough
from langserve import add_routes
from packages.llm import LLMInstance
from packages.prompts import prompt
from packages.retriever import Retriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

from .config import config

llm_instance = LLMInstance(config)
retriever_instance = Retriever(llm_instance.get_embeddings(), host=config.QDRANT_HOST, collection_name=config.QDRANT_COLLECTION_NAME, api_key=config.QDRANT_API_KEY)


# Modify the qa_chain definition
qa_chain = (
    RunnableParallel(
        {"context": retriever_instance.get_retriever(), "question": RunnablePassthrough()}
    )
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

retriever_chain = retriever_instance.get_retriever() | (lambda docs: [doc.page_content for doc in docs])

add_routes(app, path="/search", runnable=retriever_chain)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=config.PORT)
