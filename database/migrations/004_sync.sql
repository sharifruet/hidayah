-- Optional cloud sync (sync-code accounts). The API also creates these tables on first use,
-- so running this by hand is optional:
--   mysql -u <user> -p salat_saom_db < database/migrations/004_sync.sql

CREATE TABLE IF NOT EXISTS sync_accounts (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  code_hash    CHAR(64) NOT NULL UNIQUE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sync_documents (
  account_id  BIGINT NOT NULL,
  doc_key     VARCHAR(40) NOT NULL,
  data        MEDIUMTEXT NOT NULL,
  version     INT UNSIGNED NOT NULL DEFAULT 1,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id, doc_key),
  CONSTRAINT fk_sync_documents_account FOREIGN KEY (account_id)
    REFERENCES sync_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
