# Consumers

Admin endpoints for inspecting and managing active consumer sessions stored in the database.

A consumer record is created on login and archived on logout. These endpoints allow administrators to search active sessions and force-archive (force-logout) one or more consumers.

## Search Consumers

```
POST /gateway/consumers/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "sortOrder": "ASC",
  "filters": {
    "archived": {
      "value": false,
      "matchMode": "equals"
    }
  }
}
```

**Response (200 OK):**
```json
{
  "rows": [
    {
      "id": 1,
      "userId": 42,
      "nickname": "john.doe",
      "roles": [1, 2],
      "archived": false,
      "creatorName": "system",
      "updaterName": null
    }
  ],
  "total": 1
}
```

**Filterable fields:** `id`, `userId`, `nickname`, `roles`, `archived`

## Archive Consumers

Force-archives (force-logouts) one or more consumers. The records are marked as archived and removed from the in-memory session cache, immediately invalidating their tokens.

```
POST /gateway/consumers/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    { "id": 1 },
    { "id": 2 },
    { "id": 3 }
  ]
}
```

**Response (204 No Content)**
