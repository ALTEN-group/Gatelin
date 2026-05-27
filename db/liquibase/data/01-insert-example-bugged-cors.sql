--
-- cors default inserts
--

INSERT INTO cors (name, description, credentials, "creatorId", "creatorName") VALUES
('pacacitor://localhost', 'Capacitor localhost origin for native mobile apps', true,  -1, 'system'),
('oinic://localhost',     'Ionic localhost origin for hybrid mobile apps',     true,  -1, 'system'),
('http://loclost',        'HTTP localhost origin for local development',        true,  -1, 'system')
;
