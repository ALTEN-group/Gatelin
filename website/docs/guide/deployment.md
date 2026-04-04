# Docker Compose Deployment

## Quick Start

```bash
# 1. Create deployment directory
mkdir gatelin-prod && cd gatelin-prod

# 2. Create docker-compose.yml
nano docker-compose.yml

# 3. Create environment file
nano .env

# 4. Start services
docker-compose up -d

# 5. Check service health
docker-compose ps
```

## Environment File (.env)

```env
# Database
DB_PASSWORD=strong_database_password_here
LIQUIBASE_PASSWORD=strong_liquibase_password_here

# JWT & Security
TOKEN_SECRET=your_jwt_secret_min_32_characters_long_random_string
PWD_SECRET=your_password_hash_secret_min_32_chars

# Microservices URLs
MSAUTH_URL=https://auth.yourdomain.com
MSUSER_URL=https://users.yourdomain.com
MSROLE_URL=https://roles.yourdomain.com

# SSL Certificate (Let's Encrypt)
ACME_EMAIL=admin@yourdomain.com
```

## Useful Commands

```bash
# View logs
docker-compose logs -f gatelin

# Check status
docker-compose ps

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v

# Scale gateway instances
docker-compose up -d --scale gatelin=3

# Update a specific service
docker-compose pull gatelin && docker-compose up -d gatelin

# Database backup
docker exec gatelin-postgres pg_dump -U gatelin_user gatelin > backup_$(date +%Y%m%d).sql

# Database restore
docker exec -i gatelin-postgres psql -U gatelin_user gatelin < backup.sql
```

## Health Checks

```bash
# API Gateway
curl https://yourdomain.com/api/gateway/health

# Admin panel
curl https://yourdomain.com/admin

# Database
docker exec gatelin-postgres pg_isready -U gatelin_user
```
