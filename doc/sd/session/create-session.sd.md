```mermaid
---
caption: Sequence diagram for session creation (user login)
---

sequenceDiagram
  autonumber
  actor u as User
  participant f as front
  participant msg as gatelin
  participant msu as ms_user
  participant msp as foxnox
  participant udb as user_db
  participant pdb as pwd_db
  participant gdb as gatelin_db
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
        msg->>msp: post(activate/) { id }
        deactivate msg
        activate msp
        msp-->>msp: Check input : id
        msp--)msp: generate activation token
        msp->>pdb: insert activation token
        deactivate msp
        activate pdb
        pdb->>msp: activation token created
        deactivate pdb
        activate msp
        msp--)msp: prepare activation email
        msp->>msm: post(send/) { to: email, subject, body }
        msp->>msu: return 204 activation email sent
        deactivate msp
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
    note over msg,pdb: Password Validation Block
    activate msg
    msg--)msg: Attach userId from res.locals.user.id to req.body
    msg->>msp: post(/foxnox/compare) { userId, pwd }
    deactivate msg
    activate msp
    rect rgb(100, 200, 100, 0.2)
      note over msp: Antity-pgsql Library Block
      msp--)msp: Check input : userId, pwd
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
      note over msp: Passken-express Library Block
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
    msp->>msg: return 200 ok : { rows: [{ userId, pwdExpiry, lockedUntil, twoFactorEnabled }] }
    deactivate msp
    activate msg
  end
  rect rgb(220, 220, 220, 0.1)
    note over msg,msp: Mid-login Challenge Block<br/>challenge-login reads the pwd row returned above
    rect rgb(150, 50, 50, 0.5)
      break when the account is locked (lockedUntil in the future)
        msg->>f: return 403 account locked
        activate f
        f->>u: display error message
        deactivate f
      end
    end
    rect rgb(150, 50, 50, 0.5)
      break when the password expired or 2FA is on without a trusted-device cookie
        msg->>msp: post(/foxnox/trusted-devices/verify) { userId, deviceToken }<br/>(2FA only, skipped when no trusted_device cookie)
        activate msp
        msp->>msg: return 200 ok : { trusted }
        deactivate msp
        msg->>msp: post(/foxnox/challenges) { userId, kind }
        activate msp
        msp->>msg: return 201 created : { kind, challenge, url }
        deactivate msp
        msg->>f: return 202 accepted : { challengeRequired, kind, url }
        activate f
        f->>u: redirect the browser to the workflow page
        note over u,msp: The user completes the challenge on Foxnox, which redirects back to<br/>the admin login with ?ticket=… → POST /sessions/resume redeems it via<br/>post(/foxnox/login-tickets/redeem) and continues with the block below.
        deactivate f
      end
    end
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