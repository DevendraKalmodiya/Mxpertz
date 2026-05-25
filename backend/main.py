import io
import json
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pypdf import PdfReader

from database import SessionLocal, init_db, Resume, get_db
from ai_logic import get_gemini_analysis, get_embedding

app = FastAPI(title="Smart Resume Screening System")

# 1. Enable CORS for React/Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database tables on startup
@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/screen")
async def screen_resumes(
    jd: str = Form(...), 
    files: list[UploadFile] = File(...), 
    db: Session = Depends(get_db)
):
    """
    Endpoint to upload resumes, parse them, and match against a JD using Gemini.
    """
    if not files:
        raise HTTPException(status_status=400, detail="No files uploaded")

    results = []

    for file in files:
        try:
            # 2. Extract text from PDF
            content = await file.read()
            reader = PdfReader(io.BytesIO(content))
            resume_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    resume_text += text
            
            # Strip out hidden NUL characters from the PDF
            resume_text = resume_text.replace('\x00', '').replace('\0', '')

            # Get AI Analysis (Score, Skills, Explanation)
            # This uses Gemini 1.5 Flash
            analysis = await get_gemini_analysis(jd, resume_text)

            # Get Embedding (For Supabase Vector Search)
            # This uses Gemini text-embedding-004
            vector = await get_embedding(resume_text)

            # Save to Supabase (Optional but recommended for the test)
            new_resume = Resume(
                filename=file.filename,
                content=resume_text
            )
            db.add(new_resume)
            db.commit()

            #Append to results for Frontend
            results.append({
                "filename": file.filename,
                "score": analysis.get("score", 0),
                "experience": analysis.get("experience", "Experience details not explicitly found."), # Add this line!
                "matched_skills": analysis.get("matched_skills", []),
                "missing_skills": analysis.get("missing_skills", []),
                "explanation": analysis.get("explanation", "No explanation generated.")
            })

        except Exception as e:
            print(f"Error processing {file.filename}: {e}")
            results.append({
                "filename": file.filename,
                "score": 0,
                "error": "Failed to process this file."
            })

    # Sort results by score descending before sending to React
    sorted_results = sorted(results, key=lambda x: x.get('score', 0), reverse=True)
    return {"results": sorted_results}

@app.get("/health")
def health_check():
    return {"status": "online", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
