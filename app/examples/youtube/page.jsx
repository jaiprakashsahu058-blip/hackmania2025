'use client';

import YouTubeEmbed from '@/components/YouTubeEmbed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function YouTubeEmbedExample() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">YouTube Embed Component Demo</h1>
          <p className="text-gray-600">Examples of validated YouTube video embedding with fallbacks</p>
        </div>

        <div className="grid gap-8">
          {/* Example 1: Valid Video ID */}
          <Card>
            <CardHeader>
              <CardTitle>Example 1: Using Video ID</CardTitle>
            </CardHeader>
            <CardContent>
              <YouTubeEmbed
                videoId="dQw4w9WgXcQ"
                title="Rick Astley - Never Gonna Give You Up"
                autoPlay={false}
                showControls={true}
                className="mb-4"
              />
              <code className="text-sm bg-gray-100 p-2 rounded block">
                {`<YouTubeEmbed videoId="dQw4w9WgXcQ" title="Rick Astley - Never Gonna Give You Up" />`}
              </code>
            </CardContent>
          </Card>

          {/* Example 2: Valid YouTube URL */}
          <Card>
            <CardHeader>
              <CardTitle>Example 2: Using YouTube URL</CardTitle>
            </CardHeader>
            <CardContent>
              <YouTubeEmbed
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                title="Using URL instead of ID"
                autoPlay={false}
                showControls={true}
                className="mb-4"
              />
              <code className="text-sm bg-gray-100 p-2 rounded block">
                {`<YouTubeEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />`}
              </code>
            </CardContent>
          </Card>

          {/* Example 3: Invalid/Unavailable Video */}
          <Card>
            <CardHeader>
              <CardTitle>Example 3: Unavailable Video (Fallback Demo)</CardTitle>
            </CardHeader>
            <CardContent>
              <YouTubeEmbed
                videoId="invalidVideoId123"
                title="This video doesn't exist"
                autoPlay={false}
                showControls={true}
                className="mb-4"
              />
              <code className="text-sm bg-gray-100 p-2 rounded block">
                {`<YouTubeEmbed videoId="invalidVideoId123" title="This video doesn't exist" />`}
              </code>
            </CardContent>
          </Card>

          {/* Example 4: Course Integration Example */}
          <Card>
            <CardHeader>
              <CardTitle>Example 4: Course Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Chapter 1: Introduction to JavaScript</h3>
                <p className="text-gray-600">
                  Learn the basics of JavaScript programming language in this comprehensive tutorial.
                </p>
                <YouTubeEmbed
                  videoId="W6NZfCO5SIk"
                  title="JavaScript Tutorial for Beginners"
                  autoPlay={false}
                  showControls={true}
                  className="mb-4"
                />
                <code className="text-sm bg-gray-100 p-2 rounded block">
                  {`// In your course component:
{chapter.videoUrl && course.includeVideos && (
  <YouTubeEmbed
    url={chapter.videoUrl}
    title={\`\${chapter.title} - Video Tutorial\`}
    autoPlay={false}
    showControls={true}
  />
)}`}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>Server Validation:</strong> Each video is validated via <code>/api/youtube/validate</code> to ensure it's public and embeddable</li>
            <li>• <strong>Graceful Fallbacks:</strong> If a video is unavailable, shows a fallback with thumbnail and link to YouTube</li>
            <li>• <strong>Responsive Design:</strong> Videos are fully responsive and work on all screen sizes</li>
            <li>• <strong>Auto-discovery:</strong> When creating courses, videos are automatically found based on chapter content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
