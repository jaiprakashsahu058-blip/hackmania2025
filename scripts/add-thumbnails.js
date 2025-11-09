/**
 * Script to add category-based thumbnails to existing courses
 * Run with: node scripts/add-thumbnails.js
 */

const { neon } = require('@neondatabase/serverless');
const { generateCategoryThumbnail } = require('../lib/utils/categoryThumbnails');

async function addThumbnails() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log('🔍 Finding courses without thumbnails...');
    
    // Get all courses without thumbnails
    const courses = await sql`
      SELECT id, category FROM courses 
      WHERE thumbnail IS NULL OR thumbnail = ''
    `;

    console.log(`📊 Found ${courses.length} courses without thumbnails`);

    if (courses.length === 0) {
      console.log('✅ All courses already have thumbnails!');
      return;
    }

    // Update each course with category-based thumbnail
    for (const course of courses) {
      const category = course.category || 'programming';
      const thumbnail = generateCategoryThumbnail(category);
      
      await sql`
        UPDATE courses 
        SET thumbnail = ${thumbnail}
        WHERE id = ${course.id}
      `;
      
      console.log(`✅ Added thumbnail for course ${course.id} (category: ${category})`);
    }

    console.log('🎉 Successfully added thumbnails to all courses!');
  } catch (error) {
    console.error('❌ Error adding thumbnails:', error);
    process.exit(1);
  }
}

addThumbnails();
