# Conditions

Conditions are predefined filter rules that can be attached to permissions. They restrict data returned from a route based on a field value — for example, "only return non-archived records".

## How It Works

A condition combines a field, a comparison operator, and a value into a reusable named filter rule (e.g. `archived = false`). When a permission has a condition attached, Gatelin:

- injects matching filters into `req.body.filters` for admin search requests, and
- forwards them to proxied services via the `x-acl-conditions` header as `{ field, op, value }`.

Conditions are optional — a permission without a condition applies no row-level filtering.

Because proxied bodies are streamed unchanged, the upstream service enforces forwarded conditions. It must combine them with caller search filters using `AND`, constrain inserts to the permitted partition, and verify target rows before updates, archives, and history reads. Invalid conditions must fail closed rather than being dropped.

WebSocket conditions apply to the upgrade handshake only. Gatelin does not inspect frames after the connection is established.

Create conditions after creating fields, and before assigning them to permissions.

## Search Conditions

```
POST /gatelin/conditions/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "limit": 10,
  "sortField": "id",
  "sortOrder": "ASC",
  "filters": {
    "name": {
      "value": "archived",
      "matchMode": "contains"
    }
  }
}
```

## Get Condition History

```
GET /gatelin/conditions/:id/history
Authorization: Bearer <access_token>
```

## Create Condition

```
POST /gatelin/conditions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "name": "Non-archived only",
      "fieldId": 7,
      "op": "=",
      "value": "false"
    }
  ]
}
```

**Response (201 Created)**

### Condition Fields

| Field | Description |
|---|---|
| `name` | Human-readable label for the condition |
| `fieldId` | ID of the field to filter on |
| `op` | Comparison operator (`=`, `!=`, `<`, `>`, `<=`, `>=`) |
| `value` | Value to compare the field against |

## Update Condition

```
PUT /gatelin/conditions
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    {
      "id": 1,
      "name": "Non-archived only",
      "fieldId": 7,
      "op": "=",
      "value": "false"
    }
  ]
}
```

**Response (200 OK)**

## Archive Conditions

```
POST /gatelin/conditions/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "rows": [
    { "id": 1 },
    { "id": 2 },
    { "id": 3 }
  ]
}
```

**Response (204 No Content)**

Archived conditions older than 2 months are permanently deleted by the daily retention job (before fields, because `condition.fieldId` is `ON DELETE RESTRICT`).
