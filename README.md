# TaskFlow API

REST API built with **Express**, **MongoDB/Mongoose** and **JWT authentication**.
Two protected resources — **Projects** and **Tasks** — each scoped to the logged-in user.

## Features
- CRUD for Projects and Tasks (Express routers + controllers)
- Mongoose schemas/models with validation, enums, refs and timestamps
- JWT auth: register, login, `/me` (passwords hashed with bcrypt)
- Middleware: `protect` (auth) and centralised `errorHandler` / `notFound`
- Ownership checks (users only see and modify their own data)
- Pagination, filtering and sorting on list endpoints
- Deleting a project cascades to its tasks

## Setup
```bash
git clone <your-repo-url> && cd taskflow-api
npm install
cp .env.example .env      # then edit JWT_SECRET / MONGO_URI
npm run dev               # or: npm start
```
Requires Node 18+ and a running MongoDB (local or Atlas connection string).

## Project structure
```
server.js                 entry point (env, DB connect, listen)
src/
  app.js                  express app, routes, middleware wiring
  config/db.js            mongoose connection
  models/                 User, Project, Task
  controllers/            auth, project, task logic
  routes/                 route definitions
  middleware/             auth.js (JWT), error.js (error handling)
  utils/                  AppError, asyncHandler, token helper
```

## Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Create account, returns token |
| POST | `/api/auth/login` | No | Login, returns token |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/projects` | Yes | Create project |
| GET | `/api/projects?page=&limit=` | Yes | List own projects |
| GET | `/api/projects/:id` | Yes | Get one project |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project + its tasks |
| POST | `/api/tasks` | Yes | Create task (needs `project` id) |
| GET | `/api/tasks?project=&status=&priority=&sort=&page=&limit=` | Yes | List own tasks |
| GET | `/api/tasks/:id` | Yes | Get one task |
| PUT | `/api/tasks/:id` | Yes | Update task |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

Send the token as `Authorization: Bearer <token>`.

## Example requests
```bash
# Register
curl -X POST localhost:5000/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Abdul","email":"abdul@example.com","password":"secret123"}'

# Login
curl -X POST localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"abdul@example.com","password":"secret123"}'

# Create project
curl -X POST localhost:5000/api/projects -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" -d '{"name":"Semester Labs","description":"All lab work"}'

# Create task
curl -X POST localhost:5000/api/tasks -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"project":"<PROJECT_ID>","title":"Finish Express lab","priority":"high","dueDate":"2026-10-05"}'

# Filter tasks
curl "localhost:5000/api/tasks?status=todo&priority=high&sort=-dueDate" -H "Authorization: Bearer $TOKEN"
```

## Error format
```json
{ "success": false, "message": "Task title is required" }
```
Status codes: `400` validation/bad id, `401` auth, `404` not found, `409` duplicate email.

## Environment variables
| Name | Description |
|------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
