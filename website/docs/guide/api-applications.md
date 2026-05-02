# Applications

Applications represent client applications consuming the gateway. They are used for registration and access control purposes.

## Search Applications

```
POST /gateway/applications/search
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
      "value": "admin",
      "matchMode": "contains"
    }
  }
}
```

## Get Application History

```
GET /gateway/applications/:id/history
Authorization: Bearer <access_token>
```

## Create Application

```
POST /gateway/applications
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "admin-panel",
  "description": "Internal admin interface",
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created)**

## Update Application

```
PUT /gateway/applications
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "name": "admin-panel",
  "description": "Updated description",
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK)**

## Archive Applications

```
POST /gateway/applications/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "ids": [1, 2, 3]
}
```

**Response (204 No Content)**
