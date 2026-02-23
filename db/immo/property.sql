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
-- Stores monthly gains (rental income) and costs (utilities, maintenance, etc.)

CREATE TYPE transaction_type AS ENUM ('gain', 'cost');
CREATE TYPE transaction_category AS ENUM (
  -- Gains
  'rental_income',
  'parking_rental',
  -- Costs
  'water',
  'electricity',
  'gas',
  'internet',
  'phone',
  'condominium_charges',
  'property_tax',
  'housing_tax',
  'insurance',
  'maintenance',
  'repairs',
  'cleaning',
  'garbage_collection'
);

CREATE TABLE IF NOT EXISTS property_transaction (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL,
  
  -- Transaction details
  type transaction_type NOT NULL,
  category transaction_category NOT NULL,
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
  
  -- Constraints
  CHECK (amount > 0)
);
