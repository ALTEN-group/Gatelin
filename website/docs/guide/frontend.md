# Frontend Integration

How a frontend app should interact with Gatelin tokens.

## 1. Login

```typescript
const response = await fetch('/gateway/sessions', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, pwd })
});
const { accessToken, refreshToken } = await response.json();

localStorage.setItem('accessToken', accessToken);
// Prefer the httpOnly refresh cookie when REFRESH_TOKEN_COOKIE is enabled;
// keep a body copy only if your stack still needs it for PUT refresh.
localStorage.setItem('refreshToken', refreshToken);
```

## 2. Making Authenticated Requests

```typescript
const accessToken = localStorage.getItem('accessToken');

fetch('/api/protected-resource', {
  credentials: 'include',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## 3. Handling Token Expiry (401)

Refresh and logout require the CSRF double-submit cookie. Read `csrfToken` (or `CSRF_COOKIE_NAME`) and echo it in `X-CSRF-Token`.

```typescript
function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

if (response.status === 401) {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const csrfToken = getCookie('csrfToken');

  const refreshResponse = await fetch('/gateway/sessions', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-CSRF-Token': csrfToken ?? ''
    },
    body: JSON.stringify({ refreshToken })
  });

  const { accessToken: newAccess, refreshToken: newRefresh } = await refreshResponse.json();

  localStorage.setItem('accessToken', newAccess);
  localStorage.setItem('refreshToken', newRefresh);

  // Retry original request
  return fetch('/api/protected-resource', {
    credentials: 'include',
    headers: { 'Authorization': `Bearer ${newAccess}` }
  });
}
```

## 4. Logout

```typescript
const accessToken = localStorage.getItem('accessToken');
const csrfToken = getCookie('csrfToken');

await fetch('/gateway/sessions', {
  method: 'DELETE',
  credentials: 'include',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-CSRF-Token': csrfToken ?? ''
  }
});

localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

## Token Storage Considerations

| Method | Notes |
|---|---|
| `localStorage` | Simple for the access token, but vulnerable to XSS |
| `httpOnly cookies` | Preferred for the refresh token when `REFRESH_TOKEN_COOKIE` is enabled |
| CSRF cookie | Not httpOnly — the client must read it and send `X-CSRF-Token` |
| `sessionStorage` | Cleared when the tab closes |

> Always send `credentials: 'include'` on session calls so CSRF and refresh cookies are included. Never send the refresh token except to `PUT /gateway/sessions`.
