import json

def parse_mcqs(resp: str):
    try:
        # remove markdown formatting
        cleaned =resp.strip()

        if(cleaned.startswith("```")):
            cleaned = cleaned.replace("```json", "").replace("```", "").strip()

        return json.loads(cleaned) # convert to dict from json
    except Exception as e:
        print("Json parsing error:", e);
        return []