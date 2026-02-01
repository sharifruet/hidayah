import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Migration tracking functions
async function ensureMigrationsTable(connection) {
  const migrationsTableSQL = `
    CREATE TABLE IF NOT EXISTS migrations (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await connection.query(migrationsTableSQL);
}

async function getCurrentBatchNumber(connection) {
  const [rows] = await connection.query(
    'SELECT MAX(batch_number) as max_batch FROM migrations'
  );
  return (rows[0]?.max_batch || 0) + 1;
}

async function recordMigration(connection, migrationName, batchNumber, status, executionTime, errorMessage = null) {
  await connection.query(
    `INSERT INTO migrations (migration_name, batch_number, status, execution_time_ms, error_message)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     status = VALUES(status),
     execution_time_ms = VALUES(execution_time_ms),
     error_message = VALUES(error_message),
     executed_at = CURRENT_TIMESTAMP`,
    [migrationName, batchNumber, status, executionTime, errorMessage]
  );
}

async function getMigrationStatus(connection, migrationName) {
  const [rows] = await connection.query(
    'SELECT * FROM migrations WHERE migration_name = ? ORDER BY executed_at DESC LIMIT 1',
    [migrationName]
  );
  return rows[0] || null;
}

async function listMigrations(connection) {
  const [rows] = await connection.query(
    'SELECT * FROM migrations ORDER BY batch_number DESC, executed_at DESC'
  );
  return rows;
}

// Rollback functions
async function rollbackLastBatch(connection) {
  // Get the last batch number
  const [batchRows] = await connection.query(
    'SELECT MAX(batch_number) as max_batch FROM migrations WHERE status = ?',
    ['completed']
  );

  const lastBatch = batchRows[0]?.max_batch;
  if (!lastBatch) {
    console.log('❌ No completed migrations to rollback');
    return false;
  }

  // Get all migrations in the last batch
  const [migrations] = await connection.query(
    'SELECT * FROM migrations WHERE batch_number = ? AND status = ? ORDER BY id DESC',
    [lastBatch, 'completed']
  );

  if (migrations.length === 0) {
    console.log('❌ No migrations found in the last batch');
    return false;
  }

  console.log(`\n🔄 Rolling back batch ${lastBatch} (${migrations.length} migration(s))...`);

  // Note: For schema.sql, we can't automatically rollback
  // This is a limitation of the current approach
  // In a proper migration system, each migration would have an up/down script
  console.log('⚠️  Note: Automatic rollback for schema.sql is not supported.');
  console.log('   Manual rollback required. Marking migrations as rolled_back...');

  for (const migration of migrations) {
    await connection.query(
      'UPDATE migrations SET status = ? WHERE id = ?',
      ['rolled_back', migration.id]
    );
    console.log(`   ✅ Marked ${migration.migration_name} as rolled_back`);
  }

  return true;
}

async function rollbackToBatch(connection, targetBatch) {
  const [migrations] = await connection.query(
    'SELECT * FROM migrations WHERE batch_number > ? AND status = ? ORDER BY batch_number DESC, id DESC',
    [targetBatch, 'completed']
  );

  if (migrations.length === 0) {
    console.log(`❌ No migrations found after batch ${targetBatch}`);
    return false;
  }

  console.log(`\n🔄 Rolling back to batch ${targetBatch} (${migrations.length} migration(s))...`);

  for (const migration of migrations) {
    await connection.query(
      'UPDATE migrations SET status = ? WHERE id = ?',
      ['rolled_back', migration.id]
    );
    console.log(`   ✅ Marked ${migration.migration_name} as rolled_back`);
  }

  return true;
}

// Main migration function
async function migrate() {
  let connection;
  let startTime;
  let migrationName;
  let batchNumber;

  try {
    console.log('🔄 Running database migrations...');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    migrationName = 'schema.sql';

    // Get connection
    connection = await pool.getConnection();

    // Ensure migrations table exists
    await ensureMigrationsTable(connection);

    // Check if this migration has already been run
    const existingMigration = await getMigrationStatus(connection, migrationName);
    if (existingMigration && existingMigration.status === 'completed') {
      console.log(`⏭️  Migration ${migrationName} already completed`);
      console.log(`   Last run: ${existingMigration.executed_at}`);
      connection.release();
      process.exit(0);
    }

    // Get batch number
    batchNumber = await getCurrentBatchNumber(connection);

    // Record migration start
    startTime = Date.now();
    await recordMigration(connection, migrationName, batchNumber, 'running', null);

    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        return stmt.length > 0 &&
               !stmt.startsWith('--') &&
               !stmt.startsWith('/*') &&
               stmt !== 'USE salat_saom_db';
      });

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
          const preview = statement.substring(0, 60).replace(/\s+/g, ' ');
          console.log(`✅ Executed: ${preview}...`);
          successCount++;
        } catch (error) {
          // Ignore "table already exists" and "database already exists" errors
          if (error.message.includes('already exists') ||
              error.code === 'ER_DB_CREATE_EXISTS' ||
              error.code === 'ER_TABLE_EXISTS_ERROR') {
            const preview = statement.substring(0, 60).replace(/\s+/g, ' ');
            console.log(`⏭️  Skipped (already exists): ${preview}...`);
            skipCount++;
          } else {
            const executionTime = Date.now() - startTime;
            await recordMigration(connection, migrationName, batchNumber, 'failed', executionTime, error.message);
            throw error;
          }
        }
      }
    }

    // Record migration completion
    const executionTime = Date.now() - startTime;
    await recordMigration(connection, migrationName, batchNumber, 'completed', executionTime);

    connection.release();
    console.log(`\n✅ Migration completed successfully`);
    console.log(`   - Executed: ${successCount} statements`);
    console.log(`   - Skipped: ${skipCount} statements (already exist)`);
    console.log(`   - Batch: ${batchNumber}`);
    console.log(`   - Execution time: ${executionTime}ms`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    if (connection && migrationName && batchNumber) {
      try {
        const executionTime = startTime ? Date.now() - startTime : null;
        await recordMigration(connection, migrationName, batchNumber, 'failed', executionTime, error.message);
      } catch (e) {
        // Ignore errors when recording failure
        console.error('Failed to record migration failure:', e.message);
      }
      connection.release();
    } else if (connection) {
      connection.release();
    }
    process.exit(1);
  }
}

// Status command
async function status() {
  let connection;
  try {
    connection = await pool.getConnection();
    await ensureMigrationsTable(connection);

    const migrations = await listMigrations(connection);

    if (migrations.length === 0) {
      console.log('📋 No migrations recorded');
      connection.release();
      process.exit(0);
    }

    console.log('\n📋 Migration Status:\n');
    console.log('Batch | Migration Name      | Status      | Executed At          | Time (ms)');
    console.log('------|---------------------|-------------|----------------------|-----------');

    for (const migration of migrations) {
      const batch = String(migration.batch_number).padEnd(5);
      const name = (migration.migration_name || '').substring(0, 19).padEnd(19);
      const status = String(migration.status || '').padEnd(11);
      const executed = migration.executed_at ? new Date(migration.executed_at).toISOString().substring(0, 19).replace('T', ' ') : 'N/A'.padEnd(19);
      const time = migration.execution_time_ms ? String(migration.execution_time_ms).padEnd(9) : 'N/A'.padEnd(9);

      console.log(`${batch} | ${name} | ${status} | ${executed} | ${time}`);
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to get migration status:', error.message);
    if (connection) connection.release();
    process.exit(1);
  }
}

// Parse command line arguments
const command = process.argv[2] || 'migrate';
const args = process.argv.slice(3);

if (command === 'status') {
  status();
} else if (command === 'rollback') {
  (async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      await ensureMigrationsTable(connection);

      if (args[0] && !isNaN(args[0])) {
        // Rollback to specific batch
        const targetBatch = parseInt(args[0]);
        await rollbackToBatch(connection, targetBatch);
      } else {
        // Rollback last batch
        await rollbackLastBatch(connection);
      }

      connection.release();
      process.exit(0);
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      if (connection) connection.release();
      process.exit(1);
    }
  })();
} else {
  migrate();
}
