
```mermaid
---
caption: Views Entity Relationship Diagram 
---

erDiagram

  routes["routes VIEW"] {
    int id
    int serviceId
    varchar serviceName
    int resourceId
    varchar resourceName
    int[] operations "array of operation IDs"
    text operationName "comma-separated operation names"
    varchar pattern "route pattern"
    text url "COMPUTED: /service.pattern/resource.name/route.pattern"
    varchar name
    varchar description
    int[] methodIds "array of method IDs"
    text[] methodNames "array of method names"
    boolean isProtected
    boolean locked
    boolean archived
    timestamp createdAt
    int creatorId
    varchar creatorName
    timestamp updatedAt
    int updaterId
    varchar updaterName
  }

  resources["resources VIEW"] {
    int id
    int serviceId
    varchar serviceName
    varchar name
    boolean locked
    boolean archived
    timestamp createdAt
    int creatorId
    varchar creatorName
    timestamp updatedAt
    int updaterId
    varchar updaterName
  }

  permissions["permissions VIEW"] {
    int roleId
    int serviceId
    varchar serviceName
    int resourceId
    varchar resourceName
    int routeId
    varchar routeName
    int[] operationId "array of operation IDs"
    text[] operationName "array of operation names"
    text[] fields
    text[] scopes
  }

  role_cache["role_cache VIEW"] {
    int id
    boolean archived
    jsonb permissions "array of route permission objects"
  }
```
