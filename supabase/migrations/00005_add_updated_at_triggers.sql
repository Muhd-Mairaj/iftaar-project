-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for donations table
CREATE TRIGGER update_donations_updated_at
    BEFORE UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for collection_requests table
CREATE TRIGGER update_collection_requests_updated_at
    BEFORE UPDATE ON collection_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
