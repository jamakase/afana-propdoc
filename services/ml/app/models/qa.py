from langchain_core.pydantic_v1 import BaseModel, Field, validator

class InputChat(BaseModel):
    """Input for the chat endpoint."""
    question: str = Field(..., description="The query to retrieve relevant documents.")

class OutputChat(BaseModel):
    """Output for the chat endpoint."""
    result: str = Field(..., description="The output containing the result.")
