-- Fix database schema - Add missing columns to courses table
-- Run this script to fix the "column does not exist" errors

-- First, let's check what columns currently exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'courses'
ORDER BY ordinal_position;

-- Add missing columns to courses table
DO $$ 
BEGIN 
    -- Add include_quiz column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='include_quiz') THEN
        ALTER TABLE courses ADD COLUMN include_quiz BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added include_quiz column to courses table';
    ELSE
        RAISE NOTICE 'include_quiz column already exists';
    END IF;
    
    -- Add include_videos column if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='include_videos') THEN
        ALTER TABLE courses ADD COLUMN include_videos BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added include_videos column to courses table';
    ELSE
        RAISE NOTICE 'include_videos column already exists';
    END IF;
    
    -- Add course_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='course_title') THEN
        ALTER TABLE courses ADD COLUMN course_title TEXT;
        -- Copy from existing title column if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='title') THEN
            UPDATE courses SET course_title = title WHERE course_title IS NULL;
        END IF;
        RAISE NOTICE 'Added course_title column to courses table';
    ELSE
        RAISE NOTICE 'course_title column already exists';
    END IF;
    
    -- Add modules JSONB column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='modules') THEN
        ALTER TABLE courses ADD COLUMN modules JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added modules column to courses table';
    ELSE
        RAISE NOTICE 'modules column already exists';
    END IF;
    
    -- Ensure all boolean columns have proper defaults
    UPDATE courses SET include_quiz = FALSE WHERE include_quiz IS NULL;
    UPDATE courses SET include_videos = FALSE WHERE include_videos IS NULL;
    
END $$;

-- Add missing columns to chapters table
DO $$ 
BEGIN 
    -- Add quiz column to chapters if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chapters' AND column_name='quiz') THEN
        ALTER TABLE chapters ADD COLUMN quiz JSONB;
        RAISE NOTICE 'Added quiz column to chapters table';
    ELSE
        RAISE NOTICE 'quiz column already exists in chapters table';
    END IF;
    
    -- Add video_url column to chapters if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chapters' AND column_name='video_url') THEN
        ALTER TABLE chapters ADD COLUMN video_url TEXT;
        RAISE NOTICE 'Added video_url column to chapters table';
    ELSE
        RAISE NOTICE 'video_url column already exists in chapters table';
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_include_quiz ON courses(include_quiz) WHERE include_quiz = TRUE;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_include_videos ON courses(include_videos) WHERE include_videos = TRUE;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_modules_gin ON courses USING GIN(modules) WHERE modules IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chapters_quiz_gin ON chapters USING GIN(quiz) WHERE quiz IS NOT NULL;

-- Verify the changes
SELECT 'Schema Update Complete' as status;

-- Show updated courses table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'courses'
ORDER BY ordinal_position;

-- Show updated chapters table structure  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'chapters'
ORDER BY ordinal_position;
