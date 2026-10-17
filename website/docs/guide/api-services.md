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
  "limit": 10,
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
GET /gatelin/services/:id/history
Authorization: Bearer <access_token>
```

## Create Service

```
POST /gatelin/services
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "name": "user",
      "pattern": "my-api",
      "forwardedCookies": ["app_csrf"]
    }
  ]
}
```

## Update Service

```
PUT /gatelin/services
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

## Forwarded Cookies

By default Gatelin strips the client `Cookie` header before proxying. `forwardedCookies` lists the cookie names a service is allowed to receive; only those cookies are forwarded, the others are dropped.

- Each name must be a valid cookie token (no space, `;` or `=`), at most 64 characters, unique, with at most 20 names per service.
- Gatelin session cookies (`refreshToken` and `csrfToken`, or the names set by `REFRESH_TOKEN_COOKIE_NAME` and `CSRF_COOKIE_NAME`) are never forwarded, even if listed.
- An empty or unset list forwards no cookie.

## Archive Services

```
POST /gatelin/services/archive
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

The seeded **gatelin** service is `core`. It cannot be archived: catalog resources belong to that service with `ON DELETE CASCADE`, so a later retention hard-delete would wipe system resources. Custom services still archive and are purged after 2 months.
