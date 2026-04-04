# Routes

Routes define how incoming requests are matched and forwarded to services.

## Search Routes

```
POST /gatelin/routes/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "sortOrder": "ASC",
  "filters": {
    "api": {
      "value": "users",
      "matchMode": "contains"
    }
  }
}
```

## Create Route

```
POST /gatelin/routes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "serviceId": 2,
  "api": "users",
  "action": "search",
  "description": "Search users",
  "pattern": "/users/search",
  "methods": ["POST", "OPTIONS"],
  "jwt": true,
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created):** The route is cached and immediately available.

### Route Fields

| Field | Description |
|---|---|
| `serviceId` | ID of the target service |
| `api` | API name (e.g. `users`, `products`) |
| `action` | Action performed (e.g. `search`, `add`, `update`, `delete`) |
| `description` | Human-readable description |
| `pattern` | URL pattern to match (regex supported) |
| `methods` | Array of HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`) |
| `jwt` | Whether JWT authentication is required (`true`/`false`) |

## Update Route

```
PUT /gatelin/routes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "serviceId": 2,
  "api": "users",
  "action": "list",
  "description": "Updated description",
  "pattern": "/users",
  "methods": ["GET", "OPTIONS"],
  "jwt": true,
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK):** The route cache is automatically updated.

## Delete Route

```
DELETE /gatelin/routes?id=1,2,3
Authorization: Bearer <access_token>
```

**Response (204 No Content):** Routes are removed from cache immediately.
