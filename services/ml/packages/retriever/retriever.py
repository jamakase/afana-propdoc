from langchain_community.vectorstores import FAISS

class Retriever:
    def __init__(self, embeddings, faiss_index_path):
        # self.vectorstore = FAISS.load_local(faiss_index_path, embeddings, allow_dangerous_deserialization=True)
        self.vectorstore = FAISS.from_texts(["test"], embeddings)
        self.retriever = self.vectorstore.as_retriever()

    def get_retriever(self):
        return self.retriever
