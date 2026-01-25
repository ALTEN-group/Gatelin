```mermaid
---
caption: Sequence diagram for admin creating a new route
---

sequenceDiagram
  autonumber
  actor a as Admin
  participant f as front
  participant gw as ms_gateway
  participant re as route_entity
  participant gdb as gateway_db
  
  a->>f: Create new route (POST /routes)
  activate f
  
  f->>gw: POST /api/routes (route data)
  activate gw
  
  rect rgb(100, 150, 200, 0.3)
    note over gw: checkRequest middleware stack
    gw--)gw: parseBearer - extract Bearer token from Authorization header
    gw--)gw: decodeAccess - decode and validate access token
    gw--)gw: getFromCache - retrieve consumer from cache by access token
    
    rect rgb(150, 50, 50, 0.5)
      break when consumer not found in cache
        gw--)gw: log 404 consumer not found
        gw->>f: 404 consumer not found
        f->>a: redirect to login page
      end
    end
  end
  
  rect rgb(200, 150, 100, 0.3)
    note over gw,re: Route processing
    gw->>re: normalizeArray - sanitize route data
    activate re
    re--)re: Sanitize route, service, pattern, methods, jwt fields
    re-->>gw: Normalized route data
    deactivate re
    
    gw->>re: validateArray - check route constraints
    activate re
    re--)re: Validate string lengths, array size, boolean type, required fields
    
    rect rgb(150, 50, 50, 0.5)
      break when validation fails
        re--)re: log validation error
        re->>gw: return 400 validation error
        gw->>f: return 400 validation error
        f->>a: display error message
      end
    end
    
    re-->>gw: Validation successful
    deactivate re
  end
  
  rect rgb(100, 200, 150, 0.3)
    note over gw: Token refresh
    gw--)gw: refreshTokens - generate new JWT tokens for response
  end
  
  rect rgb(150, 100, 200, 0.3)
    note over gw,gdb: Database operations
    gw->>re: add - insert new route
    activate re
    
    re->>gdb: INSERT INTO routes (route, service, pattern, methods, jwt, description)
    activate gdb
    
    rect rgb(150, 50, 50, 0.5)
      break when database error
        gdb-->>re: Database constraint error
        re->>gw: return 500 database error
        gw->>f: return 500 database error
        f->>a: display error message
      end
    end
    
    gdb-->>re: Route inserted with ID
    deactivate gdb
    
    re-->>gw: Route created successfully
    deactivate re
  end
  
  note over gw: Note: Route cache is NOT automatically refreshed.<br/>Cache is only loaded at application startup via routeSvc.init()
  
  gw->>f: 201 Created (new route data with new tokens)
  deactivate gw
  
  f->>a: Display success message & new route
  deactivate f
```