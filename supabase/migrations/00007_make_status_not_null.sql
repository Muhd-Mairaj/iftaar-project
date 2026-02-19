-- Make status columns NOT NULL with default values
-- First, ensure no nulls exist (though defaults should have handled it)
UPDATE collection_requests SET status = 'pending' WHERE status IS NULL;
UPDATE donations SET status = 'pending' WHERE status IS NULL;

-- Alter collection_requests
ALTER TABLE collection_requests ALTER COLUMN status SET NOT NULL;
ALTER TABLE collection_requests ALTER COLUMN status SET DEFAULT 'pending';

-- Alter donations
ALTER TABLE donations ALTER COLUMN status SET NOT NULL;
ALTER TABLE donations ALTER COLUMN status SET DEFAULT 'pending';
