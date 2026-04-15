--
-- Default color inserts
--

INSERT INTO color (name, code) VALUES
  ('red',    '#FF0000'),
  ('orange', '#FF8000'),
  ('yellow', '#FFD700'),
  ('green',  '#008000'),
  ('teal',   '#008080'),
  ('blue',   '#0000FF'),
  ('purple', '#800080'),
  ('pink',   '#FF69B4'),
  ('brown',  '#8B4513'),
  ('gray',   '#808080'),
  ('black',  '#000000'),
  ('white',  '#FFFFFF')
ON CONFLICT DO NOTHING;
