# SpazaStream AI Prototype Overview

This workspace already contains a working SpazaStream prototype with the following core pieces:

- `app/main.py` — FastAPI voice note ingestion endpoint (`/voice-note`), inventory API, bulk orders, and delivery route.
- `app/transcribe.py` — Whisper-based speech-to-text transcription with auto-detected Zulu, Xhosa, Sotho, or English.
- `app/extract.py` — entity extraction via OpenAI GPT for item, brand, quantity, price, and low-stock signals.
- `app/database.py` — Supabase client, voice log persistence, and inventory upsert logic.
- `app/coordinator.py` — bulk-buy order creation and simple route optimization across participating shops.
- `dashboard/app.py` — Streamlit inventory dashboard.
- `supabase/schema.sql` — database schema for shops, inventory, voice logs, and bulk orders.
- `.env.example` — configuration hints for OpenAI, Supabase, and Whisper model selection.

## Key Workflow

1. Shop owner uploads a voice note via `POST /voice-note`.
2. Whisper transcribes audio and detects language.
3. GPT extracts structured inventory entities from the transcript.
4. Inventory is upserted into Supabase and voice notes are logged.
5. The coordinator pools low-stock items across shops to generate bulk orders.
6. The Streamlit dashboard displays live inventory and order state.

## Run the prototype

```bash
pip install -r requirements.txt
cp .env.example .env
# fill in OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY
uvicorn app.main:app --reload
streamlit run dashboard/app.py
```

## Why this is a strong scaffold

- Low-bandwidth audio ingestion fits township shops.
- Whisper handles multilingual audio input.
- Supabase handles real-time inventory and dashboards.
- Bulk-order coordination pools demand across nearby shops.
- The project already contains the main endpoint and database schema.
