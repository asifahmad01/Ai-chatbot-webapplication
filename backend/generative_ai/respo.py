import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

# Load environment variables
load_dotenv(Path("../.env"))
app = Flask(__name__)
CORS(app)

# Set API key
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

# Initialize the model
model_name = os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini")
chatgpt = ChatOpenAI(model_name=model_name)

# Serve React build files
@app.route('/')
def serve_index():
    return send_from_directory('build', 'index.html')  # Adjust path if necessary

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('build', path)

# Chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    try:
        query = request.json['userText']
        print(f"Received query: {query}", flush=True)  # Debugging

        # Initialize vector store with the correct path
        vectordb = Chroma(
            persist_directory=r'/Users/mdasifanjum/Desktop/task/chatbot/backend/generative_ai/vectorStore',
            embedding_function=OpenAIEmbeddings(),
            collection_name="my_collection"
        )
        print("VectorStore initialized successfully.", flush=True)

        retriever = vectordb.as_retriever()
        print("Retriever initialized.", flush=True)

        qa = RetrievalQA.from_chain_type(llm=chatgpt, chain_type="stuff", retriever=retriever)
        print("QA system initialized.", flush=True)

        # Get the response from the QA system
        response = qa.run(query)
        print(f"Response: {response}", flush=True)

        return jsonify({'botResponse': response})

    except Exception as e:
        print(f"Error processing query: {e}", flush=True)
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to process the query. Please try again later.'}), 500


if __name__ == "__main__":
    app.run(port=5001)
