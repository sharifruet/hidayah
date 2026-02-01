# Setup Instructions

## Quick Start with Docker (Recommended)

1. **Create `.env` file** (optional - defaults are provided)
   ```bash
   # Copy the example if you want to customize
   # cp .env.example .env
   ```
   
   Default environment variables (can be overridden in `.env`):
   ```env
   PORT=3000
   DB_HOST=mysql
   DB_PORT=3306
   DB_USER=app_user
   DB_PASSWORD=app_password
   DB_NAME=salat_saom_db
   DB_ROOT_PASSWORD=rootpassword
   ```

2. **Start the development environment**
   ```bash
   docker-compose up --build
   ```
   
   This will:
   - Build the Node.js API container
   - Start MySQL database
   - Run database migrations
   - Seed initial data
   - Start the API server in watch mode

3. **Access the services**
   - API: http://localhost:3000
   - MySQL: localhost:3306

**Useful Docker commands:**
```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Rebuild containers
docker-compose up --build

# Run migrations manually
docker-compose exec api npm run migrate

# Run seeds manually
docker-compose exec api npm run seed
```

## Local Development (Without Docker)

1. **Install Node.js dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=salat_saom_db
   PORT=3000
   ```

3. **Create MySQL database and tables**
   ```bash
   npm run migrate
   ```

4. **Seed initial data**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## Testing the API

Once the server is running, test the endpoints:

**Get Prayer Times:**
```bash
curl "http://localhost:3000/v1/prayer-times?latitude=23.8103&longitude=90.4125&date=2024-03-15&method=hanafi"
```

**Get Fasting Times:**
```bash
curl "http://localhost:3000/v1/fasting-times?latitude=23.8103&longitude=90.4125&date=2024-03-15&method=hanafi&sehri_margin=10"
```

**Health Check:**
```bash
curl "http://localhost:3000/health"
```

## MySQL Setup

If you don't have MySQL installed:

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows:**
Download and install from https://dev.mysql.com/downloads/mysql/

## Troubleshooting

**Database connection error:**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Ensure database user has proper permissions

**Port already in use:**
- Change `PORT` in `.env` to a different port (e.g., 3001)

**Migration errors:**
- Ensure MySQL user has CREATE DATABASE permission
- Check if database already exists and drop it if needed

## Next Steps

- Review the technical document: `TECHNICAL_DOCUMENT.md`
- Check API documentation in `README.md`
- Customize calculation methods if needed
- Add more locations to the database
