from fastapi import FastAPI
from langchain.chains import RetrievalQA
from langserve import add_routes

from .config import config

from packages.retriever import Retriever
from packages.prompts import prompt

import os

faiss_index_path = config.FAISS_INDEX_PATH

# Create a ChatOllama instance with the llama2 model
if config.USE_OPENROUTER:
    from langchain_community.chat_models import ChatOpenAI
    from langchain_huggingface.embeddings import HuggingFaceEmbeddings

    llm = ChatOpenAI(
        model=config.MODEL,
        openai_api_key=config.OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1",
        max_tokens=1000,
    )
    cache_folder = os.path.join(os.getcwd(), "model_cache")
    embeddings = HuggingFaceEmbeddings(
        model_name=config.EMBEDDING_MODEL, cache_folder=cache_folder
    )
else:
    from langchain_community.chat_models import ChatOllama
    from langchain_community.embeddings import OllamaEmbeddings

    llm = ChatOllama(model=config.MODEL, base_url=config.OLLAMA_HOST)
    embeddings = OllamaEmbeddings(model=config.MODEL, base_url=config.OLLAMA_HOST)

retriever_instance = Retriever(embeddings, faiss_index_path)

# Create a RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
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
