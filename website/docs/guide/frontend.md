# Frontend Integration

The browser talks to **Gatelin** (usually via Traefik at `/api/…`). Gatelin is the BFF: it issues JWTs, refreshes sessions, and forwards authorized calls to your microservices. This page covers tokens and mid-login challenges when the password service requires 2FA or password rotation.

## 1. Login

```typescript
const response = await fetch('/gatelin/sessions', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, pwd })
});

if (response.status === 202) {
  // Password OK, but a mid-login challenge is required (2FA / expired password).
  const { url } = await response.json();
  window.location.assign(url);
  return;
}

if (!response.ok) {
  // 401 wrong credentials, 403 locked, 404 unknown user, …
  throw new Error('Login failed');
}

const { accessToken, refreshToken } = await response.json();

localStorage.setItem('accessToken', accessToken);
// Prefer the httpOnly refresh cookie when REFRESH_TOKEN_COOKIE is enabled;
// keep a body copy only if your stack still needs it for PUT refresh.
if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
```

### Resume after a challenge

When the password-service workflow finishes, it redirects the browser back to your login page with `?ticket=…`. Redeem it before showing the login form:

```typescript
const ticket = new URLSearchParams(window.location.search).get('ticket');
if (ticket) {
  const response = await fetch('/gatelin/sessions/resume', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket })
  });

  if (!response.ok) throw new Error('Resume failed');

  const { accessToken, refreshToken } = await response.json();
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

  // Drop ?ticket= from the URL and enter the app
  history.replaceState({}, '', window.location.pathname);
  return;
}
```

The Gatelin admin UI already implements both paths (`AuthenticationService.login` / `resumeLogin`).

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

  const refreshResponse = await fetch('/gatelin/sessions', {
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
  if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

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

await fetch('/gatelin/sessions', {
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
| Trusted-device cookie (`trusted_device`) | Optional. If your password service issues it from its challenge pages (`Path=/`), Gatelin forwards its value on the next login to skip 2FA. Omit it and every 2FA login is challenged |
| `sessionStorage` | Cleared when the tab closes |

> Always send `credentials: 'include'` on session calls so CSRF, refresh, and trusted-device cookies are included. Never send the refresh token except to `PUT /gatelin/sessions`.
