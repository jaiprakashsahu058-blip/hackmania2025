'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleYouTubeEmbed from '@/components/SimpleYouTubeEmbed';
import BilingualYouTubeEmbed from '@/components/BilingualYouTubeEmbed';

export default function TestYouTubePage() {
  const [testUrl, setTestUrl] = useState('https://www.youtube.com/watch?v=W6NZfCO5SIk');
  const [showVideo, setShowVideo] = useState(false);

  const sampleVideos = [
    {
      title: 'JavaScript Introduction',
      url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
      description: 'JavaScript tutorial for beginners'
    },
    {
      title: 'JavaScript Variables',
      url: 'https://www.youtube.com/watch?v=9emXNzqCKyg',
      description: 'Learn about variables and data types'
    },
    {
      title: 'JavaScript Functions',
      url: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
      description: 'Understanding functions and scope'
    },
    {
      title: 'JavaScript Arrays',
      url: 'https://www.youtube.com/watch?v=R8rmfD9Y5-c',
      description: 'Working with arrays and objects'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>YouTube Embedding Test</CardTitle>
            <p className="text-gray-600">Test YouTube video embedding functionality</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">YouTube URL:</label>
              <div className="flex gap-2">
                <Input
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                  className="flex-1"
                />
                <Button onClick={() => setShowVideo(true)}>
                  Test Embed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showVideo && testUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Simple YouTube Embed</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleYouTubeEmbed
                url={testUrl}
                title="Test Video"
                autoPlay={false}
                showControls={true}
                className="w-full"
                height="400"
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Sample Course Videos</CardTitle>
            <p className="text-gray-600">These are the videos used in the JavaScript course</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {sampleVideos.map((video, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="font-semibold">{video.title}</h4>
                    <p className="text-sm text-gray-600">{video.description}</p>
                    <p className="text-xs text-blue-600 mt-1">{video.url}</p>
                  </div>
                  <SimpleYouTubeEmbed
                    url={video.url}
                    title={video.title}
                    autoPlay={false}
                    showControls={true}
                    className="w-full"
                    height="300"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embedding Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span><strong>SimpleYouTubeEmbed:</strong> Lightweight, reliable embedding</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span><strong>Course Integration:</strong> Videos appear after chapter descriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span><strong>Features:</strong> Click-to-load, error handling, responsive design</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>1. Video URL Extraction:</strong>
                <p className="text-gray-600">Automatically extracts video ID from various YouTube URL formats</p>
              </div>
              <div>
                <strong>2. Lazy Loading:</strong>
                <p className="text-gray-600">Videos load only when clicked to improve page performance</p>
              </div>
              <div>
                <strong>3. Error Handling:</strong>
                <p className="text-gray-600">Graceful fallbacks for invalid URLs or loading failures</p>
              </div>
              <div>
                <strong>4. Responsive Design:</strong>
                <p className="text-gray-600">Maintains 16:9 aspect ratio across all screen sizes</p>
              </div>
              <div>
                <strong>5. Course Integration:</strong>
                <p className="text-gray-600">Embedded in course layout when `chapter.videoUrl` exists and `course.includeVideos` is true</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
