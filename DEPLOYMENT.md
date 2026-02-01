# Deployment Guide

This guide covers deploying the Salat & Saom Timing API and Frontend to production.

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured (optional but recommended)
- SSL certificate (Let's Encrypt recommended)
- Production server with sufficient resources

## Production Environment Setup

### 1. Server Requirements

**Minimum Requirements:**
- 2 CPU cores
- 4GB RAM
- 20GB storage
- Ubuntu 20.04+ or similar Linux distribution

**Recommended:**
- 4 CPU cores
- 8GB RAM
- 50GB SSD storage
- Ubuntu 22.04 LTS

### 2. Environment Variables

Copy the production environment template:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` with your production values:

```bash
# Database
DB_ROOT_PASSWORD=your_secure_password
DB_NAME=salat_saom_db
DB_USER=app_user
DB_PASSWORD=your_secure_password

# Application
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

**Security Notes:**
- Use strong, unique passwords
- Never commit `.env.production` to version control
- Rotate passwords regularly
- Use environment-specific secrets

### 3. SSL Certificate Setup

**Using Let's Encrypt (Recommended):**

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
```

**Using Nginx with SSL:**

Create `/etc/nginx/sites-available/ramadan`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Deployment Steps

### Option 1: Docker Compose (Recommended)

1. **Clone repository:**
```bash
git clone <repository-url>
cd ramadan
```

2. **Set up environment:**
```bash
cp .env.production.example .env.production
# Edit .env.production with your values
```

3. **Build and start services:**
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

4. **Run migrations:**
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

5. **Seed database:**
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

6. **Verify deployment:**
```bash
# Check backend health
curl http://localhost:3000/health

# Check frontend
curl http://localhost:80/health
```

### Option 2: Manual Deployment

#### Backend Deployment

1. **Build production image:**
```bash
cd backend
docker build -t ramadan-backend:latest .
```

2. **Run container:**
```bash
docker run -d \
  --name ramadan_backend \
  --env-file ../.env.production \
  -p 3000:3000 \
  --network ramadan_network \
  ramadan-backend:latest
```

3. **Run migrations:**
```bash
docker exec ramadan_backend npm run migrate
docker exec ramadan_backend npm run seed
```

#### Frontend Deployment

1. **Build production image:**
```bash
cd frontend
docker build --build-arg VITE_API_URL=https://api.yourdomain.com -t ramadan-frontend:latest .
```

2. **Run container:**
```bash
docker run -d \
  --name ramadan_frontend \
  -p 80:80 \
  --network ramadan_network \
  ramadan-frontend:latest
```

## Database Setup

### Initial Migration

```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Or manually
docker exec ramadan_backend npm run migrate
```

### Seeding Data

```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml exec backend npm run seed

# Or manually
docker exec ramadan_backend npm run seed
```

### Database Backups

**Create backup script (`backup-db.sh`):**

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="salat_saom_db"

docker exec ramadan_mysql_prod mysqldump -u root -p${DB_ROOT_PASSWORD} ${DB_NAME} > ${BACKUP_DIR}/backup_${DATE}.sql

# Keep only last 7 days
find ${BACKUP_DIR} -name "backup_*.sql" -mtime +7 -delete
```

**Schedule backups (crontab):**
```bash
0 2 * * * /path/to/backup-db.sh
```

## Monitoring

### Health Checks

**Backend:**
```bash
curl http://localhost:3000/health
```

**Frontend:**
```bash
curl http://localhost:80/health
```

### Logs

**View logs:**
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

**Log rotation is configured in docker-compose.prod.yml:**
- Max size: 10MB per file
- Max files: 3 (30MB total per service)

## Security Hardening

### 1. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Docker Security

- Containers run as non-root users
- Security options enabled (`no-new-privileges`)
- Network isolation configured

### 3. Rate Limiting

Configured in backend:
- Default: 100 requests per 15 minutes per IP
- Adjustable via environment variables

### 4. Security Headers

Frontend includes security headers:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## Updates and Maintenance

### Updating Application

1. **Pull latest changes:**
```bash
git pull origin main
```

2. **Rebuild and restart:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

3. **Run migrations (if any):**
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

### Rolling Back

1. **Stop current containers:**
```bash
docker-compose -f docker-compose.prod.yml down
```

2. **Checkout previous version:**
```bash
git checkout <previous-commit>
```

3. **Rebuild and start:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Troubleshooting

### Backend not starting

1. Check logs:
```bash
docker-compose -f docker-compose.prod.yml logs backend
```

2. Verify database connection:
```bash
docker-compose -f docker-compose.prod.yml exec backend node -e "require('./src/config/database.js').checkDatabaseHealth()"
```

3. Check environment variables:
```bash
docker-compose -f docker-compose.prod.yml exec backend env | grep DB_
```

### Frontend not loading

1. Check logs:
```bash
docker-compose -f docker-compose.prod.yml logs frontend
```

2. Verify API URL:
```bash
docker-compose -f docker-compose.prod.yml exec frontend env | grep VITE_API_URL
```

3. Check nginx configuration:
```bash
docker-compose -f docker-compose.prod.yml exec frontend nginx -t
```

### Database connection issues

1. Verify MySQL is running:
```bash
docker-compose -f docker-compose.prod.yml ps mysql
```

2. Test connection:
```bash
docker-compose -f docker-compose.prod.yml exec mysql mysql -u root -p${DB_ROOT_PASSWORD} -e "SELECT 1"
```

3. Check network:
```bash
docker network inspect ramadan_ramadan_network_prod
```

## Performance Optimization

### Database Optimization

1. **Index optimization:**
   - Indexes are already configured in schema
   - Monitor query performance

2. **Connection pooling:**
   - Configured in `backend/src/config/database.js`
   - Default: 10 connections

### Caching

- Database caching is implemented
- Cache TTL: 24 hours for prayer/fasting times
- Cache invalidation on method changes

## Scaling

### Horizontal Scaling

1. **Load Balancer:**
   - Use Nginx or cloud load balancer
   - Configure multiple backend instances

2. **Database Replication:**
   - Set up MySQL read replicas
   - Configure read/write splitting

### Vertical Scaling

- Increase container resources
- Optimize database queries
- Add more caching layers

## Support

For issues or questions:
- Check logs first
- Review documentation
- Check GitHub issues

## Production Checklist

Before going live:

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations run
- [ ] Database seeded
- [ ] Health checks passing
- [ ] Logs configured
- [ ] Backups scheduled
- [ ] Monitoring set up
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Firewall configured
- [ ] Domain DNS configured
- [ ] Documentation reviewed
