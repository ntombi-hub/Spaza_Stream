from app.database import db
from collections import defaultdict

BULK_THRESHOLD = 3      # min shops needed to trigger bulk order
BULK_DISCOUNT_PCT = 12  # negotiated discount %

def coordinate_bulk_orders():
    """
    Scan all shops for low-stock items, pool demand across shops,
    and create bulk_orders when threshold is met.
    Returns list of new bulk orders created.
    """
    low_items = (
        db().table("inventory")
        .select("shop_id, item, brand, quantity, unit")
        .eq("low_stock", True)
        .execute()
        .data
    )

    # Group by (item, brand)
    demand: dict[tuple, list] = defaultdict(list)
    for row in low_items:
        key = (row["item"], row.get("brand"))
        demand[key].append(row)

    created = []
    for (item, brand), rows in demand.items():
        if len(rows) < BULK_THRESHOLD:
            continue

        # Check if a pending order already exists
        existing = (
            db().table("bulk_orders")
            .select("id")
            .eq("item", item)
            .eq("status", "pending")
            .maybe_single()
            .execute()
        )
        if existing.data:
            continue

        total_qty = sum(r["quantity"] for r in rows)
        shop_ids = [r["shop_id"] for r in rows]

        order = db().table("bulk_orders").insert({
            "item": item,
            "brand": brand,
            "total_quantity": total_qty,
            "participating_shops": shop_ids,
            "discount_pct": BULK_DISCOUNT_PCT,
            "status": "pending",
        }).execute().data[0]

        created.append(order)

    return created


def get_delivery_route(bulk_order_id: str) -> list[dict]:
    """
    Return shops in a simple nearest-neighbour order for the delivery truck.
    Uses lat/lng from the shops table.
    """
    order = (
        db().table("bulk_orders")
        .select("participating_shops")
        .eq("id", bulk_order_id)
        .single()
        .execute()
        .data
    )
    shop_ids = order["participating_shops"]

    shops = (
        db().table("shops")
        .select("id, name, lat, lng, location")
        .in_("id", shop_ids)
        .execute()
        .data
    )

    # Nearest-neighbour greedy sort from first shop
    route, remaining = [shops[0]], shops[1:]
    while remaining:
        last = route[-1]
        nearest = min(
            remaining,
            key=lambda s: (s["lat"] - last["lat"]) ** 2 + (s["lng"] - last["lng"]) ** 2,
        )
        route.append(nearest)
        remaining.remove(nearest)

    return route
