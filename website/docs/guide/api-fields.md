# Fields

Fields represent database columns or entity properties used to build conditions in the permission system.

## Search Fields

```
POST /gateway/fields/search
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
      "value": "archived",
      "matchMode": "contains"
    }
  }
}
```

## Get Field History

```
GET /gateway/fields/:id/history
Authorization: Bearer <access_token>
```

## Create Field

```
POST /gateway/fields
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "consumers.archived",
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created)**

## Update Field

```
PUT /gateway/fields
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "name": "consumers.active",
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK)**

## Archive Fields

```
POST /gateway/fields/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "ids": [1, 2, 3]
}
```

**Response (204 No Content)**
