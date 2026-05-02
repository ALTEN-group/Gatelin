# Preferences

Preferences store per-user column visibility and ordering settings for the admin UI. On first save, user copies are created from system defaults; subsequent saves update the existing user rows.

## Get Preferences

Returns column preferences for a given resource, merging system defaults with any user overrides.

```
GET /gateway/preferences/:resource
Authorization: Bearer <access_token>
```

**Parameters:**

| Parameter | Description |
|---|---|
| `resource` | The resource name (e.g. `routes`, `roles`, `services`) |

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "resource": "routes",
    "field": "api",
    "visible": true,
    "order": 1
  }
]
```

## Upsert Preferences

Creates user preference rows from system defaults on first call; updates existing rows on subsequent calls.

```
PUT /gateway/preferences/:resource
Content-Type: application/json
Authorization: Bearer <access_token>

[
  {
    "id": 1,
    "visible": true,
    "order": 1
  },
  {
    "id": 2,
    "visible": false,
    "order": 2
  }
]
```

**Response (200 OK)**
