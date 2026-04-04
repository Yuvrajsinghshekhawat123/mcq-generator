from setuptools import find_packages, setup

setup(
    name="mcqgenerator",
    version="0.1.0",
    author="Yuvraj Singh",
    description="AI-based MCQ Generator using FastAPI and LangChain",
    
    packages=find_packages(where="src"),
    package_dir={"": "src"},

    install_requires=[
        "fastapi",
        "uvicorn",
        "langchain",
        "openai",
        "python-dotenv",
        "pypdf"
    ],
)