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

### Step 6: Admin Features Testing

**Important:** There is NO direct API to register as admin (this is by design for security). You must manually promote a user to admin in the database.

#### Complete Admin Testing Flow:

##### 6.1 Register an Admin User
1. Go to **Authentication > Register User**
2. Use special email/credentials for admin:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Admin@123"
}
```
3. Click **Send** - User is created with default **USER** role

##### 6.2 Promote User to Admin Role
**Connect to your MySQL database and run this SQL:**
```sql
-- Option 1: Using MySQL Workbench or Command Line
USE task_management;
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';

-- Verify the change
SELECT id, name, email, role FROM users WHERE email = 'admin@example.com';
```

**Using MySQL Command Line:**
```bash
# Connect to MySQL
mysql -u your_username -p

# Run the commands
USE task_management;
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
SELECT id, name, email, role FROM users WHERE email = 'admin@example.com';
exit;
```

##### 6.3 Login as Admin to Get Admin Token
1. Go to **Authentication > Login**
2. Use admin credentials:
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```
3. Click **Send** - Token with **ADMIN privileges** is auto-saved
4. **Important:** Old token (from registration) won't work for admin endpoints - you MUST login again after role change

##### 6.4 Test Admin Endpoints
Now test these admin-only endpoints:

**A. Get All Tasks (Admin Only)**
- Go to **Admin > Get All Tasks (Admin Only)**
- Click **Send**
- ✅ Should see tasks from ALL users in the system

**B. Get All Tasks (Filter by Status)**
- Try filtering: `?status=TODO`
- Should see all TODO tasks from all users

**C. Get All Tasks (Filter by Priority)**
- Try filtering: `?priority=HIGH`
- Should see all HIGH priority tasks from all users

**D. Get All Tasks (With Pagination & Sorting)**
- Try: `?page=0&size=10&sortBy=createdAt&sortDir=DESC`
- Should see paginated results from all users

##### 6.5 Verify Role-Based Access Control
**Test USER role is blocked:**
1. Register/login as a regular user (e.g., `user@example.com`)
2. Try to access **Admin > Get All Tasks (Admin Only)**
3. ❌ Should receive `403 Forbidden` error:
```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/api/admin/tasks"
}
```

**Test ADMIN role has access:**
1. Switch to admin token (login as admin@example.com)
2. Try same endpoint
3. ✅ Should see all tasks successfully

#### Admin Testing Summary:

| Role | Endpoint | Expected Result |
|------|----------|----------------|
| USER | `/api/tasks` | ✅ Only their own tasks |
| USER | `/api/admin/tasks` | ❌ 403 Forbidden |
| ADMIN | `/api/tasks` | ✅ Only their own tasks |
| ADMIN | `/api/admin/tasks` | ✅ All users' tasks |

**Key Points:**
- Admin users can create/update/delete only their own tasks via `/api/tasks`
- Admin users can VIEW all users' tasks via `/api/admin/tasks` (read-only)
- Admin role must be set manually in database (no API endpoint for security)
- Must login again after role change to get new token with correct permissions

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

### Scenario 4: Security Testing (Task Ownership)
1. Register as User A (`usera@example.com`)
2. Create 2 tasks as User A (note the task IDs)
3. Register as User B (`userb@example.com`)
4. Create 2 tasks as User B
5. Try to access User A's task by ID → Should get 403 or 404
6. Try to update User A's task → Should fail with 403
7. Try to delete User A's task → Should fail with 403
8. Get all tasks as User B → Should only see User B's tasks

### Scenario 5: Admin Testing (Complete Flow)

**Phase 1 - Setup Users & Data:**
1. Register User A (`usera@example.com`, password: `UserA@123`)
2. Login as User A and create 3 tasks:
   - Task 1: `TODO`, `HIGH` priority, due tomorrow
   - Task 2: `IN_PROGRESS`, `MEDIUM` priority, due next week
   - Task 3: `DONE`, `LOW` priority, past due date

3. Register User B (`userb@example.com`, password: `UserB@123`)
4. Login as User B and create 2 tasks:
   - Task 4: `TODO`, `LOW` priority, due today
   - Task 5: `TODO`, `HIGH` priority, due tomorrow

5. Register Admin User (`admin@example.com`, password: `Admin@123`)

**Phase 2 - Promote to Admin:**
6. Open MySQL and run:
```sql
USE task_management;
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
SELECT id, name, email, role FROM users;
```

**Phase 3 - Test Admin Access:**
7. Login as admin@example.com (get new token with ADMIN role)
8. Try **Admin > Get All Tasks** → ✅ Should see all 5 tasks (from both users)
9. Try filter `?status=TODO` → ✅ Should see 3 TODO tasks (1 from User A, 2 from User B)
10. Try filter `?priority=HIGH` → ✅ Should see 2 HIGH priority tasks
11. Try pagination `?page=0&size=2` → ✅ Should see first 2 tasks only

**Phase 4 - Verify Role Access Control:**
12. Login as User A (regular user)
13. Try **Admin > Get All Tasks** → ❌ Should get `403 Forbidden`
14. Try **Tasks > Get My Tasks** → ✅ Should see only User A's 3 tasks
15. Login as Admin again
16. Try **Tasks > Get My Tasks** → ✅ Should see only admin's own tasks (0 if admin didn't create any)
17. Try **Admin > Get All Tasks** → ✅ Should see all tasks from all users

**Phase 5 - Admin Can't Modify Others' Tasks:**
18. As admin, try to update User A's task via `PUT /api/tasks/{userA_task_id}`
19. ❌ Should fail with 403 - Admin can VIEW all tasks but can't modify them
20. Admin endpoints are READ-ONLY for viewing/monitoring purposes

**Expected Results Summary:**
- ✅ Regular users see only their tasks
- ✅ Regular users can't access admin endpoints (403)
- ✅ Admin can view all tasks via admin endpoint
- ✅ Admin can't modify other users' tasks (ownership still enforced)
- ✅ Filtering, pagination work on admin endpoint
- ✅ Token must be refreshed after role change

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
