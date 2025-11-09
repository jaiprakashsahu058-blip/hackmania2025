import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses, chapters } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateYouTubeUrls, normalizeYouTubeUrls } from '@/lib/utils/youtube';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const courseId = id;

    // Set global context for mock database
    global.mockCurrentId = courseId;

    // Get course
    const courseResult = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (courseResult.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const course = courseResult[0];

    // Get chapters for this course
    const chaptersResult = await db
      .select()
      .from(chapters)
      .where(eq(chapters.courseId, course.id))
      .orderBy(chapters.orderIndex);

    // Handle both old and new course structures
    const courseResponse = {
      ...course,
      // For backward compatibility, provide chapters from both sources
      chapters: chaptersResult.length > 0 ? chaptersResult : 
                (course.modules && Array.isArray(course.modules) ? 
                 course.modules.map((module, index) => ({
                   id: module.id || `module-${index + 1}`,
                   title: module.title,
                   description: module.description,
                   content: module.description,
                   quiz: module.quiz || [],
                   videoUrl: module.videoUrl || null,
                   videoUrls: module.videoUrls || [],
                   orderIndex: index + 1
                 })) : []),
      // Include modules for new structure
      modules: course.modules || [],
      // Ensure boolean flags are properly set
      includeQuiz: course.include_quiz || false,
      includeVideos: course.include_videos || false
    };

    console.log(`📖 Retrieved course: ${course.course_title || course.title}`);
    console.log(`   📚 Modules: ${courseResponse.modules.length}`);
    console.log(`   📝 Chapters: ${courseResponse.chapters.length}`);
    
    // Debug: Show video information
    if (course.include_videos) {
      const modulesWithVideos = courseResponse.modules.filter(m => m.videoUrls && m.videoUrls.length > 0);
      console.log(`   🎥 Modules with videos: ${modulesWithVideos.length}`);
      if (modulesWithVideos.length > 0) {
        console.log(`   📹 Sample module videos:`, modulesWithVideos[0].videoUrls);
      }
    }
    
    if (course.include_quiz) {
      const modulesWithQuiz = courseResponse.modules.filter(m => m.quiz && m.quiz.length > 0);
      const chaptersWithQuiz = courseResponse.chapters.filter(ch => ch.quiz && ch.quiz.length > 0);
      console.log(`   🧩 Modules with quiz: ${modulesWithQuiz.length}`);
      console.log(`   📝 Chapters with quiz: ${chaptersWithQuiz.length}`);
      
      // Debug: Show sample quiz data being sent to frontend
      if (chaptersWithQuiz.length > 0 && chaptersWithQuiz[0].quiz) {
        console.log('📋 Sample chapter quiz data for frontend:');
        console.log('   Chapter:', chaptersWithQuiz[0].title);
        console.log('   Quiz length:', chaptersWithQuiz[0].quiz.length);
        console.log('   First question:', chaptersWithQuiz[0].quiz[0]?.question || 'No question');
      }
    }

    return NextResponse.json({
      course: courseResponse
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// DELETE - Delete course and its chapters
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const courseId = id;

    // First, delete all chapters associated with this course
    await db
      .delete(chapters)
      .where(eq(chapters.courseId, courseId));

    // Then delete the course
    const result = await db
      .delete(courses)
      .where(eq(courses.id, courseId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}


import { getAuth } from "@clerk/nextjs/server";
import { users } from "@/lib/db/schema";

// ✅ Create new course (after AI generation)
export async function POST(request) {
  try {
    const { userId } = getAuth(request); // get Clerk user
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      category,
      difficulty,
      duration,
      description,
      topic,
      chapterCount,
      includeVideos,
      videoUrls,
      userDescription,
      chapters: chaptersData = [],
    } = body;

    // ✅ Step 1: Find or create user in your DB
    let [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId));

    if (!existingUser) {
      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: "unknown@example.com", // fallback
          firstName: "Unknown",
          lastName: "User",
        })
        .returning();
      existingUser = newUser;
    }

    // Validate and normalize video URLs if includeVideos is true
    let processedVideoUrls = null;
    if (includeVideos && videoUrls && Array.isArray(videoUrls) && videoUrls.length > 0) {
      const { valid, invalid } = validateYouTubeUrls(videoUrls);
      
      if (invalid.length > 0) {
        return NextResponse.json(
          { 
            error: 'Invalid YouTube URLs provided', 
            invalidUrls: invalid 
          }, 
          { status: 400 }
        );
      }
      
      processedVideoUrls = normalizeYouTubeUrls(valid);
    }

    // ✅ Step 2: Insert the course
    const [newCourse] = await db
      .insert(courses)
      .values({
        userId: existingUser.id,
        title,
        description,
        category,
        difficulty,
        duration,
        chapterCount: Number(chapterCount),
        includeVideos: !!includeVideos,
        videoUrls: processedVideoUrls,
        topic,
        userDescription,
      })
      .returning();

    // ✅ Step 3: Insert related chapters (if any)
    if (chaptersData.length > 0) {
      const chapterInserts = chaptersData.map((chapter, index) => ({
        courseId: newCourse.id,
        title: chapter.title,
        description: chapter.description,
        duration: "N/A",
        content: JSON.stringify(chapter.points || []),
        videoUrls: chapter.videoUrl ? [chapter.videoUrl] : [],
        orderIndex: index + 1,
      }));

      await db.insert(chapters).values(chapterInserts);
    }

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
