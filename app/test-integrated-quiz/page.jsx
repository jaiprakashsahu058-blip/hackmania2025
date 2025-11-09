'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import ModuleQuizSection from '@/components/ModuleQuizSection';

export default function TestIntegratedQuizPage() {
  const [formData, setFormData] = useState({
    topic: 'React Hooks',
    category: 'programming',
    difficulty: 'Beginner',
    duration: '3-5 hours',
    chapterCount: '3',
    includeVideos: true,
    includeQuiz: true
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedCourse(null);

    try {
      console.log('Generating course with integrated quizzes:', formData);
      
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Generated course with quizzes:', data);
      setGeneratedCourse(data.course);
      
    } catch (err) {
      console.error('Course generation error:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧠 Test Integrated Quiz Generation</CardTitle>
            <p className="text-gray-600">Test course generation with Gemini AI-generated quizzes integrated directly into modules</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Topic:</label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., React Hooks, Python Basics"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category:</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="creative">Creative Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty:</label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chapter Count:</label>
                <Select 
                  value={formData.chapterCount} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, chapterCount: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Chapters</SelectItem>
                    <SelectItem value="5">5 Chapters</SelectItem>
                    <SelectItem value="8">8 Chapters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeVideos"
                  checked={formData.includeVideos}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeVideos: checked }))}
                />
                <label htmlFor="includeVideos" className="text-sm font-medium">
                  Include YouTube Videos
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeQuiz"
                  checked={formData.includeQuiz}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeQuiz: checked }))}
                />
                <label htmlFor="includeQuiz" className="text-sm font-medium">
                  Include AI-Generated Quizzes
                </label>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !formData.topic}
              className="w-full"
            >
              {isGenerating ? 'Generating Course with Integrated Quizzes...' : 'Generate Course with AI Quizzes'}
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

        {generatedCourse && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Course: {generatedCourse.title}</CardTitle>
              <p className="text-gray-600">{generatedCourse.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Difficulty:</strong> {generatedCourse.difficulty}
                  </div>
                  <div>
                    <strong>Duration:</strong> {generatedCourse.duration}
                  </div>
                  <div>
                    <strong>Chapters:</strong> {generatedCourse.chapters?.length || 0}
                  </div>
                  <div>
                    <strong>Include Quiz:</strong> {generatedCourse.includeQuiz ? '✅ Yes' : '❌ No'}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Chapters with Integrated Quizzes:</h4>
                  <div className="space-y-6">
                    {generatedCourse.chapters?.map((chapter, index) => (
                      <div key={chapter.id || index} className="border rounded-lg p-4">
                        <div className="mb-4">
                          <h5 className="font-medium text-lg">{chapter.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                        </div>
                        
                        {/* Video Section */}
                        {chapter.videoUrl && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                🎥 Video Available
                              </span>
                              <span className="text-xs text-gray-500">{chapter.videoUrl}</span>
                            </div>
                          </div>
                        )}

                        {/* Quiz Section */}
                        {chapter.quiz && chapter.quiz.length > 0 ? (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                🧠 AI-Generated Quiz ({chapter.quiz.length} questions)
                              </span>
                            </div>
                            <ModuleQuizSection
                              moduleId={chapter.id}
                              moduleTitle={chapter.title}
                              quizData={chapter.quiz}
                              onScoreUpdate={(score, correct, total) => {
                                console.log(`Quiz completed for ${chapter.title}:`, { score, correct, total });
                              }}
                            />
                          </div>
                        ) : (
                          <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block">
                            ❌ No Quiz Generated
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Quiz Summary:</h4>
                  <div className="bg-gray-100 p-4 rounded text-sm">
                    {generatedCourse.chapters?.filter(ch => ch.quiz && ch.quiz.length > 0).map((chapter, index) => (
                      <div key={index} className="mb-2">
                        <strong>{chapter.title}:</strong> {chapter.quiz.length} questions
                        <div className="ml-4 text-xs text-gray-600">
                          {chapter.quiz.slice(0, 2).map((q, i) => (
                            <div key={i}>• {q.question}</div>
                          ))}
                          {chapter.quiz.length > 2 && <div>... and {chapter.quiz.length - 2} more</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Raw Course Data:</h4>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(generatedCourse, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>How Integrated Quiz Generation Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>1. Single Gemini AI Call:</strong>
                <p className="text-gray-600">Course content and quizzes are generated together in one API call</p>
              </div>
              <div>
                <strong>2. Structured Prompt:</strong>
                <p className="text-gray-600">Gemini AI receives specific instructions to include quiz questions when includeQuiz is true</p>
              </div>
              <div>
                <strong>3. Module-Level Quizzes:</strong>
                <p className="text-gray-600">Each module gets 5 contextual quiz questions with explanations</p>
              </div>
              <div>
                <strong>4. Automatic Integration:</strong>
                <p className="text-gray-600">Quiz data is embedded directly in module structure, no separate API calls needed</p>
              </div>
              <div>
                <strong>5. Interactive Display:</strong>
                <p className="text-gray-600">ModuleQuizSection component handles quiz interaction and scoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
