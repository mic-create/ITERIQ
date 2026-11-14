# ITERIQ API Contract

## PDF Register Generation Endpoint
- **Endpoint**: `GET /api/v1/attendance/session/:sessionId/pdf`
- **Headers**: `Authorization: Bearer <Supabase_JWT>` (Role: `COURSE_REPRESENTATIVE`)
- **Response**: Binary PDF file stream (`application/pdf`) with `Content-Disposition: attachment`.