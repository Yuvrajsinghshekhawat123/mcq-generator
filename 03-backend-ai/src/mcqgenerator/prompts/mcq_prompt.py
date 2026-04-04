REVIEW_TEMPLATE = """
You are an expert reviewer of MCQs.

Your job is to analyze the given MCQs and ensure:

### CHECK:
- Questions are correct and meaningful
- Options are relevant
- Answer is correct
- Number of options is correct
- Format is valid JSON
- No duplicate questions

### FIX RULES:
- If any question is incorrect → fix it
- If answer is wrong → correct it
- If format is wrong → fix JSON
- If options are missing → regenerate that question

### INPUT MCQs:
{mcqs}

### OUTPUT:
Return ONLY corrected JSON in the same format.
Do not add explanation.
"""



TEMPLATE = """
You are an expert MCQ generator.

Your task is to generate {number} multiple-choice questions based on the given content.

### INPUT:
Topic/Content:
{text}

Optional Focus Areas:
{subtopics}

### REQUIREMENTS:
- Difficulty level: {difficulty}
- Question type: {question_type} (single or multiple correct answers)
- Each question must have exactly {num_options} options
- Label options alphabetically (A, B, C, D, E, ...)
- Questions must be clear, concise, and non-repetitive
- Questions must strictly be based on the provided content (no hallucination)

### ANSWER RULES:
- If question_type = "single" → ONLY ONE correct answer
- If question_type = "multiple" → MULTIPLE correct answers allowed

### OUTPUT FORMAT (STRICT JSON):
[
  {{
    "question": "string",
    "options": {{
      "A": "string",
      "B": "string",
      "C": "string",
      "D": "string"
    }},
    "answer": "A" 
    // OR ["A","C"] if multiple answers
    ,
    "type": "{question_type}",
    "difficulty": "{difficulty}"
  }}
]

Return ONLY JSON. No extra text. 
"""