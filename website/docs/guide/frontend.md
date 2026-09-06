# Frontend Integration

The browser talks to **Gatelin** (usually via Traefik at `/api/…`). Gatelin is the BFF: it issues JWTs, refreshes sessions, and forwards authorized calls to your microservices. This page covers tokens and mid-login challenges when the password service requires 2FA or password rotation.

Store **only the access token** in `localStorage`. The refresh token is an httpOnly cookie (`REFRESH_TOKEN_COOKIE`). Do not copy it into JavaScript. The Gatelin admin UI follows this path (`AuthenticationService` / `TokenService`).

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

const { accessToken } = await response.json();
localStorage.setItem('accessToken', accessToken);
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

  const { accessToken } = await response.json();
  localStorage.setItem('accessToken', accessToken);

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

Refresh and logout require the CSRF double-submit cookie. Read `csrfToken` (or `CSRF_COOKIE_NAME`) and echo it in `X-CSRF-Token`. Send an empty JSON body: the browser attaches the httpOnly refresh cookie.

```typescript
function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

if (response.status === 401) {
  const csrfToken = getCookie('csrfToken');

  const refreshResponse = await fetch('/gatelin/sessions', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken ?? ''
    },
    body: JSON.stringify({})
  });

  if (!refreshResponse.ok) {
    // Session gone — send the user to login
    localStorage.removeItem('accessToken');
    throw new Error('Refresh failed');
  }

  const { accessToken: newAccess } = await refreshResponse.json();
  localStorage.setItem('accessToken', newAccess);

  // Retry original request
  return fetch('/api/protected-resource', {
    credentials: 'include',
    headers: { 'Authorization': `Bearer ${newAccess}` }
  });
}
```

The access token on the original request may already be expired. Refresh does not need it; CSRF plus the refresh cookie are enough.

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
```

## Token Storage Considerations

| Method | Notes |
|---|---|
| `localStorage` | Access token only. Readable by XSS — keep it short-lived |
| `httpOnly cookie` | Refresh token when `REFRESH_TOKEN_COOKIE` is enabled. The browser sends it; JS cannot read it |
| CSRF cookie | Not httpOnly — the client must read it and send `X-CSRF-Token`. `SameSite` and `Secure` follow `REFRESH_TOKEN_COOKIE_SAMESITE` / `REFRESH_TOKEN_COOKIE_HTTPS_ONLY` |
| Trusted-device cookie (`trusted_device`) | Optional. If your password service issues it from its challenge pages (`Path=/`), Gatelin forwards its value on the next login to skip 2FA. Omit it and every 2FA login is challenged |
| `sessionStorage` | Cleared when the tab closes |

> Always send `credentials: 'include'` on session calls so CSRF, refresh, and trusted-device cookies are included. Never put the refresh token in `localStorage` or in a browser `PUT` body.

Non-browser clients that cannot store cookies may still send `refreshToken` in the JSON body of `PUT /gatelin/sessions`. That is not a browser pattern.
