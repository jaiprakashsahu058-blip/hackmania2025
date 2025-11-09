'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthGuard from '@/components/AuthGuard';

export default function TestCourseBuilder() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);

  const generateCourse = async () => {
    if (!topic.trim()) {
      setError('Please enter a course topic');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCourseData(null);

    try {
      const response = await fetch('/api/courses/structured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          category: 'Technology',
          difficulty: 'Beginner',
          duration: '3-5 hours',
          moduleCount: 4,
          includeVideos: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate course: ${response.status}`);
      }

      const data = await response.json();
      setCourseData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 border-0 bg-black/20 backdrop-blur-xl shadow-2xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                🎓 OpenRouter AI Course Builder Test
              </CardTitle>
              <p className="text-purple-200 text-sm">
                Testing 3 specialized models: GPT-3.5 (Syllabus) + LongCat (Content) + GPT-OSS (Quiz)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter course topic (e.g., 'Introduction to Machine Learning')"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60"
                  onKeyDown={(e) => e.key === 'Enter' && generateCourse()}
                />
                <Button
                  onClick={generateCourse}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? 'Generating...' : 'Generate Course'}
                </Button>
              </div>
              
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200">
                  Error: {error}
                </div>
              )}
            </CardContent>
          </Card>

          {courseData && (
            <Card className="border-0 bg-black/20 backdrop-blur-xl shadow-2xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Generated Course Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Course Title and Overview */}
                  <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {courseData.course_title}
                    </h2>
                    <p className="text-white/80">
                      {courseData.overview}
                    </p>
                  </div>

                  {/* Modules */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">
                      Modules ({courseData.modules?.length || 0})
                    </h3>
                    
                    {courseData.modules?.map((module, index) => (
                      <div key={index} className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {module.title}
                        </h4>
                        
                        <p className="text-white/80 mb-4 whitespace-pre-line">
                          {module.description}
                        </p>
                        
                        {/* Learning Objectives */}
                        {module.objectives && module.objectives.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-md font-medium text-white mb-2">Learning Objectives:</h5>
                            <ul className="list-disc list-inside space-y-1 text-white/70">
                              {module.objectives.map((objective, objIndex) => (
                                <li key={objIndex}>{objective}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Quiz Questions */}
                        {module.quiz && module.quiz.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-md font-medium text-white mb-2">
                              📝 Quiz Questions ({module.quiz.length}):
                            </h5>
                            <div className="space-y-3">
                              {module.quiz.map((question, qIndex) => (
                                <div key={qIndex} className="p-3 bg-green-500/20 rounded border border-green-400/30">
                                  <p className="text-white font-medium mb-2">
                                    Q{qIndex + 1}: {question.question}
                                  </p>
                                  <div className="space-y-1 mb-2">
                                    {question.options?.map((option, optIndex) => (
                                      <div key={optIndex} className={`p-2 rounded text-sm ${
                                        question.correct_answer === option || question.correctAnswer === optIndex
                                          ? 'bg-green-600/30 text-green-200 border border-green-500/50'
                                          : 'bg-white/10 text-white/70'
                                      }`}>
                                        {String.fromCharCode(65 + optIndex)}. {option}
                                      </div>
                                    ))}
                                  </div>
                                  {question.explanation && (
                                    <p className="text-green-200 text-xs italic">
                                      💡 {question.explanation}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos */}
                        {module.videos && module.videos.length > 0 && (
                          <div>
                            <h5 className="text-md font-medium text-white mb-2">
                              Videos ({module.videos.length}):
                            </h5>
                            <div className="space-y-3">
                              {module.videos.map((video, videoIndex) => (
                                <div key={videoIndex} className="p-3 bg-black/30 rounded border border-white/10">
                                  <p className="text-white/80 text-sm mb-2">{video.title}</p>
                                  <div 
                                    className="aspect-video bg-black/50 rounded overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: video.embed_code }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Raw JSON Output */}
                  <details className="p-4 bg-gray-500/20 rounded-lg border border-gray-400/30">
                    <summary className="text-white font-medium cursor-pointer">
                      View Raw JSON Output
                    </summary>
                    <pre className="mt-4 p-4 bg-black/50 rounded text-xs text-white/70 overflow-auto">
                      {JSON.stringify(courseData, null, 2)}
                    </pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}