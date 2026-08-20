# Scopes

Scopes attach to routes in the permission system. They link a route to a resource and operation to define what data entity and action type the route represents.

## How It Works

A scope is a named tag attached to a route (e.g. `users:search`). When a permission references a scope, the ACL check only grants access if the URL segment following the resource name matches one of the scope's route names — letting a role be restricted to specific sub-paths of a route instead of the whole route.

Create scopes after routes are in place.

## Search Scopes

```
POST /gatelin/scopes/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "limit": 10,
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
GET /gatelin/scopes/:id/history
Authorization: Bearer <access_token>
```

## Create Scope

```
POST /gatelin/scopes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "routeId": 5,
      "name": "users:search"
    }
  ]
}
```

**Response (201 Created)**

### Scope Fields

| Field | Description |
|---|---|
| `routeId` | ID of the associated route |
| `name` | Scope name (e.g. `users:search`) |
| `core` | Whether this scope is a core system scope (read-only) |

## Update Scope

```
PUT /gatelin/scopes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "users:search:v2"
    }
  ]
}
```

**Response (200 OK)**

## Archive Scopes

```
POST /gatelin/scopes/archive
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
