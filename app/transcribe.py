import whisper
import os
from dotenv import load_dotenv

load_dotenv()

_model = None

def get_model():
    global _model
    if _model is None:
        _model = whisper.load_model(os.getenv("WHISPER_MODEL", "base"))
    return _model

def transcribe(audio_path: str) -> dict:
    """Transcribe audio file. Returns transcript + detected language."""
    result = get_model().transcribe(audio_path, task="transcribe")
    return {
        "transcript": result["text"].strip(),
        "language": result["language"],  # auto-detects zu/xh/st/en
    }
