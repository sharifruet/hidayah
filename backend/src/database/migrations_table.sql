-- Migration tracking table
-- This table tracks which migrations have been run
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
