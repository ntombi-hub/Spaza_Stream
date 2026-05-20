import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are a supply chain assistant for South African spaza shops.
Extract inventory events from the transcript. Return ONLY valid JSON array.
Each item: {"item": str, "brand": str|null, "quantity": float, "unit": str, "price_paid": float|null, "low_stock": bool}
Examples of low_stock triggers: "running low", "almost finished", "ke fela", "iphela".
Transcript may be in English, Zulu, Xhosa, or Sotho."""

def extract_entities(transcript: str) -> list[dict]:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": transcript},
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )
    raw = response.choices[0].message.content
    data = json.loads(raw)
    # GPT may wrap in a key — unwrap
    if isinstance(data, dict):
        data = next(iter(data.values()))
    return data if isinstance(data, list) else []
