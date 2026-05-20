-- Spaza shops
create table shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text,
  location text,
  lat float,
  lng float,
  created_at timestamptz default now()
);

-- Inventory per shop
create table inventory (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  item text not null,
  brand text,
  quantity float not null default 0,
  unit text default 'units',
  price_paid float,
  low_stock boolean default false,
  updated_at timestamptz default now()
);

-- Raw voice note log
create table voice_logs (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  audio_url text,
  transcript text,
  language text,
  raw_entities jsonb,
  processed boolean default false,
  created_at timestamptz default now()
);

-- Bulk buying coordination across shops
create table bulk_orders (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  brand text,
  total_quantity float,
  participating_shops jsonb,
  status text default 'pending',
  discount_pct float default 0,
  created_at timestamptz default now()
);
