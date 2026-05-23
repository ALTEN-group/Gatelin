# Roles

Roles define access control profiles assigned to consumers. Each role carries a set of permissions (allowed operations per route). The role cache is loaded from the database at startup and kept in memory.

## How It Works

A role is assigned to a consumer and determines which routes they can access. When a request arrives, the gateway retrieves the consumer's role from their session and checks it against the permission table for the matched route. The role cache is refreshed in memory when roles or permissions are updated.

## Search Roles

```
POST /gateway/roles/search
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

## Get Role History

```
GET /gateway/roles/:id/history
Authorization: Bearer <access_token>
```

## Create Role

```
POST /gateway/roles
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "editor",
  "description": "Can edit content",
  "color": "#4B0082",
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created)**

## Update Role

```
PUT /gateway/roles
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "name": "editor",
  "description": "Can edit and publish content",
  "color": "#0000FF",
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK)**

## Archive Roles

```
POST /gateway/roles/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "ids": [1, 2, 3]
}
```

**Response (200 OK)**

### Role Fields

| Field | Description |
|---|---|
| `name` | Unique role name |
| `description` | Human-readable description |
| `color` | Hex color code assigned to the role (e.g. `#FF8000`) |
| `active` | Whether the role is currently active |
| `archived` | Whether the role is archived |
