-- One-time migration: consolidate gala_transactions + donations' inline
-- payment columns into a single generic `transactions` table.
--
-- Run ONCE against a database that still has the OLD schema (gala_transactions
-- table + donations.gateway/payment_id/order_id/status columns). A fresh
-- database created from the current schema.sql does not need this.
--
-- Usage: mysql -u <user> -p <database> < migrations/001_unify_transactions.sql

CREATE TABLE IF NOT EXISTS transactions (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    source_type         ENUM('gala_booking','donation') NOT NULL,
    source_id           BIGINT UNSIGNED NOT NULL,
    type                ENUM('payment','refund','dispute') NOT NULL DEFAULT 'payment',
    status              ENUM('initiated','succeeded','failed','cancelled','pending') NOT NULL DEFAULT 'initiated',
    amount              DECIMAL(12,2)   NOT NULL,
    currency            CHAR(3)         NOT NULL DEFAULT 'USD',
    gateway             VARCHAR(20)     NOT NULL,
    gateway_order_id    VARCHAR(255)    NULL,
    gateway_payment_id  VARCHAR(255)    NULL,
    gateway_event_id    VARCHAR(255)    NULL,
    charge_id           VARCHAR(255)    NULL,
    refund_id           VARCHAR(255)    NULL,
    payment_method      VARCHAR(30)     NULL,
    card_brand          VARCHAR(20)     NULL,
    card_last4          CHAR(4)         NULL,
    receipt_url         VARCHAR(500)    NULL,
    failure_code        VARCHAR(100)    NULL,
    failure_message     VARCHAR(500)    NULL,
    gateway_response    JSON            NULL,
    processed_at        TIMESTAMP       NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_tx_event (gateway_event_id),
    KEY idx_tx_source (source_type, source_id),
    KEY idx_tx_payment_id (gateway_payment_id),
    KEY idx_tx_order_id (gateway_order_id),
    KEY idx_tx_status (type, status),
    CONSTRAINT chk_tx_amount CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backfill existing gala booking payment/refund history.
INSERT INTO transactions
  (source_type, source_id, type, status, amount, currency, gateway,
   gateway_order_id, gateway_payment_id, gateway_event_id, charge_id, refund_id,
   payment_method, card_brand, card_last4, receipt_url, failure_code, failure_message,
   gateway_response, processed_at, created_at, updated_at)
SELECT
  'gala_booking', booking_id, type, status, amount, currency, gateway,
  stripe_session_id, stripe_payment_intent, stripe_event_id, stripe_charge_id, stripe_refund_id,
  payment_method, card_brand, card_last4, receipt_url, failure_code, failure_message,
  gateway_response, processed_at, created_at, updated_at
FROM gala_transactions;

-- Backfill existing donations as succeeded payment transactions
-- (donations are only ever inserted after a confirmed successful payment).
INSERT INTO transactions
  (source_type, source_id, type, status, amount, currency, gateway,
   gateway_order_id, gateway_payment_id, processed_at, created_at)
SELECT
  'donation', id, 'payment', 'succeeded', amount, currency, gateway,
  order_id, payment_id, created_at, created_at
FROM donations;

-- Keep the old table as a backup instead of dropping it outright.
RENAME TABLE gala_transactions TO gala_transactions_deprecated;

-- Drop the now-redundant payment columns from donations — their data now
-- lives in `transactions` (source_type = 'donation').
ALTER TABLE donations
  DROP COLUMN gateway,
  DROP COLUMN payment_id,
  DROP COLUMN order_id,
  DROP COLUMN status;
