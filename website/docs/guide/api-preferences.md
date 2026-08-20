# Preferences

Preferences store per-user UI configuration for a named resource (for example table column layouts). The list for a resource merges **system templates** (`locked: true`) with the authenticated user's own rows.

`:resource` is the resource **name** (not ID).

## List Preferences

```
GET /gatelin/preferences/:resource
Authorization: Bearer <access_token>
```

**Response (200 OK):** rows include system templates and the caller's preferences, each with `isActive` from the selection table.

## Create Preferences

```
POST /gatelin/preferences/:resource
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "name": "My layout",
      "conf": { "columns": ["id", "name"] },
      "isActive": true
    }
  ]
}
```

Gatelin injects `userId` and `resourceId` from the session and the named resource. **Response (201 Created)**

## Update Preferences

```
PUT /gatelin/preferences/:resource
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 12,
      "name": "My layout",
      "conf": { "columns": ["id", "name", "email"] },
      "isActive": true
    }
  ]
}
```

Only rows owned by the caller, unlocked, and belonging to `:resource` can be updated. Locked system templates cannot be overwritten. **Response (200 OK)**

## Delete Preference

```
DELETE /gatelin/preferences/:resource/:id
Authorization: Bearer <access_token>
```

Deletes a single preference owned by the authenticated user. **Response (204 No Content)**

### Preference Fields

| Field | Description |
|---|---|
| `name` | Preference label (max 60 chars) |
| `conf` | JSON configuration object |
| `locked` | `true` for system templates (read-only) |
| `isActive` | Whether this preference is the active selection for the user |
| `resourceId` / `resourceName` | Resource the preference belongs to |
