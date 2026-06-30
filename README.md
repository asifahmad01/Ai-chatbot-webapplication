# AI Chatbot Application

A full-stack AI chatbot application built using **Flask, LangChain, OpenAI API, OpenAI Embeddings, ChromaDB, React.js, Node.js, Express.js, JWT, and MongoDB**.

The project is developed in two phases:

- **Phase 1:** RAG-based AI chatbot using Flask, LangChain, OpenAI API, OpenAI Embeddings, and ChromaDB.
- **Phase 2:** Full-stack enhancement with React.js frontend, Node.js + Express backend, JWT authentication, real-time messaging, and MongoDB-based persistent chat storage.

---

## Project Overview

This AI chatbot uses a **Retrieval-Augmented Generation (RAG)** workflow to generate context-aware responses.

In the training phase, the chatbot loads custom context data from a text file, splits the content into smaller chunks, generates vector embeddings using OpenAI Embeddings, and stores those embeddings in ChromaDB.

When a user sends a query, the Flask `/chat` API retrieves the most relevant chunks from ChromaDB using similarity search and sends the query along with the retrieved context to the OpenAI LLM. The model then generates an intelligent and context-aware response.

---

## Features

- AI-powered chatbot with context-aware responses
- RAG-based architecture
- Custom context training using `train.py`
- Text loading and chunking
- 1000-character chunk size for context splitting
- OpenAI Embeddings for vector generation
- ChromaDB for vector storage
- Similarity search for relevant context retrieval
- Flask `/chat` API for chatbot response generation
- OpenAI LLM integration
- React.js frontend for user interaction
- Node.js + Express backend support
- JWT-based authentication
- Real-time messaging
- Persistent chat storage using MongoDB

---

## Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask
- Node.js
- Express.js

### AI / GenAI
- OpenAI API
- LangChain
- OpenAI Embeddings
- Retrieval-Augmented Generation
- Prompt Engineering

### Database / Vector Store
- ChromaDB
- MongoDB

### Authentication
- JWT Authentication

---

## Architecture

### Training Flow

```text
Context.txt
   |
   v
Text Loader
   |
   v
Character Text Splitter
Chunk Size: 1000
   |
   v
OpenAI Embeddings
   |
   v
Vector Store
   |
   v
ChromaDB
