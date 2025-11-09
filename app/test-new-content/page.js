'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

export default function TestNewContent() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [rawContent, setRawContent] = useState('');

  const testGeneration = async () => {
    setLoading(true);
    setContent('');
    setRawContent('');

    try {
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Fat Loss Basics',
          category: 'Health & Fitness',
          difficulty: 'Beginner',
          duration: '3-5 hours',
          chapterCount: 1,
          includeVideos: false,
          includeQuiz: false
        })
      });

      const data = await response.json();
      
      if (data.courseData?.modules?.[0]?.description) {
        const moduleContent = data.courseData.modules[0].description;
        setContent(moduleContent);
        setRawContent(moduleContent);
      } else {
        setContent('Error: No content generated');
      }
    } catch (error) {
      setContent(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          🧪 Test New Content Generation
        </h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <p className="text-white mb-4">
            This will generate ONE module and show you the content structure.
          </p>
          <Button 
            onClick={testGeneration}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Generating... (30-60 seconds)' : 'Generate Test Module'}
          </Button>
        </div>

        {loading && (
          <div className="bg-blue-900 p-6 rounded-lg mb-6">
            <p className="text-white animate-pulse">
              ⏳ Generating content... Please wait 30-60 seconds
            </p>
          </div>
        )}

        {rawContent && (
          <>
            {/* Checklist */}
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-white mb-4">✅ Content Checklist:</h2>
              <ul className="space-y-2 text-white">
                <li className={rawContent.includes('## 📚 Introduction') ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.includes('## 📚 Introduction') ? '✅' : '❌'} Has "## 📚 Introduction"
                </li>
                <li className={rawContent.includes('## 🎯 Core Concepts') ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.includes('## 🎯 Core Concepts') ? '✅' : '❌'} Has "## 🎯 Core Concepts"
                </li>
                <li className={rawContent.includes('### Concept') ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.includes('### Concept') ? '✅' : '❌'} Has "### Concept" subsections
                </li>
                <li className={rawContent.includes('**What it is:**') ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.includes('**What it is:**') ? '✅' : '❌'} Has "**What it is:**" format
                </li>
                <li className={rawContent.includes('## 💡 Real-World Examples') ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.includes('## 💡 Real-World Examples') ? '✅' : '❌'} Has "## 💡 Real-World Examples"
                </li>
                <li className={rawContent.includes('## ✅ Best Practices') ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.includes('## ✅ Best Practices') ? '✅' : '❌'} Has "## ✅ Best Practices"
                </li>
                <li className={rawContent.includes('## ⚠') ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.includes('## ⚠') ? '✅' : '❌'} Has "## ⚠ Common Mistakes"
                </li>
                <li className={rawContent.includes('## 🎓 Key Takeaways') ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.includes('## 🎓 Key Takeaways') ? '✅' : '❌'} Has "## 🎓 Key Takeaways"
                </li>
                <li className={rawContent.length > 2000 ? 'text-green-400' : 'text-red-400'}>
                  {rawContent.length > 2000 ? '✅' : '❌'} Length: {rawContent.length} chars (should be 2000+)
                </li>
              </ul>
            </div>

            {/* Raw Content */}
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-white mb-4">📄 Raw Content:</h2>
              <pre className="text-gray-300 text-sm overflow-auto whitespace-pre-wrap">
                {rawContent}
              </pre>
            </div>

            {/* Rendered Content */}
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎨 Rendered Content:</h2>
              <ReactMarkdown
                className="prose prose-lg max-w-none"
                components={{
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-4 text-purple-700" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-purple-600" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-purple-600" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
