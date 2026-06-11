ALTER TABLE merchant_application
    ADD COLUMN IF NOT EXISTS document_type VARCHAR(30) NOT NULL DEFAULT 'id_card',
    ADD COLUMN IF NOT EXISTS reviewed_by BIGINT,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS user_id BIGINT,
    ADD COLUMN IF NOT EXISTS merchant_id BIGINT;

CREATE INDEX IF NOT EXISTS idx_merchant_application_merchant ON merchant_application(merchant_id);
