# RAG Chatbot

A simple Retrieval-Augmented Generation (RAG) chatbot project that generates answers using custom data and an AI model API.
<img width="1920" height="1080" alt="Capture d&#39;écran 2026-05-27 212315" src="https://github.com/user-attachments/assets/0ab2c5b7-4897-4a6c-8256-0088b1299ea7" />
## Features

* Ask questions about your own data
* AI-generated responses using an external API
* Retrieval-Augmented Generation (RAG) architecture
* Fast and simple backend structure
* Environment variable support using `.env`

---

# How It Works

1. User sends a question
2. The system searches relevant data/documents
3. Context is sent to the AI model
4. The AI generates a final answer based on the retrieved data

---

# Tech Stack

* JavaScript / Node.js
* Express.js
* AI API integration
* Vector search / document retrieval
* Environment variables with `.env`


---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository.git
```

## 2. Navigate to the project

```bash
cd your-repository
```

## 3. Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example:

```env
API_KEY=your_api_key_here
```

You can also create a `.env.example` file:

```env
API_KEY=
```

---

Run the Project
Start the backend server
Open the project folder
Navigate to the backend folder
Open CMD/Terminal inside the backend folder
Run the following command: node server.js
```

Or for development:

```bash
npm run dev
```

---

# Security

Do not expose your `.env` file or API keys publicly.

Make sure `.env` is added to `.gitignore`.

Example:

```txt
.env
```

---

# Example Workflow

```text
User Question
      ↓
Retrieve Relevant Data
      ↓
Send Context + Question to AI API
      ↓
Generate Final Answer
```

---

# Future Improvements

* Conversation memory
* Authentication system
* Advanced vector database support
* Multi-document upload
* Streaming AI responses
* End-to-end encrypted messaging
* AI monitoring and analytics

---

# License

This project is open-source and available under the MIT License.
