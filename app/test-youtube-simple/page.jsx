'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleYouTubeEmbed from '@/components/SimpleYouTubeEmbed';

export default function TestYouTubeSimplePage() {
  const [searchQuery, setSearchQuery] = useState('JavaScript tutorial');
  const [isSearching, setIsSearching] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(null);

  const testYouTubeSearch = async () => {
    setIsSearching(true);
    setError(null);
    setVideoId(null);

    try {
      console.log('Searching YouTube for:', searchQuery);
      
      const response = await fetch(`/api/youtube?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      console.log('YouTube API response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'YouTube search failed');
      }

      if (data.videoId) {
        setVideoId(data.videoId);
        console.log('Found video ID:', data.videoId);
      } else {
        setError('No video found for this search query');
      }

    } catch (err) {
      console.error('YouTube search error:', err);
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const testCourseGeneration = async () => {
    setIsSearching(true);
    setError(null);

    try {
      console.log('Testing course generation with videos...');
      
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'JavaScript Basics',
          category: 'programming',
          difficulty: 'Beginner',
          duration: '3-5 hours',
          chapterCount: '3',
          includeVideos: true,
          includeQuiz: false
        }),
      });

      const data = await response.json();
      console.log('Course generation response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Course generation failed');
      }

      // Check if videos were found
      const chaptersWithVideos = data.course?.chapters?.filter(ch => ch.videoUrl) || [];
      console.log(`Found ${chaptersWithVideos.length} chapters with videos out of ${data.course?.chapters?.length || 0} total chapters`);

      if (chaptersWithVideos.length > 0) {
        const firstVideoUrl = chaptersWithVideos[0].videoUrl;
        const videoIdMatch = firstVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoIdMatch) {
          setVideoId(videoIdMatch[1]);
        }
      } else {
        setError('Course generated but no videos were found');
      }

    } catch (err) {
      console.error('Course generation error:', err);
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>YouTube Integration Test</CardTitle>
            <p className="text-gray-600">Test YouTube search and video embedding functionality</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Query:</label>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter search query"
                  className="flex-1"
                />
                <Button 
                  onClick={testYouTubeSearch} 
                  disabled={isSearching || !searchQuery}
                >
                  {isSearching ? 'Searching...' : 'Search YouTube'}
                </Button>
              </div>
            </div>

            <div>
              <Button 
                onClick={testCourseGeneration} 
                disabled={isSearching}
                variant="outline"
                className="w-full"
              >
                {isSearching ? 'Generating...' : 'Test Course Generation with Videos'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {videoId && (
          <Card>
            <CardHeader>
              <CardTitle>Found Video: {videoId}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Video URL: https://www.youtube.com/watch?v={videoId}
                </div>
                <SimpleYouTubeEmbed
                  videoId={videoId}
                  title="Test Video"
                  className="w-full"
                  height="400"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Required Environment Variables:</strong>
              </div>
              <div className="ml-4 space-y-1">
                <div>• YOUTUBE_API_KEY - YouTube Data API v3 key</div>
                <div>• GEMINI_API_KEY - Google Gemini API key</div>
              </div>
              
              <div className="mt-4">
                <strong>Setup Instructions:</strong>
              </div>
              <div className="ml-4 space-y-1 text-gray-600">
                <div>1. Get YouTube API key from Google Cloud Console</div>
                <div>2. Enable YouTube Data API v3</div>
                <div>3. Add YOUTUBE_API_KEY to .env.local</div>
                <div>4. Restart your development server</div>
              </div>

              <div className="mt-4">
                <strong>Troubleshooting:</strong>
              </div>
              <div className="ml-4 space-y-1 text-gray-600">
                <div>• Check browser console for API errors</div>
                <div>• Verify API key has correct permissions</div>
                <div>• Check YouTube API quota usage</div>
                <div>• Ensure server can access YouTube API</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Test Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[
                { id: 'W6NZfCO5SIk', title: 'JavaScript Introduction' },
                { id: '9emXNzqCKyg', title: 'JavaScript Variables' },
                { id: 'N8ap4k_1QEQ', title: 'JavaScript Functions' }
              ].map((video) => (
                <div key={video.id} className="border rounded p-3">
                  <h4 className="font-medium mb-2">{video.title}</h4>
                  <SimpleYouTubeEmbed
                    videoId={video.id}
                    title={video.title}
                    className="w-full"
                    height="200"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
