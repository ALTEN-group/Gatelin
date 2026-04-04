# Environment Variables

Configure the following environment variables:

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

## JWT Token Flow

1. User logs in via `POST /consumers` with email and password
2. Gateway validates credentials against the user microservice
3. Gateway generates JWT access token (short-lived) and refresh token (long-lived)
4. Client includes access token in `Authorization: Bearer <token>` header for subsequent requests
5. When access token expires, client uses `PUT /consumers` with both tokens to get new ones
6. Gateway validates and refreshes tokens automatically
