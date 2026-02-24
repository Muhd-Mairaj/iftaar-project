-- Migration to add recurring donation fields to the donations table

ALTER TABLE donations
ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN duration_days INTEGER NULL,
ADD COLUMN daily_quantity INTEGER NULL,
ADD COLUMN available_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN parent_donation_id UUID NULL REFERENCES donations(id);
