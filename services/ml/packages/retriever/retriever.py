from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_core.embeddings import Embeddings


class Retriever:
    def __init__(
        self, embeddings: Embeddings, host: str, collection_name: str, api_key: str
    ):
        client = QdrantClient(url=host, api_key=api_key)

        # Check if collection exists, if not, create it
        collections = client.get_collections().collections
        if not any(collection.name == collection_name for collection in collections):
            client.create_collection(
                collection_name=collection_name,
                vectors_config={
                    "size": 384,
                    "distance": "Cosine",
                },
            )

        self.vectorstore = QdrantVectorStore(
            client=client,
            collection_name=collection_name,
            embedding=embeddings,
        )
        self.retriever = self.vectorstore.as_retriever()

    def get_retriever(self):
        return self.retriever
