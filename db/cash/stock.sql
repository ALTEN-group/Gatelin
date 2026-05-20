-- Stock Portfolio
-- Stores stock/ETF definitions and purchase history

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_transaction_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Stock Table
-- One row per stock / ETF held

CREATE TABLE IF NOT EXISTS stock (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(20) NOT NULL UNIQUE, -- e.g. AAPL, MC.PA
  isin VARCHAR(12),                   -- International Securities Identification Number
  name VARCHAR(200) NOT NULL,
  description TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER trigger_update_stock_timestamp
BEFORE UPDATE ON stock
FOR EACH ROW
EXECUTE FUNCTION update_transaction_timestamp();

-- Stock Buy Table
-- Records each purchase (like buying a property)

CREATE TABLE IF NOT EXISTS stock_buy (
  id SERIAL PRIMARY KEY,
  stock_id INT NOT NULL,

  quantity DECIMAL(18, 6) NOT NULL,        -- Number of shares / units
  price_per_share DECIMAL(14, 4) NOT NULL, -- Unit price at purchase
  fees DECIMAL(10, 2) DEFAULT 0,           -- Brokerage fees
  bought_at DATE NOT NULL,

  description TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_stock_buy_stock
    FOREIGN KEY (stock_id) REFERENCES stock (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CHECK (quantity > 0),
  CHECK (price_per_share > 0),
  CHECK (fees >= 0)
);

CREATE TRIGGER trigger_update_stock_buy_timestamp
BEFORE UPDATE ON stock_buy
FOR EACH ROW
EXECUTE FUNCTION update_transaction_timestamp();

CREATE INDEX IF NOT EXISTS idx_stock_buy_stock_id ON stock_buy(stock_id);
CREATE INDEX IF NOT EXISTS idx_stock_buy_bought_at ON stock_buy(bought_at);
