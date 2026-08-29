# Skillz API Documentation (Phase 1)

All endpoints will be prefixed with `/api/v1`.

## Auth Endpoints

### POST `/auth/register`
Create a new user account.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123",
    "username": "janedoe"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "username": "janedoe",
      "onboardingCompleted": false
    }
  }
  ```

### POST `/auth/login`
Authenticate a user.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK` (Same format as register)

## User Endpoints

### GET `/users/me`
Get current user profile.
- **Auth Required**: Yes
- **Response**: `200 OK`
  ```json
  {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "bio": "Developer...",
    "preferences": {...},
    "skills": [...],
    "interests": [...],
    "goals": [...]
  }
  ```

### PUT `/users/me`
Update basic user info.
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "bio": "New bio",
    "location": "New York"
  }
  ```

### POST `/users/onboarding`
Complete user onboarding.
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "preferences": {
      "availabilityHours": 10,
      "preferWeekends": true,
      "experienceLevel": "INTERMEDIATE"
    },
    "skills": [
      { "skillId": "uuid-1", "proficiencyLevel": "ADVANCED" }
    ],
    "interests": ["uuid-2", "uuid-3"],
    "goals": ["HACKATHON", "LEARNING"]
  }
  ```

## Reference Endpoints

### GET `/skills`
List all available skills (optionally grouped by category).
- **Auth Required**: No
- **Response**: `200 OK`
  ```json
  [
    { "id": "uuid", "name": "React", "category": "Frontend" },
    { "id": "uuid", "name": "Node.js", "category": "Backend" }
  ]
  ```

### GET `/interests`
List all available interests.
- **Auth Required**: No
- **Response**: `200 OK`
  ```json
  [
    { "id": "uuid", "name": "Web Development" },
    { "id": "uuid", "name": "AI / Machine Learning" }
  ]
  ```
