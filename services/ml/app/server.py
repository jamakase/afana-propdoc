from fastapi import FastAPI
from langchain.chains import RetrievalQA
from langserve import add_routes

from .config import config

from packages.retriever import Retriever
from packages.prompts import prompt

faiss_index_path = config.FAISS_INDEX_PATH

# Create a ChatOllama instance with the llama2 model
if config.USE_OPENROUTER:
    from langchain_openai import ChatOpenAI
    from langchain_openai import OpenAIEmbeddings

    llm = ChatOpenAI(
        model="openai/gpt-3.5-turbo",
        openai_api_key=config.OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1",
        max_tokens=1000
    )
    embeddings = OpenAIEmbeddings(
        model=config.OPENAI_EMBEDDING_MODEL,
        openai_api_key=config.OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )
else:
    from langchain_community.chat_models import ChatOllama
    from langchain_community.embeddings import OllamaEmbeddings

    llm = ChatOllama(model=config.MODEL)
    embeddings = OllamaEmbeddings(model=config.MODEL)

retriever_instance = Retriever(embeddings, faiss_index_path)

# Create a RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever_instance.get_retriever(),
    chain_type_kwargs={"prompt": prompt}
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
