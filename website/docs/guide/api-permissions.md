# Permissions

Permissions define which operations a role is allowed to perform on a given route. They are stored in Gatelin’s database and loaded into memory at startup.

## How It Works

Each permission links a role to a route and an operation. Optionally it may also attach:

- **`fields`** — column allow-list (`null` = unrestricted, `[]` = only `id`). Gatelin enforces it directly for its own `/gatelin/*` APIs. Transparent proxied requests carry the allow-list in `x-acl-fields`; the upstream service must filter write rows, read responses, history snapshots, and schema output.
- **`scopes`** — allowed URL sub-segments for scoped routes
- **`conditionId`** — condition IDs whose filters are injected into `/gatelin/*` searches and forwarded as `x-acl-conditions` on proxied requests. The upstream must force these predicates into searches and check them before inserts, updates, archives, and history reads.

When a request arrives, Gatelin looks up whether any of the consumer's roles has a matching permission for the route and operation. Permissions are loaded into memory at startup and updated when changes occur.

Permissions are hard-deleted (not archived) and are not purged by the archived-entities retention job. There is no `POST /gatelin/permissions/archive`. Turning a grant off in the admin is `PUT` with `active: false`; removing the row is `DELETE /gatelin/permissions`.

## Gatelin vs upstream enforcement

Gatelin's control-plane APIs parse JSON, so they can strip disallowed fields and inject condition filters themselves. The catch-all data proxy deliberately does not parse or re-serialize payloads: this is what allows multipart, binary, GraphQL, SSE, and arbitrary HTTP bodies to pass unchanged.

For a proxied protected route, Gatelin still rejects a missing route/operation/scope permission with **403**, then sends the resolved data restrictions as trusted headers:

| Permission value | Forwarded contract |
|---|---|
| `fields: null` | `x-acl-fields` omitted — unrestricted |
| `fields: []` | `x-acl-fields` present but empty — only `id` |
| `fields: ["name"]` | `x-acl-fields: name` |
| attached conditions | `x-acl-conditions: [{"field":"userId","op":"=","value":42}]` |

Services must not accept direct public traffic that can bypass Gatelin, and must ignore or overwrite client-supplied `x-consumer-*` / `x-acl-*` headers at any other trusted ingress. Gatelin replaces these headers before forwarding protected requests. How an upstream should apply the headers is in [Integration](./integration#enforcing-acl-headers-in-a-service).

## Search Permissions

```
POST /gatelin/permissions/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "limit": 10,
  "sortField": "roleId",
  "sortOrder": "ASC",
  "filters": {
    "roleId": {
      "value": 2,
      "matchMode": "equals"
    }
  }
}
```

## Get Permission History by Route

```
GET /gatelin/permissions/history/route/:routeId
Authorization: Bearer <access_token>
```

## Add Permissions

Permissions are added in bulk — one entry per role/route/operation combination.

```
POST /gatelin/permissions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "roleId": 2,
      "routeId": 5,
      "operationId": 1,
      "fields": ["name", "email"],
      "scopes": ["own"],
      "conditionId": [1]
    }
  ]
}
```

**Response (201 Created)**

The caller may only grant a route, operation, and `fields`/`scopes` set they already hold. `fields: null` (unrestricted) cannot be granted by a role that is itself field-restricted on that route. The whole batch is rejected with **403** if any row exceeds that ceiling.

Writes that target a **locked** system role (Super-admin, Admin, User, Guest) are also rejected with **403**, even when the grant is one the caller already holds. Super-admin is the exception and may still maintain those seed roles. Custom (unlocked) roles are unchanged.

## Update Permissions

```
PUT /gatelin/permissions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 10,
      "conditionId": [2]
    }
  ]
}
```

**Response (200 OK)**

The same ceiling applies. Changing `routeId` or `operationId` on an existing row is judged as the resulting grant, so a caller cannot retarget a permission onto a privileged route they do not already hold, nor carry unrestricted `fields` onto a route where they are field-restricted.

## Delete Permissions

```
DELETE /gatelin/permissions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    { "id": 10 },
    { "id": 11 },
    { "id": 12 }
  ]
}
```

**Response (200 OK)**

The locked-role ceiling applies here too: deleting a permission row attached to Super-admin, Admin, or another locked role is **403** unless the caller is Super-admin.

If the database write succeeds but the in-memory role cache cannot reload, the response is **500** (`Changes were saved but the role cache could not be reloaded`). Retry the same call or restart the process; Gatelin does not roll the write back.
