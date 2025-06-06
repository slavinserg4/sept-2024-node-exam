# Medical Clinic Management System API

A system for managing medical clinics with functionality for managing doctors, services, and patient records.

## Tech Stack

- Node.js (v20)
- TypeScript
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Joi for validation
- Nodemailer for email sending
- Swagger for API documentation
- Docker & Docker Compose

## Prerequisites

Before running the project, make sure you have:

- Docker
- Docker Compose


### Types of BD
- A database dump in zip format is attached to GitHub, unzip it and use Docker according to the instructions below.
- There is a cloud database:
- mongodb+srv://user:user@node-exam-bd.9spjjgr.mongodb.net/nodejs-exam-db?retryWrites=true&w=majority&appName=node-exam-bd,
for it you need to remove env.db and in the file docker.compose delete db, and replace mongo_uri in env

## Installation and Running with Docker

1. Clone the repository:
```
bash
git clone <repository-url>
cd medical-clinic-api
```
2. Configure environment variables:

Create `.env` file in the project root:
```
PORT=your_port
MONGO_URI=your_MONGO_URI

JWT_ACCESS_SECRET=your_JWT_ACCESS_SECRET
JWT_REFRESH_SECRET=your_JWT_REFRESH_SECRET
JWT_ACCESS_LIFETIME="10 minutes"
JWT_REFRESH_LIFETIME="20 minutes"

JWT_RECOVERY_SECRET=your_JWT_RECOVERY_SECRET
JWT_RECOVERY_LIFETIME=10m

EMAIL_USER=your_EMAIL_USER
EMAIL_PASSWORD=your_EMAIL_PASSWORD
```
Create `.env.db` file for MongoDB:
```
env
MONGO_INITDB_DATABASE=nodejs-exam-db
MONGO_INITDB_ROOT_USERNAME=your_MONGO_INITDB_ROOT_USERNAME
MONGO_INITDB_ROOT_PASSWORD=_your_MONGO_INITDB_ROOT_PASSWORD
```
3. Run with Docker Compose:
```
bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```
The API will be available at `http://localhost:YOUR_PORT"`
MongoDB will be available at `localhost:YOUR_PORT`

## Development

For development with auto-reload:
```
# Local development (requires Node.js)
npm install
```
## API Endpoints

### Authentication
- `POST /auth/sign-up` - User registration
- `POST /auth/sign-in` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/recovery` - Password recovery request
- `POST /auth/recovery:token` - Password recovery

### Clinics
- `GET /clinics` - Get list of clinics (with pagination)
- `GET /clinics/:id` - Get specific clinic information
- `POST /clinics` - Create new clinic (admin only)
- `DELETE /clinics/:id` - Delete clinic (admin only)

### Doctors
- `GET /doctors` - Get list of doctors (with pagination)
- `GET /doctors/:id` - Get specific doctor information
- `POST /doctors` - Add new doctor (admin only)
- `PATCH /doctors/:id` - Update doctors services or clinics information (admin only)
- `POST /doctors/sign-in` - Doctor login
- `DELETE /doctors/:id` - Delete doctor (admin only)

### Services
- `GET /services` - Get list of services (with pagination)
- `GET /services/search` - Search services by name (with pagination)
- `GET /services/:id` - Get specific service information
- `POST /services` - Add new service (admin only)
- `DELETE /services/:id` - Delete service (admin only)

### Project Structure
```
.
├── backend/           # Application source code
├── mongo_db/          # MongoDB data (created by Docker)
├── .env               # Environment variables
├── .env.db            # MongoDB environment variables
├── docker-compose.yml # Docker Compose configuration
├── Dockerfile         # Docker configuration
├── mongo-init.js      # MongoDB configuration
└── README.md         # This file
```
### Available Docker Commands
```
bash
# Build and start
docker-compose up --build

# Start existing containers
docker-compose up

# Stop containers
docker-compose down

# View logs
docker-compose logs

# View running containers
docker-compose ps


```
## Validation

The project uses Joi for input validation. Main rules:
- Password: minimum 8 characters, including uppercase and lowercase letters, numbers, and special characters
- Email: standard email address validation
- Phone number: format +38 (0XX) XXX-XX-XX
- Names: first letter uppercase, rest lowercase, 2-10 characters

## Authentication

The system uses JWT tokens:
- Access Token: short-term (10 minutes)
- Refresh Token: long-term (20 minutes)
- Recovery Token: (10 minutes)

## User Roles

- `ADMIN`: Full access to all functionality
- `DOCTOR`: Access to personal account and schedule
- `USER`: Basic access to view information

## Features

- User and doctor authentication
- Clinic management
- Service management
- Doctor management
- Patient records
- Role-based access control
- Password recovery
- Email notifications (via Gmail)
- Input validation
- Token-based authentication
- Pagination for lists
- Sorting and filtering
- Error handling
- Data persistence with MongoDB
- TypeScript type safety
- API documentation with Swagger
- Docker containerization

## Project Structure
```

backend/
├── src/
│   ├── config/         # Configuration files
│   ├── constants/      # Constants and enums
│   ├── controllers/    # Request handlers
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Mongoose models
│   ├── repositories/   # Database operations
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── validators/     # Input validation schemas
├── Dockerfile
└── package.json

