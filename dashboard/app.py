import os
import streamlit as st
import pandas as pd
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
db = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

st.set_page_config(page_title="SpazaStream AI", page_icon="🏪", layout="wide")
st.title("🏪 SpazaStream AI — Inventory Dashboard")

# --- Sidebar: shop selector ---
shops = db.table("shops").select("id, name, location").execute().data
if not shops:
    st.warning("No shops registered yet.")
    st.stop()

shop_map = {s["name"]: s["id"] for s in shops}
selected = st.sidebar.selectbox("Select Shop", list(shop_map.keys()))
shop_id = shop_map[selected]

# --- Inventory table ---
st.subheader(f"📦 Inventory — {selected}")
inv = db.table("inventory").select("*").eq("shop_id", shop_id).order("updated_at", desc=True).execute().data
if inv:
    df = pd.DataFrame(inv)[["item", "brand", "quantity", "unit", "price_paid", "low_stock", "updated_at"]]
    st.dataframe(
        df.style.apply(
            lambda row: ["background-color: #ffe0e0" if row["low_stock"] else "" for _ in row],
            axis=1,
        ),
        use_container_width=True,
    )
else:
    st.info("No inventory data yet. Upload a voice note via the API.")

# --- Recent voice logs ---
st.subheader("🎙️ Recent Voice Notes")
logs = (
    db.table("voice_logs")
    .select("created_at, language, transcript")
    .eq("shop_id", shop_id)
    .order("created_at", desc=True)
    .limit(5)
    .execute()
    .data
)
for log in logs:
    with st.expander(f"[{log['language'].upper()}] {log['created_at'][:16]}"):
        st.write(log["transcript"])

# --- Bulk orders ---
st.subheader("🤝 Active Bulk Orders")
bulk = db.table("bulk_orders").select("*").eq("status", "pending").execute().data
if bulk:
    st.dataframe(pd.DataFrame(bulk)[["item", "brand", "total_quantity", "discount_pct", "created_at"]], use_container_width=True)
else:
    st.info("No pending bulk orders.")

st.caption("Auto-refreshes every 30s")
st.markdown(
    "<script>setTimeout(()=>window.location.reload(), 30000)</script>",
    unsafe_allow_html=True,
)
