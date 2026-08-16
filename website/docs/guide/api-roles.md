# Roles

Roles define access control profiles assigned to consumers. Each role carries a set of permissions (allowed operations per route). The role cache is loaded from the database at startup and kept in memory.

## How It Works

Consumers carry one or more role IDs. When a request arrives, the gateway merges permissions from all of those roles and checks them against the matched route. The role cache is loaded at startup and refreshed in memory when roles or permissions are updated.

### Field restrictions on permissions

Permissions attached to a role may include a `fields` array:

| Value | Meaning |
|---|---|
| `null` | Unrestricted — all fields are readable/writable |
| `[]` | No writable fields — write payloads keep only `id` |
| `["colA", "colB"]` | Only the listed fields are allowed (plus `id` on writes) |

When merging multiple roles, `null` wins (least restrictive). Otherwise field sets are unioned.

## Search Roles

```
POST /gateway/roles/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "limit": 10,
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
  "rows": [
    {
      "name": "editor",
      "description": "Can edit content",
      "color": "#4B0082",
      "appId": 1
    }
  ]
}
```

**Response (201 Created)**

## Update Role

```
PUT /gateway/roles
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "editor",
      "description": "Can edit and publish content",
      "color": "#0000FF"
    }
  ]
}
```

**Response (200 OK)**

## Archive Roles

```
POST /gateway/roles/archive
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

Archived roles older than 2 months are permanently deleted by the daily retention job.

### Role Fields

| Field | Description |
|---|---|
| `appId` | ID of the application this role belongs to |
| `name` | Unique role name |
| `description` | Human-readable description |
| `color` | Hex color code assigned to the role (e.g. `#FF8000`) |
| `archived` | Whether the role is archived |
