<div align="center">

# 🗂 TASKFLOW API

### Project & Task Management REST API

A backend-focused REST API for managing projects and tasks through secure user authentication, protected resources, MongoDB data modeling, and structured Express middleware.

**Authenticate. Organize. Track. Manage.**

</div>

---

## 📌 About

**TaskFlow API** is a RESTful backend application built with **Node.js, Express, MongoDB, Mongoose, and JWT authentication**.

The platform provides authenticated users with a structured way to manage their projects and tasks through a collection of protected API endpoints.

TaskFlow demonstrates the core concepts involved in building a modern backend REST API:

* RESTful API architecture
* Express routing
* Controller-based application structure
* MongoDB database integration
* Mongoose schemas and models
* JWT authentication
* Password hashing
* Authentication middleware
* Centralized error handling
* Resource ownership
* CRUD operations
* Pagination
* Filtering
* Sorting
* Related MongoDB documents

The project is designed as a reusable backend API that can later be connected to a web, mobile, or desktop frontend.

---

## ✨ Features

* 👤 User registration and authentication
* 🔐 JWT-based authentication
* 🔑 Login and current-user endpoints
* 🔒 Protected API routes
* 🛡 Authentication middleware
* 📁 Project management
* ✅ Task management
* 🔗 Project-task relationships
* 🗃 MongoDB persistence
* 🧩 Mongoose schemas and models
* 🔒 bcrypt password hashing
* 👥 User ownership protection
* 📊 Pagination
* 🔎 Task filtering
* ↕️ Task sorting
* 🗑 Cascade deletion of project tasks
* ⚠️ Centralized error handling
* 📄 Validation handling
* 🌱 Environment-based configuration
* 📦 npm dependency management

---

## 🔐 Authentication

TaskFlow uses **JSON Web Tokens (JWT)** to protect resources that require an authenticated user.

```text
                 USER
                  │
                  ▼
          Register / Login
                  │
                  ▼
        Validate Credentials
                  │
          ┌───────┴───────┐
          │               │
       Register          Login
          │               │
          ▼               ▼
      Hash Password   Verify Password
          │               │
          └───────┬───────┘
                  ▼
             Generate JWT
                  │
                  ▼
            Return Token
                  │
                  ▼
       Authorization Header
                  │
                  ▼
         Authentication
           Middleware
                  │
                  ▼
        Protected Resource
```

### Authentication Endpoints

| Method | Endpoint             | Auth | Description            |
| ------ | -------------------- | ---- | ---------------------- |
| POST   | `/api/auth/register` | No   | Register a new user    |
| POST   | `/api/auth/login`    | No   | Authenticate user      |
| GET    | `/api/auth/me`       | Yes  | Get authenticated user |

Protected requests use:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 👤 User System

TaskFlow uses a Mongoose **User** model to manage authenticated accounts.

### User Model

```text
User
├── name
├── email
├── password
├── createdAt
└── updatedAt
```

The email field is unique.

Passwords are hashed using **bcryptjs** before being stored.

Authentication does not expose the user's original password.

---

## 📁 Project Management

Projects provide the main organizational layer for TaskFlow.

Each authenticated user can create and manage their own projects.

### Project Model

```text
Project
├── name
├── description
├── owner → User
├── createdAt
└── updatedAt
```

### Project CRUD

```text
CREATE
   ↓
POST /api/projects

READ
   ↓
GET /api/projects
GET /api/projects/:id

UPDATE
   ↓
PUT /api/projects/:id

DELETE
   ↓
DELETE /api/projects/:id
```

### Project Endpoints

| Method | Endpoint            | Auth | Description          |
| ------ | ------------------- | ---- | -------------------- |
| POST   | `/api/projects`     | Yes  | Create project       |
| GET    | `/api/projects`     | Yes  | List user's projects |
| GET    | `/api/projects/:id` | Yes  | Get a project        |
| PUT    | `/api/projects/:id` | Yes  | Update project       |
| DELETE | `/api/projects/:id` | Yes  | Delete project       |

When a project is deleted, its associated tasks are also deleted.

---

## ✅ Task Management

Tasks represent individual pieces of work inside a project.

### Task Model

```text
Task
├── title
├── description
├── status
├── priority
├── dueDate
├── project → Project
├── owner → User
├── createdAt
└── updatedAt
```

Tasks are connected to both:

```text
User
  ↓
Owner

Project
  ↓
Parent Project
```

### Task CRUD

```text
CREATE
   ↓
POST /api/tasks

READ
   ↓
GET /api/tasks
GET /api/tasks/:id

UPDATE
   ↓
PUT /api/tasks/:id

DELETE
   ↓
DELETE /api/tasks/:id
```

### Task Endpoints

| Method | Endpoint         | Auth | Description       |
| ------ | ---------------- | ---- | ----------------- |
| POST   | `/api/tasks`     | Yes  | Create task       |
| GET    | `/api/tasks`     | Yes  | List user's tasks |
| GET    | `/api/tasks/:id` | Yes  | Get a task        |
| PUT    | `/api/tasks/:id` | Yes  | Update task       |
| DELETE | `/api/tasks/:id` | Yes  | Delete task       |

---

## 🔗 Data Relationships

TaskFlow uses MongoDB references through Mongoose.

```text
                    USER
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
           PROJECT         TASK
              │             │
              │             │
              └──────┬──────┘
                     │
                     ▼
                   TASK
```

More specifically:

```text
User
 ├── owns → Projects
 └── owns → Tasks

Project
 └── contains → Tasks

Task
 ├── belongs to → User
 └── belongs to → Project
```

This relationship structure allows the API to enforce ownership while keeping projects and tasks connected.

---

## 🔎 Filtering & Querying

TaskFlow provides query parameters for retrieving tasks more efficiently.

### Filter by Project

```text
GET /api/tasks?project=<PROJECT_ID>
```

### Filter by Status

```text
GET /api/tasks?status=todo
```

### Filter by Priority

```text
GET /api/tasks?priority=high
```

### Sort Results

```text
GET /api/tasks?sort=-dueDate
```

### Pagination

```text
GET /api/tasks?page=1&limit=10
```

### Combined Query

```text
GET /api/tasks?project=<PROJECT_ID>&status=todo&priority=high&sort=-dueDate&page=1&limit=10
```

Projects also support pagination:

```text
GET /api/projects?page=1&limit=10
```

---

## 🛡 Ownership Protection

TaskFlow ensures that authenticated users only interact with resources belonging to them.

```text
                AUTHENTICATED USER
                       │
                       ▼
                 JWT Middleware
                       │
                       ▼
                   req.user
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
          Projects           Tasks
              │                 │
              └────────┬────────┘
                       ▼
                Ownership Check
                       │
                       ▼
                Database Query
```

Example:

```text
User A
 ├── Project A
 └── Task A

User B
 ├── Project B
 └── Task B
```

User A cannot access User B's resources simply by changing a resource ID.

---

## 🧩 Middleware Architecture

TaskFlow separates authentication and error handling from the controllers.

### Authentication Middleware

The `protect` middleware:

* Reads the Authorization header
* Extracts the Bearer token
* Verifies the JWT
* Finds the authenticated user
* Attaches the user to `req.user`
* Rejects unauthorized requests

Flow:

```text
HTTP Request
      ↓
Authorization Header
      ↓
Bearer Token
      ↓
JWT Verification
      ↓
User Lookup
      ↓
req.user
      ↓
Protected Controller
```

### Error Middleware

The centralized error middleware handles:

```text
Validation Errors
Invalid MongoDB IDs
Duplicate Email
Invalid JWT
Expired JWT
Invalid JSON
404 Routes
Application Errors
```

This keeps error responses consistent throughout the API.

---

## 🏗 Application Architecture

TaskFlow follows a layered backend structure.

```text
                         TASKFLOW API
                              │
                              ▼
                        Express Server
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
           Routes        Middleware       Configuration
              │               │
              │        ┌──────┴──────┐
              │        │             │
              │        ▼             ▼
              │     JWT Auth    Error Handler
              │
              ▼
         Controllers
              │
              ▼
           Models
              │
              ▼
          Mongoose
              │
              ▼
           MongoDB
```

---

## 🔄 Request Flow

A typical protected API request follows this flow:

```text
Client
   ↓
HTTP Request
   ↓
Express Router
   ↓
Authentication Middleware
   ↓
JWT Verification
   ↓
User Lookup
   ↓
Controller
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
Controller Response
   ↓
JSON Response
```

---

## 🧠 Core Systems

### Authentication Controller

Responsible for:

* User registration
* Password hashing
* Login
* Password verification
* JWT generation
* Current-user retrieval

### Project Controller

Responsible for:

* Creating projects
* Listing projects
* Retrieving projects
* Updating projects
* Deleting projects
* Project ownership
* Cascade task deletion

### Task Controller

Responsible for:

* Creating tasks
* Listing tasks
* Retrieving tasks
* Updating tasks
* Deleting tasks
* Filtering
* Sorting
* Pagination
* Ownership protection

### Authentication Middleware

Responsible for:

* JWT extraction
* JWT verification
* User lookup
* Request authentication

### Error Middleware

Responsible for:

* Centralized error handling
* Validation errors
* Database errors
* JWT errors
* 404 handling
* Consistent API responses

---

## 📂 Project Structure

```text
taskflow-api/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   └── task.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   └── task.routes.js
│   │
│   └── utils/
│       ├── AppError.js
│       ├── asyncHandler.js
│       └── token.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## 🛠 Tech Stack

| Technology | Usage                         |
| ---------- | ----------------------------- |
| Node.js    | JavaScript runtime            |
| Express    | REST API framework            |
| MongoDB    | Database                      |
| Mongoose   | ODM and data modeling         |
| JWT        | Authentication                |
| bcryptjs   | Password hashing              |
| dotenv     | Environment configuration     |
| cors       | Cross-origin request handling |
| Nodemon    | Development server            |
| Git        | Version control               |
| GitHub     | Repository hosting            |

---

## 🔒 Security Model

TaskFlow includes several backend security practices.

### Password Hashing

Passwords are hashed using bcryptjs before database storage.

```text
Plain Password
      ↓
bcryptjs
      ↓
Password Hash
      ↓
MongoDB
```

### JWT Protection

Protected endpoints require:

```text
Authorization: Bearer <JWT_TOKEN>
```

### Environment Variables

Sensitive values are stored through environment variables.

```text
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=7d
```

The `.env` file is excluded from Git through `.gitignore`.

### Resource Ownership

Database queries are scoped to the authenticated user where appropriate, preventing cross-user resource access.

---

## 📡 API Reference

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Abdul",
  "email": "abdul@example.com",
  "password": "secret123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "abdul@example.com",
  "password": "secret123"
}
```

#### Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Projects

#### Create

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Semester Labs",
  "description": "Backend development work"
}
```

#### List

```http
GET /api/projects?page=1&limit=10
Authorization: Bearer <token>
```

#### Get One

```http
GET /api/projects/<PROJECT_ID>
Authorization: Bearer <token>
```

#### Update

```http
PUT /api/projects/<PROJECT_ID>
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete

```http
DELETE /api/projects/<PROJECT_ID>
Authorization: Bearer <token>
```

---

### Tasks

#### Create

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "project": "<PROJECT_ID>",
  "title": "Finish Express assignment",
  "description": "Complete REST API work",
  "priority": "high",
  "dueDate": "2026-10-05"
}
```

#### List

```http
GET /api/tasks
Authorization: Bearer <token>
```

#### Filter

```http
GET /api/tasks?status=todo&priority=high
Authorization: Bearer <token>
```

#### Get One

```http
GET /api/tasks/<TASK_ID>
Authorization: Bearer <token>
```

#### Update

```http
PUT /api/tasks/<TASK_ID>
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete

```http
DELETE /api/tasks/<TASK_ID>
Authorization: Bearer <token>
```

---

## ⚠️ Error Handling

TaskFlow provides centralized JSON error responses.

Example:

```json
{
  "success": false,
  "message": "Task title is required"
}
```

### Common Status Codes

| Status | Meaning                            |
| ------ | ---------------------------------- |
| 400    | Validation error / invalid request |
| 401    | Authentication failure             |
| 404    | Resource or route not found        |
| 409    | Duplicate resource                 |

The error middleware also handles invalid MongoDB IDs, JWT errors, malformed JSON, and Mongoose validation errors.

---

## 🚀 Getting Started

TaskFlow is a **Node.js + Express application** backed by MongoDB.

### Requirements

```text
Node.js 18+
npm
MongoDB or MongoDB Atlas
Git
```

### 1. Clone the repository

```bash
git clone https://github.com/AbdulRehmanYasir/taskflow-api.git
cd taskflow-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure:

```text
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=7d
```

### 4. Start the development server

```bash
npm run dev
```

Or:

```bash
npm start
```

The API will run at:

```text
http://localhost:5000
```

> **Note:** The repository is configured to run with Node.js and npm. The Node.js runtime is required on the machine where the API is executed.

---

## 🧪 API Verification Flow

The intended API workflow is:

```text
Register User
      ↓
Login
      ↓
Receive JWT
      ↓
Create Project
      ↓
Create Task
      ↓
Read Project / Tasks
      ↓
Filter Tasks
      ↓
Sort Tasks
      ↓
Update Resources
      ↓
Delete Task
      ↓
Delete Project
      ↓
Cascade Delete Tasks
```

The project source is configured for Node.js execution. Runtime testing can be performed on any machine with Node.js, npm, and MongoDB available.

---

## 📋 Current Implementation Status

```text
Express REST API             ✅
Node.js Project              ✅
MongoDB Integration          ✅
Mongoose Models              ✅
User Model                   ✅
Project Model                ✅
Task Model                   ✅
User Registration            ✅
JWT Login                    ✅
JWT Current User             ✅
Project CRUD                 ✅
Task CRUD                    ✅
Authentication Middleware    ✅
Error Middleware             ✅
Ownership Protection         ✅
Pagination                   ✅
Filtering                    ✅
Sorting                      ✅
Cascade Deletion             ✅
Environment Configuration    ✅
GitHub Repository            ✅
Documentation                ✅
```

---

## 🎓 Assignment Alignment

TaskFlow was built to cover the main concepts required for a **Node.js, Express & MongoDB REST API** project.

| Requirement        | Implementation                 |
| ------------------ | ------------------------------ |
| Express REST API   | Express routes and controllers |
| CRUD REST API      | Projects + Tasks               |
| Mongoose           | User, Project and Task models  |
| MongoDB            | Mongoose database connection   |
| JWT Authentication | Register + Login + `/me`       |
| Auth Middleware    | `protect` middleware           |
| Error Middleware   | `notFound` + `errorHandler`    |
| Multiple Resources | Projects + Tasks               |
| GitHub Repository  | Public GitHub repository       |

---

## ⚠️ Limitations

TaskFlow is currently focused on the core backend REST API.

It does not currently include:

```text
Frontend Application
        ✕
Role-Based Access Control
        ✕
Email Verification
        ✕
Password Reset
        ✕
Refresh Token Rotation
        ✕
Real-Time Notifications
        ✕
Automated API Test Suite
        ✕
Production Deployment
        ✕
```

The project focuses specifically on Express, MongoDB/Mongoose, JWT authentication, CRUD operations, middleware, and backend architecture.

---

## 🎯 Project Goals

TaskFlow was built around a simple backend development workflow:

```text
User
 ↓
Authenticate
 ↓
Create Project
 ↓
Create Tasks
 ↓
Organize Work
 ↓
Update Progress
 ↓
Manage Resources
```

The goal is to demonstrate how a structured Node.js REST API can connect authentication, database models, relationships, middleware, and CRUD operations into one maintainable backend application.

---

## 📁 Repository

The complete source code is available on GitHub:

**https://github.com/AbdulRehmanYasir/taskflow-api**

---

## 👨‍💻 Author

<div align="center">

### Abdul Rehman Yasir

**BS Artificial Intelligence Student | Developer**

Building real-world software & AI projects.

[GitHub](https://github.com/AbdulRehmanYasir)

</div>

---

<div align="center">

### 🗂 TASKFLOW API

**Authenticate. Organize. Track. Manage.**

Built with Node.js + Express + MongoDB + Mongoose + JWT.

</div>
