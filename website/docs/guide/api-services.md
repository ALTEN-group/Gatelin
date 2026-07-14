# Services

Services represent the backend microservices that routes can forward requests to.

## Search Services

```
POST /gateway/services/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "filters": {
    "name": {
      "value": "user",
      "matchMode": "contains"
    }
  }
}
```

## Get Service History

```
GET /gateway/services/:id/history
Authorization: Bearer <access_token>
```

## Create Service

```
POST /gateway/services
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "name": "user",
      "pattern": "my-api"
    }
  ]
}
```

## Update Service

```
PUT /gateway/services
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "user-service"
    }
  ]
}
```

## Archive Services

```
POST /gateway/services/archive
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
