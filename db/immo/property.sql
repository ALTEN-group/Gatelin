-- Real Estate Property Table
-- Stores information about apartments and houses

CREATE TYPE property_type AS ENUM ('apartment', 'house');
CREATE TYPE energy_class AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G');

CREATE TABLE IF NOT EXISTS property (
  id SERIAL PRIMARY KEY,
  -- Property Type & Status
  type property_type NOT NULL,  
  -- Location
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(50) DEFAULT 'France',
  
  -- Property Characteristics
  surface_area DECIMAL(10, 2) NOT NULL, -- in square meters
  land_area DECIMAL(10, 2), -- in square meters (for houses)
  bedrooms INT NOT NULL,
  bathrooms INT,
  toilets INT,
  floors INT, -- floor number for apartments
  parking BOOLEAN DEFAULT FALSE,
  garage BOOLEAN DEFAULT FALSE,
  
  -- Energy & Equipment
  energy_class energy_class,
  ges_class energy_class, -- Greenhouse Gas emission class
  
  -- Financial Information
  price DECIMAL(12, 2) NOT NULL, -- Sale price
  notary_fees DECIMAL(10, 2), -- Notary fees (frais de notaire)
  agency_fees DECIMAL(10, 2), -- Real estate agency fees
  
  -- Construction & Condition
  construction_year INT,
  
  -- Additional Information
  description TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  bought_at TIMESTAMP,
  
  -- Owner/Agent tracking
  owner_id INT,
  
  -- Constraints
  CHECK (surface_area > 0),
  CHECK (bedrooms >= 0),
  CHECK (price > 0)
);

-- Monthly Transactions Table
-- Stores monthly income (rental income) and expenses (utilities, maintenance, etc.)

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
  ('parking', 'income', 'Parking space rental income'),
  -- Expenses
  ('water', 'expense', 'Water utility bill'),
  ('electricity', 'expense', 'Electricity utility bill'),
  ('gas', 'expense', 'Gas utility bill'),
  ('internet', 'expense', 'Internet subscription'),
  ('phone', 'expense', 'Phone subscription'),
  ('condominium', 'expense', 'Monthly condominium charges'),
  ('property_tax', 'expense', 'Annual property tax (taxe foncière)'),
  ('housing_tax', 'expense', 'Annual housing tax (taxe d''habitation)'),
  ('insurance', 'expense', 'Property insurance'),
  ('maintenance', 'expense', 'Regular maintenance costs'),
  ('repairs', 'expense', 'Repair costs'),
  ('cleaning', 'expense', 'Cleaning service costs'),
  ('garbage', 'expense', 'Garbage collection fees')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS property_transaction (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL,
  
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
  CONSTRAINT fk_transaction_line_item
    FOREIGN KEY (line_item_id) REFERENCES line_item (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  
  -- Constraints
  CHECK (amount > 0)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transaction_property_id ON property_transaction(property_id);
CREATE INDEX IF NOT EXISTS idx_transaction_line_item_id ON property_transaction(line_item_id);
CREATE INDEX IF NOT EXISTS idx_transaction_payment_date ON property_transaction(payment_date);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transaction_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_transaction_timestamp
BEFORE UPDATE ON property_transaction
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
FROM property_transaction pt
JOIN line_item li ON pt.line_item_id = li.id
WHERE pt.payment_date IS NOT NULL
GROUP BY pt.property_id, EXTRACT(YEAR FROM pt.payment_date), EXTRACT(MONTH FROM pt.payment_date)
ORDER BY pt.property_id, EXTRACT(YEAR FROM pt.payment_date) DESC, EXTRACT(MONTH FROM pt.payment_date) DESC;

-- Example inserts
-- Get line item IDs first, then insert transactions
-- Rental income
-- INSERT INTO property_transaction (property_id, line_item_id, amount, payment_date, description)
-- VALUES (1, (SELECT id FROM line_item WHERE name = 'rent'), 1200.00, '2026-02-01', 'Monthly rent - February 2026');

-- Monthly expenses
-- INSERT INTO property_transaction (property_id, line_item_id, amount, payment_date, description)
-- VALUES 
--   (1, (SELECT id FROM line_item WHERE name = 'electricity'), 85.50, '2026-02-01', 'Electricity bill - February 2026'),
--   (1, (SELECT id FROM line_item WHERE name = 'water'), 45.00, '2026-02-01', 'Water bill - February 2026'),
--   (1, (SELECT id FROM line_item WHERE name = 'internet'), 39.99, '2026-02-01', 'Internet subscription - February 2026'),
--   (1, (SELECT id FROM line_item WHERE name = 'condominium'), 150.00, '2026-02-01', 'Monthly charges - February 2026');
