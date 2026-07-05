# Permissions

Permissions define which operations a role is allowed to perform on a given route. They are stored directly in the gateway database and loaded into memory at startup.

## How It Works

Each permission links a role to a route and optionally attaches a condition. When a request arrives, the gateway looks up whether the consumer's role has a permission entry for the matched route. If a condition is attached, it is forwarded to the target service as a query filter to restrict the data returned.

Permissions are loaded from the database into memory at startup and updated in memory when changes occur.



## Search Permissions

```
POST /gateway/permissions/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
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
      "conditionId": 1
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
      "conditionId": 2
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
