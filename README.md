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

### Route Management

#### Create Route

```
POST /routes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "route": "/api/users",
  "service": "user",
  "description": "User management service",
  "pattern": "/api/users",
  "methods": ["GET", "POST", "PUT", "DELETE"],
  "jwt": true
}
```

#### Update Route

```
PUT /routes
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "route": "/api/users",
  "service": "user",
  "description": "Updated description",
  "pattern": "/api/users",
  "methods": ["GET", "POST"],
  "jwt": true
}
```

#### Delete Route

```
DELETE /routes?id=1
Authorization: Bearer <access_token>
```

#### Search Routes

```
POST /routes/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "filters": {
    "service": "user"
  }
}
```

### Proxy (Request Forwarding)

All requests not matching `/health`, `/consumers`, or `/routes` are treated as proxy requests and forwarded to the appropriate microservice based on route configuration.

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

- **routeSvc**: Manages route configuration and caching
- **consumerSvc**: Manages consumer sessions and authentication
- **http**: HTTP client for forwarding requests to microservices

## Data Models

### Route

```javascript
{
  id: integer,
  route: string,           // URL pattern (e.g., "/api/users")
  service: string,         // Target service name (e.g., "user")
  description: string,     // Route description
  pattern: string,         // Pattern to strip from URL
  methods: array,          // Allowed HTTP methods
  jwt: boolean            // Requires authentication
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

## Dependencies

- **express** - Web framework
- **helmet** - Security headers
- **@dwtechs/toker-express** - JWT token management
- **@dwtechs/antity-pgsql** - PostgreSQL entity management
- **@dwtechs/winstan** - Logging
- **@dwtechs/servpico-express** - Server utilities
- **@dwtechs/errandler-express** - Error handling
- **@dwtechs/healix-express** - Health check endpoints

## License

ISC