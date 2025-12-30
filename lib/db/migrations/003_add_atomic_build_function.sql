-- =============================================================================
-- MIGRATION 003: Add atomic build creation function
-- Run this in Supabase SQL Editor to add the function
-- =============================================================================

-- Add unique constraint on builds (project_id, version) to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_builds_project_version 
ON builds(project_id, version);

-- Atomic build creation function - prevents race conditions
CREATE OR REPLACE FUNCTION create_build_atomic(
  p_project_id UUID,
  p_full_code TEXT
) RETURNS builds AS $$
DECLARE
  v_next_version INT;
  v_new_build builds;
BEGIN
  -- Get and increment version atomically using FOR UPDATE
  SELECT COALESCE(MAX(version), 0) + 1 INTO v_next_version
  FROM builds
  WHERE project_id = p_project_id
  FOR UPDATE;

  -- Insert new build
  INSERT INTO builds (project_id, full_code, version, audit_complete)
  VALUES (p_project_id, p_full_code, v_next_version, false)
  RETURNING * INTO v_new_build;

  RETURN v_new_build;
END;
$$ LANGUAGE plpgsql;
