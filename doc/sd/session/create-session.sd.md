```mermaid
---
caption: Sequence diagram for session creation (user login)
---

sequenceDiagram
  autonumber
  actor u as User
  participant f as front
  participant msg as ms_gateway
  participant msu as ms_user
  participant msa as ms_auth
  participant udb as user_db
  participant adb as auth_db
  participant gdb as gateway_db
  participant msm as ms_mail
  u->>f: Open URL
  activate f
  f--)f: Load application
  f--)f: No accessToken found in local storage
  f->>u: Redirect to login page
  deactivate f
  activate u
  u->>f: Enter email and password
  deactivate u
  activate f
  f->>msg: post(/consumers) { email, pwd }
  deactivate f

  rect rgb(220, 220, 220, 0.1)
    note over f,msg: Input Validation Block
    activate msg
    rect rgb(100, 200, 100, 0.2)
      note over msg: Antity-pgsql Library Block
      msg--)msg: User entity normalize email
      msg--)msg: User entity validate email, pwd
    end
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
    msg--)msg: Prepare filters : { email: { value, matchMode }, archived: { value: false, matchMode: 'is' } }
    msg->>msu: post(/users/search) { filters }
    deactivate msg
    activate msu
    rect rgb(100, 200, 100, 0.2)
      note over msu: Antity-pgsql Library Block
      msu--)msu: User entity check filters : email, archived
      msu--)msu: User entity generate search query
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
    msu->>msg: return 200 ok { rows: [{ id, nickname, roles, active, email... }] }
    deactivate msu
    activate msg
    msg--)msg: Create req.body.rows[0] with { userId, nickname, roles }
    msg--)msg: Add user { id, active } to res.locals.user
  end

  rect rgb(220, 220, 220, 0.1)
    note over msg,msm: User Activation Block
    msg--)msg: Check user is active
    rect rgb(150, 50, 50, 0.5)
      break when user is inactive
        msg--)msg: log 403 account not activated
        msg->>msa: post(activate/) { id }
        deactivate msg
        activate msa
        msa-->>msa: Check input : id
        msa--)msa: generate activation token
        msa->>adb: insert activation token
        deactivate msa
        activate adb
        adb->>msa: activation token created
        deactivate adb
        activate msa
        msa--)msa: prepare activation email
        msa->>msm: post(send/) { to: email, subject, body }
        msa->>msu: return 204 activation email sent
        deactivate msa
        activate msu
        msu->>msg: return 403 account not activated
        deactivate msu
        activate msg
        msg->>f: return 403 account not activated
        deactivate msg
        activate f
        f->>u: display activation required message
        deactivate f
        activate msu
      end
    end
  end

  rect rgb(220, 220, 220, 0.1)
    note over msg,adb: Password Validation Block
    activate msg
    msg--)msg: Prepare filters for pwd verification : { userId: { value: id, matchMode }, pwd: { value, matchMode } }
    msg->>msa: post(/auth/verify) { filters }
    deactivate msg
    activate msa
    rect rgb(100, 200, 100, 0.2)
      note over msa: Antity-pgsql Library Block
      msa--)msa: Check input : pwd
      msa--)msa: Check filters : userId
      msa->>adb: get pwd hash by userId
    end
    deactivate msa
    activate adb
    rect rgb(150, 50, 50, 0.5) 
      break when pwd  is not found
        adb->>msa: Pwd not found
        deactivate adb
        activate msa
        msa--)msa: log 404 resource not found
        msa->>msg: return 404 resource not found
        deactivate msa
        activate msg
        msg->>f: return 404 resource not found
        deactivate msg
        activate f
        f->>u: display error message
        deactivate f   
        activate adb
      end
    end
    adb->>msa: pwd hash found
    deactivate adb
    activate msa
    rect rgb(100, 200, 100, 0.2)
      note over msa: Passken-express Library Block
      msa--)msa: compare password sent with password hash in db
    end
    rect rgb(150, 50, 50, 0.5)
      break when passwords comparison fails
        msa--)msa: log 401 wrong password
        msa->>msg: return 401 wrong password
        deactivate msa
        activate msg
        msg->>f: return 401 wrong password
        deactivate msg
        activate f
        f->>u: display error message
        deactivate f
        activate msa
      end
    end
    msa->>msg: return 204 No content ok
    deactivate msa
    activate msg
  end
  rect rgb(220, 220, 220, 0.1)
    note over msg,gdb: Token Creation & Session Insertion Block
    rect rgb(100, 200, 100, 0.2)
      note over msg: Toker-express Lib Block<br/>from :<br/>- res.locals.user: { id, active }<br/>- req.body.rows[0]: { userId, nickname, roles }
      msg--)msg: Create accessToken with payload : { id, nickname, roles }
      msg--)msg: Create refreshToken
      msg--)msg: Add accessToken and refreshToken to req.body.rows[0]
      msg--)msg: Set refreshToken httpOnly cookie on res (REFRESH_TOKEN_COOKIE=true)
    end
    rect rgb(100, 200, 100, 0.2)
      note over msg: Session Entity Block
      msg--)msg: Validate session data (userId, nickname, accessToken, refreshToken, roles)
    end
    msg->>gdb: Insert session in consumer table
    deactivate msg
    activate gdb
    gdb->>msg: Session added
    deactivate gdb
    activate msg
    msg--)msg: Add session to cache (async)
    rect rgb(100, 200, 100, 0.2)
      note over msg: Permission Resolution Block<br/>from :<br/>- req.body.rows[0]: { roles }
      msg--)msg: Resolve permissions from role cache for each role id
      msg--)msg: Merge operations and fields across roles
      msg--)msg: Store merged permissions array in res.locals.permissions
    end
    rect rgb(100, 200, 100, 0.2)
      note over msg: CSRF Cookie Block
      msg--)msg: Generate CSRF token and set non-httpOnly csrfToken cookie on res
    end
    msg--)msg: Delete unsafe props from response data (refreshToken is isPrivate, stripped from body)
    msg->>f: return 200 ok : { nickname, accessToken, roles, permissions }<br/>Set-Cookie: refreshToken (httpOnly), csrfToken
    deactivate msg
    activate f
    f--)f: Store accessToken in local storage<br/>(refreshToken and csrfToken cookies stored by browser)
    f->>u: Display home page
    deactivate f
  end 