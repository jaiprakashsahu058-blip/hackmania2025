#!/usr/bin/env node

/**
 * Database Setup Script for MindCourse
 * 
 * This script helps you set up your PostgreSQL database for the MindCourse application.
 * Run this after setting up your environment variables.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MindCourse Database...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('Please create .env.local with your database credentials first.');
  console.log('You can copy from env.example and fill in your values.');
  process.exit(1);
}

try {
  // Generate database schema
  console.log('📋 Generating database schema...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  
  // Push schema to database
  console.log('🗄️  Pushing schema to database...');
  execSync('npm run db:push', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup completed successfully!');
  console.log('\n🎯 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Open http://localhost:3000 in your browser');
  console.log('3. Set up Clerk authentication');
  console.log('4. Start generating courses!');
  
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting tips:');
  console.log('- Make sure PostgreSQL is running');
  console.log('- Check your DATABASE_URL in .env.local');
  console.log('- Ensure the database exists');
  console.log('- Verify your database credentials');
  process.exit(1);
}


