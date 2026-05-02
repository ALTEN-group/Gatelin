# Conditions

Conditions are predefined filter rules that can be attached to permissions. They restrict data returned from a route based on a field value — for example, "only return non-archived records".

## Search Conditions

```
POST /gateway/conditions/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 10,
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
  "name": "Non-archived only",
  "fieldId": 7,
  "op": "=",
  "value": "false",
  "creatorId": 1,
  "creatorName": "admin"
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
  "id": 1,
  "name": "Non-archived only",
  "fieldId": 7,
  "op": "=",
  "value": "false",
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK)**

## Archive Conditions

```
POST /gateway/conditions/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "ids": [1, 2, 3]
}
```

**Response (204 No Content)**
