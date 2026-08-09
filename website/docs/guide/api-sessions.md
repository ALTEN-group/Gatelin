# Sessions

Session endpoints manage authentication — login, token refresh, and logout.

## Login

### API

```
POST /gateway/sessions
Content-Type: application/json

{
  "email": "user@example.com",
  "pwd": "password"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "permissions": [
    { "route": "routeName", "operations": [1, 2], "fields": null }
  ]
}
```


### Sequence diagram 

```mermaid
---
caption: Sequence diagram for session creation (user login)
---

sequenceDiagram
  autonumber
  actor u as User
  participant f as front
  participant msg as ms_gateway
  participant gdb as gateway_db
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
  f->>msg: post(/consumers) { email, pwd }
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
    msg->>msu: post(/users/search) { filters: { email } }
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
    msg->>msp: post(/auth/verify) { filters: {userId, pwd} }
    deactivate msg
    activate msp
    rect rgb(100, 200, 100, 0.2)
      msp->>pdb: get pwd hash by userId
    end
    deactivate msp
    activate pdb
    rect rgb(150, 50, 50, 0.5) 
      break when pwd  is not found
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
    msp->>msg: return 204 No content ok
    deactivate msp
    activate msg
  end
  rect rgb(220, 220, 220, 0.1)
    note over msg,gdb: Token Creation Block
    rect rgb(100, 200, 100, 0.2)
      msg--)msg: Create accessToken with payload : { id, nickname, roles }
      msg--)msg: Create refreshToken
    end
    msg->>gdb: Insert session in consumer table
    deactivate msg
    activate gdb
    gdb->>msg: Session added
    deactivate gdb
    activate msg
    msg--)msg: Add session to cache (async)
    msg->>f: 200 : { nickname, accessToken, refreshToken, roles, permissions }
    deactivate msg
    activate f
    f->>u: Display home page
    deactivate f
  end
```


## Refresh Tokens

```
PUT /gateway/sessions
Content-Type: application/json
Authorization: Bearer <refresh_token>

{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "permissions": [
    { "route": "routeName", "operations": [1, 2], "fields": null }
  ]
}
```

## Logout

```
DELETE /gateway/sessions
Authorization: Bearer <access_token>
```

**Response (204 No Content)**
