'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function TestQuizFlowPage() {
  const [formData, setFormData] = useState({
    topic: 'React Hooks',
    category: 'programming',
    difficulty: 'Beginner',
    duration: '3-5 hours',
    chapterCount: '3',
    includeVideos: false,
    includeQuiz: true
  });
  
  const [testResults, setTestResults] = useState({
    generation: null,
    saving: null,
    retrieval: null,
    frontend: null
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedCourseId, setGeneratedCourseId] = useState(null);

  const runCompleteTest = async () => {
    setIsRunning(true);
    setTestResults({
      generation: null,
      saving: null,
      retrieval: null,
      frontend: null
    });

    try {
      // Step 1: Test Course Generation with Quiz
      setCurrentStep('Testing course generation with quiz...');
      const generationResult = await testCourseGeneration();
      setTestResults(prev => ({ ...prev, generation: generationResult }));

      if (!generationResult.success) {
        throw new Error('Course generation failed');
      }

      // Step 2: Test Course Saving
      setCurrentStep('Testing course saving to database...');
      const savingResult = await testCourseSaving(generationResult.courseData);
      setTestResults(prev => ({ ...prev, saving: savingResult }));

      if (!savingResult.success) {
        throw new Error('Course saving failed');
      }

      setGeneratedCourseId(savingResult.courseId);

      // Step 3: Test Course Retrieval
      setCurrentStep('Testing course retrieval from database...');
      const retrievalResult = await testCourseRetrieval(savingResult.courseId);
      setTestResults(prev => ({ ...prev, retrieval: retrievalResult }));

      // Step 4: Test Frontend Integration
      setCurrentStep('Testing frontend quiz integration...');
      const frontendResult = await testFrontendIntegration(retrievalResult.courseData);
      setTestResults(prev => ({ ...prev, frontend: frontendResult }));

    } catch (error) {
      console.error('Test flow error:', error);
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const testCourseGeneration = async () => {
    try {
      console.log('🧪 Testing course generation...');
      
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: 'Course generation API failed',
          details: data.error || 'Unknown error',
          data: data
        };
      }

      const course = data.course;
      
      // Check both modules (new structure) and chapters (legacy)
      const modules = course?.modules || [];
      const chapters = course?.chapters || [];
      
      const modulesWithQuiz = modules.filter(m => m.quiz && m.quiz.length > 0);
      const chaptersWithQuiz = chapters.filter(ch => ch.quiz && ch.quiz.length > 0);
      
      const totalModuleQuestions = modulesWithQuiz.reduce((sum, m) => sum + m.quiz.length, 0);
      const totalChapterQuestions = chaptersWithQuiz.reduce((sum, ch) => sum + ch.quiz.length, 0);
      
      const totalQuestions = totalModuleQuestions + totalChapterQuestions;
      const totalWithQuiz = modulesWithQuiz.length + chaptersWithQuiz.length;

      if (formData.includeQuiz && totalWithQuiz === 0) {
        return {
          success: false,
          message: 'Quiz generation failed',
          details: 'No modules or chapters have quiz data despite includeQuiz=true',
          courseData: course
        };
      }

      return {
        success: true,
        message: 'Course generation successful',
        details: `Generated ${modules.length} modules + ${chapters.length} chapters, ${totalWithQuiz} with quizzes (${totalQuestions} total questions)`,
        courseData: course,
        modulesWithQuiz: modulesWithQuiz.length,
        chaptersWithQuiz: chaptersWithQuiz.length,
        totalQuestions: totalQuestions
      };

    } catch (error) {
      return {
        success: false,
        message: 'Course generation request failed',
        details: error.message
      };
    }
  };

  const testCourseSaving = async (courseData) => {
    try {
      console.log('💾 Testing course saving...');
      
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_title: courseData.course_title || courseData.title,
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          difficulty: courseData.difficulty,
          duration: courseData.duration,
          modules: courseData.modules || [], // New JSONB structure
          include_quiz: courseData.include_quiz || courseData.includeQuiz,
          include_videos: courseData.include_videos || courseData.includeVideos,
          topic: courseData.topic,
          generatedChapters: courseData.chapters, // Legacy support
          quizzes: courseData.quizzes
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: 'Course saving failed',
          details: data.error || 'Unknown error',
          data: data
        };
      }

      return {
        success: true,
        message: 'Course saved successfully',
        details: `Course ID: ${data.course.id}`,
        courseId: data.course.id,
        savedCourse: data.course
      };

    } catch (error) {
      return {
        success: false,
        message: 'Course saving request failed',
        details: error.message
      };
    }
  };

  const testCourseRetrieval = async (courseId) => {
    try {
      console.log('📖 Testing course retrieval...');
      
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: 'Course retrieval failed',
          details: data.error || 'Unknown error',
          data: data
        };
      }

      const course = data.course;
      const chaptersWithQuiz = course?.chapters?.filter(ch => ch.quiz && Array.isArray(ch.quiz) && ch.quiz.length > 0) || [];
      const totalQuestions = chaptersWithQuiz.reduce((sum, ch) => sum + ch.quiz.length, 0);

      if (formData.includeQuiz && chaptersWithQuiz.length === 0) {
        return {
          success: false,
          message: 'Quiz data lost during save/retrieve',
          details: 'Course was saved but quiz data is missing from database',
          courseData: course
        };
      }

      return {
        success: true,
        message: 'Course retrieval successful',
        details: `Retrieved ${course?.chapters?.length || 0} chapters, ${chaptersWithQuiz.length} with quizzes (${totalQuestions} total questions)`,
        courseData: course,
        chaptersWithQuiz: chaptersWithQuiz.length,
        totalQuestions: totalQuestions
      };

    } catch (error) {
      return {
        success: false,
        message: 'Course retrieval request failed',
        details: error.message
      };
    }
  };

  const testFrontendIntegration = async (courseData) => {
    try {
      console.log('🎨 Testing frontend integration...');
      
      // Check if ModuleQuizSection component can handle the quiz data
      const chaptersWithQuiz = courseData?.chapters?.filter(ch => ch.quiz && ch.quiz.length > 0) || [];
      
      if (chaptersWithQuiz.length === 0) {
        return {
          success: false,
          message: 'No quiz data for frontend testing',
          details: 'Cannot test frontend integration without quiz data'
        };
      }

      // Validate quiz data structure
      const validQuizzes = chaptersWithQuiz.filter(chapter => {
        return chapter.quiz.every(q => 
          q.question && 
          Array.isArray(q.options) && 
          q.options.length >= 2 && 
          q.correct_answer &&
          q.options.includes(q.correct_answer)
        );
      });

      if (validQuizzes.length !== chaptersWithQuiz.length) {
        return {
          success: false,
          message: 'Invalid quiz data structure',
          details: `${validQuizzes.length}/${chaptersWithQuiz.length} chapters have valid quiz structure`
        };
      }

      return {
        success: true,
        message: 'Frontend integration ready',
        details: `${validQuizzes.length} chapters have valid quiz data for ModuleQuizSection component`,
        validQuizzes: validQuizzes.length
      };

    } catch (error) {
      return {
        success: false,
        message: 'Frontend integration test failed',
        details: error.message
      };
    }
  };

  const getStatusIcon = (result) => {
    if (!result) return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    if (result.success) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (result) => {
    if (!result) return 'border-gray-200 bg-gray-50';
    if (result.success) return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Complete Quiz Flow Test</CardTitle>
            <p className="text-gray-600">
              Test the entire quiz generation, saving, retrieval, and frontend integration flow
            </p>
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
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeQuiz"
                  checked={formData.includeQuiz}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeQuiz: checked }))}
                />
                <label htmlFor="includeQuiz" className="text-sm font-medium">
                  Include AI-Generated Quizzes (Required for this test)
                </label>
              </div>
            </div>
            
            <Button 
              onClick={runCompleteTest} 
              disabled={isRunning || !formData.topic || !formData.includeQuiz}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {currentStep || 'Running tests...'}
                </>
              ) : (
                'Run Complete Quiz Flow Test'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Generation Test */}
          <Card className={getStatusColor(testResults.generation)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(testResults.generation)}
                <div className="flex-1">
                  <h3 className="font-semibold">1. Course Generation</h3>
                  {testResults.generation ? (
                    <>
                      <p className="text-sm mt-1">{testResults.generation.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{testResults.generation.details}</p>
                      {testResults.generation.chaptersWithQuiz > 0 && (
                        <div className="mt-2 text-xs bg-blue-100 text-blue-800 p-2 rounded">
                          ✅ {testResults.generation.chaptersWithQuiz} chapters with {testResults.generation.totalQuestions} total questions
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

          {/* Saving Test */}
          <Card className={getStatusColor(testResults.saving)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(testResults.saving)}
                <div className="flex-1">
                  <h3 className="font-semibold">2. Database Saving</h3>
                  {testResults.saving ? (
                    <>
                      <p className="text-sm mt-1">{testResults.saving.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{testResults.saving.details}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Not tested yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Retrieval Test */}
          <Card className={getStatusColor(testResults.retrieval)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(testResults.retrieval)}
                <div className="flex-1">
                  <h3 className="font-semibold">3. Database Retrieval</h3>
                  {testResults.retrieval ? (
                    <>
                      <p className="text-sm mt-1">{testResults.retrieval.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{testResults.retrieval.details}</p>
                      {testResults.retrieval.chaptersWithQuiz > 0 && (
                        <div className="mt-2 text-xs bg-green-100 text-green-800 p-2 rounded">
                          ✅ Quiz data preserved: {testResults.retrieval.chaptersWithQuiz} chapters with {testResults.retrieval.totalQuestions} questions
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

          {/* Frontend Test */}
          <Card className={getStatusColor(testResults.frontend)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(testResults.frontend)}
                <div className="flex-1">
                  <h3 className="font-semibold">4. Frontend Integration</h3>
                  {testResults.frontend ? (
                    <>
                      <p className="text-sm mt-1">{testResults.frontend.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{testResults.frontend.details}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Not tested yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Generated Course */}
        {generatedCourseId && (
          <Card>
            <CardHeader>
              <CardTitle>🎯 Test Course Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">
                  <strong>Course ID:</strong> {generatedCourseId}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(`/create-course/${generatedCourseId}`, '_blank')}
                    variant="outline"
                  >
                    View Course Page
                  </Button>
                  <Button
                    onClick={() => window.open(`/api/courses/${generatedCourseId}`, '_blank')}
                    variant="outline"
                  >
                    View Raw API Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>If Generation Fails:</strong>
                <p className="text-gray-600 ml-4">• Check GEMINI_API_KEY in environment variables<br />• Verify Gemini API quota and permissions<br />• Check server console for JSON parsing errors</p>
              </div>
              <div>
                <strong>If Saving Fails:</strong>
                <p className="text-gray-600 ml-4">• Verify database connection<br />• Check if quiz field exists in chapters table<br />• Ensure includeQuiz field exists in courses table</p>
              </div>
              <div>
                <strong>If Retrieval Fails:</strong>
                <p className="text-gray-600 ml-4">• Quiz data might be lost due to schema mismatch<br />• Check database logs for JSONB serialization errors<br />• Verify course and chapters were saved correctly</p>
              </div>
              <div>
                <strong>If Frontend Fails:</strong>
                <p className="text-gray-600 ml-4">• Quiz data structure might be invalid<br />• Check that questions have correct_answer in options array<br />• Verify ModuleQuizSection component is imported correctly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
