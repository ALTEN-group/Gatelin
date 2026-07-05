# Routes

Routes define how incoming requests are matched and forwarded to services.

## Search Routes

```
POST /gateway/routes/search
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

## Get Route History

```
GET /gateway/routes/:id/history
Authorization: Bearer <access_token>
```

## Create Route

```
POST /gateway/routes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "serviceId": 2,
      "resourceId": 4,
      "name": "searchUsers",
      "description": "Search users",
      "pattern": "/users/search",
      "methodIds": [1, 7],
      "protected": true
    }
  ]
}
```

**Response (201 Created):** The route is cached and immediately available.

### Route Fields

| Field | Description |
|---|---|
| `serviceId` | ID of the target service |
| `resourceId` | ID of the resource this route exposes |
| `name` | Route name identifier |
| `description` | Human-readable description |
| `pattern` | URL pattern to match (regex supported) |
| `methodIds` | Array of HTTP method IDs allowed on this route |
| `protected` | Whether JWT authentication is required (`true`/`false`) |

## Update Route

```
PUT /gateway/routes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "serviceId": 2,
      "resourceId": 4,
      "name": "listUsers",
      "description": "Updated description",
      "pattern": "/users",
      "methodIds": [1],
      "protected": true
    }
  ]
}
```

**Response (200 OK):** The route cache is automatically updated.

## Archive Routes

```
POST /gateway/routes/archive
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

**Response (204 No Content):** Routes are removed from cache immediately.
