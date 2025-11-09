'use client';

import { generateCategoryThumbnail } from '@/lib/utils/categoryThumbnails';

export default function TestSVG() {
  const categories = ['programming', 'health', 'creative', 'business', 'science', 'technology'];
  
  const thumbnails = categories.map(cat => ({
    category: cat,
    svg: generateCategoryThumbnail(cat)
  }));

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">🧪 SVG Thumbnail Direct Test</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {thumbnails.map(({ category, svg }) => (
          <div key={category} className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold mb-4 capitalize">{category}</h3>
            
            {/* Direct SVG rendering */}
            <div className="bg-gray-700 rounded mb-4">
              <img 
                src={svg} 
                alt={category}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.parentElement.innerHTML = `<div class="text-red-500 p-4">❌ FAILED TO LOAD</div>`;
                }}
              />
            </div>
            
            {/* SVG preview */}
            <div className="text-xs text-gray-400 break-all">
              {svg.substring(0, 100)}...
            </div>
            
            {/* Length */}
            <div className="text-xs text-green-400 mt-2">
              Length: {svg.length} chars
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">🔍 Raw SVG Code - Health Category</h2>
        <pre className="text-gray-300 text-xs overflow-auto whitespace-pre-wrap bg-gray-900 p-4 rounded">
          {thumbnails.find(t => t.category === 'health')?.svg}
        </pre>
      </div>
    </div>
  );
}
