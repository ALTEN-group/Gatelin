-- Real Estate Property
-- Stores information about apartments and houses

CREATE TYPE property_type AS ENUM ('apartment', 'house', 'parking space', 'garage');
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
  land_area DECIMAL(10, 2),             -- in square meters (for houses)
  bedrooms INT NOT NULL,
  bathrooms INT,
  toilets INT,
  floors INT,                           -- floor number for apartments
  parking BOOLEAN DEFAULT FALSE,
  garage BOOLEAN DEFAULT FALSE,

  -- Energy & Equipment
  energy_class energy_class,
  ges_class energy_class,               -- Greenhouse Gas emission class

  -- Financial Information
  price DECIMAL(12, 2) NOT NULL,        -- Sale price
  notary_fees DECIMAL(10, 2),           -- Notary fees (frais de notaire)
  agency_fees DECIMAL(10, 2),           -- Real estate agency fees
  loan_fees DECIMAL(10, 2),             -- Loan fees (frais d'emprunt)

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
