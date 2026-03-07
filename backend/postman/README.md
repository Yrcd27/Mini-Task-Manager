# Task Manager API - Postman Collection

This folder contains comprehensive API documentation and testing resources for the Mini Task Management System Backend.

## 📁 Files

- **Task-Manager-API.postman_collection.json** - Complete API collection with all endpoints
- **Task-Manager-Environment.postman_environment.json** - Environment variables for easy testing
- **README.md** - This file (usage instructions)

## 🚀 Getting Started

### 1. Import into Postman

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop both JSON files or click "Upload Files"
4. Import both:
   - `Task-Manager-API.postman_collection.json`
   - `Task-Manager-Environment.postman_environment.json`

### 2. Set Environment

1. Click the environment dropdown (top right)
2. Select **"Task Manager Environment"**
3. Verify `baseUrl` is set to `http://localhost:8080/api`

### 3. Start Your Backend

```bash
# Make sure your backend is running
mvn spring-boot:run
```

Make sure you have set these environment variables:
- `DATABASE_URL` (e.g., `jdbc:mysql://localhost:3306/task_management`)
- `DATABASE_USERNAME` (your MySQL username)
- `DATABASE_PASSWORD` (your MySQL password)
- `JWT_SECRET` (256-bit secret key for JWT)

## 📋 API Testing Flow

### Step 1: Authentication

#### Register a New User
1. Go to **Authentication > Register User**
2. Click **Send**
3. The JWT token will be **automatically saved** to environment variable `token`
4. Default request body:
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

#### Login (Alternative)
1. Go to **Authentication > Login**
2. Use the same credentials you registered with
3. Token will be auto-saved again

### Step 2: Create Tasks

1. Go to **Tasks > Create Task**
2. Modify the request body as needed:
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-03-15"
}
```
3. Click **Send**

**Valid Values:**
- `status`: `TODO`, `IN_PROGRESS`, `DONE`
- `priority`: `LOW`, `MEDIUM`, `HIGH`
- `dueDate`: Format `YYYY-MM-DD`

### Step 3: View Your Tasks

Try different endpoints to see various features:

#### Basic Retrieval
- **Get My Tasks (All)** - Get all your tasks with default pagination

#### Filtering
- **Get My Tasks (Filter by Status)** - Only TODO, IN_PROGRESS, or DONE tasks
- **Get My Tasks (Filter by Priority)** - Only LOW, MEDIUM, or HIGH priority tasks
- **Get My Tasks (Combined Filters)** - Both status AND priority filters

#### Pagination
- **Get My Tasks (With Pagination)** - Custom page size
  - `page=0` - First page (zero-based)
  - `size=5` - 5 items per page

#### Sorting
- **Get My Tasks (Sort by Due Date ASC)** - Nearest deadlines first
- **Get My Tasks (Sort by Priority DESC)** - Highest priority first
  - Available sort fields: `createdAt`, `dueDate`, `priority`, `title`
  - Sort directions: `ASC`, `DESC`

#### Specific Task
- **Get Task by ID** - Change the task ID in the URL (e.g., `/tasks/1`)

### Step 4: Update Tasks

1. **Update Task** - Modify any field of an existing task
2. **Mark Task as Completed** - Change status to `DONE`
3. Update the task ID in the URL to match your task

### Step 5: Delete Tasks

1. Go to **Tasks > Delete Task**
2. Change the task ID in the URL
3. Click **Send**

### Step 6: Admin Features (Optional)

**Note:** Admin features require ADMIN role. You need to manually update the database to set a user's role to ADMIN:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'john@example.com';
```

After setting ADMIN role, login again to get a new token with ADMIN privileges.

#### Admin Endpoints:
- **Get All Tasks (Admin Only)** - View all tasks from all users
- **Get All Tasks (Filter by Status)** - Filter all users' tasks by status
- **Get All Tasks (Filter by Priority)** - Filter all users' tasks by priority
- **Get All Tasks (With Pagination & Sorting)** - Full control over all tasks

**Expected Behavior:**
- ✅ ADMIN role: Returns all tasks from all users
- ❌ USER role: Returns `403 Forbidden` error

## 🔧 Environment Variables

The environment file contains these variables:

| Variable | Description | Auto-Set |
|----------|-------------|----------|
| `baseUrl` | API base URL | Pre-configured |
| `token` | JWT authentication token | ✅ Auto-saved on login/register |
| `userId` | Current user ID | ✅ Auto-saved on login/register |

**Token Management:**
- Token is automatically saved when you register or login
- Token is automatically included in all protected endpoints via `Authorization: Bearer {{token}}`
- Token expires after 24 hours (86400000 ms)

## 📊 Response Format

### Success Response (Task)
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

### Paginated Response
```json
{
  "content": [
    { /* task object */ },
    { /* task object */ }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 25,
  "totalPages": 3,
  "last": false
}
```

### Error Response
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Task not found with id: 1",
  "path": "/api/tasks/1"
}
```

### Validation Error Response
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/register",
  "validationErrors": {
    "password": "Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character",
    "email": "Email must be valid"
  }
}
```

## 📖 API Endpoints Summary

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user

### Tasks (Protected - Requires JWT)
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get my tasks (with filters, pagination, sorting)
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Admin (Protected - Requires ADMIN role)
- `GET /api/admin/tasks` - View all users' tasks (with filters, pagination, sorting)

## 🔍 Testing Scenarios

### Scenario 1: Complete Task Lifecycle
1. Register → Login
2. Create 3 tasks with different priorities
3. Get all tasks
4. Update one task to IN_PROGRESS
5. Mark one task as DONE
6. Delete one task

### Scenario 2: Filtering & Sorting
1. Create 10 tasks with mixed statuses and priorities
2. Filter by status=TODO
3. Filter by priority=HIGH
4. Combine: status=TODO & priority=HIGH
5. Sort by dueDate ascending
6. Test pagination with size=5

### Scenario 3: Error Handling
1. Try to register with weak password → 400 Bad Request
2. Try to register with duplicate email → 409 Conflict
3. Try to access tasks without token → 401 Unauthorized
4. Try to get non-existent task → 404 Not Found
5. Try admin endpoint as USER → 403 Forbidden

### Scenario 4: Security Testing
1. Register as User A
2. Create task as User A (note the task ID)
3. Logout and register as User B
4. Try to access User A's task → Should fail or not show
5. Try to update User A's task → Should fail
6. Try to delete User A's task → Should fail

### Scenario 5: Admin Testing
1. Set one user as ADMIN in database
2. Login as ADMIN
3. Create tasks as ADMIN
4. Register another user and create tasks
5. Use admin endpoint to view all tasks
6. Verify both users' tasks are visible

## 🐛 Troubleshooting

### Token Not Auto-Saving
- Check the **Tests** tab in Register/Login requests
- Make sure environment is selected (top right)
- Look at Postman Console (View → Show Postman Console)

### 401 Unauthorized
- Make sure you've logged in and token is saved
- Check if token has expired (24 hours)
- Verify Authorization header is set to `Bearer {{token}}`

### 403 Forbidden (Admin endpoints)
- Make sure your user has ADMIN role in database
- Login again after changing role to get new token

### 404 Not Found
- Verify the task ID exists
- Check if you're trying to access another user's task

### Connection Refused
- Make sure backend is running on port 8080
- Check `baseUrl` in environment matches your server

## 📚 Additional Resources

- See `API_ENDPOINTS.md` in project root for detailed API documentation
- See `IMPLEMENTATION_CHECKLIST.md` for feature completion status
- Check backend logs for SQL queries and debugging info

## 💡 Tips

1. **Keep Token Fresh**: Login every 24 hours or when you get 401 errors
2. **Test Incrementally**: Start with register/login, then move to CRUD
3. **Use Tests Tab**: Add custom scripts to validate responses
4. **Check Console**: View detailed request/response logs
5. **Save Examples**: Click "Save Response" to keep example responses
6. **Create Test Users**: Register multiple users to test isolation
7. **Use Folders**: Organize your own variations in collection folders

## 🎯 Quick Test Commands

If you prefer curl, here are some examples:

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Pass@123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass@123"}'

# Create Task (replace YOUR_TOKEN)
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test","description":"Test task","status":"TODO","priority":"HIGH","dueDate":"2026-03-15"}'

# Get Tasks
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Happy Testing! 🚀**

For questions or issues, check the backend logs or verify your database connection.
