import base64

from fastapi import FastAPI
from langchain_community.document_loaders.parsers.pdf import PDFMinerParser
from langchain_core.document_loaders import Blob
from langchain_core.runnables import RunnableLambda
from langchain_core.pydantic_v1 import BaseModel, Field, validator

from langserve import CustomUserType, add_routes

class FileProcessingRequest(CustomUserType):
    """Request including a base64 encoded file."""

    # The extra field is used to specify a widget for the playground UI.
    file: str = Field(..., extra={"widget": {"type": "base64file"}})


def _process_file(request: FileProcessingRequest) -> str:
    """Extract the text from all pages of the PDF."""
    content = base64.b64decode(request.file.encode("utf-8"))
    blob = Blob(data=content)
    documents = list(PDFMinerParser().lazy_parse(blob))
    
    processed_content = []
    for i, doc in enumerate(documents, 1):
        page_content = doc.page_content
        processed_content.append(f"Page {i}:\n{page_content}\n")
    
    return "\n".join(processed_content)
