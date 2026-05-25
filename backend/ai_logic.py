import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini using your API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def get_embedding(text):
    """
    Generates a high-quality vector using gemini-embedding-2.
    """
    try:
        model = "models/gemini-embedding-2"
        result = genai.embed_content(
            model=model,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"Embedding Error: {e}")
        # Return an empty list or an explicit fallback array if needed
        return []

async def get_gemini_analysis(jd, resume_text):
    """
    Uses gemini-2.5-flash for blazing fast, structured resume analysis.
    """
   
    model = genai.GenerativeModel('models/gemini-2.5-flash')
    
    prompt = f"""
    You are an expert technical recruiter. Analyze the following Resume against the Job Description (JD).
    
    JD: {jd}
    Resume: {resume_text}
    
    Return ONLY a JSON object with the following keys:
    1. "score": (An integer 0-100 based on skill match and experience)
    2. "experience": (A short 1-2 sentence summary of their total years of experience and key roles)
    3. "matched_skills": (List of skills found in both)
    4. "missing_skills": (List of key skills in JD but not in Resume)
    5. "explanation": (A concise 2-line summary of the fit)

    Output format:
    {{
      "score": 85,
      "experience": "4 years as a Full-Stack Developer, primarily building MERN applications.",
      "matched_skills": ["React", "Node.js"],
      "missing_skills": ["AWS"],
      "explanation": "Candidate has strong frontend experience but lacks the cloud infrastructure skills required."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        start_idx = text_response.find('{')
        end_idx = text_response.rfind('}') + 1
        
        if start_idx != -1 and end_idx != 0:
            clean_json = text_response[start_idx:end_idx]
            return json.loads(clean_json)
        else:
            raise ValueError("No valid JSON found in AI response.")
    
    except Exception as e:
        print(f"AI Logic Analysis Error: {e}")
        # Safe fallback matching our JSON schema requirements
        return {
            "score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "explanation": "Error analyzing resume with the AI model configuration."
        }
