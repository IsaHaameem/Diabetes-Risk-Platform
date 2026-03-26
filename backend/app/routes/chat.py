from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from app.utils.auth import get_current_user_id

load_dotenv()
router = APIRouter(prefix="/chat", tags=["AI Assistant"])
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    message: str
    context: dict = {} # Can pass recent prediction results here

@router.post("/")
def chat_with_ai(req: ChatRequest, user_id: int = Depends(get_current_user_id)):
    system_prompt = f"""You are a specialized AI Assistant for a Diabetes Risk Intelligence Platform. 
    Your goal is to explain prediction results and answer questions related to diabetes risk factors.
    Here is the recent prediction context for this patient: {req.context}.
    DO NOT provide official medical diagnoses. Suggest consulting a doctor for definitive advice."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.message}
            ],
            temperature=0.3
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))