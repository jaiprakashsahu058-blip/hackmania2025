// Run database migration to fix schema issues
// Usage: node scripts/run-migration.js

const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔧 Starting database schema migration...');
    
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('📡 Connecting to database...');
    const sql = postgres(databaseUrl);
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'fix-database-schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Executing migration SQL...');
    
    // Split the SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql.unsafe(statement);
        } catch (error) {
          // Some statements might fail if columns already exist, that's okay
          if (!error.message.includes('already exists')) {
            console.warn('⚠️ Warning:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the schema
    console.log('🔍 Verifying schema...');
    const coursesColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'courses'
      ORDER BY ordinal_position
    `;
    
    console.log('📊 Courses table columns:');
    coursesColumns.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Check for required columns
    const requiredColumns = ['include_quiz', 'include_videos', 'course_title', 'modules'];
    const existingColumns = coursesColumns.map(col => col.column_name);
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length === 0) {
      console.log('✅ All required columns exist!');
    } else {
      console.log('❌ Missing columns:', missingColumns);
    }
    
    await sql.end();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
