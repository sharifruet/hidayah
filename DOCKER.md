# Docker Development Environment

Complete Docker setup for development with hot reload, MySQL database, and all services.

## Quick Start (Development)

```bash
# Copy environment file
cp .env.docker.example .env

# Start all services with hot reload
docker-compose up --build
```

The API will be available at: **http://localhost:3000**
The Frontend will be available at: **http://localhost:5173**

## Services

### MySQL Database
- **Container:** `ramadan_mysql`
- **Port:** 3306 (configurable)
- **Database:** `salat_saom_db`
- **Auto-initialization:** Schema is automatically loaded on first start
- **Persistent storage:** Data persists in `mysql_data` volume

### Backend API
- **Container:** `ramadan_backend`
- **Port:** 3000 (configurable)
- **Hot Reload:** ✅ Enabled (watches for file changes)
- **Auto-migration:** ✅ Runs migrations and seeds on startup
- **Volume Mounts:** Source code is mounted for live updates

### Frontend Application
- **Container:** `ramadan_frontend`
- **Port:** 5173 (configurable via `FRONTEND_PORT`)
- **Hot Reload:** ✅ Enabled (Vite dev server with HMR)
- **Volume Mounts:** Source code is mounted for live updates
- **Framework:** React 18+ with Vite

## Development Workflow

### First Time Setup

```bash
# 1. Copy environment file
cp .env.docker.example .env

# 2. Start all services
docker-compose up --build
```

This will:
- Build the backend and frontend containers
- Start MySQL database
- Run database migrations
- Seed initial data
- Start API server with hot reload
- Start frontend dev server with hot reload

### Making Code Changes

**Backend:**
1. **Edit files** in `backend/src/`
2. **Changes are automatically detected** (watch mode)
3. **Server restarts automatically**
4. **No need to rebuild containers**

**Frontend:**
1. **Edit files** in `frontend/src/`
2. **Changes are automatically detected** (Vite HMR)
3. **Browser updates automatically** (Hot Module Replacement)
4. **No need to rebuild containers**

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# MySQL only
docker-compose logs -f mysql
```

### Running Commands

```bash
# Run migrations manually
docker-compose exec backend npm run migrate

# Run seeds manually
docker-compose exec backend npm run seed

# Install new package
docker-compose exec backend npm install <package-name>

# Access backend container shell
docker-compose exec backend sh

# Access frontend container shell
docker-compose exec frontend sh

# Run tests
docker-compose exec backend npm test

# Lint code
docker-compose exec backend npm run lint

# Format code
docker-compose exec backend npm run format
```

### Database Access

```bash
# Access MySQL CLI
docker-compose exec mysql mysql -u app_user -papp_password salat_saom_db

# Or as root
docker-compose exec mysql mysql -u root -prootpassword

# Backup database
docker-compose exec mysql mysqldump -u app_user -papp_password salat_saom_db > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u app_user -papp_password salat_saom_db < backup.sql
```

## Common Commands

### Start Services

```bash
# Start in foreground (see logs)
docker-compose up

# Start in background (detached)
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Start specific service
docker-compose up backend
```

### Stop Services

```bash
# Stop services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v

# Stop and remove everything
docker-compose down -v --remove-orphans
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000
NODE_ENV=development
API_VERSION=v1

# Database
DB_HOST=mysql
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=salat_saom_db
DB_ROOT_PASSWORD=rootpassword

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Hot Reload Configuration

The development setup includes:
- **Volume mounts** for source code (`./backend/src`)
- **Watch mode** enabled (`npm run dev`)
- **Automatic restarts** on file changes
- **No container rebuild** needed for code changes

### What Triggers Reload

- Changes to files in `backend/src/`
- Changes to `backend/package.json` (requires restart)

### What Doesn't Trigger Reload

- Changes to `node_modules/` (requires rebuild)
- Changes to Dockerfile (requires rebuild)
- Changes to docker-compose.yml (requires restart)

## Troubleshooting

### Port Already in Use

If port 3000 or 3306 is already in use:

```bash
# Change in .env file
PORT=3001
DB_PORT=3307
```

### Database Connection Issues

```bash
# Check MySQL health
docker-compose ps

# Check MySQL logs
docker-compose logs mysql

# Verify database exists
docker-compose exec mysql mysql -u root -prootpassword -e "SHOW DATABASES;"
```

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Rebuild containers
docker-compose up --build --force-recreate

# Clean start (removes volumes)
docker-compose down -v
docker-compose up --build
```

### Migration Errors

```bash
# Ensure MySQL is healthy
docker-compose ps

# Run migrations manually
docker-compose exec backend npm run migrate

# Check database connection
docker-compose exec backend node -e "import('./src/config/database.js').then(() => console.log('Connected'))"
```

### Hot Reload Not Working

```bash
# Check volume mounts
docker-compose config

# Verify file changes are detected
docker-compose exec backend ls -la /app/src

# Restart backend service
docker-compose restart backend
```

### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER backend/

# Or run with sudo (not recommended)
sudo docker-compose up
```

## Shell Scripts

A few convenient shell scripts are provided for common operations that require container access:

```bash
./dev.sh              # Start development environment (docker-compose up --build)
./migrate.sh          # Run database migrations
./seed.sh             # Seed database
./shell.sh            # Access backend container shell
./shell-frontend.sh   # Access frontend container shell
./mysql.sh            # Access MySQL CLI (with credentials)
./mysql-root.sh       # Access MySQL CLI as root
./test.sh             # Run tests
./lint.sh             # Run ESLint
./lint-fix.sh         # Fix ESLint errors
./format.sh           # Format code
```

For basic docker-compose operations, use docker-compose directly:
```bash
docker-compose up -d          # Start in background
docker-compose down           # Stop services
docker-compose restart       # Restart services
docker-compose logs -f       # View logs
docker-compose logs -f backend   # View backend logs
docker-compose logs -f frontend  # View frontend logs
docker-compose logs -f mysql     # View MySQL logs
docker-compose down -v        # Stop and remove volumes
docker-compose build          # Rebuild containers
docker-compose ps             # Show running containers
```

## Volumes

- **mysql_data**: Persistent MySQL data storage
- **./backend/src**: Mounted source code for hot reload
- **./backend/package.json**: Mounted for dependency tracking
- **./frontend/src**: Mounted source code for hot reload
- **./frontend/public**: Mounted public assets
- **./frontend/package.json**: Mounted for dependency tracking
- **/app/node_modules**: Anonymous volumes (excludes host node_modules)

## Networks

All services run on the `ramadan_network` bridge network, allowing them to communicate using service names:
- Backend connects to MySQL using hostname: `mysql`
- Services can communicate internally without exposing ports

## File Structure

```
ramadan/
├── docker-compose.yml          # Docker compose (development with hot reload)
├── .env.docker.example         # Environment variables template
├── *.sh                        # Shell scripts for container operations
├── backend/
│   ├── Dockerfile              # Production Dockerfile
│   ├── Dockerfile.dev         # Development Dockerfile
│   └── .dockerignore           # Docker ignore rules
├── frontend/
│   ├── Dockerfile.dev         # Development Dockerfile
│   └── vite.config.js         # Vite configuration
└── .dockerignore               # Root docker ignore
```

## Next Steps

1. **Start development environment:**
   ```bash
   docker-compose up --build
   ```

2. **Verify API is running:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Make code changes** and see them reload automatically!

4. **Continue with Phase 1** of the implementation plan.
