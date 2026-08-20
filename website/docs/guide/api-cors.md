# CORS

CORS origins are stored in the database and dynamically applied without requiring a service restart. The middleware runs before route matching so preflight `OPTIONS` requests short-circuit with `204`.

Allowed request headers include `Content-Type`, `Authorization`, and `X-CSRF-Token`. When an origin has `credentials: true`, responses include `Access-Control-Allow-Credentials: true`.

## Search CORS Origins

```
POST /gatelin/cors/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "limit": 10,
  "sortField": "id",
  "filters": {
    "name": {
      "value": "app.example.com",
      "matchMode": "contains"
    }
  }
}
```

## Get CORS History

```
GET /gatelin/cors/:id/history
Authorization: Bearer <access_token>
```

## Add CORS Origin

```
POST /gatelin/cors
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "name": "https://app.example.com",
      "credentials": true
    }
  ]
}
```

**Response (201 Created):** The new origin is immediately added to the CORS whitelist.

## Update CORS Origin

```
PUT /gatelin/cors
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "https://updated.example.com"
    }
  ]
}
```

**Response (200 OK):** The CORS whitelist is automatically updated.

## Archive CORS Origins

```
POST /gatelin/cors/archive
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

**Response (204 No Content):** Origins are removed from the CORS whitelist immediately.
