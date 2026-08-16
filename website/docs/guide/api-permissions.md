# Permissions

Permissions define which operations a role is allowed to perform on a given route. They are stored directly in the gateway database and loaded into memory at startup.

## How It Works

Each permission links a role to a route and an operation. Optionally it may also attach:

- **`fields`** — column allow-list (`null` = unrestricted, `[]` = no writable fields)
- **`scopes`** — allowed URL sub-segments for scoped routes
- **`conditionId`** — condition IDs whose filters are injected into `req.body.filters` and forwarded as `x-acl-conditions` on proxied requests

When a request arrives, the gateway looks up whether any of the consumer's roles has a matching permission for the route and operation. Permissions are loaded into memory at startup and updated when changes occur.

Permissions are hard-deleted (not archived) and are not purged by the archived-entities retention job.



## Search Permissions

```
POST /gateway/permissions/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "limit": 10,
  "sortField": "roleId",
  "sortOrder": "ASC",
  "filters": {
    "roleId": {
      "value": 2,
      "matchMode": "equals"
    }
  }
}
```

## Get Permission History by Route

```
GET /gateway/permissions/history/route/:routeId
Authorization: Bearer <access_token>
```

## Add Permissions

Permissions are added in bulk — one entry per role/route/operation combination.

```
POST /gateway/permissions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "roleId": 2,
      "routeId": 5,
      "operationId": 1,
      "fields": ["name", "email"],
      "scopes": ["own"],
      "conditionId": [1]
    }
  ]
}
```

**Response (201 Created)**

## Update Permissions

```
PUT /gateway/permissions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 10,
      "conditionId": [2]
    }
  ]
}
```

**Response (200 OK)**

## Delete Permissions

```
DELETE /gateway/permissions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    { "id": 10 },
    { "id": 11 },
    { "id": 12 }
  ]
}
```

**Response (204 No Content)**
