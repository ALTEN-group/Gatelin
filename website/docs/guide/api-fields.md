# Fields

Fields represent database columns or entity properties used to build conditions in the permission system.

## How It Works

A field name follows the format `table.column` (e.g. `consumers.archived`). Fields are the building blocks of conditions — when creating a condition, you reference a field to specify which property to filter on. Create fields before creating conditions.

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
  "rows": [
    {
      "resourceId": 3,
      "name": "consumers.archived"
    }
  ]
}
```

**Response (201 Created)**

## Update Field

```
PUT /gateway/fields
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "consumers.active"
    }
  ]
}
```

**Response (200 OK)**

## Archive Fields

```
POST /gateway/fields/archive
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
