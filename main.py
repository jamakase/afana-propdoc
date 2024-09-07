from langchain.llms import Ollama
from langchain.embeddings import OllamaEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader

# Initialize the Ollama model
ollama = Ollama(base_url="http://localhost:11434", model="llama2")

# Initialize Ollama embeddings
embeddings = OllamaEmbeddings(base_url="http://localhost:11434", model="llama2")

# Load and process the document
loader = TextLoader("path/to/your/document.txt")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

# Create a vector store
vectorstore = Chroma.from_documents(texts, embeddings)

# Create a retrieval-based QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ollama,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Example usage
query = "What is the main topic of the document?"
response = qa_chain.run(query)
print(f"Query: {query}")
print(f"Response: {response}")

