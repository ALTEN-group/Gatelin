# Gatelin

API Gateway service for routing and forwarding HTTP requests to internal microservices with JWT-based authentication and management for consumers, services, routes, and CORS configurations.

## Overview

Gatelin is an API Gateway that acts as a single entry point for microservices architecture. It handles:

- 🛣️ Requests routing - Dynamic route matching and forwarding to target microservices
- 👤 Consumer management - With automatic token refresh
- 🗺️ Routes management - Organize and control available API endpoints
- 🛎️ Services management - Register, update, and monitor backend services
- 🌐 Cors management - Configure and enforce Cross-Origin Resource Sharing policies
- 🔐 Authentication - JWT token validation and consumer session management
- 🛡️ Authorization - Role-based access control (ACL) validation
- 🎭 Role management — Create, update, archive, and search roles with assigned permissions
- 🔑 Permission management — Per-role, per-route operation access stored directly in the gateway database
- 🎛️ Front-end admin - Manage the gateway via a user-friendly web interface


## Environment Variables

Configure the following environment variables :

```env
# Application
APP_NAME=gatelin              # Application name prefix for service discovery
ENV_NAME=development          # Environment (development, staging, production)
PORT=3000                     # Port the gateway listens on
TZ=Europe/Paris
LOCALE=fr-FR
SERVER_SCHEME=http://         # Protocol for internal 
SERVER_URL=localhost          # Gateway address

# Database (PostgreSQL)
# Used to store routes and consumer sessions
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gatelin
DB_USER=gatelin_user
DB_PASSWORD=your_password

# JWT Configuration
# These variables are used to generate and validate tokens
ACCESS_TOKEN_DURATION=15m
REFRESH_TOKEN_DURATION=7d
TOKEN_SECRET=your_token_secret_min_32_chars

# Microservices URLs (Required)
# Gatelin requires these URLs to communicate with internal microservices
MSAUTH_URL=http://gatelin-ms-auth-mock-local:3000    # Authentication microservice URL
MSUSER_URL=http://gatelin-ms-user-mock-local:3000    # User management microservice URL
```

**JWT Token Flow:**
1. User logs in via `POST /consumers` with email and password
2. Gateway validates credentials against the user microservice
3. Gateway generates JWT access token (short-lived) and refresh token (long-lived)
4. Client includes access token in `Authorization: Bearer <token>` header for subsequent requests
5. When access token expires, client uses `PUT /consumers` with both tokens to get new ones
6. Gateway validates and refreshes tokens automatically

## API Endpoints

### Health Check

```
GET /gatelin/health
```

Returns service health status.

### Consumer Management (Authentication)

#### Login / Create Consumer Session

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

#### Refresh Tokens

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

#### Logout / Delete Consumer Session

```
DELETE /gatelin/consumers
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

### Service Management

Services represent the backend microservices that routes can forward requests to.

#### Search Services

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

#### Create Service

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

#### Update Service

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

#### Delete Service

```
DELETE /gatelin/services?id=1,2,3
Authorization: Bearer <access_token>
```

### CORS Management

CORS origins are stored in the database and dynamically applied without requiring a service restart.

#### Search CORS Origins

```
POST /gatelin/cors/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "filters": {
    "name": {
      "value": "app.example.com",
      "matchMode": "contains"
    }
  }
}
```

#### Add CORS Origin

```
POST /gatelin/cors
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "https://app.example.com",
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created):** The new origin is immediately added to the CORS whitelist.

#### Update CORS Origin

```
PUT /gatelin/cors
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "name": "https://updated.example.com",
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK):** The CORS whitelist is automatically updated.

#### Delete CORS Origin

```
DELETE /gatelin/cors?id=1,2,3
Authorization: Bearer <access_token>
```

**Response (204 No Content):** Origins are removed from the CORS whitelist immediately.

### Route Management

Routes define how incoming requests are matched and forwarded to services.

#### Search Routes

```
POST /gatelin/routes/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
  "sortField": "id",
  "sortOrder": "ASC",
  "filters": {
    "api": {
      "value": "users",
      "matchMode": "contains"
    }
  }
}
```

#### Create Route

```
POST /gatelin/routes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "serviceId": 2,
  "api": "users",
  "action": "search",
  "description": "Search users",
  "pattern": "/users/search",
  "methods": ["POST", "OPTIONS"],
  "jwt": true,
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created):** The route is cached and immediately available.

**Route Fields:**
- `serviceId`: ID of the target service
- `api`: API name (e.g., "users", "products")
- `action`: Action performed (e.g., "search", "add", "update", "delete")
- `description`: Human-readable description
- `pattern`: URL pattern to match (regex supported)
- `methods`: Array of HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)
- `jwt`: Whether JWT authentication is required (true/false)

#### Update Route

```
PUT /gatelin/routes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "serviceId": 2,
  "api": "users",
  "action": "list",
  "description": "Updated description",
  "pattern": "/users",
  "methods": ["GET", "OPTIONS"],
  "jwt": true,
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK):** The route cache is automatically updated.

#### Delete Route

```
DELETE /gatelin/routes?id=1,2,3
Authorization: Bearer <access_token>
```

**Response (204 No Content):** Routes are removed from cache immediately

### Role Management

Roles define access control profiles assigned to consumers. Each role carries a set of permissions (allowed operations per route).

#### Search Roles

```
POST /gateway/roles/search
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

#### Get Role History

```
GET /gateway/roles/:id/history
Authorization: Bearer <access_token>
```

#### Create Role

```
POST /gateway/roles
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "editor",
  "description": "Can edit content",
  "color": "#4B0082",
  "creatorId": 1,
  "creatorName": "admin"
}
```

#### Update Role

```
PUT /gateway/roles
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "name": "editor",
  "description": "Can edit and publish content",
  "color": "#0000FF",
  "updaterId": 1,
  "updaterName": "admin"
}
```

#### Archive Roles

```
POST /gateway/roles/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "ids": [1, 2, 3]
}
```

### Proxy (Request Forwarding)

All requests not matching `/health`, `/gatelin/*` (admin endpoints), or `/consumers` are treated as proxy requests and forwarded to the appropriate microservice based on route configuration.

**Example:**

```
GET /api/users/123
Authorization: Bearer <access_token>
```

**Flow:**
1. Gateway validates the route exists and matches `/api/users` pattern
2. Validates JWT token (if `jwt: true` for the route)
3. Checks consumer session exists and is valid
4. Strips the pattern from URL (if configured)
5. Forwards request to: `http://gatelin-user-development:3000/123`
6. Returns the microservice response to the client

## Architecture

### Request Flow

```
Client Request
    ↓
[checkRoute] - Validate route exists and extract config
    ↓
[decodeAccess] - Decode JWT token (if present)
    ↓
[checkConsumer] - Validate consumer session
    ↓
[checkACL] - Validate user roles/permissions
    ↓
[stripUrl] - Remove pattern prefix from URL
    ↓
[additionalHeaders] - Add custom headers
    ↓
[forwardToService] - Forward to target microservice
    ↓
Client Response
```

### Key Middlewares

- **checkRoute**: Validates incoming request matches a configured route
- **checkConsumer**: Ensures consumer session exists and is valid
- **checkToken**: Validates JWT access and refresh tokens
- **checkACL**: Validates user has required roles for the route
- **stripUrl**: Removes route pattern prefix before forwarding
- **additionalHeaders**: Adds gateway-specific headers to forwarded requests


## Use with Front end admin

In a typical situation, here's how the frontend should use access tokens:

Standard Flow
1. After Login (POST /gatelin/consumers)

```typescript
const response = await fetch('/gatelin/consumers', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { accessToken, refreshToken } = await response.json();

// Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

2. Making Authenticated Requests

```typescript
const accessToken = localStorage.getItem('accessToken');

fetch('/api/protected-resource', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

3. When Access Token Expires (401 response)

```typescript
// Intercept 401 errors
if (response.status === 401) {
  // Refresh tokens
  const refreshToken = localStorage.getItem('refreshToken');
  const refreshResponse = await fetch('/gatelin/consumers', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}` // Old access token
    },
    body: JSON.stringify({ refreshToken })
  });
  
  const { accessToken: newAccess, refreshToken: newRefresh } = await refreshResponse.json();
  
  // Store new tokens
  localStorage.setItem('accessToken', newAccess);
  localStorage.setItem('refreshToken', newRefresh);
  
  // Retry original request with new token
  return fetch('/api/protected-resource', {
    headers: { 'Authorization': `Bearer ${newAccess}` }
  });
}
```

4. Logout (DELETE /consumers)

```typescript
const accessToken = localStorage.getItem('accessToken');

await fetch('/gatelin/consumers', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// Clear tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

Key Points

1. Short-lived access token (15 min) - Used for all API requests
2. Long-lived refresh token (days/weeks) - Only used to get new access tokens
3. Storage:
  - localStorage - Simple, but vulnerable to XSS
  - httpOnly cookies - More secure (not accessible to JavaScript)
  - sessionStorage - Cleared when tab closes
4. Never send refresh token except to the refresh endpoint

## Security

- All routes can require JWT authentication via the `jwt` flag
- Tokens are validated on every request to protected routes
- Consumer sessions are cached and validated against the database
- Security headers are automatically applied via Helmet.js
- Role-based access control (RBAC) is enforced via ACL validation

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, development, testing, and production build commands.

