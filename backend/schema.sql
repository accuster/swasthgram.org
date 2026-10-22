-- Swasthgram donations database schema
-- Run this once against a fresh database (e.g. staging) to recreate the tables the API expects.
-- Usage: mysql -u <user> -p <database> < schema.sql

-- The donation itself (donor + what they pledged). Payment facts (gateway,
-- IDs, status) live in the shared `transactions` table below, keyed by
-- source_type = 'donation', source_id = donations.id.
CREATE TABLE IF NOT EXISTS donations (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  donor_name    VARCHAR(255)   NOT NULL,
  donor_email   VARCHAR(255)   NOT NULL,
  donor_phone   VARCHAR(32)    NOT NULL,
  donor_state   VARCHAR(100)   NULL,
  amount        DECIMAL(12,2)  NOT NULL,
  currency      VARCHAR(3)     NOT NULL,
  program       VARCHAR(100)   NOT NULL DEFAULT 'General',
  frequency     VARCHAR(20)    NOT NULL DEFAULT 'once',
  receipt_sent  TINYINT(1)     NOT NULL DEFAULT 0,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_donor_email (donor_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Partnership enquiries (NGO/corporate/government/individual partners). A
-- partnership contribution is paid through the same flow as a donation (see
-- `donations`, program = 'Partnership') — donation_id links back to that row.
-- Not a FK since partner_inquiries can outlive or precede that payment record.
CREATE TABLE IF NOT EXISTS partner_inquiries (
  id            INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  partner_type  VARCHAR(50)   NOT NULL,
  name          VARCHAR(255)  NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  phone         VARCHAR(32)   NOT NULL,
  country       VARCHAR(100)  NOT NULL,
  organization  VARCHAR(255)  NOT NULL,
  website       VARCHAR(500)  NULL,
  notes         TEXT          NOT NULL,
  donation_id   INT UNSIGNED  NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_partner_inquiries_email (email),
  INDEX idx_partner_inquiries_donation (donation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Gala ticket booking (guest checkout — no user account, so no user_id FK).
-- One row per booking (one checkout by one person).
CREATE TABLE IF NOT EXISTS gala_bookings (
    id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_ref        VARCHAR(12)     NOT NULL,              -- e.g. SGF-7KQ2M
    full_name          VARCHAR(120)    NOT NULL,
    email              VARCHAR(191)    NOT NULL,
    phone_code         VARCHAR(5)      NOT NULL,              -- e.g. 1, 44, 91 (no +)
    phone_number       VARCHAR(20)     NOT NULL,
    seat_count         TINYINT UNSIGNED NOT NULL,
    price_per_seat     DECIMAL(10,2)   NOT NULL DEFAULT 5000.00,
    total_amount       DECIMAL(12,2)   NOT NULL,
    currency           CHAR(3)         NOT NULL DEFAULT 'USD',
    payment_status     ENUM('pending','paid','failed','refunded','cancelled') NOT NULL DEFAULT 'pending',
    stripe_session_id  VARCHAR(255)    NULL,
    stripe_payment_id  VARCHAR(255)    NULL,
    paid_at            TIMESTAMP       NULL,
    created_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_gala_bookings_ref (booking_ref),
    KEY idx_gala_bookings_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per seat held by a booking. The unique key stops two people
-- from ever holding the same seat. Deleting a booking frees its seats.
CREATE TABLE IF NOT EXISTS gala_booking_seats (
    id           BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    booking_id   BIGINT UNSIGNED  NOT NULL,                  -- FK to gala_bookings.id
    table_label  CHAR(1)          NOT NULL,                  -- A to L
    seat_number  TINYINT UNSIGNED NOT NULL,                  -- 1 to 6
    created_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_gala_seat (table_label, seat_number),
    KEY idx_gala_seats_booking (booking_id),
    CONSTRAINT fk_gala_seats_booking
        FOREIGN KEY (booking_id) REFERENCES gala_bookings (id)
        ON DELETE CASCADE,
    CONSTRAINT chk_gala_table CHECK (table_label BETWEEN 'A' AND 'L'),
    CONSTRAINT chk_gala_seat  CHECK (seat_number BETWEEN 1 AND 6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per money movement across the whole site: gala booking payments,
-- donations, and any future paid feature. Rows are never deleted, so this
-- is the audit trail. `source_type` + `source_id` point at the record the
-- money belongs to (gala_bookings.id or donations.id) — not a real FK,
-- since it targets a different table depending on source_type.
CREATE TABLE IF NOT EXISTS transactions (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    source_type         ENUM('gala_booking','donation','partnership') NOT NULL,
    source_id           BIGINT UNSIGNED NOT NULL,
    type                ENUM('payment','refund','dispute') NOT NULL DEFAULT 'payment',
    status              ENUM('initiated','succeeded','failed','cancelled','pending') NOT NULL DEFAULT 'initiated',
    amount              DECIMAL(12,2)   NOT NULL,             -- positive; refunds stored as positive with type = refund
    currency            CHAR(3)         NOT NULL DEFAULT 'USD',
    gateway             VARCHAR(20)     NOT NULL,             -- 'stripe' | 'razorpay'
    gateway_order_id    VARCHAR(255)    NULL,                 -- Stripe Checkout session id OR Razorpay order id
    gateway_payment_id  VARCHAR(255)    NULL,                 -- Stripe PaymentIntent id OR Razorpay payment id
    gateway_event_id    VARCHAR(255)    NULL,                 -- Stripe webhook event id, for idempotency (Razorpay rows leave this null)
    charge_id           VARCHAR(255)    NULL,                 -- Stripe charge id (ch_...)
    refund_id           VARCHAR(255)    NULL,                 -- Stripe refund id (re_...)
    payment_method      VARCHAR(30)     NULL,                 -- card, us_bank_account, ...
    card_brand          VARCHAR(20)     NULL,                 -- visa, mastercard, amex
    card_last4          CHAR(4)         NULL,
    receipt_url         VARCHAR(500)    NULL,
    failure_code        VARCHAR(100)    NULL,
    failure_message     VARCHAR(500)    NULL,
    gateway_response    JSON            NULL,                 -- raw gateway object for debugging
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
