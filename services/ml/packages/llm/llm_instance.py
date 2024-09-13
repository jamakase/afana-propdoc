from app.config import Config

from langchain.embeddings.base import Embeddings
from sentence_transformers import SentenceTransformer

# 1. Обёртка для модели SentenceTransformer
class SentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name: str = 'all-mpnet-base-v2'):
        self.model = SentenceTransformer(model_name)
    
    def embed_documents(self, texts):
        return self.model.encode(texts)
    
    def embed_query(self, text):
        return self.model.encode([text])[0]

class LLMInstance:
    def __init__(self, config: Config):
        self.config = config
        self.llm = None
        self.embeddings = None

        if config.LLM_SOURCE == "openai":
            from langchain_openai import ChatOpenAI
            from langchain_community.embeddings import HuggingFaceEmbeddings

            self.llm = ChatOpenAI(
                model=config.MODEL,
                openai_api_key=config.OPENAI_API_KEY,
                openai_api_base=config.OPENAI_BASE_URL,
                max_tokens=1000,
            )
            self.embeddings = SentenceTransformerEmbeddings()
        elif config.LLM_SOURCE == "ygpt":
            from langchain_community.chat_models import ChatYandexGPT
            from langchain_community.embeddings import YandexGPTEmbeddings

            self.llm = ChatYandexGPT()
            self.embeddings = YandexGPTEmbeddings()

        elif config.LLM_SOURCE == "ollama":
            from langchain_community.chat_models import ChatOllama
            from langchain_community.embeddings import OllamaEmbeddings

            self.llm = ChatOllama(model=config.MODEL, base_url=config.OLLAMA_HOST)
            self.embeddings = OllamaEmbeddings(
                model=config.MODEL, base_url=config.OLLAMA_HOST
            )
        else:
            raise ValueError(f"Unsupported LLM_SOURCE: {config.LLM_SOURCE}")

    def get_llm(self):
        return self.llm

    def get_embeddings(self):
        return self.embeddings
