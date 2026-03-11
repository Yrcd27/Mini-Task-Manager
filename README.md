<div align="center">

# TaskBoard - The Task Manager

A full-stack task management application with JWT authentication, role-based access control, and comprehensive task management features.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=flat&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Java](https://img.shields.io/badge/Java-17-007396?style=flat&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io)

</div>

---

## Overview

This is a comprehensive task management system that enables users to organize, track, and manage their tasks efficiently. The application implements secure JWT-based authentication with role-based access control (ADMIN and USER roles), allowing administrators to oversee all tasks while regular users manage their own tasks independently.

Built with modern technologies and following clean architecture principles, the system provides a responsive user interface with features including task filtering, pagination, sorting, and a visual Kanban board for task organization.

## Technology Stack

### Backend
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **JWT (JSON Web Tokens)** - Secure token-based authentication
- **MySQL 8.0+** - Relational database
- **Hibernate** - ORM framework
- **Maven** - Dependency management and build tool
- **Bean Validation** - Input validation

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API integration
- **Context API** - State management
- **Lucide Icons** - Icon library

## Architecture

The application follows a clean, monolithic architecture with clear separation of concerns:

### Backend Architecture
```
Controller Layer (REST API)
      ↓
Service Layer (Business Logic)
      ↓
Repository Layer (Data Access)
      ↓
Database (MySQL)
```

### Frontend Architecture
```
Pages (Next.js App Router)
      ↓
Components (Reusable UI)
      ↓
Context Providers (State Management)
      ↓
API Layer (Axios)
      ↓
Backend REST API
```

### Key Features
- JWT-based stateless authentication
- Role-based access control (RBAC)
- Centralized exception handling
- RESTful API design with proper HTTP status codes
- Input validation and error handling
- Pagination and sorting support
- Task filtering by status and priority

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 18+ and npm** - [Download](https://nodejs.org/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
- **Git** (optional) - [Download](https://git-scm.com/)

Verify installations:
```bash
java -version
node --version
npm --version
mysql --version
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Database Setup

**Step 1:** Login to MySQL
```bash
mysql -u root -p
```

**Step 2:** Execute the setup script
```bash
# From MySQL prompt
source database/setup_database.sql

# Or from terminal
mysql -u root -p < database/setup_database.sql
```

This script will:
- Create the `task_management` database with UTF-8 support
- Create `users` and `tasks` tables with proper relationships
- Set up indexes and foreign key constraints

**Database Configuration Details:** See [database/setup_database.sql](database/setup_database.sql) for complete schema.

**Step 3: Creating Admin Users**

By default, all users registered through the application are assigned the USER role. To grant administrative privileges, you must manually update the user's role in the database using SQL queries.

**To promote an existing user to admin:**

```sql
-- Login to MySQL
mysql -u root -p

-- Select the database
USE task_management;

-- Update user role to ADMIN (replace with actual email)
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';

-- Verify the change
SELECT id, email, role FROM users WHERE email = 'admin@example.com';
```

**Security Significance:**

This deliberate manual approach to admin role assignment provides several security benefits:

- **Prevents Privilege Escalation:** Users cannot self-promote to admin through the application interface, preventing unauthorized privilege escalation attacks
- **Audit Trail:** Database-level changes can be logged and monitored through MySQL audit logs
- **Separation of Concerns:** Administrative access is controlled at the database level, separate from application logic
- **Reduces Attack Surface:** No API endpoint exists for role modification, eliminating a potential security vulnerability
- **Intentional Access Control:** Requires deliberate action and database access, ensuring only authorized personnel with database credentials can grant admin privileges

This approach follows the principle of least privilege and ensures that administrative access is granted only through secure, controlled channels.

### 3. Backend Setup

**Step 1:** Navigate to backend directory
```bash
cd backend
```

**Step 2:** Configure environment variables

Create a `.env` file in the `backend` directory (or set environment variables):

```env
DATABASE_URL=jdbc:mysql://localhost:3306/task_management
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_mysql_password
JWT_SECRET=your_secret_key_minimum_32_characters
```

**Required Environment Variables:**
- `DATABASE_URL` - MySQL connection URL
- `DATABASE_USERNAME` - MySQL username
- `DATABASE_PASSWORD` - MySQL password
- `JWT_SECRET` - Secret key for JWT token generation (minimum 32 characters)

**Step 3:** Build and run the application

**On Windows:**
```bash
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

**On Linux/Mac:**
```bash
./mvnw clean install
./mvnw spring-boot:run
```

The backend server will start at `http://localhost:8080`

### 4. Frontend Setup

**Step 1:** Navigate to frontend directory
```bash
cd frontend
```

**Step 2:** Install dependencies
```bash
npm install
```

**Step 3:** Configure environment (optional)

Create `.env.local` if you need to customize the API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

**Step 4:** Start development server
```bash
npm run dev
```

The frontend application will start at `http://localhost:3000`

### 5. Build for Production

**Backend:**
```bash
cd backend
mvnw.cmd clean package
java -jar target/task-manager-backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## Application Features

### Authentication & Authorization
- User registration with email and password
- Secure login with JWT token generation
- Password encryption using BCrypt
- Role-based access control (ADMIN and USER)
- Protected routes requiring authentication

### Task Management
- Create, read, update, and delete tasks
- Task attributes: title, description, status, priority, due date
- Task status: TODO, IN_PROGRESS, DONE
- Task priority: LOW, MEDIUM, HIGH
- Mark tasks as completed
- View tasks in Kanban board layout

### Filtering & Organization
- Filter tasks by status (TODO, IN_PROGRESS, DONE)
- Filter tasks by priority (LOW, MEDIUM, HIGH)
- Sort tasks by creation date, due date, or priority
- Pagination support for large task lists
- Search functionality

### Administrative Features
- Admin dashboard to view all users
- Admin can view all tasks across the system
- User management capabilities
- Role assignment

## API Testing

The project includes a comprehensive Postman collection for API testing.

**Location:** `backend/postman/`

**Files:**
- `Task-Manager-API.postman_collection.json` - Complete API collection
- `Task-Manager-Environment.postman_environment.json` - Environment variables

**To use:**
1. Open Postman
2. Import the collection and environment files
3. Set the environment to "Task Manager Environment"
4. Update the `baseUrl` and `token` variables as needed
5. Execute requests to test all endpoints

For detailed API documentation, refer to the Postman collection which includes:
- Authentication endpoints (register, login)
- Task CRUD operations
- Filtering and pagination
- Admin-only endpoints

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/yasiru/task_manager_backend/
│   │   │   │   ├── config/           # Security and application configuration
│   │   │   │   ├── controller/       # REST API controllers
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── entity/           # JPA entities
│   │   │   │   ├── enums/            # Enum types (Role, Status, Priority)
│   │   │   │   ├── exception/        # Custom exceptions and handlers
│   │   │   │   ├── repository/       # Data access layer
│   │   │   │   ├── security/         # JWT authentication filter
│   │   │   │   └── service/          # Business logic layer
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                     # Unit and integration tests
│   ├── postman/                      # API testing collection
│   ├── pom.xml                       # Maven configuration
│   └── .gitignore
│
├── frontend/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (protected)/              # Protected routes
│   │       ├── admin/                # Admin dashboard
│   │       ├── dashboard/            # Main Kanban board
│   │       ├── tasks/                # Task management
│   │       ├── scheduled/            # Scheduled tasks view
│   │       └── completed/            # Completed tasks view
│   ├── components/                   # Reusable React components
│   │   ├── auth/                     # Authentication components
│   │   ├── dashboard/                # Dashboard components
│   │   ├── tasks/                    # Task components
│   │   ├── layout/                   # Layout components
│   │   └── ui/                       # UI primitives
│   ├── context/                      # React Context providers
│   │   ├── AuthContext.tsx           # Authentication state
│   │   └── ToastContext.tsx          # Notification system
│   ├── lib/                          # Utility libraries
│   │   ├── api/                      # API integration layer
│   │   ├── axios.ts                  # Axios configuration
│   │   └── utils.ts                  # Helper functions
│   ├── types/                        # TypeScript type definitions
│   ├── package.json
│   └── .gitignore
│
└── database/
    ├── setup_database.sql            # Database initialization script
    ├── er_diagram.png                # Entity-Relationship diagram
    └── .gitignore
```

## Security Considerations

- Passwords are hashed using BCrypt with strength 10
- JWT tokens are used for stateless authentication
- CORS is configured to allow frontend-backend communication
- Environment variables are used for sensitive configuration
- SQL injection prevention through JPA/Hibernate parameterized queries
- Input validation on both frontend and backend
- Role-based access control enforced at the service layer

## Troubleshooting

### Common Issues

**Backend fails to start:**
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in environment variables
- Ensure port 8080 is not in use

**Frontend fails to connect to backend:**
- Verify backend is running on port 8080
- Check CORS configuration in Spring Boot
- Verify API base URL in frontend configuration

**JWT token issues:**
- Ensure `JWT_SECRET` is at least 32 characters
- Check token expiration settings
- Clear browser localStorage and re-login

**Database connection errors:**
- Verify MySQL service is running
- Check database name, username, and password
- Ensure MySQL is accepting connections on port 3306

## Contact

For questions, support, or further clarifications regarding this project, please contact:

**Developer:** Yasiru Pandigama

**Email:** yasirucp2002@gmail.com

Feel free to reach out for any issues, suggestions, or inquiries about the implementation.
