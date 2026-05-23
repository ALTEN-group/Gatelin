# Scopes

Scopes attach to routes in the permission system. They link a route to a resource and operation to define what data entity and action type the route represents.

## How It Works

A scope answers: "What does this route give access to, and what kind of action does it represent?" The gateway uses the scope during ACL validation to confirm the consumer's role is allowed to perform that operation on that resource. Each route should have a scope defined for authorization to work correctly.

Create scopes after resources and operations are in place.

## Search Scopes

```
POST /gateway/scopes/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "sortOrder": "ASC",
  "filters": {
    "routeId": {
      "value": 5,
      "matchMode": "equals"
    }
  }
}
```

## Get Scope History

```
GET /gateway/scopes/:id/history
Authorization: Bearer <access_token>
```

## Create Scope

```
POST /gateway/scopes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "routeId": 5,
  "resourceId": 2,
  "operationId": 1,
  "core": false,
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created)**

### Scope Fields

| Field | Description |
|---|---|
| `routeId` | ID of the associated route |
| `resourceId` | ID of the associated resource |
| `operationId` | ID of the associated operation |
| `core` | Whether this scope is a core system scope (read-only) |

## Update Scope

```
PUT /gateway/scopes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "resourceId": 3,
  "operationId": 2,
  "core": false,
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK)**

## Archive Scopes

```
POST /gateway/scopes/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "ids": [1, 2, 3]
}
```

**Response (204 No Content)**
