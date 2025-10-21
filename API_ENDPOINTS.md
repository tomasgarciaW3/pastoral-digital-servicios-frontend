# API Endpoints - Pastoral Digital Frontend

---

## 1. Search Parishes

```
GET /public/parish?name-or-location={query}
```

### Query Parameters
- `name-or-location` (string, required): Search term for parish name or location

### Example Response
```json
{
  "parishes": [
    {
      "parishId": 1,
      "name": "Parroquia San Juan Bautista",
      "location": "Buenos Aires, Argentina",
      "coordinates": {
        "lat": -34.6037,
        "long": -58.3816
      }
    }
  ]
}
```

---

## 2. Get Parish Details

```
GET /public/parish-by-id/{parishIhd}
```

### Path Parameters
- `parishId` (number, required): Unique parish identifier

### Example Response

**Note:** All times (startTime, endTime) are in the parish's local country timezone, formatted as "HH:MM" (24-hour format).

```json
{
  "id": 1,
  "name": "Parroquia San Juan Bautista",
  "priest": "Padre Juan Pérez",
  "address": "Av. Rivadavia 1234",
  "country": "Argentina",
  "province": "Buenos Aires",
  "city": "Buenos Aires",
  "coordinates": {
    "lat": -34.6037,
    "lng": -58.3816
  },
  "placeId": "6e2e7a6d5fb!8m2",
  "phone": "+54 11 4567-8900",
  "email": "contacto@sanjuanbautista.org.ar",
  "website": "https://example.com",
  "services": [
    {
      "id": 1,
      "name": "Misa",
      "days": [
        {
          "name" : "saturday",
          "times" : [
            {"startTime": "11:00", "endTime": "12:00"},
            ]
        },
        {
          "name" : "sunday",
          "times" : [
            {"startTime": "11:00", "endTime": "12:00"},
            {"startTime": "18:00", "endTime": "21:00"}
          ]
        },
      ]
    },
    {
      "id": 2,
      "name": "Cáritas",
      "days": [
        {
          "name" : "saturday"
        }
      ]
    },
  ]
}
```

---

## 3. Get Parish Markers

```
GET /public/parish/markers?min_lon={minLon}&min_lat={minLat}&max_lon={maxLon}&max_lat={maxLat}&countryId={countryId}&serviceIds={serviceIds}
```

### Query Parameters
- `min_lon` (number, required): Minimum longitude of map bounds
- `min_lat` (number, required): Minimum latitude of map bounds
- `max_lon` (number, required): Maximum longitude of map bounds
- `max_lat` (number, required): Maximum latitude of map bounds
- `countryId` (number, optional): Filter by country ID

### Example Response
```json
{
  "markers": [
    {
      "parishId": 1,
      "coordinates": {
        "lat": -34.6037,
        "long": -58.3816
      },
      "title": "Parroquia San Juan Bautista",
      "location": "Buenos Aires, Argentina",
      "countryId": 1,
      "hasSubscription": false
    }
  ]
}
```

---

## Reference Data

### Country IDs
| Country | ID |
|---------|-----|
| Argentina | 1 |
| Uruguay | 2 |
| Paraguay | 3 |
| Chile | 4 |
| República Dominicana | 5 |
| Perú | 6 |

### Service IDs
| Service | ID |
|---------|-----|
| Misa | 1 |
| Confesiones | 2 |
| Bautismo | 3 |
| Matrimonio | 4 |
| Catequesis | 5 |
| Adoración | 6 |
| Caritas | 7 |
| Retiros | 8 |
