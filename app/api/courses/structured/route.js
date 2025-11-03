import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatCourseToStructuredJSON, validateAndEnhanceCourse } from '@/lib/utils/courseBuilder';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Search YouTube for video IDs
async function searchYouTubeVideoIds(query, apiKey, max = 3) {
  try {
    const params = new URLSearchParams({
      key: apiKey,
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: String(Math.min(Math.max(max, 1), 5)),
      safeSearch: 'moderate',
      videoEmbeddable: 'true', // Only embeddable videos
      videoSyndicated: 'true'  // Only syndicated videos
    });
    
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!res.ok) {
      console.error('YouTube API error:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    const ids = (data.items || [])
      .map((item) => item?.id?.videoId)
      .filter(Boolean);
    
    return ids;
  } catch (e) {
    console.error('YouTube search error:', e);
    return [];
  }
}

// POST /api/courses/structured - Generate course in structured JSON format
export async function POST(request) {
  try {
    // Use Clerk authentication
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      topic, 
      category = 'General',
      difficulty = 'Beginner',
      duration = '3-5 hours',
      moduleCount = 5,
      includeVideos = true
    } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    console.log('Generating structured course for:', { topic, category, difficulty });

    // Enhanced prompt for structured course generation
    const prompt = `You are an AI Course Builder assistant for "MindCourse". Generate a complete educational course outline.

🎓 COURSE TOPIC: ${topic}
📚 CATEGORY: ${category}
⚡ DIFFICULTY: ${difficulty}
⏱️ DURATION: ${duration}
📖 MODULES: ${moduleCount}

Generate a JSON response with this EXACT structure:
{
  "course_title": "Engaging and SEO-friendly course title",
  "overview": "Brief 2-3 line course description explaining what students will learn and achieve",
  "modules": [
    {
      "title": "Module Title",
      "description": "Detailed 2-3 paragraph explanation of what this module covers, why it's important, and how it fits into the overall course. Make it engaging and educational.",
      "objectives": [
        "Clear, measurable learning objective 1",
        "Specific skill or knowledge objective 2", 
        "Practical application objective 3",
        "Assessment or evaluation objective 4"
      ]
    }
  ]
}

🧩 REQUIREMENTS:
1. **Course Title**: Make it catchy, SEO-friendly, clearly indicate subject and level
2. **Overview**: 2-3 lines explaining the course value proposition and outcomes
3. **Modules**: Create exactly ${moduleCount} comprehensive modules
4. **Module Descriptions**: 2-3 detailed paragraphs explaining:
   - What the module covers in detail
   - Why it's important for learning ${topic}
   - How it connects to other modules
   - Real-world applications and examples
5. **Learning Objectives**: 3-5 specific, measurable outcomes using action verbs (understand, apply, analyze, create, evaluate)

🎯 CONTENT GUIDELINES:
- Make content progressive (beginner to advanced concepts)
- Include practical applications and real-world examples
- Ensure each module builds upon previous knowledge
- Use engaging, educational language appropriate for ${difficulty} level
- Structure content for ${duration} of learning
- Focus on ${category} domain expertise

Return ONLY valid JSON, no additional text or explanations.`;

    let courseData;

    // Generate course with Gemini AI
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini AI response received');

        // Parse JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          courseData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in AI response');
        }
      } catch (error) {
        console.error('Gemini AI error:', error);
        courseData = null;
      }
    }

    // Fallback if AI generation fails
    if (!courseData) {
      courseData = {
        course_title: `Complete ${topic} Course - ${difficulty} Level`,
        overview: `Master ${topic} with this comprehensive ${difficulty.toLowerCase()}-level course. Learn through structured modules, practical examples, and expert guidance.`,
        modules: Array.from({ length: parseInt(moduleCount) }, (_, i) => ({
          title: `Module ${i + 1}: ${topic} Fundamentals`,
          description: `This module covers essential ${topic} concepts and principles. You'll learn the fundamental building blocks, understand key terminology, and explore practical applications. Through hands-on examples and real-world scenarios, you'll develop a solid foundation in ${topic}.\n\nWe'll progress from basic concepts to more advanced applications, ensuring you understand both the theory and practical implementation. By the end of this module, you'll be confident in applying ${topic} knowledge to solve real problems.`,
          objectives: [
            `Understand fundamental ${topic} concepts and principles`,
            `Apply ${topic} knowledge to practical scenarios`,
            `Analyze and evaluate different ${topic} approaches`,
            `Create solutions using ${topic} methodologies`
          ]
        }))
      };
    }

    // Validate and enhance the course structure
    const validatedCourse = validateAndEnhanceCourse(courseData);

    // Add YouTube videos if requested
    if (includeVideos && process.env.YOUTUBE_API_KEY) {
      console.log('Searching for YouTube videos...');
      
      for (const module of validatedCourse.modules) {
        try {
          // Search for videos using module title and topic
          const searchQuery = `${topic} ${module.title} tutorial ${difficulty.toLowerCase()}`;
          const videoIds = await searchYouTubeVideoIds(searchQuery, process.env.YOUTUBE_API_KEY, 3);
          
          if (videoIds.length > 0) {
            module.videos = videoIds.map((videoId, index) => ({
              title: `${module.title} - Video ${index + 1}`,
              embed_code: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="${module.title} - Video ${index + 1}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            }));
            
            console.log(`Found ${videoIds.length} videos for module: ${module.title}`);
          } else {
            module.videos = [];
            console.log(`No videos found for module: ${module.title}`);
          }
          
          // Small delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Error searching videos for module ${module.title}:`, error);
          module.videos = [];
        }
      }
    } else {
      // Add empty videos array if not including videos
      validatedCourse.modules.forEach(module => {
        module.videos = [];
      });
    }

    // Return the structured JSON format
    const structuredResponse = {
      course_title: validatedCourse.course_title,
      overview: validatedCourse.overview,
      modules: validatedCourse.modules.map(module => ({
        title: module.title,
        description: module.description,
        objectives: module.objectives,
        videos: module.videos || []
      }))
    };

    return NextResponse.json(structuredResponse);

  } catch (error) {
    console.error('Error generating structured course:', error);
    return NextResponse.json({ 
      error: 'Failed to generate structured course: ' + error.message 
    }, { status: 500 });
  }
}