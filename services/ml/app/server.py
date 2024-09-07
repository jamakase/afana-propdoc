from fastapi import FastAPI
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.chat_models import ChatOllama
from langchain.chains import RetrievalQA
from langserve import add_routes
from packages.retriever import Retriever
from packages.prompts import prompt
# Update the embedding model to use llama2
embeddings = OllamaEmbeddings(model="llama3.1")

faiss_index_path = "/Users/jamakase/Projects/afana/data/faiss_index"
retriever_instance = Retriever(embeddings, faiss_index_path)

# Create a ChatOllama instance with the llama2 model
llm = ChatOllama(model="llama3.1")


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

    uvicorn.run(app, host="0.0.0.0", port=8000)
