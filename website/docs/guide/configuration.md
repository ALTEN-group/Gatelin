
## JWT Token Flow

1. User logs in via `POST /gateway/sessions` with email and password
2. Gateway validates credentials against the user microservice
3. Gateway generates JWT access token (short-lived) and refresh token (long-lived)
4. Client includes access token in `Authorization: Bearer <token>` header for subsequent requests
5. When access token expires, client uses `PUT /gateway/sessions` with both tokens to get new ones
6. Gateway validates and refreshes tokens automatically
