-- One-time migration: add the partner_inquiries table.
--
-- Run ONCE against a database created before this table existed. A fresh
-- database created from the current schema.sql does not need this.
--
-- Usage: mysql -u <user> -p <database> < migrations/002_add_partner_inquiries.sql

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
