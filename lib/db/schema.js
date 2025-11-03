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

// 📘 COURSES TABLE
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull(),
  duration: text('duration').notNull(),
  chapterCount: integer('chapter_count').notNull(),
  includeVideos: boolean('include_videos').default(false),
  videoUrls: jsonb('video_urls'), // Store YouTube video URLs as JSON array
  thumbnail: text('thumbnail'),
  topic: text('topic').notNull(),
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
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
