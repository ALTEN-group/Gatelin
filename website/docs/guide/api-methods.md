# Methods

Methods represent HTTP methods (GET, POST, PUT, DELETE, etc.) available on Gatelin. They are read-only reference data — only updates are supported.

## Search Methods

```
POST /gatelin/methods/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "limit": 10,
  "sortField": "id",
  "sortOrder": "ASC"
}
```

## Get Method History

```
GET /gatelin/methods/:id/history
Authorization: Bearer <access_token>
```

## Update Method

```
PUT /gatelin/methods
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "GET"
    }
  ]
}
```

**Response (200 OK)**
