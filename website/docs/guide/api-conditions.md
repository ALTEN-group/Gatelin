# Conditions

Conditions are predefined filter rules that can be attached to permissions. They restrict data returned from a route based on a field value — for example, "only return non-archived records".

## How It Works

A condition combines a field, a comparison operator, and a value into a reusable named filter rule (e.g. `archived = false`). When a permission has a condition attached, the gateway:

- injects matching filters into `req.body.filters` for admin search requests, and
- forwards them to proxied services via the `x-acl-conditions` header.

Conditions are optional — a permission without a condition applies no row-level filtering.

Create conditions after creating fields, and before assigning them to permissions.

## Search Conditions

```
POST /gateway/conditions/search
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
GET /gateway/conditions/:id/history
Authorization: Bearer <access_token>
```

## Create Condition

```
POST /gateway/conditions
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
PUT /gateway/conditions
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
POST /gateway/conditions/archive
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
