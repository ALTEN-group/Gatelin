```mermaid
---
caption: Refresh Token
---

sequenceDiagram
  autonumber
  actor u as User
  participant f as front
  participant msg as ms_gateway
  participant db as gateway_db
  u->>f: Open URL
  activate f
  f--)f: Load application
  f--)f: Get tokens from local storage
  f->>msg: put(consumers/) { refreshToken } + Authorization: Bearer accessToken
  deactivate f
  activate msg
  msg--)msg: Parse Bearer token from Authorization header
  msg--)msg: Get consumer from cache by accessToken
  rect rgb(150, 50, 50, 0.5)
    break when consumer not found in cache
      msg--)msg: log 401 consumer not found
      msg->>f: 401 consumer not found
      deactivate msg
      activate f
      f->>u: Go to login page
      deactivate f
    end
  end
  activate msg
  msg--)msg: Transform cached consumer to standardized format
  msg--)msg: Create req.body.rows = [{id: consumer.id}]
  msg--)msg: Check refreshToken from body matches consumer's refreshToken
  rect rgb(150, 50, 50, 0.5)
    break when refreshToken does not match
      msg--)msg: log 404 refresh token not found
      msg->>f: 404 refresh token not found
      deactivate msg
      activate f
      f->>u: Go to login page
      deactivate f
    end
  end
  activate msg
  msg--)msg: Set ignoreExpiration flag for accessToken validation
  msg--)msg: Set ignoreExpiration flag for accessToken validation
  
  par decode access token
    rect rgb(100, 200, 100, 0.2)
      note over msg: Toker-express Library Block
      msg--)msg: Decode access token (validates signature)
      msg--)msg: Extract issuer from access token
    end
    rect rgb(150, 50, 50, 0.5)
      break when access token is invalid
        msg--)msg: log 401 invalid access token
        msg->>f: 401 invalid access token
        deactivate msg
        activate f
        f->>u: Go to login page
        deactivate f
      end
    end
    activate msg

  and decode refresh token
    rect rgb(100, 200, 100, 0.2)
      note over msg: Toker-express Library Block
      msg--)msg: Decode refresh token (validates signature and expiration)
    end
    rect rgb(150, 50, 50, 0.5)
      break when refresh token is invalid or expired
        msg--)msg: log 401 invalid/expired refresh token
        msg->>f: 401 invalid/expired refresh token
        deactivate msg
        activate f
        f->>u: Go to login page
        deactivate f
      end
    end
    activate msg

  end 
  
  rect rgb(100, 200, 100, 0.2)
    note over msg: Toker-express Library Block
    msg--)msg: Refresh both tokens (generate new accessToken and refreshToken)
  end
  rect rgb(100, 200, 100, 0.2)
    note over msg: Antity-pgsql Library Block
    msg-->>db: update consumer with new tokens
    deactivate msg
    activate db
    db-->>msg: Consumer updated
  end
  deactivate db
  activate msg
  msg--)msg: Update consumer in cache with new tokens
  msg->>f: return 200 ok { nickname, accessToken, refreshToken, rolesArrayAgg }
  deactivate msg
  activate f
  f->>u: Display home page
  deactivate f 
```
