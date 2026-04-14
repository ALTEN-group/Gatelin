# Colors

Colors are assignable to roles for visual differentiation in the admin panel.

## Search Colors

```
POST /gateway/colors/search
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "pagination": true,
  "first": 0,
  "rows": 20,
  "sortField": "name",
  "sortOrder": "ASC",
  "filters": {
    "archived": {
      "value": false,
      "matchMode": "equals"
    }
  }
}
```

## Get Color History

```
GET /gateway/colors/:id/history
Authorization: Bearer <access_token>
```

## Create Color

```
POST /gateway/colors
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "indigo",
  "code": "#4B0082",
  "creatorId": 1,
  "creatorName": "admin"
}
```

**Response (201 Created)**

## Update Color

```
PUT /gateway/colors
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "id": 1,
  "name": "indigo",
  "code": "#4B0082",
  "updaterId": 1,
  "updaterName": "admin"
}
```

**Response (200 OK)**

## Archive Colors

```
POST /gateway/colors/archive
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "ids": [1, 2]
}
```

**Response (200 OK)**

### Color Fields

| Field | Description |
|---|---|
| `name` | Color name (e.g. `indigo`, `teal`) |
| `code` | Hex color code (e.g. `#4B0082`) |
| `archived` | Whether the color is archived |
