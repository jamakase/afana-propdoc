from langchain_community.vectorstores import FAISS

class Retriever:
    def __init__(self, embeddings):
        self.vectorstore = FAISS.from_texts(
            ["cats like fish", "dogs like sticks"], embedding=embeddings
        )
        self.retriever = self.vectorstore.as_retriever()

    def get_retriever(self):
        return self.retriever
