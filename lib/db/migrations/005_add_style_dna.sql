-- Add style_dna column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS style_dna JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN users.style_dna IS 'The Chronosphere: User style preferences, evolution, and historical patterns.';
