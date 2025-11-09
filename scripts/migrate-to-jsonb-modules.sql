-- Migration script to update courses table to use JSONB modules structure
-- This migrates from the old chapters-based structure to the new modules JSONB structure

-- Step 1: Add new columns to courses table
DO $$ 
BEGIN 
    -- Add course_title if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='course_title') THEN
        ALTER TABLE courses ADD COLUMN course_title TEXT;
        -- Copy from existing title column
        UPDATE courses SET course_title = title WHERE course_title IS NULL;
        -- Make it NOT NULL after populating
        ALTER TABLE courses ALTER COLUMN course_title SET NOT NULL;
    END IF;
    
    -- Add modules JSONB column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='modules') THEN
        ALTER TABLE courses ADD COLUMN modules JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Rename include_quiz column if old name exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='includeQuiz') THEN
        ALTER TABLE courses RENAME COLUMN "includeQuiz" TO include_quiz;
    END IF;
    
    -- Add include_quiz if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='include_quiz') THEN
        ALTER TABLE courses ADD COLUMN include_quiz BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Rename include_videos column if old name exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='includeVideos') THEN
        ALTER TABLE courses RENAME COLUMN "includeVideos" TO include_videos;
    END IF;
    
    -- Add include_videos if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='include_videos') THEN
        ALTER TABLE courses ADD COLUMN include_videos BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Step 2: Migrate existing chapters to modules JSONB structure
-- This converts existing chapter data into the modules JSONB format
UPDATE courses 
SET modules = (
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', c.id::text,
                'title', c.title,
                'description', c.description,
                'content', c.content,
                'videoUrl', c."videoUrl",
                'quiz', COALESCE(c.quiz, '[]'::jsonb),
                'objectives', CASE 
                    WHEN c.content IS NOT NULL THEN 
                        string_to_array(c.content, E'\n')
                    ELSE 
                        ARRAY[]::text[]
                END,
                'keywords', ARRAY[]::text[],
                'videoSearchTerms', ''
            ) ORDER BY c."orderIndex"
        ),
        '[]'::jsonb
    )
    FROM chapters c 
    WHERE c."courseId" = courses.id
)
WHERE modules = '[]'::jsonb OR modules IS NULL;

-- Step 3: Update boolean flags based on existing data
UPDATE courses 
SET 
    include_quiz = CASE 
        WHEN EXISTS (
            SELECT 1 FROM chapters c 
            WHERE c."courseId" = courses.id 
            AND c.quiz IS NOT NULL 
            AND jsonb_array_length(c.quiz) > 0
        ) THEN TRUE 
        ELSE COALESCE(include_quiz, FALSE) 
    END,
    include_videos = CASE 
        WHEN EXISTS (
            SELECT 1 FROM chapters c 
            WHERE c."courseId" = courses.id 
            AND (c."videoUrl" IS NOT NULL OR c."videoUrls" IS NOT NULL)
        ) THEN TRUE 
        ELSE COALESCE(include_videos, FALSE) 
    END;

-- Step 4: Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_modules_gin ON courses USING GIN(modules);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_include_quiz ON courses(include_quiz) WHERE include_quiz = TRUE;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_include_videos ON courses(include_videos) WHERE include_videos = TRUE;

-- Step 5: Update normalized quizzes table structure (if exists)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='quizzes') THEN
        -- Add moduleId column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='moduleId') THEN
            ALTER TABLE quizzes ADD COLUMN "moduleId" TEXT;
        END IF;
        
        -- Add question_type column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quizzes' AND column_name='question_type') THEN
            ALTER TABLE quizzes ADD COLUMN question_type TEXT DEFAULT 'mcq';
        END IF;
    END IF;
END $$;

-- Step 6: Verify the migration
SELECT 
    'Migration Summary' as status,
    COUNT(*) as total_courses,
    COUNT(CASE WHEN modules != '[]'::jsonb THEN 1 END) as courses_with_modules,
    COUNT(CASE WHEN include_quiz = TRUE THEN 1 END) as courses_with_quiz,
    COUNT(CASE WHEN include_videos = TRUE THEN 1 END) as courses_with_videos
FROM courses;

-- Show sample of migrated data
SELECT 
    id,
    course_title,
    jsonb_array_length(modules) as module_count,
    include_quiz,
    include_videos,
    (
        SELECT COUNT(*)
        FROM jsonb_array_elements(modules) as m
        WHERE m->'quiz' IS NOT NULL 
        AND jsonb_array_length(m->'quiz') > 0
    ) as modules_with_quiz
FROM courses 
WHERE modules != '[]'::jsonb
LIMIT 5;
