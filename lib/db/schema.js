// import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// export const users = pgTable('users', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   clerkId: text('clerk_id').notNull().unique(),
//   email: text('email').notNull(),
//   firstName: text('first_name'),
//   lastName: text('last_name'),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

// export const courses = pgTable('courses', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
//   title: text('title').notNull(),
//   description: text('description'),
//   category: text('category').notNull(),
//   difficulty: text('difficulty').notNull(),
//   duration: text('duration').notNull(),
//   chapterCount: integer('chapter_count').notNull(),
//   includeVideos: boolean('include_videos').default(false),
//   thumbnail: text('thumbnail'),
//   topic: text('topic').notNull(),
//   userDescription: text('user_description'),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

// export const chapters = pgTable('chapters', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
//   title: text('title').notNull(),
//   description: text('description').notNull(),
//   duration: text('duration').notNull(),
//   content: text('content'),
//   videoUrls: jsonb('video_urls'),
//   orderIndex: integer('order_index').notNull(),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });


import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// 🧍 USERS TABLE
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(), // ✅ This ensures the DB column name is "clerk_id"
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 📘 COURSES TABLE - Updated to store modules as JSONB
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(), // Original title field (required for backward compatibility)
  course_title: text('course_title'), // New field for API response structure
  description: text('description'),
  category: text('category'),
  difficulty: text('difficulty'),
  duration: text('duration'),
  chapterCount: integer('chapter_count').notNull(), // Required field for chapter count
  modules: jsonb('modules').default('[]'), // Store complete modules with quiz data
  include_quiz: boolean('include_quiz').default(false), // Quiz inclusion flag
  include_videos: boolean('include_videos').default(false), // Video inclusion flag
  topic: text('topic'),
  thumbnail: text('thumbnail'),
  userDescription: text('user_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 🎬 CHAPTERS TABLE
export const chapters = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  duration: text('duration').notNull(),
  content: text('content'),
  videoUrls: jsonb('video_urls'),
  videoUrl: text('video_url'), // Single video URL for frontend compatibility
  quiz: jsonb('quiz'), // Quiz data as JSONB array
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 🧩 QUIZZES TABLE (Normalized structure for advanced tracking)
export const quizzes = pgTable('quizzes', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  moduleId: text('module_id').notNull(), // Reference to module in JSONB
  question: text('question').notNull(),
  options: jsonb('options').notNull(), // Array of answer options
  correct_answer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  question_type: text('question_type').default('mcq'), // mcq, true_false, fill_blank, etc.
  difficulty: text('difficulty'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 📊 USER PROGRESS TABLE (for quiz scores and analytics)
export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  chapterId: uuid('chapter_id')
    .references(() => chapters.id, { onDelete: 'cascade' })
    .notNull(),
  quizScore: integer('quiz_score').default(0), // Percentage score (0-100)
  totalQuestions: integer('total_questions').default(0),
  correctAnswers: integer('correct_answers').default(0),
  completedAt: timestamp('completed_at'),
  attempts: integer('attempts').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
