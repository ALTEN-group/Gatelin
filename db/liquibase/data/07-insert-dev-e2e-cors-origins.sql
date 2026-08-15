-- Dev / e2e browser Origins. The admin UI is served through Traefik, so the
-- browser Origin includes the published host:port (localhost:8100 from the
-- host, or the `traefik` hostname from the admin-e2e container) — not bare
-- `http://localhost`.
INSERT INTO cors (name, description, credentials, "creatorId", "creatorName") VALUES
('http://localhost:8100', 'Traefik-published admin UI Origin for local host e2e', true, -1, 'system'),
('http://traefik',        'Traefik hostname Origin for in-compose Playwright e2e', true, -1, 'system')
;
