'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import SimpleYouTubeEmbed from '@/components/SimpleYouTubeEmbed';

export default function TestCourseGenerationPage() {
  const [formData, setFormData] = useState({
    topic: 'React Hooks',
    category: 'programming',
    difficulty: 'Beginner',
    duration: '3-5 hours',
    chapterCount: '5',
    includeVideos: true,
    includeQuiz: false
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedCourse(null);

    try {
      console.log('Generating course with data:', formData);
      
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
      console.log('Generated course:', data);
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
            <CardTitle>Test Course Generation with YouTube Integration</CardTitle>
            <p className="text-gray-600">Test the complete course generation flow including YouTube video embedding</p>
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
                <label className="block text-sm font-medium mb-2">Duration:</label>
                <Select 
                  value={formData.duration} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                    <SelectItem value="3-5 hours">3-5 hours</SelectItem>
                    <SelectItem value="6-10 hours">6-10 hours</SelectItem>
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
                  Include Quizzes
                </label>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !formData.topic}
              className="w-full"
            >
              {isGenerating ? 'Generating Course...' : 'Generate Course with Videos'}
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
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Difficulty:</strong> {generatedCourse.difficulty}
                  </div>
                  <div>
                    <strong>Duration:</strong> {generatedCourse.duration}
                  </div>
                  <div>
                    <strong>Chapters:</strong> {generatedCourse.chapters?.length || 0}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Chapters with Videos:</h4>
                  <div className="space-y-4">
                    {generatedCourse.chapters?.map((chapter, index) => (
                      <div key={chapter.id || index} className="border rounded-lg p-4">
                        <div className="mb-3">
                          <h5 className="font-medium">{chapter.title}</h5>
                          <p className="text-sm text-gray-600">{chapter.description}</p>
                        </div>
                        
                        {chapter.videoUrl ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                ✅ Video Found
                              </span>
                              <span className="text-xs text-gray-500">{chapter.videoUrl}</span>
                            </div>
                            <SimpleYouTubeEmbed
                              url={chapter.videoUrl}
                              title={chapter.title}
                              className="w-full"
                              height="200"
                            />
                          </div>
                        ) : (
                          <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block">
                            ❌ No Video Found
                          </div>
                        )}
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
            <CardTitle>Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Required Environment Variables:</strong>
              </div>
              <div className="ml-4 space-y-1">
                <div>• GEMINI_API_KEY - For course content generation</div>
                <div>• YOUTUBE_API_KEY - For video search and embedding</div>
              </div>
              <div className="mt-3">
                <strong>How it works:</strong>
              </div>
              <div className="ml-4 space-y-1 text-gray-600">
                <div>1. Generate course content with Gemini AI</div>
                <div>2. Search YouTube for relevant videos using chapter titles</div>
                <div>3. Embed the best matching video for each chapter</div>
                <div>4. Display course with integrated video content</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
