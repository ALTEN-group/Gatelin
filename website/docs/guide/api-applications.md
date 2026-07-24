# Applications

Applications represent client applications consuming the gateway. They are used for registration and access control purposes.

## How It Works

An application represents a registered client — such as a web app, mobile app, or an admin — consuming the gateway. Applications can be associated with consumers to track and control which clients are authorized to interact with the gateway.

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
  "rows": [
    {
      "name": "admin-panel",
      "description": "Internal admin interface"
    }
  ]
}
```

**Response (201 Created)**

## Update Application

```
PUT /gateway/applications
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "admin-panel",
      "description": "Updated description"
    }
  ]
}
```

**Response (200 OK)**

## Archive Applications

```
POST /gateway/applications/archive
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
