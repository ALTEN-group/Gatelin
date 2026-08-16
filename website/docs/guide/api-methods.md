# Methods

Methods represent HTTP methods (GET, POST, PUT, DELETE, etc.) available in the gateway. They are read-only reference data — only updates are supported.

## Search Methods

```
POST /gateway/methods/search
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
GET /gateway/methods/:id/history
Authorization: Bearer <access_token>
```

## Update Method

```
PUT /gateway/methods
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
