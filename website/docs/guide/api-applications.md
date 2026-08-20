# Applications

Applications represent client applications that use this BFF. They are used for registration and access control purposes.

## How It Works

An application represents a registered client — such as a web app, mobile app, or an admin. Applications can be associated with consumers to track and control which clients are authorized to use Gatelin.

## Search Applications

```
POST /gatelin/applications/search
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
      "value": "admin",
      "matchMode": "contains"
    }
  }
}
```

## Get Application History

```
GET /gatelin/applications/:id/history
Authorization: Bearer <access_token>
```

## Create Application

```
POST /gatelin/applications
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
PUT /gatelin/applications
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
POST /gatelin/applications/archive
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
