'use client';

import { useState, useEffect } from 'react';

export default function ShowThumbnails() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">📸 Thumbnail Test - All Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-700">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.category}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', course.category);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {!course.thumbnail && (
                <div className="flex items-center justify-center h-full text-white">
                  ❌ NO THUMBNAIL
                </div>
              )}
              {/* Error fallback (hidden by default) */}
              <div 
                className="hidden items-center justify-center h-full text-red-400 absolute inset-0 bg-gray-700"
                style={{ display: 'none' }}
              >
                ⚠️ FAILED TO LOAD
              </div>
            </div>
            
            {/* Course Info */}
            <div className="p-4">
              <div className="text-xs text-gray-400 mb-2">
                Category: <span className="font-bold text-white">{course.category}</span>
              </div>
              <h3 className="text-white font-bold mb-2 line-clamp-2">{course.title}</h3>
              <div className="text-xs text-gray-500">
                Thumbnail: {course.thumbnail ? `✅ ${course.thumbnail.length} chars` : '❌ Missing'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-white text-center py-12">
          No courses found
        </div>
      )}
    </div>
  );
}
