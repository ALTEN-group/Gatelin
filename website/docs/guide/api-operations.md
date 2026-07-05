# Operations

Operations represent action types (e.g. `read`, `write`, `delete`) used in the permission system to define what a role is allowed to do on a resource.

## How It Works

Operations define the type of action a permission grants on a resource. They are paired with a resource in a scope to express "this route allows performing operation X on resource Y". Create operations before creating scopes.

## Search Operations

```
POST /gateway/operations/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "sortOrder": "ASC",
  "filters": {
    "name": {
      "value": "read",
      "matchMode": "contains"
    }
  }
}
```

## Get Operation History

```
GET /gateway/operations/:id/history
Authorization: Bearer <access_token>
```

## Create Operation

```
POST /gateway/operations
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "name": "read",
      "description": "Read access",
      "color": "#4B0082"
    }
  ]
}
```

**Response (201 Created)**

## Update Operation

```
PUT /gateway/operations
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "read",
      "description": "Read-only access",
      "color": "#0000FF"
    }
  ]
}
```

**Response (200 OK)**

## Archive Operations

```
POST /gateway/operations/archive
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
