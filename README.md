# 🏪 SpazaStream AI

> Voice-to-data supply chain agent for South African spaza shops.  
> Multilingual (Zulu · Xhosa · Sotho · English) · Low-bandwidth · Bulk-buying coordinator.

---

## Architecture

```
Voice Note (audio)
      │
      ▼
POST /voice-note  (FastAPI)
      │
      ├─► Whisper STT  →  transcript + language
      │
      ├─► GPT-4o       →  [{ item, brand, quantity, price_paid, low_stock }]
      │
      ├─► Supabase     →  inventory table (upsert) + voice_logs
      │
      └─► Coordinator  →  pool low-stock across shops → bulk_orders
                                    │
                                    └─► Delivery route (nearest-neighbour)

Streamlit Dashboard  ←  reads Supabase in real-time
```

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Fill in OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY

# 3. Apply DB schema (paste into Supabase SQL editor)
#    supabase/schema.sql

# 4. Run API
uvicorn app.main:app --reload

# 5. Run Dashboard (separate terminal)
streamlit run dashboard/app.py
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/voice-note` | Upload audio → full pipeline |
| `GET`  | `/inventory/{shop_id}` | Get shop inventory |
| `GET`  | `/bulk-orders` | List pending bulk orders |
| `GET`  | `/delivery-route/{bulk_order_id}` | Optimised truck route |

### Upload a voice note (curl)
```bash
curl -X POST http://localhost:8000/voice-note \
  -F "shop_id=<your-shop-uuid>" \
  -F "audio=@note.wav"
```

---

## Bulk-Buying Logic

- When **3+ shops** report the same item as `low_stock`, a `bulk_order` is created automatically.
- A **12% discount** is applied to the pooled order.
- The delivery route is optimised using a **nearest-neighbour greedy algorithm** on shop GPS coordinates.

---

## Supported Languages

Whisper auto-detects: `zu` (Zulu) · `xh` (Xhosa) · `st` (Sotho) · `en` (English)
