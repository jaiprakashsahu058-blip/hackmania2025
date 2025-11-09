-- Quick fix: Add missing columns to courses and chapters tables
-- Run this SQL script in your PostgreSQL database

-- ==========================================
-- COURSES TABLE - Add missing columns
-- ==========================================

-- Add course_title column (nullable to match schema.js)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_title TEXT;

-- Add modules JSONB column
ALTER TABLE courses ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb;

-- Add include_quiz column
ALTER TABLE courses ADD COLUMN IF NOT EXISTS include_quiz BOOLEAN DEFAULT FALSE;

-- Add include_videos column
ALTER TABLE courses ADD COLUMN IF NOT EXISTS include_videos BOOLEAN DEFAULT FALSE;

-- Add topic column if missing
ALTER TABLE courses ADD COLUMN IF NOT EXISTS topic TEXT;

-- Add thumbnail column if missing
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail TEXT;

-- Add user_description column if missing
ALTER TABLE courses ADD COLUMN IF NOT EXISTS user_description TEXT;

-- Update existing NULL values in courses
UPDATE courses SET include_quiz = FALSE WHERE include_quiz IS NULL;
UPDATE courses SET include_videos = FALSE WHERE include_videos IS NULL;
UPDATE courses SET modules = '[]'::jsonb WHERE modules IS NULL;

-- ==========================================
-- CHAPTERS TABLE - Add missing columns
-- ==========================================

-- Add video_urls JSONB column
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS video_urls JSONB;

-- Add video_url TEXT column (single video URL for frontend)
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add quiz JSONB column
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS quiz JSONB;

-- Update existing NULL values in chapters
UPDATE chapters SET video_urls = NULL WHERE video_urls IS NULL;
UPDATE chapters SET video_url = NULL WHERE video_url IS NULL;
UPDATE chapters SET quiz = NULL WHERE quiz IS NULL;

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Verify courses table changes
SELECT 'COURSES TABLE COLUMNS:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;

-- Verify chapters table changes
SELECT 'CHAPTERS TABLE COLUMNS:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chapters' 
ORDER BY ordinal_position;
