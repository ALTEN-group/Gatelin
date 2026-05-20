-- Shared Transaction Infrastructure
-- Loading order: 1. property.sql  2. stock.sql  3. struct.sql

-- Transactions Table
-- Stores income (rental, dividends, capital gains) and expenses

-- Line Item Reference Table
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

CREATE TABLE IF NOT EXISTS line_item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  type transaction_type NOT NULL,
  description TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed data for line items
INSERT INTO line_item (name, type, description) VALUES
  -- Income
  ('rent', 'income', 'Monthly rental income from tenant'),
  ('dividend', 'income', 'Dividend income from stock investments'),
  ('capital_gain', 'income', 'Capital gain from selling stocks'),
  -- Expenses
  ('water', 'expense', 'Water utility bill'),
  ('electricity', 'expense', 'Electricity utility bill'),
  ('gas', 'expense', 'Gas utility bill'),
  ('internet', 'expense', 'Internet subscription'),
  ('condominium', 'expense', 'Monthly condominium charges'),
  ('property_tax', 'expense', 'Annual property tax (taxe foncière)'),
  ('housing_tax', 'expense', 'Annual housing tax (taxe d''habitation)'),
  ('insurance', 'expense', 'Property insurance'),
  ('maintenance', 'expense', 'Regular maintenance costs'),
  ('repairs', 'expense', 'Repair costs'),
  ('cleaning', 'expense', 'Cleaning service costs'),
  ('garbage', 'expense', 'Garbage collection fees'),
  ('decoration', 'expense', 'Home decoration and interior design costs'),
  ('brokerage_fee', 'expense', 'Brokerage fees on stock trades')
ON CONFLICT (name) DO NOTHING;

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_transaction_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS transaction (
  id SERIAL PRIMARY KEY,
  property_id INT, -- NULL if stock transaction
  stock_id INT,    -- NULL if property transaction
  
  -- Transaction details
  line_item_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  
  -- Additional info
  description TEXT,
  invoice_reference VARCHAR(100),
  payment_date DATE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Foreign key
  CONSTRAINT fk_transaction_property
    FOREIGN KEY (property_id) REFERENCES property (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_transaction_stock
    FOREIGN KEY (stock_id) REFERENCES stock (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_transaction_line_item
    FOREIGN KEY (line_item_id) REFERENCES line_item (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  
  -- Constraints
  CHECK (amount > 0),
  CHECK (num_nonnulls(property_id, stock_id) = 1)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transaction_property_id ON transaction(property_id);
CREATE INDEX IF NOT EXISTS idx_transaction_stock_id ON transaction(stock_id);
CREATE INDEX IF NOT EXISTS idx_transaction_line_item_id ON transaction(line_item_id);
CREATE INDEX IF NOT EXISTS idx_transaction_payment_date ON transaction(payment_date);

CREATE TRIGGER trigger_update_transaction_timestamp
BEFORE UPDATE ON transaction
FOR EACH ROW
EXECUTE FUNCTION update_transaction_timestamp();

-- View to get monthly summary per property
CREATE OR REPLACE VIEW property_monthly_summary AS
SELECT 
  pt.property_id,
  EXTRACT(YEAR FROM pt.payment_date) AS period_year,
  EXTRACT(MONTH FROM pt.payment_date) AS period_month,
  COALESCE(SUM(CASE WHEN li.type = 'income' THEN pt.amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN li.type = 'expense' THEN pt.amount ELSE 0 END), 0) AS total_expenses,
  COALESCE(SUM(CASE WHEN li.type = 'income' THEN pt.amount ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN li.type = 'expense' THEN pt.amount ELSE 0 END), 0) AS net_result
FROM transaction pt
JOIN line_item li ON pt.line_item_id = li.id
WHERE pt.payment_date IS NOT NULL
  AND pt.property_id IS NOT NULL
GROUP BY pt.property_id, EXTRACT(YEAR FROM pt.payment_date), EXTRACT(MONTH FROM pt.payment_date)
ORDER BY pt.property_id, EXTRACT(YEAR FROM pt.payment_date) DESC, EXTRACT(MONTH FROM pt.payment_date) DESC;

-- View to get monthly summary per stock
CREATE OR REPLACE VIEW stock_monthly_summary AS
SELECT
  pt.stock_id,
  EXTRACT(YEAR FROM pt.payment_date) AS period_year,
  EXTRACT(MONTH FROM pt.payment_date) AS period_month,
  COALESCE(SUM(CASE WHEN li.type = 'income' THEN pt.amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN li.type = 'expense' THEN pt.amount ELSE 0 END), 0) AS total_expenses,
  COALESCE(SUM(CASE WHEN li.type = 'income' THEN pt.amount ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN li.type = 'expense' THEN pt.amount ELSE 0 END), 0) AS net_result
FROM transaction pt
JOIN line_item li ON pt.line_item_id = li.id
WHERE pt.payment_date IS NOT NULL
  AND pt.stock_id IS NOT NULL
GROUP BY pt.stock_id, EXTRACT(YEAR FROM pt.payment_date), EXTRACT(MONTH FROM pt.payment_date)
ORDER BY pt.stock_id, EXTRACT(YEAR FROM pt.payment_date) DESC, EXTRACT(MONTH FROM pt.payment_date) DESC;

-- ============================================================
-- Example inserts
-- Get line item IDs first, then insert transactions
-- Rental income
-- INSERT INTO transaction (property_id, line_item_id, amount, payment_date, description)
-- VALUES (1, (SELECT id FROM line_item WHERE name = 'rent'), 1200.00, '2026-02-01', 'Monthly rent - February 2026');

-- Monthly expenses
-- INSERT INTO transaction (property_id, line_item_id, amount, payment_date, description)
-- VALUES 
--   (1, (SELECT id FROM line_item WHERE name = 'electricity'), 85.50, '2026-02-01', 'Electricity bill - February 2026'),
--   (1, (SELECT id FROM line_item WHERE name = 'water'), 45.00, '2026-02-01', 'Water bill - February 2026'),
--   (1, (SELECT id FROM line_item WHERE name = 'internet'), 39.99, '2026-02-01', 'Internet subscription - February 2026'),
--   (1, (SELECT id FROM line_item WHERE name = 'condominium'), 150.00, '2026-02-01', 'Monthly charges - February 2026');
