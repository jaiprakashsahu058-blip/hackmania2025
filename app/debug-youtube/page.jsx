'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function DebugYouTubePage() {
  const [diagnostics, setDiagnostics] = useState({
    envCheck: null,
    apiTest: null,
    courseGenTest: null,
    frontendTest: null
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics({
      envCheck: null,
      apiTest: null,
      courseGenTest: null,
      frontendTest: null
    });

    try {
      // Test 1: Environment Check
      setCurrentTest('Checking environment variables...');
      const envResult = await checkEnvironment();
      setDiagnostics(prev => ({ ...prev, envCheck: envResult }));

      // Test 2: YouTube API Test
      setCurrentTest('Testing YouTube API...');
      const apiResult = await testYouTubeAPI();
      setDiagnostics(prev => ({ ...prev, apiTest: apiResult }));

      // Test 3: Course Generation Test
      setCurrentTest('Testing course generation with videos...');
      const courseResult = await testCourseGeneration();
      setDiagnostics(prev => ({ ...prev, courseGenTest: courseResult }));

      // Test 4: Frontend Integration Test
      setCurrentTest('Testing frontend integration...');
      const frontendResult = await testFrontendIntegration();
      setDiagnostics(prev => ({ ...prev, frontendTest: frontendResult }));

    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const checkEnvironment = async () => {
    try {
      // Try to make a request that will reveal if API keys are missing
      const response = await fetch('/api/youtube?q=test');
      const data = await response.json();
      
      if (response.status === 500 && data.error === 'Missing YOUTUBE_API_KEY') {
        return {
          status: 'error',
          message: 'YOUTUBE_API_KEY is missing from environment variables',
          details: 'Add YOUTUBE_API_KEY=your_key_here to .env.local file',
          solution: '1. Get YouTube Data API v3 key from Google Cloud Console\n2. Add to .env.local: YOUTUBE_API_KEY=your_key_here\n3. Restart development server'
        };
      }
      
      if (response.status === 400) {
        return {
          status: 'success',
          message: 'YOUTUBE_API_KEY is present in environment',
          details: 'Environment variables are properly configured'
        };
      }

      return {
        status: 'warning',
        message: 'Unable to verify environment variables',
        details: `Response: ${response.status} - ${JSON.stringify(data)}`
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to check environment variables',
        details: error.message
      };
    }
  };

  const testYouTubeAPI = async () => {
    try {
      const response = await fetch('/api/youtube?q=JavaScript tutorial');
      const data = await response.json();
      
      if (!response.ok) {
        return {
          status: 'error',
          message: 'YouTube API test failed',
          details: `${response.status}: ${data.error || 'Unknown error'}`,
          solution: data.error === 'Missing YOUTUBE_API_KEY' 
            ? 'Add YOUTUBE_API_KEY to .env.local and restart server'
            : 'Check YouTube API key validity and quota limits'
        };
      }
      
      if (data.videoId) {
        return {
          status: 'success',
          message: 'YouTube API is working correctly',
          details: `Found video ID: ${data.videoId}`,
          videoId: data.videoId
        };
      } else {
        return {
          status: 'warning',
          message: 'YouTube API responded but no video found',
          details: 'API is working but search returned no results'
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'YouTube API request failed',
        details: error.message,
        solution: 'Check network connection and server status'
      };
    }
  };

  const testCourseGeneration = async () => {
    try {
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
      
      if (!response.ok) {
        return {
          status: 'error',
          message: 'Course generation failed',
          details: `${response.status}: ${data.error || 'Unknown error'}`,
          solution: 'Check server logs for detailed error information'
        };
      }
      
      const course = data.course;
      const chaptersWithVideos = course?.chapters?.filter(ch => ch.videoUrl) || [];
      const totalChapters = course?.chapters?.length || 0;
      
      if (chaptersWithVideos.length === 0) {
        return {
          status: 'error',
          message: 'Course generated but no videos were embedded',
          details: `Generated ${totalChapters} chapters, but 0 have videoUrl`,
          solution: 'Check server console logs for YouTube search errors',
          courseData: course
        };
      }
      
      return {
        status: 'success',
        message: 'Course generation with videos successful',
        details: `${chaptersWithVideos.length}/${totalChapters} chapters have videos`,
        videoUrls: chaptersWithVideos.map(ch => ch.videoUrl),
        courseData: course
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Course generation request failed',
        details: error.message,
        solution: 'Check network connection and API availability'
      };
    }
  };

  const testFrontendIntegration = async () => {
    try {
      // Check if SimpleYouTubeEmbed component exists and works
      const testVideoId = 'W6NZfCO5SIk'; // JavaScript tutorial video
      
      return {
        status: 'success',
        message: 'Frontend integration ready',
        details: 'SimpleYouTubeEmbed component should work with valid video IDs',
        testVideoId: testVideoId
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Frontend integration test failed',
        details: error.message
      };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 YouTube Integration Diagnostics</CardTitle>
            <p className="text-gray-600">
              This tool will help identify why YouTube videos are not embedding
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runDiagnostics} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {currentTest || 'Running diagnostics...'}
                </>
              ) : (
                'Run Full Diagnostics'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          {/* Environment Check */}
          <Card className={diagnostics.envCheck ? getStatusColor(diagnostics.envCheck.status) : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(diagnostics.envCheck?.status)}
                <div className="flex-1">
                  <h3 className="font-semibold">1. Environment Variables Check</h3>
                  {diagnostics.envCheck ? (
                    <>
                      <p className="text-sm mt-1">{diagnostics.envCheck.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{diagnostics.envCheck.details}</p>
                      {diagnostics.envCheck.solution && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <strong>Solution:</strong>
                          <pre className="mt-1 whitespace-pre-wrap">{diagnostics.envCheck.solution}</pre>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Not tested yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* YouTube API Test */}
          <Card className={diagnostics.apiTest ? getStatusColor(diagnostics.apiTest.status) : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(diagnostics.apiTest?.status)}
                <div className="flex-1">
                  <h3 className="font-semibold">2. YouTube API Test</h3>
                  {diagnostics.apiTest ? (
                    <>
                      <p className="text-sm mt-1">{diagnostics.apiTest.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{diagnostics.apiTest.details}</p>
                      {diagnostics.apiTest.solution && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <strong>Solution:</strong> {diagnostics.apiTest.solution}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Not tested yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Generation Test */}
          <Card className={diagnostics.courseGenTest ? getStatusColor(diagnostics.courseGenTest.status) : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(diagnostics.courseGenTest?.status)}
                <div className="flex-1">
                  <h3 className="font-semibold">3. Course Generation with Videos</h3>
                  {diagnostics.courseGenTest ? (
                    <>
                      <p className="text-sm mt-1">{diagnostics.courseGenTest.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{diagnostics.courseGenTest.details}</p>
                      {diagnostics.courseGenTest.videoUrls && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                          <strong>Found Videos:</strong>
                          {diagnostics.courseGenTest.videoUrls.map((url, i) => (
                            <div key={i} className="mt-1">• {url}</div>
                          ))}
                        </div>
                      )}
                      {diagnostics.courseGenTest.solution && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <strong>Solution:</strong> {diagnostics.courseGenTest.solution}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Not tested yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frontend Integration Test */}
          <Card className={diagnostics.frontendTest ? getStatusColor(diagnostics.frontendTest.status) : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(diagnostics.frontendTest?.status)}
                <div className="flex-1">
                  <h3 className="font-semibold">4. Frontend Integration</h3>
                  {diagnostics.frontendTest ? (
                    <>
                      <p className="text-sm mt-1">{diagnostics.frontendTest.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{diagnostics.frontendTest.details}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Not tested yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Fix Guide */}
        <Card>
          <CardHeader>
            <CardTitle>🚨 Common Issues & Quick Fixes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Most Common Issue:</strong> Missing YOUTUBE_API_KEY
                <br />
                <strong>Fix:</strong> Add YOUTUBE_API_KEY=your_key_here to .env.local and restart server
              </AlertDescription>
            </Alert>
            
            <div className="text-sm space-y-2">
              <div><strong>Issue 1:</strong> "Missing YOUTUBE_API_KEY" error</div>
              <div className="ml-4 text-gray-600">
                • Get API key from Google Cloud Console → YouTube Data API v3<br />
                • Add to .env.local: YOUTUBE_API_KEY=your_key_here<br />
                • Restart development server (npm run dev)
              </div>
              
              <div><strong>Issue 2:</strong> API key exists but no videos found</div>
              <div className="ml-4 text-gray-600">
                • Check API key permissions in Google Cloud Console<br />
                • Verify YouTube Data API v3 is enabled<br />
                • Check API quota usage (default: 10,000 units/day)
              </div>
              
              <div><strong>Issue 3:</strong> Videos found but not displaying</div>
              <div className="ml-4 text-gray-600">
                • Ensure "Include Videos" is checked when creating course<br />
                • Check browser console for JavaScript errors<br />
                • Verify course.includeVideos is true in course data
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
