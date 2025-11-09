# 🔧 YouTube Integration Debugging Guide

## 🎯 Quick Diagnosis

### Step 1: Check Environment Variables
```bash
# Check if YouTube API key is set
echo $YOUTUBE_API_KEY
# or in Windows
echo %YOUTUBE_API_KEY%
```

**Required in `.env.local`:**
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 2: Test YouTube API Directly
Navigate to: `/test-youtube-simple`

1. **Test YouTube Search**: Enter "JavaScript tutorial" and click "Search YouTube"
2. **Test Course Generation**: Click "Test Course Generation with Videos"

### Step 3: Check Server Console
When generating a course, look for these logs:

**✅ Success Indicators:**
```
🎥 YouTube video integration requested for X modules
✅ YouTube API key found, searching for videos...
🔍 Searching videos for module: [Module Name]
✅ Found video ID: [VIDEO_ID] for query: "[SEARCH_QUERY]"
🎥 YouTube Integration Summary: X/Y modules have videos
```

**❌ Error Indicators:**
```
❌ YouTube API key not found, skipping video search
❌ No video found for query: "[SEARCH_QUERY]"
❌ Failed to search for: [QUERY] [ERROR_MESSAGE]
```

## 🔍 Common Issues & Solutions

### Issue 1: No YouTube API Key
**Symptoms:**
- Console shows: "❌ YouTube API key not found"
- No videos appear in generated courses

**Solution:**
1. Get YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `.env.local`: `YOUTUBE_API_KEY=your_key_here`
3. Restart development server

### Issue 2: API Quota Exceeded
**Symptoms:**
- Console shows: "Failed to search for: [query] [quota exceeded error]"
- Videos stop appearing after some searches

**Solution:**
1. Check quota usage in Google Cloud Console
2. Wait for quota reset (daily)
3. Consider increasing quota limits

### Issue 3: Videos Not Embedding
**Symptoms:**
- API finds video IDs but videos don't show in course
- Console shows video URLs but frontend doesn't display them

**Solution:**
1. Check if `includeVideos` is enabled in course creation
2. Verify `chapter.videoUrl` exists in course data
3. Check browser console for embedding errors

### Issue 4: Invalid Video URLs
**Symptoms:**
- Videos found but won't play
- Embedding errors in browser console

**Solution:**
1. Check video URL format: `https://www.youtube.com/watch?v=VIDEO_ID`
2. Verify video is public and embeddable
3. Test video URL manually in browser

## 🧪 Testing Checklist

### ✅ Environment Setup
- [ ] YOUTUBE_API_KEY is set in .env.local
- [ ] GEMINI_API_KEY is set in .env.local
- [ ] Development server restarted after adding keys
- [ ] YouTube Data API v3 is enabled in Google Cloud

### ✅ API Testing
- [ ] `/test-youtube-simple` page loads without errors
- [ ] YouTube search returns video IDs
- [ ] Course generation includes video URLs
- [ ] Server console shows successful video searches

### ✅ Frontend Integration
- [ ] Course creation form has "Include Videos" checkbox
- [ ] Generated courses show video sections
- [ ] Videos are clickable and playable
- [ ] Videos maintain proper aspect ratio

### ✅ Error Handling
- [ ] Graceful handling when no videos found
- [ ] Proper error messages for API failures
- [ ] Fallback behavior when YouTube API is unavailable

## 🔧 Manual Testing Steps

### Test 1: Basic YouTube Search
```javascript
// Test in browser console on /test-youtube-simple
fetch('/api/youtube?q=JavaScript tutorial')
  .then(r => r.json())
  .then(console.log);
```

### Test 2: Course Generation with Videos
```javascript
// Test course generation API
fetch('/api/courses/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'React Hooks',
    category: 'programming',
    difficulty: 'Beginner',
    duration: '3-5 hours',
    chapterCount: '3',
    includeVideos: true,
    includeQuiz: false
  })
}).then(r => r.json()).then(console.log);
```

### Test 3: Check Generated Course Structure
Look for this structure in the response:
```json
{
  "course": {
    "chapters": [
      {
        "id": "chapter-1",
        "title": "Introduction to React Hooks",
        "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
        "videoUrls": ["https://www.youtube.com/embed/VIDEO_ID"]
      }
    ]
  }
}
```

## 🚨 Troubleshooting Commands

### Check Environment Variables
```bash
# In your project directory
cat .env.local | grep YOUTUBE
```

### Test YouTube API Key
```bash
# Replace YOUR_API_KEY with actual key
curl "https://www.googleapis.com/youtube/v3/search?key=YOUR_API_KEY&q=test&part=snippet&type=video&maxResults=1"
```

### Check Server Logs
```bash
# Watch server console while generating course
npm run dev
# Then generate a course and watch for YouTube-related logs
```

## 📋 Expected Behavior

### When Everything Works:
1. **Course Creation**: User checks "Include Videos" checkbox
2. **Generation**: Server searches YouTube for each chapter
3. **Integration**: Videos are automatically embedded in course
4. **Display**: Each chapter shows relevant educational video
5. **Interaction**: Users can click and watch videos inline

### Performance Expectations:
- **Search Time**: 2-5 seconds per chapter for video search
- **Success Rate**: 80%+ chapters should get relevant videos
- **Quality**: Videos should be educational and topic-relevant
- **Embedding**: Videos should load and play without issues

## 🎯 Success Metrics

### ✅ Integration Working When:
- Server logs show successful video searches
- Generated courses have `videoUrl` fields populated
- Frontend displays video sections for chapters
- Videos are clickable and playable
- No console errors related to video embedding

### ❌ Integration Failing When:
- No video URLs in generated course data
- Server logs show API key errors
- Videos don't appear in course layout
- Embedding errors in browser console
- YouTube API quota exceeded messages

**Follow this guide step by step to diagnose and fix YouTube integration issues!** 🎥✨
