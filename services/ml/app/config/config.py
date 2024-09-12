import os

class Config:
    FAISS_INDEX_PATH: str = os.environ.get("FAISS_INDEX_PATH", os.path.join(os.path.dirname(__file__),"../../" "data", "faiss_index"))
    QDRANT_HOST: str = os.environ.get("QDRANT_HOST", "http://localhost:6333")
    QDRANT_COLLECTION_NAME: str = os.environ.get("QDRANT_COLLECTION_NAME", "test")
    MODEL: str = os.environ.get("MODEL", "meta-llama/llama-3.1-8b-instruct:free")
    PORT: int = int(os.environ.get("PORT", 8000))
    LLM_SOURCE: str = os.environ.get("LLM_SOURCE", "openrouter")
    OPENROUTER_API_KEY: str = os.environ.get("OPENROUTER_API_KEY", "placeholder")
    EMBEDDING_MODEL: str = os.environ.get("EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2")
    OLLAMA_HOST: str = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
