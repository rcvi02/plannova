# StudyFlow API Documentation

Base URL: `http://localhost:5000/api`

All authenticated endpoints require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "password": "securepassword123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Alex Chen", "email": "alex@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

---

### POST `/auth/login`
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "alex@example.com",
  "password": "securepassword123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Alex Chen", "email": "alex@example.com", "streak": 7 },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
}
```

---

### GET `/auth/me`
Get the current authenticated user's profile.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Alex Chen",
    "email": "alex@example.com",
    "streak": 7,
    "totalStudyMinutes": 10560,
    "dailyStudyGoal": 360,
    "course": "B.Tech Computer Science",
    "college": "IIT Delhi",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT `/auth/me`
Update the current user's profile.

**Request Body (all fields optional):**
```json
{
  "name": "Alex Chen",
  "dailyStudyGoal": 420,
  "course": "B.Tech Computer Science",
  "college": "IIT Delhi"
}
```

---

## Dashboard

### GET `/dashboard/stats`
Get today's study statistics, streak, and upcoming exam info.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "todayMinutes": 180,
    "dailyGoalMinutes": 360,
    "goalPercent": 50,
    "streak": 7,
    "tasksCompletedToday": 3,
    "tasksDueToday": 5,
    "nextExam": {
      "name": "Physics Mid-term",
      "daysUntil": 7,
      "prepProgress": 70
    },
    "revisionsDue": 2
  }
}
```

---

## Analytics

### GET `/analytics/overview`
Get summary analytics for the specified date range.

**Query Parameters:**
- `days` (optional, default: 30) — Number of days to look back

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalMinutes": 5400,
    "totalSessions": 42,
    "avgSessionMinutes": 52,
    "avgRating": 4.2,
    "tasksCompleted": 87,
    "currentStreak": 7,
    "longestStreak": 14
  }
}
```

---

### GET `/analytics/sessions`
Get daily session data for charting.

**Query Parameters:**
- `days` (optional, default: 14)

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "date": "2024-07-15", "minutes": 120, "sessions": 2 },
    { "date": "2024-07-16", "minutes": 180, "sessions": 3 }
  ]
}
```

---

### GET `/analytics/subjects`
Get study time distribution by subject.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "name": "Mathematics", "hours": 42, "color": "#7C3AED", "sessions": 28 },
    { "name": "Physics", "hours": 35, "color": "#0EA5E9", "sessions": 22 }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

**`400` Bad Request:**
```json
{ "success": false, "message": "Validation error: email is required" }
```

**`401` Unauthorized:**
```json
{ "success": false, "message": "Not authorized, token missing or invalid" }
```

**`404` Not Found:**
```json
{ "success": false, "message": "Resource not found" }
```

**`429` Too Many Requests:**
```json
{ "success": false, "message": "Too many requests, please try again later" }
```

**`500` Server Error:**
```json
{ "success": false, "message": "Internal server error" }
```

---

## Rate Limiting

- Global limit: **100 requests per 15 minutes** per IP
- Auth endpoints: **10 requests per 15 minutes** per IP

---

## Security

- All passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens expire in **7 days**
- HTTP security headers via **Helmet**
- CORS restricted to configured origins
- Input validation on all mutation endpoints
