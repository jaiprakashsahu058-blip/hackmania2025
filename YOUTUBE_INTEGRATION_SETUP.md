# YouTube Integration Setup Guide

## 🎯 Overview
Your course generation now automatically searches and embeds relevant YouTube videos for each chapter when `includeVideos` is enabled.

## 🔧 Setup Requirements

### 1. YouTube Data API Key
You need a YouTube Data API v3 key to search for videos.

#### Get YouTube API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key

#### Add to Environment Variables:
```env
# Add to your .env.local file
YOUTUBE_API_KEY=your_youtube_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Verify Integration

#### Test Course Generation:
1. Navigate to `/test-course-generation`
2. Fill in course details
3. **Enable "Include YouTube Videos"** checkbox
4. Click "Generate Course with Videos"
5. Check that videos appear in each chapter

#### Expected Behavior:
- ✅ Each chapter should have a relevant YouTube video
- ✅ Videos should be embedded and playable
- ✅ Video URLs should be in format: `https://www.youtube.com/watch?v=VIDEO_ID`

## 🔄 How It Works

### Course Generation Flow:
```
1. User creates course with "Include Videos" enabled
2. Gemini AI generates course content and chapters
3. For each chapter:
   - Extract keywords and search terms
   - Search YouTube API for relevant videos
   - Select best matching video
   - Add video URL to chapter data
4. Frontend displays course with embedded videos
```

### Search Strategy:
The system uses multiple search queries per chapter:
- `{topic} {chapter_title}`
- `{topic} tutorial {keywords}`
- `learn {topic} {chapter_content}`

### Rate Limiting:
- Processes chapters in batches of 3
- 100ms delay between searches
- 500ms delay between batches
- Caches results to avoid duplicate searches

## 🎨 Frontend Integration

### Course Layout:
Videos automatically appear in the course layout when:
- `chapter.videoUrl` exists
- `course.includeVideos` is true

### Video Component:
Uses `SimpleYouTubeEmbed` component with features:
- Click-to-load for performance
- Responsive 16:9 aspect ratio
- Error handling with retry
- Accessibility support

## 🐛 Troubleshooting

### No Videos Appearing:
1. **Check API Key**: Ensure `YOUTUBE_API_KEY` is set correctly
2. **Check Quota**: YouTube API has daily quotas (10,000 units/day default)
3. **Check Network**: Ensure server can access YouTube API
4. **Check Logs**: Look for YouTube search errors in server console

### API Quota Issues:
- Each search costs 100 quota units
- 5 chapters = ~500 units per course
- Monitor usage in Google Cloud Console
- Consider caching or reducing search queries

### Video Not Loading:
- Some videos may be restricted for embedding
- The system automatically selects the first available video
- Check video URL format in browser console

## 📊 Testing

### Manual Testing:
1. **Basic Test**: Generate a simple course (e.g., "JavaScript Basics")
2. **Complex Test**: Generate advanced course (e.g., "Machine Learning")
3. **Edge Cases**: Try niche topics or very specific subjects

### Automated Testing:
Use `/test-course-generation` page to:
- Test different topics and difficulties
- Verify video embedding works
- Check API responses and errors

## 🚀 Production Deployment

### Environment Variables:
```env
YOUTUBE_API_KEY=your_production_youtube_api_key
GEMINI_API_KEY=your_production_gemini_api_key
```

### Monitoring:
- Monitor YouTube API quota usage
- Log video search success/failure rates
- Track user engagement with embedded videos

### Optimization:
- Consider video caching for popular topics
- Implement fallback videos for failed searches
- Add video quality/duration preferences

## 🎯 Usage

### For Users:
1. Go to **Create Course** page
2. Fill in course details
3. **Check "Include Videos"** option
4. Generate course
5. Videos will automatically appear in each chapter

### For Developers:
The integration is fully automatic. When `includeVideos: true` is passed to the course generation API, it will:
- Search for relevant videos
- Embed them in the course structure
- Return course data with `videoUrl` fields populated

**YouTube integration is now fully functional and ready for use!** 🎥✨
