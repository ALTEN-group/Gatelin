# Fields

Fields represent database columns or entity properties used to build conditions in the permission system.

## How It Works

A field name follows the format `table.column` (e.g. `users.active`) and is limited to **50 characters**. Fields are the building blocks of conditions — when creating a condition, you reference a field to specify which property to filter on. Create fields before creating conditions.

Field names are also used in permission `fields` arrays to restrict which columns a role may read or write on a route.

## Search Fields

```
POST /gatelin/fields/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "limit": 10,
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
GET /gatelin/fields/:id/history
Authorization: Bearer <access_token>
```

## Create Field

```
POST /gatelin/fields
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "resourceId": 3,
      "name": "users.active"
    }
  ]
}
```

**Response (201 Created)**

## Update Field

```
PUT /gatelin/fields
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "users.email"
    }
  ]
}
```

**Response (200 OK)**

## Archive Fields

```
POST /gatelin/fields/archive
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

Seeded Gatelin catalog fields (those marked `core`) cannot be archived. Conditions reference fields with `ON DELETE RESTRICT`, and permission `fields` arrays match these names. Custom fields still archive and are purged after 2 months (after conditions that reference them).
