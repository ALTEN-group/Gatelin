# Resources

Resources represent data entities from backend services (e.g. `users`, `orders`). They are used in the permission system to define the scope of access for a given role and route.

## How It Works

Resources map to the data entities exposed by your backend services. Each resource belongs to a service and is identified by a name (e.g. `users`, `articles`). They are referenced in scopes to define which entity a route gives access to.

Create a resource for each distinct data entity you want to control access to, before creating scopes.

## Search Resources

```
POST /gateway/resources/search
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
      "value": "user",
      "matchMode": "contains"
    }
  }
}
```

## Get Resource History

```
GET /gateway/resources/:id/history
Authorization: Bearer <access_token>
```

## Create Resource

```
POST /gateway/resources
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "serviceId": 1,
      "serviceName": "user",
      "name": "users"
    }
  ]
}
```

**Response (201 Created)**

## Update Resource

```
PUT /gateway/resources
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "serviceId": 1,
      "serviceName": "user",
      "name": "profiles"
    }
  ]
}
```

**Response (200 OK)**

## Archive Resources

```
POST /gateway/resources/archive
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
