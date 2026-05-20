import os, shutil, tempfile
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.transcribe import transcribe
from app.extract import extract_entities
from app.database import log_voice_note, upsert_inventory, db
from app.coordinator import coordinate_bulk_orders

app = FastAPI(title="SpazaStream AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/voice-note")
async def ingest_voice_note(
    shop_id: str = Form(...),
    audio: UploadFile = File(...),
):
    """
    Full pipeline:
    1. Save uploaded audio
    2. Whisper transcription (multilingual)
    3. GPT-4o entity extraction
    4. Upsert inventory in Supabase
    5. Trigger bulk-order coordination
    """
    suffix = os.path.splitext(audio.filename)[-1] or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(audio.file, tmp)
        tmp_path = tmp.name

    try:
        stt = transcribe(tmp_path)
        entities = extract_entities(stt["transcript"])

        if not entities:
            raise HTTPException(422, "No inventory entities found in audio.")

        log_voice_note(shop_id, stt["transcript"], stt["language"], entities)
        upsert_inventory(shop_id, entities)
        bulk_orders = coordinate_bulk_orders()

        return JSONResponse({
            "transcript": stt["transcript"],
            "language": stt["language"],
            "entities": entities,
            "bulk_orders_triggered": len(bulk_orders),
        })
    finally:
        os.unlink(tmp_path)


@app.get("/shops")
def list_shops():
    return db().table("shops").select("id, name, location, lat, lng").execute().data


@app.get("/inventory/{shop_id}")
def get_inventory(shop_id: str):
    return (
        db().table("inventory")
        .select("*")
        .eq("shop_id", shop_id)
        .order("updated_at", desc=True)
        .execute()
        .data
    )


@app.get("/bulk-orders")
def list_bulk_orders(status: str = "pending"):
    return db().table("bulk_orders").select("*").eq("status", status).execute().data


@app.get("/delivery-route/{bulk_order_id}")
def delivery_route(bulk_order_id: str):
    from app.coordinator import get_delivery_route
    return get_delivery_route(bulk_order_id)
