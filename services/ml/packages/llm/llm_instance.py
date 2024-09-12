import os

from app.config import Config


class LLMInstance:
    def __init__(self, config: Config):
        self.config = config
        self.llm = None
        self.embeddings = None

        if config.LLM_SOURCE == "openrouter":
            from langchain_community.chat_models import ChatOpenAI
            from langchain_huggingface.embeddings import HuggingFaceEmbeddings

            self.llm = ChatOpenAI(
                model=config.MODEL,
                openai_api_key=config.OPENROUTER_API_KEY,
                base_url="https://openrouter.ai/api/v1",
                max_tokens=1000,
            )
            cache_folder = os.path.join(os.getcwd(), "model_cache")
            self.embeddings = HuggingFaceEmbeddings(
                model_name=config.EMBEDDING_MODEL, cache_folder=cache_folder
            )
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
