-- One-time migration: add 'partnership' to transactions.source_type, so a
-- partnership contribution's payment row is tagged distinctly from a plain
-- donation (still a donations.id in source_id — only the tag changes).
--
-- Usage: mysql -u <user> -p <database> < migrations/003_add_partnership_source_type.sql

ALTER TABLE transactions
  MODIFY COLUMN source_type ENUM('gala_booking','donation','partnership') NOT NULL;
