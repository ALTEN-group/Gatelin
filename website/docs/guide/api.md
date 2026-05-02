# Sessions & Consumers

## Sessions

Session endpoints manage authentication — login, token refresh, and logout.

### Login

```
POST /gateway/sessions
Content-Type: application/json

{
  "email": "user@example.com",
  "pwd": "password"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nickname": "username",
  "rolesArrayAgg": [1, 2],
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Refresh Tokens

```
PUT /gateway/sessions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

### Logout

```
DELETE /gateway/sessions
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

## Consumers

Admin endpoints for managing consumer sessions stored in the database.

### Search Consumers

```
POST /gateway/consumers/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "sortOrder": "ASC",
  "filters": {
    "archived": {
      "value": false,
      "matchMode": "equals"
    }
  }
}
```

### Archive Consumers

```
POST /gateway/consumers/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "ids": [1, 2, 3]
}
```

**Response (204 No Content)**
