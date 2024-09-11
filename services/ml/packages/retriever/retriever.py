from langchain_community.vectorstores import Qdrant

class Retriever:
    def __init__(self, embeddings, host: str, collection_name: str):
        self.vectorstore = Qdrant(
            embedding_function=embeddings,
            collection_name=collection_name,
            host=host,
        )
        self.retriever = self.vectorstore.as_retriever()

    def get_retriever(self):
        return self.retriever
