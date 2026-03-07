# Task Manager API - Endpoints Documentation

## 🚀 Quick Start

For comprehensive API testing with Postman:
- See [`postman/README.md`](postman/README.md) for detailed testing guide
- Import [`postman/Task-Manager-API.postman_collection.json`](postman/Task-Manager-API.postman_collection.json)
- Import [`postman/Task-Manager-Environment.postman_environment.json`](postman/Task-Manager-Environment.postman_environment.json)

## 📍 Base URL

```
http://localhost:8080/api
```

## 🔐 Authentication

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Pass@123"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character

**Success Response (201 Created):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (409 Conflict):**
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Email already exists",
  "path": "/api/auth/register"
}
```

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Pass@123"
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "path": "/api/auth/login"
}
```

---

## 📋 Task Management (Requires JWT Token)

**Authorization Header Required:**
```
Authorization: Bearer <your_jwt_token>
```

### Create Task
**POST** `/tasks`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-03-15"
}
```

**Valid Values:**
- `status`: `TODO`, `IN_PROGRESS`, `DONE`
- `priority`: `LOW`, `MEDIUM`, `HIGH`
- `dueDate`: `YYYY-MM-DD` format

**Success Response (201 Created):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-03-15",
  "createdAt": "2026-03-07T10:30:00",
  "updatedAt": "2026-03-07T10:30:00"
}
```

---

### Get My Tasks
**GET** `/tasks`

**Query Parameters (All Optional):**
- `status` - Filter by status: `TODO`, `IN_PROGRESS`, `DONE`
- `priority` - Filter by priority: `LOW`, `MEDIUM`, `HIGH`
- `page` - Page number (zero-based, default: 0)
- `size` - Items per page (default: 10)
- `sortBy` - Sort field: `createdAt`, `dueDate`, `priority`, `title` (default: `createdAt`)
- `sortDir` - Sort direction: `ASC`, `DESC` (default: `DESC`)

**Examples:**
```
GET /tasks
GET /tasks?status=TODO
GET /tasks?priority=HIGH
GET /tasks?status=TODO&priority=HIGH
GET /tasks?page=0&size=5
GET /tasks?sortBy=dueDate&sortDir=ASC
GET /tasks?status=TODO&priority=HIGH&page=0&size=10&sortBy=priority&sortDir=DESC
```

**Success Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2026-03-15",
      "createdAt": "2026-03-07T10:30:00",
      "updatedAt": "2026-03-07T10:30:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 1,
  "first": true,
  "empty": false
}
```

---

### Get Task by ID
**GET** `/tasks/{id}`

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-03-15",
  "createdAt": "2026-03-07T10:30:00",
  "updatedAt": "2026-03-07T10:30:00"
}
```

**Error Response (404 Not Found):**
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Task not found with id: 999",
  "path": "/api/tasks/999"
}
```

**Error Response (403 Forbidden - Accessing another user's task):**
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to access this task",
  "path": "/api/tasks/1"
}
```

---

### Update Task
**PUT** `/tasks/{id}`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation and user guide",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-03-15"
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation and user guide",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-03-15",
  "createdAt": "2026-03-07T10:30:00",
  "updatedAt": "2026-03-07T11:45:00"
}
```

**Mark as Completed:**
Simply set `status` to `DONE` in the request body.

---

### Delete Task
**DELETE** `/tasks/{id}`

**Success Response (204 No Content)**

No response body.

**Error Response (404 Not Found):**
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Task not found with id: 999",
  "path": "/api/tasks/999"
}
```

---

## 👨‍💼 Admin Endpoints (Requires ADMIN Role)

**Authorization Header Required:**
```
Authorization: Bearer <admin_jwt_token>
```

**How to Get Admin Access:**
```sql
-- Run this SQL to set a user as ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

After updating the role, login again to get a new token with ADMIN privileges.

---

### Get All Tasks (Admin)
**GET** `/admin/tasks`

View all tasks from all users in the system.

**Query Parameters (All Optional):**
- `status` - Filter by status: `TODO`, `IN_PROGRESS`, `DONE`
- `priority` - Filter by priority: `LOW`, `MEDIUM`, `HIGH`
- `page` - Page number (zero-based, default: 0)
- `size` - Items per page (default: 10)
- `sortBy` - Sort field: `createdAt`, `dueDate`, `priority`, `title` (default: `createdAt`)
- `sortDir` - Sort direction: `ASC`, `DESC` (default: `DESC`)

**Examples:**
```
GET /admin/tasks
GET /admin/tasks?status=TODO
GET /admin/tasks?priority=HIGH
GET /admin/tasks?status=IN_PROGRESS&priority=HIGH&page=0&size=20&sortBy=dueDate&sortDir=ASC
```

**Success Response (200 OK):**
Same format as "Get My Tasks" but includes tasks from all users.

**Error Response (403 Forbidden - USER role):**
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/api/admin/tasks"
}
```

---

## 🚨 Error Response Format

All errors follow this standardized format:

```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Detailed error message",
  "path": "/api/path/that/caused/error",
  "validationErrors": {
    "field1": "Error message for field1",
    "field2": "Error message for field2"
  }
}
```

**Common HTTP Status Codes:**
- `200 OK` - Successful GET request
- `201 Created` - Successful POST (resource created)
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions (e.g., USER trying to access admin endpoint)
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., email already exists)
- `500 Internal Server Error` - Server error

---

## 🔧 Environment Variables

Set these before running the application:

```bash
# Database Configuration
DATABASE_URL=jdbc:mysql://localhost:3306/task_management
DATABASE_USERNAME=your_mysql_username
DATABASE_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_256_bit_secret_key_here_make_it_very_long_and_secure
```

**Generate JWT Secret (256 bits):**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 3: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🧪 Testing Guide

### 1. Using Postman (Recommended)

Import the Postman collection for comprehensive testing:
1. Import `postman/Task-Manager-API.postman_collection.json`
2. Import `postman/Task-Manager-Environment.postman_environment.json`
3. See [`postman/README.md`](postman/README.md) for detailed testing scenarios

**Benefits:**
- ✅ Auto-saves JWT token after login/register
- ✅ All endpoints pre-configured
- ✅ Example requests for all features
- ✅ Multiple filtering/pagination examples

### 2. Using cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Pass@123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Pass@123"
  }'
```

**Create Task:**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Task",
    "description": "This is a test",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-03-15"
  }'
```

**Get Tasks:**
```bash
curl -X GET "http://localhost:8080/api/tasks?status=TODO&priority=HIGH" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Update Task:**
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "dueDate": "2026-03-20"
  }'
```

**Delete Task:**
```bash
curl -X DELETE http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📚 Additional Documentation

- **[postman/README.md](postman/README.md)** - Comprehensive Postman testing guide with scenarios
- **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** - Feature completion checklist
- **[docs/requirements.txt](docs/requirements.txt)** - Original project requirements

---

## 💡 Tips & Best Practices

1. **Token Management**
   - JWT tokens expire after 24 hours
   - Store token securely in environment variable
   - Login again when token expires

2. **Testing Workflow**
   - Start with register/login
   - Create several tasks with different attributes
   - Test filtering, pagination, and sorting
   - Test error scenarios (invalid data, unauthorized access)

3. **Database Setup**
   - Create database: `CREATE DATABASE task_management;`
   - Tables are auto-created by Hibernate
   - Check `application.properties` for SQL query logging

4. **Security**
   - Never commit JWT_SECRET to version control
   - Use strong passwords for production
   - ADMIN role must be set manually in database

5. **Development**
   - Check backend logs for SQL queries
   - Use Postman Console for request/response debugging
   - Verify environment variables are set before starting

---

**Happy Testing! 🚀**

For issues or questions, check the backend logs or refer to the [Postman testing guide](postman/README.md).
