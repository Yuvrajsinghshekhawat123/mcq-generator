from pypdf import PdfReader
from fastapi import UploadFile
import io

async def extract_text_from_pdf(file: UploadFile):
    contents = await file.read()
    pdf = PdfReader(io.BytesIO(contents))

    text = ""
    for page in pdf.pages:
        text += page.extract_text() or ""

    return text.strip()