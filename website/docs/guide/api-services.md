# Services

Services represent the backend microservices that routes can forward requests to.

## Search Services

```
POST /gatelin/services/search
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

## Create Service

```
POST /gatelin/services
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "user",
  "creatorId": 1,
  "creatorName": "admin"
}
```

## Update Service

```
PUT /gatelin/services
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "name": "user-service",
  "updaterId": 1,
  "updaterName": "admin"
}
```

## Delete Service

```
DELETE /gatelin/services?id=1,2,3
Authorization: Bearer <access_token>
```
