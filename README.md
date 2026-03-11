# 📋 TaskBoard - Task Manager Application

A modern, full-stack task management application built with Spring Boot, React (Next.js), and MySQL. Features include user authentication, role-based access control, drag-and-drop Kanban board, and real-time task management.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control (Admin/User)
- 📊 **Kanban Board** - Drag-and-drop interface for visual task management
- 🎯 **Task Management** - Create, edit, delete, and organize tasks with priorities and due dates
- 👥 **User Management** - Admin dashboard for managing users and permissions
- 📱 **Responsive Design** - Beautiful, mobile-friendly UI with smooth animations
- 🎨 **Modern UI** - Clean, professional interface with Tailwind CSS
- 🔍 **Task Filtering** - Filter and sort tasks by status, priority, and due date
- 📅 **Calendar Views** - Scheduled and completed task views

## 🛠️ Tech Stack

### Backend
- **Java 17+** - Programming language
- **Spring Boot 3.x** - Application framework
- **Spring Security** - Authentication and authorization
- **JWT** - Token-based authentication
- **MySQL 8.0+** - Database
- **JPA/Hibernate** - ORM
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Beautiful DnD** - Drag and drop functionality
- **Lucide Icons** - Icon library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
  - [Download JDK](https://www.oracle.com/java/technologies/downloads/)
  - Verify: `java -version`

- **Node.js 18+ and npm**
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node --version` and `npm --version`

- **MySQL 8.0+ or MariaDB 10.5+**
  - [Download MySQL](https://dev.mysql.com/downloads/)
  - Verify: `mysql --version`

- **Git** (optional, for cloning)
  - [Download Git](https://git-scm.com/)

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
source database/setup_database.sql

# Or run it directly
mysql -u root -p < database/setup_database.sql
```

This will:
- Create the `task_management` database
- Set up tables with proper schema
- Insert sample users and tasks for testing

📚 See [database/README.md](database/README.md) for detailed database setup instructions.

### 3. Backend Setup

```bash
cd backend

# Create .env file from example
cp .env.example .env

# Edit .env and update your MySQL credentials
# Update these values:
# - DATABASE_PASSWORD=your_mysql_password
# - JWT_SECRET=your_secret_key

# Build and run the application
# On Windows:
mvnw.cmd spring-boot:run

# On Linux/Mac:
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔑 Default Test Credentials

After running the database setup script, you can login with these accounts:

| Email | Password | Role |
|-------|----------|------|
| alex.thompson@taskboard.com | Test@123 | ADMIN |
| sarah.johnson@taskboard.com | Test@123 | USER |
| michael.chen@taskboard.com | Test@123 | USER |

## 📁 Project Structure

```
task-manager/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source code
│   │   │   └── resources/  # Configuration files
│   │   └── test/           # Test files
│   ├── .env.example        # Environment variables template
│   ├── pom.xml            # Maven dependencies
│   └── postman/           # Postman API collection
│
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript types
│   └── package.json       # npm dependencies
│
└── database/              # Database setup files
    ├── setup_database.sql # Complete setup script
    └── README.md          # Database documentation
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
DATABASE_URL=jdbc:mysql://localhost:3306/task_management
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

### Frontend Configuration

Edit `frontend/lib/axios.ts` if backend runs on a different port:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});
```

## 📚 API Documentation

The backend includes a Postman collection for API testing.

Import `backend/postman/Task-Manager-API.postman_collection.json` into Postman to test all endpoints.

### Key Endpoints

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/tasks` - Get all tasks
- **POST** `/api/tasks` - Create new task
- **PUT** `/api/tasks/{id}` - Update task
- **DELETE** `/api/tasks/{id}` - Delete task
- **GET** `/api/admin/users` - Get all users (Admin only)

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🏗️ Building for Production

### Backend

```bash
cd backend
./mvnw clean package
java -jar target/task-manager-backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## 🐛 Troubleshooting

### Database Connection Issues

1. Verify MySQL is running: `sudo systemctl status mysql`
2. Check credentials in `.env` file
3. Ensure database exists: `SHOW DATABASES;`
4. Check user privileges: `SHOW GRANTS FOR 'your_user'@'localhost';`

### Backend Won't Start

1. Check Java version: `java -version` (should be 17+)
2. Verify `.env` file exists and has correct values
3. Check if port 8080 is available
4. Review Spring Boot logs for errors

### Frontend Issues

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check Node.js version: `node --version` (should be 18+)
3. Verify backend is running on port 8080
4. Check browser console for errors

### Port Already in Use

```bash
# Find process using port 8080 (backend)
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :8080
kill -9 <PID>

# Find process using port 3000 (frontend)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed by Yasiru

## 🙏 Acknowledgments

- Spring Boot for the robust backend framework
- Next.js for the powerful React framework
- Tailwind CSS for the beautiful styling
- Lucide Icons for the icon library

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [database/README.md](database/README.md) for database-specific issues
3. Check the issue tracker
4. Contact the development team

---

**Happy Task Managing! 📋✨**
