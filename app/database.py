import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

_db: Client = None

def db() -> Client:
    global _db
    if _db is None:
        _db = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    return _db

def log_voice_note(shop_id: str, transcript: str, language: str, entities: list, audio_url: str = None):
    db().table("voice_logs").insert({
        "shop_id": shop_id,
        "transcript": transcript,
        "language": language,
        "raw_entities": entities,
        "audio_url": audio_url,
        "processed": True,
    }).execute()

def upsert_inventory(shop_id: str, entities: list):
    for e in entities:
        existing = (
            db().table("inventory")
            .select("id, quantity")
            .eq("shop_id", shop_id)
            .eq("item", e["item"])
            .maybe_single()
            .execute()
        )
        if existing.data:
            new_qty = existing.data["quantity"] + e["quantity"]
            db().table("inventory").update({
                "quantity": new_qty,
                "low_stock": e.get("low_stock", False),
                "price_paid": e.get("price_paid"),
                "updated_at": "now()",
            }).eq("id", existing.data["id"]).execute()
        else:
            db().table("inventory").insert({
                "shop_id": shop_id,
                "item": e["item"],
                "brand": e.get("brand"),
                "quantity": e["quantity"],
                "unit": e.get("unit", "units"),
                "price_paid": e.get("price_paid"),
                "low_stock": e.get("low_stock", False),
            }).execute()
