'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

export default function TestStructure() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const testDifficulty = async (difficulty) => {
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Machine Learning Basics',
          category: 'Technology',
          difficulty: difficulty,
          duration: '3-5 hours',
          chapterCount: 1,
          includeVideos: false,
          includeQuiz: false
        })
      });

      const data = await response.json();
      
      if (data.courseData?.modules?.[0]?.description) {
        const content = data.courseData.modules[0].description;
        
        // Check for all required sections
        const checks = {
          hasIntroduction: content.includes('## 📚 Introduction'),
          hasCoreConceptsHeader: content.includes('## 🎯 Core Concepts'),
          hasConceptSubsection: content.includes('### Concept'),
          hasWhatItIs: content.includes('**What it is:**'),
          hasWhyItMatters: content.includes('**Why it matters:**'),
          hasHowItWorks: content.includes('**How it works:**'),
          hasExample: content.includes('**Example:**'),
          hasRealWorldExamples: content.includes('## 💡 Real-World Examples'),
          hasBestPractices: content.includes('## ✅ Best Practices'),
          hasCommonMistakes: content.includes('## ⚠'),
          hasKeyTakeaways: content.includes('## 🎓 Key Takeaways'),
          length: content.length
        };

        setResults({
          difficulty,
          content,
          checks,
          allPassed: Object.values(checks).filter(v => typeof v === 'boolean').every(v => v === true)
        });
      } else {
        setResults({
          difficulty,
          error: 'No content generated'
        });
      }
    } catch (error) {
      setResults({
        difficulty,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          🧪 Structure Test - All Difficulty Levels
        </h1>
        <p className="text-gray-300 mb-8">
          Test that all difficulty levels generate the same 6-section structure
        </p>

        {/* Test Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => testDifficulty('Beginner')}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 h-16 text-lg"
          >
            {loading ? '⏳ Testing...' : '🟢 Test Beginner'}
          </Button>
          <Button
            onClick={() => testDifficulty('Intermediate')}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 h-16 text-lg"
          >
            {loading ? '⏳ Testing...' : '🟡 Test Intermediate'}
          </Button>
          <Button
            onClick={() => testDifficulty('Advanced')}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 h-16 text-lg"
          >
            {loading ? '⏳ Testing...' : '🔴 Test Advanced'}
          </Button>
        </div>

        {loading && (
          <div className="bg-blue-900 p-6 rounded-lg mb-8 animate-pulse">
            <p className="text-white text-center text-xl">
              ⏳ Generating content... Please wait 30-60 seconds
            </p>
          </div>
        )}

        {results && !results.error && (
          <>
            {/* Overall Status */}
            <div className={`p-6 rounded-lg mb-8 ${results.allPassed ? 'bg-green-900' : 'bg-red-900'}`}>
              <h2 className="text-2xl font-bold text-white mb-4">
                {results.allPassed ? '✅ PASS' : '❌ FAIL'} - {results.difficulty} Level
              </h2>
              <p className="text-white text-lg">
                {results.allPassed 
                  ? 'All 6 sections detected! Structure is correct! 🎉'
                  : 'Missing sections detected. Structure needs fixing.'}
              </p>
            </div>

            {/* Checklist */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">📋 Structure Checklist:</h2>
              <div className="grid grid-cols-2 gap-3">
                <CheckItem 
                  label="Has '## 📚 Introduction'" 
                  passed={results.checks.hasIntroduction} 
                />
                <CheckItem 
                  label="Has '## 🎯 Core Concepts'" 
                  passed={results.checks.hasCoreConceptsHeader} 
                />
                <CheckItem 
                  label="Has '### Concept' subsections" 
                  passed={results.checks.hasConceptSubsection} 
                />
                <CheckItem 
                  label="Has '**What it is:**' format" 
                  passed={results.checks.hasWhatItIs} 
                />
                <CheckItem 
                  label="Has '**Why it matters:**' format" 
                  passed={results.checks.hasWhyItMatters} 
                />
                <CheckItem 
                  label="Has '**How it works:**' format" 
                  passed={results.checks.hasHowItWorks} 
                />
                <CheckItem 
                  label="Has '**Example:**' format" 
                  passed={results.checks.hasExample} 
                />
                <CheckItem 
                  label="Has '## 💡 Real-World Examples'" 
                  passed={results.checks.hasRealWorldExamples} 
                />
                <CheckItem 
                  label="Has '## ✅ Best Practices'" 
                  passed={results.checks.hasBestPractices} 
                />
                <CheckItem 
                  label="Has '## ⚠ Common Mistakes'" 
                  passed={results.checks.hasCommonMistakes} 
                />
                <CheckItem 
                  label="Has '## 🎓 Key Takeaways'" 
                  passed={results.checks.hasKeyTakeaways} 
                />
                <CheckItem 
                  label={`Length: ${results.checks.length} chars (need 2000+)`}
                  passed={results.checks.length > 2000} 
                />
              </div>
            </div>

            {/* Raw Content */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold text-white mb-4">📄 Raw Content Preview:</h2>
              <pre className="text-gray-300 text-sm overflow-auto whitespace-pre-wrap max-h-96">
                {results.content.substring(0, 1000)}...
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
                {results.content}
              </ReactMarkdown>
            </div>
          </>
        )}

        {results?.error && (
          <div className="bg-red-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">❌ Error</h2>
            <p className="text-white">{results.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckItem({ label, passed }) {
  return (
    <div className={`p-3 rounded ${passed ? 'bg-green-900/30 border border-green-600' : 'bg-red-900/30 border border-red-600'}`}>
      <span className={`text-lg ${passed ? 'text-green-400' : 'text-red-400'}`}>
        {passed ? '✅' : '❌'} {label}
      </span>
    </div>
  );
}
