# Frontend Integration

How a frontend app should interact with Gatelin tokens.

## 1. Login

```typescript
const response = await fetch('/gateway/sessions', {
  method: 'POST',
  body: JSON.stringify({ email, pwd })
});
const { accessToken, refreshToken } = await response.json();

localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

## 2. Making Authenticated Requests

```typescript
const accessToken = localStorage.getItem('accessToken');

fetch('/api/protected-resource', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## 3. Handling Token Expiry (401)

```typescript
if (response.status === 401) {
  const refreshToken = localStorage.getItem('refreshToken');
  const refreshResponse = await fetch('/gateway/sessions', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ refreshToken })
  });

  const { accessToken: newAccess, refreshToken: newRefresh } = await refreshResponse.json();

  localStorage.setItem('accessToken', newAccess);
  localStorage.setItem('refreshToken', newRefresh);

  // Retry original request
  return fetch('/api/protected-resource', {
    headers: { 'Authorization': `Bearer ${newAccess}` }
  });
}
```

## 4. Logout

```typescript
const accessToken = localStorage.getItem('accessToken');

await fetch('/gateway/sessions', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

## Token Storage Considerations

| Method | Notes |
|---|---|
| `localStorage` | Simple, but vulnerable to XSS |
| `httpOnly cookies` | More secure — not accessible to JavaScript |
| `sessionStorage` | Cleared when the tab closes |

> **Never** send the refresh token except to the `PUT /gateway/sessions` endpoint.
