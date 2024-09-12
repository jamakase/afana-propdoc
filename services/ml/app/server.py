from fastapi import FastAPI
from langchain.schema.runnable import RunnableParallel, RunnablePassthrough
from langserve import add_routes
from packages.llm import LLMInstance
from packages.prompts import prompt
from packages.retriever import Retriever
from pydantic import BaseModel, Field
from langchain_core.output_parsers import StrOutputParser

from .config import config

llm_instance = LLMInstance(config)
retriever_instance = Retriever(llm_instance.get_embeddings(), host=config.QDRANT_HOST, collection_name=config.QDRANT_COLLECTION_NAME)


class BaseInputChat(BaseModel):
    class Config:
        arbitrary_types_allowed = True

class InputChat(BaseInputChat):
    # model_config = ConfigDict(arbitrary_types_allowed=True)
    """Input for the chat endpoint."""
    query: str = Field(..., description="The query to retrieve relevant documents.")
    # messages: List[Union[HumanMessage, AIMessage, SystemMessage]] = Field(
    #     ...,
    #     description="The chat messages representing the current conversation.",
    # )


# Modify the qa_chain definition
qa_chain = (
    RunnableParallel(
        {"context": retriever_instance.get_retriever(), "question": RunnablePassthrough()}
    )
    | prompt
    | llm_instance.get_llm()
    | StrOutputParser()
)


app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="Spin up a simple api server using Langchain's Runnable interfaces",
)

# Add routes for the QA chain instead of just the retriever
add_routes(app, path="/llm", runnable=llm_instance.get_llm())
add_routes(app, qa_chain)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=config.PORT)
