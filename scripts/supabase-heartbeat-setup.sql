-- Supabase Heartbeat Setup
-- Run this in your Supabase SQL Editor to set up the keep-alive system

-- Create heartbeat table
CREATE TABLE IF NOT EXISTS heartbeat (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_heartbeat CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE heartbeat ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access (for GitHub Actions)
CREATE POLICY "Allow heartbeat operations" ON heartbeat FOR ALL USING (true);

-- Create function to create heartbeat table if not exists
CREATE OR REPLACE FUNCTION create_heartbeat_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is called by the ping script
  -- It ensures the heartbeat table exists
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'heartbeat') THEN
    CREATE TABLE heartbeat (
      id INTEGER PRIMARY KEY DEFAULT 1,
      last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT single_heartbeat CHECK (id = 1)
    );
    
    ALTER TABLE heartbeat ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow heartbeat operations" ON heartbeat FOR ALL USING (true);
  END IF;
END;
$$;

-- Insert initial heartbeat record
INSERT INTO heartbeat (id, last_ping, message) 
VALUES (1, NOW(), 'Initial heartbeat setup')
ON CONFLICT (id) DO UPDATE SET 
  last_ping = NOW(),
  message = 'Heartbeat table already exists';

-- Create a view to check heartbeat status
CREATE OR REPLACE VIEW heartbeat_status AS
SELECT 
  last_ping,
  message,
  EXTRACT(EPOCH FROM (NOW() - last_ping)) / 3600 AS hours_since_last_ping,
  CASE 
    WHEN EXTRACT(EPOCH FROM (NOW() - last_ping)) / 3600 < 48 THEN 'Active'
    WHEN EXTRACT(EPOCH FROM (NOW() - last_ping)) / 3600 < 168 THEN 'Warning'
    ELSE 'Inactive Risk'
  END AS status
FROM heartbeat 
WHERE id = 1;