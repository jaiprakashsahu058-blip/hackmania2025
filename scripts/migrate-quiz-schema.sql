-- Migration script to add quiz support to existing database
-- Run this if you have an existing database without quiz fields

-- Add includeQuiz field to courses table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='include_quiz') THEN
        ALTER TABLE courses ADD COLUMN include_quiz BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add quiz and videoUrl fields to chapters table if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chapters' AND column_name='quiz') THEN
        ALTER TABLE chapters ADD COLUMN quiz JSONB;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chapters' AND column_name='video_url') THEN
        ALTER TABLE chapters ADD COLUMN video_url TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_include_quiz ON courses(include_quiz) WHERE include_quiz = TRUE;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chapters_quiz ON chapters USING GIN(quiz) WHERE quiz IS NOT NULL;

-- Update existing courses to have includeQuiz = false if NULL
UPDATE courses SET include_quiz = FALSE WHERE include_quiz IS NULL;

-- Verify the changes
SELECT 
    'courses' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'courses' 
    AND column_name IN ('include_quiz')
UNION ALL
SELECT 
    'chapters' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'chapters' 
    AND column_name IN ('quiz', 'video_url')
ORDER BY table_name, column_name;
