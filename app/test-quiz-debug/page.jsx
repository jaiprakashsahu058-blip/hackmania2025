'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuizDebugPage() {
  const [chapterId, setChapterId] = useState('');
  const [debugResult, setDebugResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runDebug = async () => {
    setIsLoading(true);
    setError(null);
    setDebugResult(null);

    try {
      const response = await fetch('/api/debug-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: chapterId || 'test-chapter-id' }),
      });

      const data = await response.json();
      setDebugResult(data);

      if (!response.ok) {
        setError(data.error || 'Debug failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testQuizGeneration = async () => {
    if (!chapterId) {
      setError('Please enter a chapter ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setDebugResult({ 
          success: true, 
          message: 'Quiz generation successful!', 
          data 
        });
      } else {
        setError(data.error || 'Quiz generation failed');
        setDebugResult({ success: false, data });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Generation Debug Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chapter ID (optional):</label>
              <Input
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                placeholder="Enter chapter ID to test specific chapter"
              />
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={runDebug} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? 'Running Debug...' : 'Run Debug Check'}
              </Button>
              
              <Button 
                onClick={testQuizGeneration} 
                disabled={isLoading || !chapterId}
              >
                {isLoading ? 'Testing...' : 'Test Quiz Generation'}
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

        {debugResult && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debugResult.recommendations && (
                  <div>
                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {debugResult.recommendations.map((rec, index) => (
                        <li key={index} className={`text-sm p-2 rounded ${
                          rec.startsWith('❌') ? 'bg-red-50 text-red-700' :
                          rec.startsWith('ℹ️') ? 'bg-blue-50 text-blue-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {debugResult.debug && (
                  <div>
                    <h4 className="font-semibold mb-2">Debug Information:</h4>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(debugResult.debug, null, 2)}
                    </pre>
                  </div>
                )}

                {debugResult.success !== undefined && (
                  <div className={`p-4 rounded ${
                    debugResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <h4 className="font-semibold">
                      {debugResult.success ? 'Success!' : 'Failed'}
                    </h4>
                    <p className="text-sm mt-1">{debugResult.message}</p>
                    {debugResult.data && (
                      <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                        {JSON.stringify(debugResult.data, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>1. Missing Environment Variables:</strong>
                <p className="text-gray-600">Make sure you have GEMINI_API_KEY and DATABASE_URL in your .env.local file</p>
              </div>
              <div>
                <strong>2. Database Tables Not Created:</strong>
                <p className="text-gray-600">Run database migration to create quizzes and user_progress tables</p>
              </div>
              <div>
                <strong>3. Chapter Has No Content:</strong>
                <p className="text-gray-600">Quiz generation requires chapter content. Make sure chapters have content field populated</p>
              </div>
              <div>
                <strong>4. Chapter Not Found:</strong>
                <p className="text-gray-600">Verify the chapter ID exists in the database</p>
              </div>
              <div>
                <strong>5. Quiz Already Exists:</strong>
                <p className="text-gray-600">Quiz generation skips if quiz already exists for the chapter</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
