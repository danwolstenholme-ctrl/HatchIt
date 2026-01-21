-- =============================================================================
-- SECTION VERSIONS TABLE
-- Tracks version history for each section (for undo/rollback)
-- =============================================================================

CREATE TABLE IF NOT EXISTS section_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  
  code TEXT NOT NULL,
  label TEXT, -- e.g., "Initial build", "User refinement", "Auto-fix"
  prompt TEXT, -- The prompt that triggered this version (if any)
  
  version_index INT NOT NULL, -- Incrementing version number for this section
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_section_versions_section_id ON section_versions(section_id);
CREATE INDEX idx_section_versions_created_at ON section_versions(created_at);

-- Ensure version_index is unique per section
CREATE UNIQUE INDEX idx_section_versions_section_version ON section_versions(section_id, version_index);

-- =============================================================================
-- Add code_versions JSONB column to sections for lightweight history
-- This stores the last 10 versions inline for fast access
-- =============================================================================
ALTER TABLE sections 
ADD COLUMN IF NOT EXISTS code_versions JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN sections.code_versions IS 'Array of {code, label, timestamp} for last 10 versions';
