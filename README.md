# Mxpertz AI Resume Screener

# Project Overview
An intelligent applicant tracking and screening tool that utilizes large language models and semantic vector embeddings to evaluate candidate resumes against a provided job description. Built with a modern architecture utilizing FastAPI, React, and Supabase

# Approach Explanation
This system utilizes a dual-model artificial intelligence pipeline, orchestrated by a FastAPI backend, to address the complexities of unstructured resume data. The architecture is designed to process documents through the following stages:

**Text Extraction:** Resumes are uploaded as PDF documents to the FastAPI server. The backend performs raw text extraction and implements custom sanitization logic to actively strip hidden null bytes and formatting anomalies that typically cause downstream parsing failures.

**Embedding and Semantic Vector Generation:** The sanitized text is processed using an AI embedding model to generate a high-dimensional semantic vector. This embedding translates the contextual meaning of the resume into a mathematical format, preparing the data for advanced similarity calculations.

**Supabase Integration:** The semantic vectors are stored and queried using a Supabase PostgreSQL database configured with the pgvector extension. This infrastructure enables scalable, context-aware candidate matching rather than relying on brittle, exact-match keyword searches.

**Structured AI Evaluation:** Concurrently, the parsed text undergoes a structured AI evaluation using a generative language model. By employing a highly constrained prompt, the model is forced to output a strict JSON payload rather than conversational text.

**Skill and Experience Extraction:** Within that structured evaluation, the model acts as an expert technical recruiter to perform precise skill and experience extraction. It calculates a compatibility score, quantifies the total years of experience, identifies matched versus missing skills, and provides a concise reasoning summary.

To ensure absolute system stability and frontend reliability, the FastAPI application applies a final failsafe algorithm that searches exclusively for JSON boundaries within the model's response, discarding any unstructured markdown before delivering the clean payload to the client interface.

# Setup Steps

**Prerequisites**
Python 3.10 or higher
Node.js (v18 or higher)
Google Gemini API Key
Supabase PostgreSQL Connection URL

**1. Repository Initialization**
Clone the repository and navigate to the project directory:

1. git clone https://github.com/YourUsername/smart-resume-screener.git
2. cd Mxpertz

**2. Backend Configuration**
 Navigate to the backend directory, initialize a virtual environment, and install the required dependencies:

1. cd backend
2. python -m venv venv

**Activate the virtual environment (Windows)**
.\venv\Scripts\Activate.ps1

**Activate the virtual environment (Mac/Linux)**
source venv/bin/activate

**Install core dependencies**
pip install fastapi uvicorn sqlalchemy pypdf google-generativeai python-dotenv psycopg2-binary python-multipart

**3. Environment Variables**
Create a .env file in the backend/ directory and include your specific credentials. Ensure this file is listed in your .gitignore and never committed to version control.

**4. Database SetUp(Supabase)**
1. Enable the pgvector extension for semantic search

CREATE EXTENSION IF NOT EXISTS vector;

3. Create the table to store parsed resumes and AI embeddings

CREATE TABLE candidates (
   
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    raw_text TEXT,
    embedding VECTOR(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

**Code snippet**
1. GEMINI_API_KEY=your_google_gemini_api_key
2. DATABASE_URL=your_supabase_postgresql_url

**4. Frontend Configuration**
Open a separate terminal instance, navigate to the frontend directory, and install the necessary node modules:

cd frontend
npm install

# How to Run the Application
The application requires both the backend API and the frontend client to run concurrently in separate terminal sessions.

**1. Execute the FastAPI Backend**
Ensure your virtual environment is active in the backend terminal, then start the server:

1. cd backend
2. python -m uvicorn main:app --reload

The backend API will initialize at http://127.0.0.1:8000. You can access the automated Swagger UI documentation at http://127.0.0.1:8000/docs to test endpoints directly.

**2. Execute the React Frontend**

In your second terminal window, start the development server:

1. cd frontend
2. npm run dev

The user interface will launch on your local network, typically accessible at http://localhost:5173. Open this URL in your web browser to interact with the system.

# Screenshots
https://drive.google.com/file/d/1thf70T0ESrJ3qBZ_i0cWN8HN13YRpQLi/view?usp=sharing
