import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from mcqgenerator.prompts.mcq_prompt import TEMPLATE, REVIEW_TEMPLATE


#load env
load_dotenv()

# get api keys
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")



# LLM (OpenRouter)
llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    base_url="https://openrouter.ai/api/v1",
    openai_api_key=openrouter_api_key
)






#Prompt
prompt = PromptTemplate(
    input_variables=["number", "text", "subtopics", "difficulty", "question_type", "num_options"],
    template=TEMPLATE
)

# Generator
generator_chain=prompt | llm


# Reviewer
review_prompt=PromptTemplate(
    input_variables=["questions"],
    template=REVIEW_TEMPLATE
);


review_chain = review_prompt | llm



# -------- MAIN FUNCTION --------
def generate_and_review(data: dict):
    #step 1=Generate
    raw_resp = generator_chain.invoke(data)
    raw_mcqs=raw_resp.content

    # Step 2: Review
    final_response = review_chain.invoke({
        "mcqs": raw_mcqs
    })

    return final_response.content







