#!/bin/bash
# Run database migrations

docker-compose exec backend npm run migrate
