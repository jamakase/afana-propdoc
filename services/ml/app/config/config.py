import os

class Config:
    FAISS_INDEX_PATH: str = os.environ.get("FAISS_INDEX_PATH", os.path.join(os.path.dirname(__file__),"../../" "data", "faiss_index"))
    MODEL: str = os.environ.get("MODEL", "llama3.1")
    PORT: int = int(os.environ.get("PORT", 8000))
