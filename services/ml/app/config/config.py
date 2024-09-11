import os

class Config:
    FAISS_INDEX_PATH: str = os.environ.get("FAISS_INDEX_PATH", os.path.join(os.path.dirname(__file__),"../../" "data", "faiss_index"))
    MODEL: str = os.environ.get("MODEL", "meta-llama/llama-3.1-8b-instruct:free")
    PORT: int = int(os.environ.get("PORT", 8000))
    USE_OPENROUTER: bool = os.environ.get("USE_OPENROUTER", "true").lower() == "true"
    OPENROUTER_API_KEY: str = os.environ.get("OPENROUTER_API_KEY", "placeholder")
    EMBEDDING_MODEL: str = os.environ.get("EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2")
    OLLAMA_HOST: str = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
