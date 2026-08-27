# Sessions

Session endpoints manage authentication — login, mid-login challenge resume, token refresh, and logout.

## Login

### API

```
POST /gatelin/sessions
Content-Type: application/json

{
  "email": "user@example.com",
  "pwd": "password"
}
```

**Response (200 OK)** — password accepted and no mid-login challenge required:

```json
{
  "nickname": "jane",
  "accessToken": "eyJhbGc...",
  "roles": [1, 2],
  "permissions": [
    { "route": 4, "operations": [1, 2], "fields": [], "scopes": [] }
  ]
}
```

A CSRF cookie (`csrfToken` by default) is also set. When `REFRESH_TOKEN_COOKIE` is enabled, the refresh token is stored as an httpOnly cookie (and omitted from the JSON body when marked private).

**Response (202 Accepted)** — password accepted, but a mid-login challenge must be completed first:

```json
{
  "challengeRequired": true,
  "kind": "2fa",
  "url": "https://example.com/api/pwd/web/2fa/verify?challenge=…"
}
```

| `kind` | When it is returned |
|---|---|
| `expired-password` | The account's password has expired |
| `2fa` | Two-factor is enabled and the browser has no valid trusted-device cookie |

The client must send the browser to `url`. That URL is served entirely by **your** password service — Gatelin does not render or control it. When the workflow finishes, your service redirects the browser back to the admin login with `?ticket=…`, and the frontend calls [Resume](#resume) to create the session.

**Other error statuses:**

| Status | Meaning |
|---|---|
| `400` | Missing or invalid `email` / `pwd` |
| `401` | Wrong credentials |
| `403` | Account locked |
| `404` | User not found |

### Password-service contract

Gatelin never stores password hashes or 2FA secrets, and never renders challenge pages. It delegates all of that to a **password service** you point `PWD_CHECK_URL` at. Any service that speaks the small HTTP contract below works.

#### Credential check (required)

`PWD_CHECK_URL` is the only endpoint Gatelin always calls. On a correct password it must return **HTTP 200** with a single user row:

```json
{
  "rows": [{
    "userId": 42,
    "pwdExpiry": null,
    "lockedUntil": null,
    "twoFactorEnabled": false
  }],
  "total": 1
}
```

On a wrong password it must return a non-2xx status (typically `401`).

Gatelin reads only these fields from `rows[0]`; any others are ignored:

| Field | Type | Effect on login |
|---|---|---|
| `lockedUntil` | ISO date string or `null` | If in the future, login is rejected with **403** |
| `pwdExpiry` | ISO date string or `null` | If in the past, login returns **202** `expired-password` |
| `twoFactorEnabled` | boolean | If `true` (and no trusted-device cookie), login returns **202** `2fa` |

> **Don't need challenges?** If your service only checks passwords, return a body **without a `rows` entry** (for example `{ "success": true }`, or `{ "rows": [], "total": 0 }`). Gatelin then treats the login as fully authenticated, skips all gating, and logs a debug/warn note. This is the correct setup for a plain username+password login with no 2FA or password-expiry policy.

#### Challenge endpoints (only if you emit 202)

If your credential check can return `pwdExpiry`, `lockedUntil`, or `twoFactorEnabled`, then Gatelin also needs the endpoints below. Each one has its own environment variable — nothing is derived from `PWD_CHECK_URL`, so you are free to name and place these routes however you like:

| Variable | Request body | Expected response | Called when |
|---|---|---|---|
| `PWD_CHALLENGES_URL` | `{ userId, kind }` | `{ url, kind }` — `url` is the browser page that runs the challenge | A challenge is required |
| `PWD_TRUSTED_DEVICES_URL` | `{ userId, deviceToken }` | `{ trusted: boolean }` | 2FA is enabled and a trusted-device cookie is present |
| `PWD_LOGIN_TICKET_URL` | `{ ticket }` | `{ userId }` | The frontend calls [Resume](#resume) |

All three are POST endpoints and all three may be empty. Gatelin still boots and password login still succeeds. Empty `PWD_CHALLENGES_URL` skips 2FA and password-expiry pages (a warn is logged). Empty `PWD_TRUSTED_DEVICES_URL` ignores the trusted-device cookie. Empty `PWD_LOGIN_TICKET_URL` makes [Resume](#resume) answer **501**.

#### Trusted-device cookie

To let a returning browser skip 2FA, your challenge pages may set a trusted-device cookie named **`trusted_device`** (scoped `Path=/` so it reaches `/gatelin/sessions`). On the next login Gatelin forwards its value to `PWD_TRUSTED_DEVICES_URL`; a `{ trusted: true }` response suppresses the 2FA challenge. If you don't implement trusted devices, simply never set the cookie — every 2FA login then challenges.

### Sequence diagram

```mermaid
---
caption: Sequence diagram for session creation (user login)
---

sequenceDiagram
  autonumber
  actor u as User
  participant f as front
  participant msg as gatelin
  participant gdb as gatelin_db
  participant msu as ms_user
  participant udb as user_db
  participant msp as ms_pwd
  participant pdb as pwd_db
  u->>f: Open URL
  activate f
  f--)f: Load application
  f--)f: No tokens found from local storage
  f->>u: Redirect to login page
  deactivate f
  activate u
  u->>f: Enter email and pwd
  deactivate u
  activate f
  f->>msg: POST /gatelin/sessions { email, pwd }
  deactivate f

  rect rgb(220, 220, 220, 0.1)
    activate msg
    rect rgb(150, 50, 50, 0.5)
      break when email or pwd are missing or invalid
        msg--)msg: log 400 invalid parameters
        msg->>f: return 400 invalid parameters
        deactivate msg
        activate f
        f->>u: display error message
        deactivate f
      end
    end
    activate msg
  end
  rect rgb(220, 220, 220, 0.1)
    note over msg,udb: User Lookup Block
    msg->>msu: POST USER_SEARCH_URL { filters }
    deactivate msg
    activate msu
    rect rgb(100, 200, 100, 0.2)
      msu->>udb: get user by email, not archived
    end
    deactivate msu
    activate udb
    rect rgb(150, 50, 50, 0.5)
      break when email is not found
        udb->>msu: User not found
        deactivate udb
        activate msu
        msu--)msu: log 404 resource not found
        msu->>msg: return 404 resource not found
        deactivate msu
        activate msg
        msg->>f: return 404 resource not found
        deactivate msg
        activate f
        f->>u: display error message
        deactivate f
        activate udb
      end
    end
    udb->>msu: User found
    deactivate udb
    activate msu
    msu->>msg: 200 { rows: [{ id, nickname, roles... }] }
    deactivate msu
    activate msg
  end

  rect rgb(220, 220, 220, 0.1)
    note over msg,pdb: Password Validation Block
    msg->>msp: POST PWD_CHECK_URL { userId, pwd }
    deactivate msg
    activate msp
    rect rgb(100, 200, 100, 0.2)
      msp->>pdb: get pwd hash by userId
    end
    deactivate msp
    activate pdb
    rect rgb(150, 50, 50, 0.5)
      break when pwd is not found
        pdb->>msp: Pwd not found
        deactivate pdb
        activate msp
        msp--)msp: log 404 resource not found
        msp->>msg: return 404 resource not found
        deactivate msp
        activate msg
        msg->>f: return 404 resource not found
        deactivate msg
        activate f
        f->>u: display error message
        deactivate f
        activate pdb
      end
    end
    pdb->>msp: pwd hash found
    deactivate pdb
    activate msp
    rect rgb(100, 200, 100, 0.2)
      msp--)msp: compare password sent with password hash in db
    end
    rect rgb(150, 50, 50, 0.5)
      break when passwords comparison fails
        msp--)msp: log 401 wrong password
        msp->>msg: return 401 wrong password
        deactivate msp
        activate msg
        msg->>f: return 401 wrong password
        deactivate msg
        activate f
        f->>u: display error message
        deactivate f
        activate msp
      end
    end
    msp->>msg: return 200 { rows: [{ userId, pwdExpiry, lockedUntil, twoFactorEnabled }] }
    deactivate msp
    activate msg
  end

  rect rgb(220, 220, 220, 0.1)
    note over msg,msp: Mid-login Challenge Block
    rect rgb(150, 50, 50, 0.5)
      break when the account is locked
        msg->>f: return 403 account locked
        activate f
        f->>u: display error message
        deactivate f
      end
    end
    rect rgb(150, 50, 50, 0.5)
      break when password expired or 2FA required without a trusted device
        msg->>msp: POST PWD_TRUSTED_DEVICES_URL { userId, deviceToken } (2FA only)
        activate msp
        msp->>msg: 200 { trusted }
        deactivate msp
        msg->>msp: POST PWD_CHALLENGES_URL { userId, kind }
        activate msp
        msp->>msg: 201 { kind, challenge, url }
        deactivate msp
        msg->>f: return 202 { challengeRequired, kind, url }
        activate f
        f->>u: redirect browser to the workflow page
        note over u,msp: User completes the challenge on ms_pwd, which redirects back with ?ticket=… then POST /gatelin/sessions/resume
        deactivate f
      end
    end
  end

  rect rgb(220, 220, 220, 0.1)
    note over msg,gdb: Token Creation Block
    rect rgb(100, 200, 100, 0.2)
      msg--)msg: Create accessToken with payload : { id, nickname, roles }
      msg--)msg: Create refreshToken
      msg--)msg: Set CSRF cookie
    end
    msg->>gdb: Insert session in consumer table
    deactivate msg
    activate gdb
    gdb->>msg: Session added
    deactivate gdb
    activate msg
    msg--)msg: Add session to cache (async)
    msg->>f: 200 : { nickname, accessToken, roles, permissions }
    deactivate msg
    activate f
    f->>u: Display home page
    deactivate f
  end
```

## Resume

Finishes a login that was interrupted by a mid-login challenge. Public — no JWT required.

```
POST /gatelin/sessions/resume
Content-Type: application/json

{
  "ticket": "one-shot-login-resume-ticket"
}
```

Gatelin redeems the ticket against the password service (`POST PWD_LOGIN_TICKET_URL`), looks the user up by id, then runs the same token / session / CSRF path as a successful login.

**Response (200 OK):** same session payload as [Login](#login).

| Status | Meaning |
|---|---|
| `400` | Missing, invalid, or already-consumed ticket |
| `422` | Ticket redeemed but the user lookup failed |

Tickets are one-shot and short-lived. The admin UI reads `?ticket=` on the login page and calls this endpoint automatically.

## Refresh Tokens

```
PUT /gatelin/sessions
Content-Type: application/json
Authorization: Bearer <access_token>
X-CSRF-Token: <csrf_cookie_value>
Cookie: csrfToken=<csrf_cookie_value>; refreshToken=<optional>

{
  "refreshToken": "eyJhbGc..."
}
```

The access token may already be expired — refresh ignores expiration after CSRF and refresh-token checks pass. The refresh token may be supplied in the JSON body and/or the refresh-token cookie.

**Response (200 OK):**
```json
{
  "nickname": "jane",
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "roles": [1, 2],
  "permissions": [
    { "route": 4, "operations": [1, 2], "fields": [], "scopes": [] }
  ]
}
```

A fresh CSRF cookie is issued with the new tokens.

## Logout

```
DELETE /gatelin/sessions
Authorization: Bearer <access_token>
X-CSRF-Token: <csrf_cookie_value>
Cookie: csrfToken=<csrf_cookie_value>
```

**Response (204 No Content)**

The consumer session is archived, removed from the cache, and refresh/CSRF cookies are cleared.
