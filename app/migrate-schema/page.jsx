'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, Loader2, Database } from 'lucide-react';

export default function MigrateSchemePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runMigration = async () => {
    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      console.log('🔧 Starting database schema migration...');
      
      const response = await fetch('/api/migrate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Migration failed');
      }

      setResult(data);
      console.log('✅ Migration completed:', data);
      
    } catch (err) {
      console.error('❌ Migration error:', err);
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Database Schema Migration
            </CardTitle>
            <p className="text-gray-600">
              Fix the "column does not exist" error by adding missing columns to your database
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800">
                  <strong>Error detected:</strong> column "include_quiz" of relation "courses" does not exist
                  <br />
                  This migration will add the missing columns to fix the database schema.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">This migration will add:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <code>include_quiz</code> column to courses table</li>
                <li>• <code>include_videos</code> column to courses table</li>
                <li>• <code>course_title</code> column to courses table</li>
                <li>• <code>modules</code> JSONB column to courses table</li>
                <li>• <code>quiz</code> JSONB column to chapters table</li>
                <li>• <code>video_url</code> column to chapters table</li>
              </ul>
            </div>
            
            <Button 
              onClick={runMigration} 
              disabled={isRunning}
              className="w-full"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Running Migration...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Run Database Migration
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Migration Failed</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                  <div className="mt-3 text-xs text-red-600">
                    <strong>Manual fix:</strong> Run this SQL in your database:
                    <pre className="mt-1 bg-red-100 p-2 rounded text-xs overflow-x-auto">
{`ALTER TABLE courses ADD COLUMN include_quiz BOOLEAN DEFAULT FALSE;
ALTER TABLE courses ADD COLUMN include_videos BOOLEAN DEFAULT FALSE;
ALTER TABLE courses ADD COLUMN course_title TEXT;
ALTER TABLE courses ADD COLUMN modules JSONB DEFAULT '[]'::jsonb;
ALTER TABLE chapters ADD COLUMN quiz JSONB;
ALTER TABLE chapters ADD COLUMN video_url TEXT;`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 mb-1">Migration SQL Generated!</h3>
                  <p className="text-blue-600 text-sm mb-3">{result.message}</p>
                  
                  {result.instructions && (
                    <div className="mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">Instructions:</h4>
                      <ol className="text-sm text-blue-700 space-y-1">
                        {result.instructions.map((instruction, index) => (
                          <li key={index}>{index + 1}. {instruction}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {result.sql && (
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Copy this SQL:</h4>
                      <div className="bg-gray-900 text-green-400 p-4 rounded text-xs font-mono overflow-x-auto">
                        <pre>{result.sql}</pre>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(result.sql)}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Copy SQL to Clipboard
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>After running the SQL:</strong>
                    </p>
                    <ul className="text-xs text-green-700 mt-1 space-y-1">
                      <li>• Restart your development server</li>
                      <li>• Try generating a course with quizzes again</li>
                      <li>• The "column does not exist" error should be gone</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>1. After Migration:</strong>
                <p className="text-gray-600 ml-4">Try generating a course again with "Include Quizzes" enabled</p>
              </div>
              <div>
                <strong>2. Test the Flow:</strong>
                <p className="text-gray-600 ml-4">Visit <code>/test-quiz-flow</code> to test the complete integration</p>
              </div>
              <div>
                <strong>3. Verify Data:</strong>
                <p className="text-gray-600 ml-4">Check that courses save successfully with quiz data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Migration (Alternative)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              If the automatic migration fails, you can run this SQL manually in your database:
            </p>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
{`-- Add missing columns to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS include_quiz BOOLEAN DEFAULT FALSE;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS include_videos BOOLEAN DEFAULT FALSE;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_title TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb;

-- Add missing columns to chapters table  
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS quiz JSONB;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Update NULL values
UPDATE courses SET include_quiz = FALSE WHERE include_quiz IS NULL;
UPDATE courses SET include_videos = FALSE WHERE include_videos IS NULL;`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
