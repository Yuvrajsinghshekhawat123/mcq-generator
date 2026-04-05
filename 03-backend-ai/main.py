from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from src.mcqgenerator.chains.mcq_chain import generate_and_review
from src.mcqgenerator.utils.parser import parse_mcqs
from src.mcqgenerator.utils.logger import get_logger
from src.mcqgenerator.utils.pdf_parser import extract_text_from_pdf

logger = get_logger(__name__)  ## (__name__) means=>a built-in Python variable , a built-in Python variable
app = FastAPI() #app = FastAPI()


@app.post("/generate")
async def generate(
    number: int = Form(...),
    subtopics: str = Form(...),
    difficulty: str = Form(...),
    question_type: str = Form(...),
    num_options: int = Form(...),
    text: str = Form(None),
    file: UploadFile = File(None)
):
    logger.info("MCQ generation started")

    # Step 1: Get content
    if file:
        content = await extract_text_from_pdf(file)
        logger.info("Text extracted from PDF")
    else:
        content = text

    # Step 2: Prepare data
    data = {
        "number": number,
        "text": content,
        "subtopics": subtopics,
        "difficulty": difficulty,
        "question_type": question_type,
        "num_options": num_options
    }

    # Step 3: Generate MCQ
    result = generate_and_review(data)
    parsed = parse_mcqs(result)

    logger.info("MCQ generation completed")

    return {"success": True, "data": parsed}