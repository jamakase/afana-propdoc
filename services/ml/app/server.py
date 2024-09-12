from fastapi import FastAPI
from langchain.chains import RetrievalQA
from langserve import add_routes

from .config import config

from packages.llm import LLMInstance
from packages.retriever import Retriever
from packages.prompts import prompt

llm_instance = LLMInstance(config)
retriever_instance = Retriever(llm_instance.get_embeddings(), host=config.QDRANT_HOST, collection_name=config.QDRANT_COLLECTION_NAME)

# Create a RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm_instance.get_llm(),
    chain_type="stuff",
    retriever=retriever_instance.get_retriever(),
    chain_type_kwargs={"prompt": prompt},
)

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="Spin up a simple api server using Langchain's Runnable interfaces",
)

# Add routes for the QA chain instead of just the retriever
add_routes(app, qa_chain)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=config.PORT)
