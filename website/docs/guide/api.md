# Consumers

Consumer endpoints manage authentication — login, token refresh, and logout.

## Login

```
POST /gatelin/consumers
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

## Refresh Tokens

```
PUT /gatelin/consumers
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

## Logout

```
DELETE /gatelin/consumers
Authorization: Bearer <access_token>
```

**Response (204 No Content)**
