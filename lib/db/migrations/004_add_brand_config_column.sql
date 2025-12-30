-- =============================================================================
-- MIGRATION 004: Add brand_config column to projects
-- Run this in Supabase SQL Editor
-- =============================================================================

-- Add brand_config JSON column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS brand_config JSONB DEFAULT NULL;

-- Comment for documentation
COMMENT ON COLUMN projects.brand_config IS 'JSON object containing brand settings: brandName, tagline, logoUrl, colors (primary, secondary, accent), fontStyle, styleVibe';
