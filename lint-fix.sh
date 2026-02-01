#!/bin/bash
# Fix ESLint errors

docker-compose exec backend npm run lint:fix
