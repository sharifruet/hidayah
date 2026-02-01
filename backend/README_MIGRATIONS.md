# Database Migrations Guide

This document explains how to use the database migration system with rollback and status tracking.

## Overview

The migration system tracks all database schema changes, allowing you to:
- Track which migrations have been run
- View migration history and status
- Rollback migrations (mark as rolled back)
- Monitor migration execution times

## Commands

### Run Migrations

```bash
npm run migrate
```

This will:
- Create the `migrations` tracking table if it doesn't exist
- Check if `schema.sql` has already been run
- Execute all SQL statements in `schema.sql`
- Record the migration with status, batch number, and execution time

### Check Migration Status

```bash
npm run migrate:status
```

This displays a table showing:
- Batch number
- Migration name
- Status (pending, running, completed, failed, rolled_back)
- Execution timestamp
- Execution time in milliseconds

Example output:
```
📋 Migration Status:

Batch | Migration Name      | Status      | Executed At          | Time (ms)
------|---------------------|-------------|----------------------|-----------
1     | schema.sql          | completed   | 2024-01-15 10:30:00  | 1250
```

### Rollback Migrations

#### Rollback Last Batch

```bash
npm run migrate:rollback
```

This marks all migrations in the last completed batch as `rolled_back`.

**Note**: This does not automatically reverse SQL changes. It only marks the migration as rolled back in the tracking table. For a proper rollback system, you would need separate up/down migration scripts.

#### Rollback to Specific Batch

```bash
node src/database/migrate.js rollback <batch_number>
```

Example:
```bash
node src/database/migrate.js rollback 3
```

This marks all migrations after batch 3 as `rolled_back`.

## Migration Tracking Table

The system automatically creates a `migrations` table with the following structure:

```sql
CREATE TABLE migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  migration_name VARCHAR(255) UNIQUE NOT NULL,
  batch_number INT NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  execution_time_ms INT,
  status ENUM('pending', 'running', 'completed', 'failed', 'rolled_back') DEFAULT 'pending',
  error_message TEXT,
  INDEX idx_batch (batch_number),
  INDEX idx_status (status),
  INDEX idx_executed_at (executed_at)
);
```

## Migration Statuses

- **pending**: Migration has been recorded but not yet executed
- **running**: Migration is currently being executed
- **completed**: Migration completed successfully
- **failed**: Migration failed with an error
- **rolled_back**: Migration has been rolled back (marked, not reversed)

## Batch Numbers

Each migration run gets a batch number. This allows you to:
- Group related migrations together
- Rollback entire batches at once
- Track the order of migrations

## Limitations

### Current Implementation

The current migration system:
- ✅ Tracks migration execution
- ✅ Records execution times
- ✅ Supports status checking
- ✅ Supports rollback marking
- ❌ Does NOT automatically reverse SQL changes
- ❌ Does NOT support individual migration files (uses single schema.sql)

### Future Enhancements

For a production-ready migration system, consider:
1. **Separate Migration Files**: One file per migration (e.g., `001_create_users.sql`, `002_add_indexes.sql`)
2. **Up/Down Scripts**: Each migration has both an "up" and "down" script
3. **Automatic Rollback**: Execute down scripts when rolling back
4. **Migration Versioning**: Track schema versions

## Example Workflow

```bash
# 1. Run migrations
npm run migrate

# 2. Check status
npm run migrate:status

# 3. If needed, rollback last batch
npm run migrate:rollback

# 4. Check status again
npm run migrate:status
```

## Integration with Docker

When using Docker, migrations run automatically on container startup:

```bash
docker-compose up --build
```

To run migrations manually in Docker:

```bash
docker-compose exec backend npm run migrate
docker-compose exec backend npm run migrate:status
docker-compose exec backend npm run migrate:rollback
```

## Troubleshooting

### Migration Already Completed

If you see "Migration already completed", the system detected that `schema.sql` was already run. To re-run:
1. Manually update the migration status in the database
2. Or rollback the migration first

### Migration Failed

If a migration fails:
1. Check the error message in the output
2. Check the `migrations` table for the error message
3. Fix the issue in `schema.sql`
4. Re-run the migration (it will update the existing record)

### Rollback Doesn't Reverse Changes

Remember: Rollback only marks migrations as rolled_back. It does NOT reverse SQL changes. You must manually reverse changes if needed.
