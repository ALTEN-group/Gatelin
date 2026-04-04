# CORS

CORS origins are stored in the database and dynamically applied without requiring a service restart.

## Search CORS Origins

```
POST /gatelin/cors/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "filters": {
    "name": {
      "value": "app.example.com",
      "matchMode": "contains"
    }
  }
}
```

## Add CORS Origin

```
POST /gatelin/cors
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "https://app.example.com",
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created):** The new origin is immediately added to the CORS whitelist.

## Update CORS Origin

```
PUT /gatelin/cors
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "name": "https://updated.example.com",
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK):** The CORS whitelist is automatically updated.

## Delete CORS Origin

```
DELETE /gatelin/cors?id=1,2,3
Authorization: Bearer <access_token>
```

**Response (204 No Content):** Origins are removed from the CORS whitelist immediately.
