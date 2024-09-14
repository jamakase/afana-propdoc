import os

class Config:
    PORT: int = int(os.environ.get("PORT", 8000))
    QDRANT_HOST: str = os.environ.get("QDRANT_HOST", "http://84.201.156.82:6333")
    QDRANT_COLLECTION_NAME: str = os.environ.get("QDRANT_COLLECTION_NAME", "docs_768")
    QDRANT_API_KEY: str = os.environ.get("QDRANT_API_KEY", "somwerhjsadimqwe")
    LLM_SOURCE: str = os.environ.get("LLM_SOURCE", "openai")

    def __init__(self):
        if self.LLM_SOURCE == "openai":
            self.MODEL = os.environ.get("MODEL", "meta-llama/llama-3.1-8b-instruct")
            self.OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
            self.OPENAI_API_KEY = os.environ.get("")
            self.EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2")

        elif self.LLM_SOURCE == "ollama":
            self.OLLAMA_HOST: str = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
            self.MODEL = os.environ.get("MODEL", "llama3.1")
            self.EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "llama3.1")
        elif self.LLM_SOURCE == "ygpt":
            pass
        else:
            raise ValueError(f"Unsupported LLM_SOURCE: {self.LLM_SOURCE}")
