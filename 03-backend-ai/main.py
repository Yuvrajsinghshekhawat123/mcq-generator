from fastapi import FastAPI
from pydantic import BaseModel
from src.mcqgenerator.chains.mcq_chain import generate_and_review
from src.mcqgenerator.utils.parser import parse_mcqs
app = FastAPI() #app = FastAPI()

class MCQRequest(BaseModel):
    number: int
    text: str
    subtopics: str
    difficulty: str
    question_type: str
    num_options: int


@app.post("/generate")
def generate(data: MCQRequest):

    result = generate_and_review(data.dict()) 
    parsed=parse_mcqs(result)
    return { "success": True, "data": parsed }