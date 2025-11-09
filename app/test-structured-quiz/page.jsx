'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TestStructuredQuizPage() {
  const [chapterTitle, setChapterTitle] = useState('Introduction to JavaScript');
  const [chapterContent, setChapterContent] = useState(`JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web. It enables interactive web pages and is an essential part of web applications. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative programming styles.

JavaScript was initially created to make web pages alive. The programs in this language are called scripts. They can be written right in a web page's HTML and run automatically as the page loads. Scripts are provided and executed as plain text. They don't need special preparation or compilation to run.

Variables in JavaScript are containers for storing data values. JavaScript has several data types including primitive types like numbers, strings, booleans, undefined, null, and symbols, as well as non-primitive types like objects and arrays.`);
  const [difficulty, setDifficulty] = useState('beginner');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testQuizGeneration = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create a mock chapter first (in real app, this would be from database)
      const mockChapterId = 'test-chapter-' + Date.now();
      
      // Test the structured quiz generation API directly
      const response = await fetch('/api/generate-structured-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chapterId: mockChapterId,
          // For testing, we'll pass the content directly in the request
          testData: {
            title: chapterTitle,
            content: chapterContent,
            difficulty: difficulty
          }
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(data.message || data.error || 'Quiz generation failed');
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Structured Quiz Generation</CardTitle>
            <p className="text-gray-600">Test the improved quiz generation system with structured prompts</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chapter Title:</label>
              <Input
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Enter chapter title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level:</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chapter Content:</label>
              <Textarea
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
                placeholder="Enter chapter content (minimum 100 characters)"
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Content length: {chapterContent.length} characters
              </p>
            </div>
            
            <Button 
              onClick={testQuizGeneration} 
              disabled={isLoading || chapterContent.length < 100}
              className="w-full"
            >
              {isLoading ? 'Generating Quiz...' : 'Generate Structured Quiz'}
            </Button>
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

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.success ? '✅ Quiz Generated Successfully!' : '❌ Quiz Generation Failed'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.success && result.quiz && (
                  <div>
                    <h4 className="font-semibold mb-2">Generated Quiz:</h4>
                    <div className="bg-gray-100 p-4 rounded">
                      <h5 className="font-medium">{result.quiz.chapter_title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{result.quiz.chapter_summary}</p>
                      <p className="text-xs text-gray-500">
                        Difficulty: {result.quiz.difficulty} | 
                        Questions: {result.quiz.quiz?.length || 0} |
                        Generated: {result.quiz.metadata?.generated_at}
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Questions:</h5>
                      <div className="space-y-3">
                        {result.quiz.quiz?.map((question, index) => (
                          <div key={question.question_id} className="border rounded p-3 bg-white">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-blue-600">
                                {question.question_id}
                              </span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {question.question_type}
                              </span>
                            </div>
                            <p className="font-medium mb-2">{question.question_text}</p>
                            <div className="text-sm space-y-1">
                              {question.options?.map((option, i) => (
                                <div 
                                  key={i} 
                                  className={`p-1 rounded ${
                                    option === question.correct_answer 
                                      ? 'bg-green-100 text-green-800 font-medium' 
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {String.fromCharCode(65 + i)}. {option}
                                  {option === question.correct_answer && ' ✓'}
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-blue-600 mt-2">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Full Response:</h4>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>1. Structured Prompt:</strong>
                <p className="text-gray-600">Uses your provided structured prompt to ensure consistent JSON output from Gemini AI</p>
              </div>
              <div>
                <strong>2. Validation:</strong>
                <p className="text-gray-600">Validates the generated quiz structure and auto-fixes common issues</p>
              </div>
              <div>
                <strong>3. Database Storage:</strong>
                <p className="text-gray-600">Stores the complete quiz as JSON in the database for efficient retrieval</p>
              </div>
              <div>
                <strong>4. Fallback Handling:</strong>
                <p className="text-gray-600">Graceful error handling with retry mechanisms and detailed error messages</p>
              </div>
              <div>
                <strong>5. Question Types:</strong>
                <p className="text-gray-600">Supports MCQ, True/False, Fill-in-blank, and Code Output questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
