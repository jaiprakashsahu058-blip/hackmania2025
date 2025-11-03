import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses, chapters, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { validateYouTubeUrls, normalizeYouTubeUrls } from '@/lib/utils/youtube';

// GET - Fetch user's courses
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create the user by Clerk ID
    let existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUsers.length === 0) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || 'unknown@example.com';
      const firstName = clerkUser?.firstName || null;
      const lastName = clerkUser?.lastName || null;
      const [created] = await db
        .insert(users)
        .values({ clerkId: userId, email, firstName, lastName })
        .returning();
      existingUsers = [created];
    }

    const userCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, existingUsers[0].id))
      .orderBy(courses.createdAt);

    return NextResponse.json({ courses: userCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Return empty array instead of error for better UX
    return NextResponse.json({ courses: [] });
  }
}

// POST - Create new course
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create the user by Clerk ID
    let existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUsers.length === 0) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || 'unknown@example.com';
      const firstName = clerkUser?.firstName || null;
      const lastName = clerkUser?.lastName || null;
      const [created] = await db
        .insert(users)
        .values({ clerkId: userId, email, firstName, lastName })
        .returning();
      existingUsers = [created];
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      chapterCount,
      includeVideos,
      videoUrls,
      topic,
      generatedChapters
    } = body;

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

    // Create course
    const [newCourse] = await db
      .insert(courses)
      .values({
        userId: existingUsers[0].id,
        title,
        description,
        category: category || 'General',
        difficulty: difficulty || 'Beginner',
        duration: duration || '3-5 hours',
        chapterCount: chapterCount || 5,
        includeVideos: includeVideos || false,
        videoUrls: processedVideoUrls,
        topic: topic || title
      })
      .returning();

    // Create chapters with enhanced structure support
    if (generatedChapters && Array.isArray(generatedChapters) && generatedChapters.length > 0) {
      const chapterData = generatedChapters.map((chapter, index) => {
        // Handle both old and new chapter formats
        const points = Array.isArray(chapter.points) ? chapter.points : 
                      Array.isArray(chapter.objectives) ? chapter.objectives :
                      Array.isArray(chapter.content) ? chapter.content : [];
        
        const contentText = points.join('\n');
        const urls = Array.isArray(chapter.videoUrls) && chapter.videoUrls.length > 0 ? chapter.videoUrls : null;
        
        // Enhanced chapter data with new fields
        return {
          courseId: newCourse.id,
          title: chapter.title,
          description: chapter.description || `Learn about ${chapter.title}`,
          duration: '10-15 minutes', // Default duration
          content: contentText,
          videoUrls: urls, // store array of embed URLs or null
          orderIndex: chapter.orderIndex || index + 1
        };
      });

      if (chapterData.length > 0) {
        await db.insert(chapters).values(chapterData);
      }
    }

    return NextResponse.json({
      success: true,
      course: newCourse
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}


