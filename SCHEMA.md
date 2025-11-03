# Course Generator Platform - Database Schema

## Overview

This document describes the database schema for the Course Generator platform using Drizzle ORM and PostgreSQL.

## Schema Definition

### Table: `users`

| Column    | Type      | Constraints           | Description                    |
|-----------|-----------|----------------------|--------------------------------|
| id        | serial    | PRIMARY KEY          | Auto-incrementing user ID      |
| email     | varchar   | UNIQUE, NOT NULL     | User's email address           |
| name      | varchar   | NULL                 | User's display name            |
| createdAt | timestamp | DEFAULT now()        | Record creation timestamp      |

### Table: `courses`

| Column      | Type      | Constraints                    | Description                    |
|-------------|-----------|--------------------------------|--------------------------------|
| id          | serial    | PRIMARY KEY                    | Auto-incrementing course ID    |
| userId      | integer   | FOREIGN KEY → users.id         | Reference to course creator    |
| title       | varchar   | NOT NULL                       | Course title                   |
| description | text      | NULL                           | Course description             |
| createdAt   | timestamp | DEFAULT now()                  | Record creation timestamp      |

### Table: `chapters`

| Column     | Type      | Constraints                    | Description                    |
|------------|-----------|--------------------------------|--------------------------------|
| id         | serial    | PRIMARY KEY                    | Auto-incrementing chapter ID   |
| courseId   | integer   | FOREIGN KEY → courses.id       | Reference to parent course     |
| title      | varchar   | NOT NULL                       | Chapter title                  |
| content    | text      | NULL                           | AI-generated chapter content   |
| youtubeUrl | varchar   | NULL                           | Related YouTube video URL      |
| createdAt  | timestamp | DEFAULT now()                  | Record creation timestamp      |

## Relationships

- **One-to-Many**: `users` → `courses` (One user can create many courses)
- **One-to-Many**: `courses` → `chapters` (One course can have many chapters)

## Drizzle ORM Relations

```typescript
// Users can have many courses
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
}));

// Courses belong to one user and can have many chapters
export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  chapters: many(chapters),
}));

// Chapters belong to one course
export const chaptersRelations = relations(chapters, ({ one }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
}));
```

## Key Features

1. **Simplified Schema**: Clean, focused design with essential fields only
2. **AI Integration**: `content` field stores AI-generated chapter content from Gemini API
3. **Video Support**: `youtubeUrl` field for embedding related YouTube videos
4. **Cascade Deletes**: Deleting a user deletes all their courses, deleting a course deletes all its chapters
5. **Type Safety**: Full TypeScript support with Drizzle ORM

## Usage Examples

### Creating a User
```typescript
const newUser = await db.insert(users).values({
  email: 'user@example.com',
  name: 'John Doe'
}).returning();
```

### Creating a Course
```typescript
const newCourse = await db.insert(courses).values({
  userId: 1,
  title: 'JavaScript Fundamentals',
  description: 'Learn the basics of JavaScript programming'
}).returning();
```

### Creating Chapters
```typescript
const newChapters = await db.insert(chapters).values([
  {
    courseId: 1,
    title: 'Introduction to JavaScript',
    content: 'AI-generated content here...',
    youtubeUrl: 'https://www.youtube.com/watch?v=example'
  }
]).returning();
```

### Querying with Relations
```typescript
const courseWithChapters = await db.query.courses.findFirst({
  where: eq(courses.id, 1),
  with: {
    user: true,
    chapters: true
  }
});
```

## Migration

To apply this schema to your PostgreSQL database:

1. Set up your `DATABASE_URL` in `.env.local`
2. Run: `npx drizzle-kit generate:pg`
3. Run: `npx drizzle-kit push:pg`

## Mock Database

For development and testing without a real PostgreSQL connection, the application uses an in-memory mock database that simulates the same API as Drizzle ORM.
