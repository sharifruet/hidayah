#!/bin/bash

# Deployment script for Salat & Saom Timing API
# Usage: ./scripts/deploy.sh [environment]
# Example: ./scripts/deploy.sh production

set -e  # Exit on error

ENVIRONMENT=${1:-production}
ENV_FILE=".env.${ENVIRONMENT}"

echo "🚀 Starting deployment for ${ENVIRONMENT} environment..."

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: Environment file ${ENV_FILE} not found!"
    echo "   Please create it from .env.production.example"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

# Pull latest changes (if in git repo)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main || echo "⚠️  Warning: Could not pull latest changes"
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check backend health
echo "🏥 Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend health check failed!"
        docker-compose -f docker-compose.prod.yml logs backend
        exit 1
    fi
    sleep 2
done

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend npm run migrate || {
    echo "⚠️  Warning: Migration failed or already applied"
}

# Check frontend health
echo "🏥 Checking frontend health..."
for i in {1..30}; do
    if curl -f http://localhost:80/health > /dev/null 2>&1; then
        echo "✅ Frontend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Frontend health check failed!"
        docker-compose -f docker-compose.prod.yml logs frontend
        exit 1
    fi
    sleep 2
done

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🔗 Services:"
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:80"
echo ""
echo "📝 View logs: docker-compose -f docker-compose.prod.yml logs -f"
