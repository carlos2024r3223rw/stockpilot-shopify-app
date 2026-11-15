-- Initial PostgreSQL model for a multi-store StockPilot installation.
-- Inventory snapshots are keyed by Shopify inventory item + location.
CREATE TABLE shops (
  id BIGSERIAL PRIMARY KEY,
  shop_domain TEXT NOT NULL UNIQUE,
  access_token_encrypted TEXT,
  installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uninstalled_at TIMESTAMPTZ
);

CREATE TABLE inventory_levels (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  inventory_item_gid TEXT NOT NULL,
  location_gid TEXT NOT NULL,
  product_gid TEXT NOT NULL,
  variant_gid TEXT NOT NULL,
  available INTEGER NOT NULL DEFAULT 0 CHECK (available >= 0),
  threshold INTEGER NOT NULL DEFAULT 5 CHECK (threshold >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, inventory_item_gid, location_gid)
);

CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  inventory_item_gid TEXT NOT NULL,
  location_gid TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('low_stock', 'out_of_stock')),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ
);

CREATE INDEX alerts_shop_status_created_idx ON alerts(shop_id, status, created_at DESC);

CREATE TABLE activity_events (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('alert_generated', 'alert_reviewed', 'threshold_changed')),
  inventory_item_gid TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX activity_shop_created_idx ON activity_events(shop_id, created_at DESC);

-- Webhook IDs make retries idempotent: one Shopify delivery is processed once.
CREATE TABLE webhook_deliveries (
  webhook_id TEXT PRIMARY KEY,
  shop_id BIGINT REFERENCES shops(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
