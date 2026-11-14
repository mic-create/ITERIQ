# ITERIQ API Contract

## Authentication
All protected routes require a Bearer token in the `Authorization` header:
`Authorization: Bearer <Supabase_JWT>`

## Endpoints

### 1. Attendance Verification & Submission
- **Endpoint**: `POST /api/v1/attendance/verify`
- **Request Body**:
  ```json
  {
    "session_id": "uuid",
    "latitude": 6.6731,
    "longitude": 3.1592,
    "accuracy": 8.5
  }