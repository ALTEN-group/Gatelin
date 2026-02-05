# Gatelin

API Gateway service for routing and forwarding HTTP requests to internal microservices with JWT-based authentication and consumer management.

## Overview

Gatelin is an API Gateway that acts as a single entry point for microservices architecture. It handles:

- **Request routing** - Dynamic route matching and forwarding to target microservices
- **Authentication** - JWT token validation and consumer session management
- **Authorization** - Role-based access control (ACL) validation
- **Request transformation** - URL pattern stripping and header manipulation
- **Health monitoring** - Built-in health check endpoints
- **Performance tracking** - Request/response timing and metrics

## Features

- 🔐 JWT-based authentication with access and refresh tokens
- 🛣️ Dynamic route configuration and management
- 👤 Consumer (session) management with automatic token refresh
- 🔄 Request forwarding to internal microservices
- 🛡️ Role-based access control (RBAC)
- 📊 Performance monitoring and logging
- 🏥 Health check endpoints
- 🔒 Security headers with Helmet.js


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

## Usage

### Development

```bash
npm run dev
```

Starts the server with hot-reload using Node's `--watch` flag.

### Production

```bash
npm start
```

### Docker

```bash
cd docker
docker-compose up
```

## API Endpoints

### Health Check

```
GET /health
```

Returns service health status.

### Consumer Management (Authentication)

#### Login / Create Consumer Session

```
POST /consumers
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
  "roles": ["user", "admin"],
  "active": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Refresh Tokens

```
PUT /consumers
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "accessToken": "eyJhbGc...",
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
DELETE /consumers
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
  "filters": {
    "name": "user"
  },
  "pagination": {
    "limit": 10,
    "offset": 0
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
  "filters": {
    "name": "https://app.example.com"
  },
  "pagination": {
    "limit": 10,
    "offset": 0
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
  "filters": {
    "serviceId": 1,
    "api": "users"
  },
  "pagination": {
    "limit": 10,
    "offset": 0
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

### Services

- **routeSvc**: Manages route configuration and caching (auto-updates on add/update/delete)
- **consumerSvc**: Manages consumer sessions and authentication
- **corsSvc**: Manages CORS origins whitelist (auto-updates on add/update/delete)
- **http**: HTTP client for forwarding requests to microservices

## Data Models

### Service

```javascript
{
  id: integer,
  name: string,            // Service name (max 10 chars, e.g., "user", "auth")
  creatorId: integer,      // ID of user who created the service
  creatorName: string,     // Name of user who created the service
  updaterId: integer,      // ID of user who last updated (optional)
  updaterName: string,     // Name of user who last updated (optional)
  createdAt: timestamp,    // Creation timestamp
  updatedAt: timestamp     // Last update timestamp
}
```

### CORS

```javascript
{
  id: integer,
  name: string,            // Origin URL (max 50 chars, e.g., "https://app.example.com")
  creatorId: integer,      // ID of user who created the origin
  creatorName: string,     // Name of user who created the origin
  updaterId: integer,      // ID of user who last updated (optional)
  updaterName: string,     // Name of user who last updated (optional)
  createdAt: timestamp,    // Creation timestamp
  updatedAt: timestamp     // Last update timestamp
}
```

### Route

```javascript
{
  id: integer,
  serviceId: integer,      // Foreign key to service table
  api: string,             // API name (max 20 chars, e.g., "users", "products")
  action: string,          // Action name (max 20 chars, e.g., "search", "add", "update")
  description: string,     // Route description
  pattern: string,         // URL pattern with optional regex (e.g., "/users/(?<userId>\\d+)")
  methods: array,          // Allowed HTTP methods (e.g., ["GET", "POST", "OPTIONS"])
  jwt: boolean,            // Requires JWT authentication
  creatorId: integer,      // ID of user who created the route
  creatorName: string,     // Name of user who created the route
  updaterId: integer,      // ID of user who last updated (optional)
  updaterName: string,     // Name of user who last updated (optional)
  createdAt: timestamp,    // Creation timestamp
  updatedAt: timestamp     // Last update timestamp
}
```

### Consumer

```javascript
{
  id: integer,
  nickname: string,        // Username
  accessToken: string,     // JWT access token
  refreshToken: string,    // JWT refresh token
  roles: array            // User roles for RBAC
}
```

## Use with Front end 

In a typical situation, here's how the frontend should use access tokens:

Standard Flow
1. After Login (POST /consumers)

```typescript
const response = await fetch('/consumers', {
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
  const refreshResponse = await fetch('/consumers', {
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

await fetch('/consumers', {
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

1. Short-lived access token (5-15 min) - Used for all API requests
2. Long-lived refresh token (days/weeks) - Only used to get new access tokens
3. Storage:
  - localStorage - Simple, but vulnerable to XSS
  - httpOnly cookies - More secure (not accessible to JavaScript)
  - sessionStorage - Cleared when tab closes
4. Never send refresh token except to the refresh endpoint
5. Always check token expiration before requests (optional optimization)



## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Security

- All routes can require JWT authentication via the `jwt` flag
- Tokens are validated on every request to protected routes
- Consumer sessions are cached and validated against the database
- Security headers are automatically applied via Helmet.js
- Role-based access control (RBAC) is enforced via ACL validation

