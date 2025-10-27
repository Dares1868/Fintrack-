# Fintrack Docker Setup

This repository contains a complete Docker Compose setup for the Fintrack application, including:

- **Frontend**: React application with Vite (runs on port 3000)
- **Backend**: Node.js/Express API server (runs on port 3001)
- **Database**: MySQL 8.0 (runs on port 3307)

## Prerequisites

- Docker Desktop installed and running
- Git (to clone the repository)

## Quick Start

1. **Clone and navigate to the project:**

   ```bash
   cd frontend
   ```

2. **Start all services:**

   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MySQL Database: localhost:3307

## Available Commands

### Start all services (with build)

```bash
docker-compose up --build
```

### Start all services (detached mode)

```bash
docker-compose up -d
```

### Stop all services

```bash
docker-compose down
```

### View logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs fintrack-backend
docker-compose logs fintrack-frontend
docker-compose logs fintrack-mysql
```

### Restart a specific service

```bash
docker-compose restart fintrack-backend
```

## Database Access

### Connect to MySQL

```bash
# From host machine
mysql -h 127.0.0.1 -P 3307 -u fintrack_user -p
# Password: userpassword

# From inside Docker container
docker exec -it fintrack-mysql mysql -u fintrack_user -p
```

### Database Credentials

- **Database Name**: fintrack_db
- **Username**: fintrack_user
- **Password**: userpassword
- **Root Password**: rootpassword

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Health Check

- `GET /health` - Backend health status

## Development

### Frontend Development

The frontend runs with hot reload enabled. Any changes to files in the `src/` directory will automatically refresh the browser.

### Backend Development

The backend runs with nodemon for automatic restart on file changes. Logs are visible in the Docker Compose output.

### Database Schema

The database is automatically initialized with the following tables:

- `users` - User accounts and authentication
- `categories` - Expense categories
- `transactions` - Financial transactions
- `goals` - Savings goals

## Environment Variables

### Backend (.env)

```env
DB_HOST=fintrack-mysql
DB_PORT=3306
DB_NAME=fintrack_db
DB_USER=fintrack_user
DB_PASSWORD=userpassword
PORT=3001
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-super-secret-session-key
```

### Frontend

```env
VITE_API_URL=http://localhost:3001
```

## Troubleshooting

### Services won't start

```bash
# Check Docker is running
docker --version

# Clean up and rebuild
docker-compose down --volumes --rmi all
docker-compose up --build
```

### Database connection issues

```bash
# Check MySQL container logs
docker-compose logs fintrack-mysql

# Wait for MySQL to be ready (might take 30-60 seconds on first start)
```

### Port conflicts

If ports 3000, 3001, or 3307 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:3001" # Change first number to available port
```

### Clear all data

```bash
# Warning: This will delete all database data
docker-compose down --volumes
docker-compose up --build
```

## Production Deployment

For production deployment:

1. Update environment variables in docker-compose.yml
2. Change SESSION_SECRET to a secure random string
3. Set NODE_ENV=production
4. Configure proper SSL/TLS
5. Use a production database setup
6. Enable proper logging and monitoring

## File Structure

```
frontend/
├── docker-compose.yml          # Main orchestration file
├── Dockerfile.frontend         # Frontend container definition
├── backend/
│   ├── Dockerfile             # Backend container definition
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Backend environment variables
│   ├── src/                   # Backend source code
│   └── database/
│       └── init.sql           # Database initialization
└── src/                       # Frontend source code
```
