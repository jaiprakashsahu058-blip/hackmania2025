# Setup Checklist - OpenRouter AI Integration

Follow these steps in order to complete the setup.

## ✅ Step-by-Step Setup

### 1. Database Migration
- [ ] Open your database client (Supabase, pgAdmin, or psql)
- [ ] Navigate to `scripts/fix-schema.sql`
- [ ] Run the SQL script
- [ ] Verify both `courses` and `chapters` tables updated
- [ ] Expected output: "COURSES TABLE COLUMNS" and "CHAPTERS TABLE COLUMNS" lists

**Commands:**
```bash
# Using psql
psql "your_database_url" -f scripts/fix-schema.sql

# Or copy/paste SQL into Supabase SQL Editor
```

---

### 2. Environment Variables
- [ ] Create `.env.local` file in project root (if not exists)
- [ ] Add OpenRouter API keys (get from https://openrouter.ai/)
- [ ] Add database connection string
- [ ] Add Clerk authentication keys
- [ ] Optionally add YouTube API key

**Minimum Required:**
```env
DATABASE_URL=your_postgresql_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

# These three can be the same API key
OPENROUTER_SYLLABUS_API_KEY=sk-or-v1-your-key
OPENROUTER_CONTENT_API_KEY=sk-or-v1-your-key
OPENROUTER_QUIZ_API_KEY=sk-or-v1-your-key
```

---

### 3. Restart Development Server
- [ ] Stop current server (Ctrl+C)
- [ ] Clear terminal
- [ ] Run `npm run dev`
- [ ] Wait for "Ready" message
- [ ] Verify no errors in console

**Command:**
```bash
npm run dev
```

---

### 4. Test Course Generation

#### Test A: Basic Course (No Quiz)
- [ ] Navigate to `/create-course`
- [ ] Enter topic: "JavaScript"
- [ ] Select difficulty: "Beginner"
- [ ] Duration: "1-2 hours"
- [ ] Uncheck "Include Quiz"
- [ ] Click "Generate Course"

**Expected Console Output:**
```
🚀 Using OpenRouter AI with 3 specialized models
📋 Step 1: Generating course syllabus...
✅ Generated X modules
📝 Step 2: Generating detailed content...
✅ OpenRouter course generation completed!
```

**Success Criteria:**
- [ ] Console shows "Using OpenRouter AI"
- [ ] Course generated with multiple modules
- [ ] Each module has detailed content (800+ words)
- [ ] Content has markdown structure (## headers, ### subheaders)

---

#### Test B: Full Course (With Quiz)
- [ ] Navigate to `/create-course`
- [ ] Enter topic: "Python"
- [ ] Select difficulty: "Intermediate"
- [ ] Duration: "3-5 hours"
- [ ] **Check "Include Quiz"**
- [ ] Click "Generate Course"

**Expected Console Output:**
```
🚀 Using OpenRouter AI with 3 specialized models
📋 Step 1: Generating course syllabus...
✅ Generated X modules
📝 Step 2: Generating detailed content...
   📖 Generating content for: Module 1: ...
   🧩 Generating quiz for: Module 1: ...
✅ OpenRouter course generation completed!
   🧩 Total Quiz Questions: XX
```

**Success Criteria:**
- [ ] Quiz questions generated (5 per module)
- [ ] Each question has 4 options
- [ ] Questions test understanding, not just memory
- [ ] Detailed explanations provided

---

#### Test C: Save to Database
- [ ] After course generation, click "Save Course"
- [ ] Verify no errors in console
- [ ] Check database for new course entry
- [ ] Navigate to `/courses` to see saved course

**Expected Console Output:**
```
💾 Saving course with new JSONB structure:
✅ Course saved with ID: xxx-xxx-xxx
✅ Successfully saved X chapters to database
```

**Success Criteria:**
- [ ] Course appears in courses table
- [ ] Chapters/modules saved correctly
- [ ] Quiz data stored (if enabled)
- [ ] Video URLs stored (if enabled)

---

### 5. Verify Content Quality

Open a generated module and check:

- [ ] **Introduction Section** (~100-150 words)
  - [ ] Starts with relatable hook
  - [ ] Explains importance
  - [ ] Previews outcomes

- [ ] **Core Concepts Section** (~400-500 words)
  - [ ] Multiple subsections with ### headers
  - [ ] Each concept has: What, Why, How, Example
  - [ ] Technical terms explained

- [ ] **Real-World Examples** (~200-300 words)
  - [ ] 2-3 concrete examples
  - [ ] Relatable scenarios
  - [ ] Practical applications

- [ ] **Best Practices** (~100-150 words)
  - [ ] 4-6 actionable tips
  - [ ] Do's and don'ts
  - [ ] Why each matters

- [ ] **Common Mistakes** (~100-150 words)
  - [ ] 3-5 pitfalls listed
  - [ ] Why they happen
  - [ ] How to avoid

- [ ] **Key Takeaways** (~50-100 words)
  - [ ] 5-7 bullet points
  - [ ] Reinforces learning objectives

---

### 6. Verify Quiz Quality

If quiz enabled, check questions:

- [ ] **Question Quality**
  - [ ] Tests understanding, not just definitions
  - [ ] Clear and specific
  - [ ] Appropriate difficulty level

- [ ] **Options Quality**
  - [ ] All 4 options plausible
  - [ ] Similar length
  - [ ] No obvious wrong answers

- [ ] **Explanation Quality**
  - [ ] 2-3 sentences
  - [ ] Explains why correct answer is right
  - [ ] Mentions why others are wrong
  - [ ] Reinforces concept

---

## 🚨 Troubleshooting

### If you see "OpenRouter API keys not found"
1. Check `.env.local` file exists
2. Verify keys are correctly named
3. Restart dev server
4. Check for typos in variable names

### If you see "Column does not exist"
1. Run database migration: `scripts/fix-schema.sql`
2. Verify migration completed successfully
3. Restart application
4. Check database schema manually

### If content is plain text (no markdown structure)
1. System is using Gemini fallback
2. Verify OpenRouter keys are set
3. Check OpenRouter dashboard for credits
4. Check console for OpenRouter errors

### If quizzes not generated
1. Verify "Include Quiz" is checked
2. Check OPENROUTER_QUIZ_API_KEY is set
3. Check console for quiz generation logs
4. Verify OpenRouter has credits/quota

---

## 📊 Success Indicators

When everything is working correctly, you should see:

### Console Logs
```
✓ Database connected
✓ Environment variables loaded
🚀 Using OpenRouter AI with 3 specialized models
📋 Step 1: Generating course syllabus...
✅ Generated 5 modules
📝 Step 2: Generating detailed content...
   📖 Generating content for: Module 1
   🧩 Generating quiz for: Module 1
   📖 Generating content for: Module 2
   🧩 Generating quiz for: Module 2
...
✅ OpenRouter course generation completed!
💾 Saving course with new JSONB structure:
✅ Course saved with ID: xxx
✅ Successfully saved 5 chapters to database
```

### Generated Course
- ✅ Course title is engaging and SEO-friendly
- ✅ 3-12 modules based on topic complexity
- ✅ Each module 800-1200+ words
- ✅ Proper markdown formatting
- ✅ Structured sections (Introduction, Core Concepts, etc.)
- ✅ 5 quiz questions per module (if enabled)
- ✅ Video URLs populated (if YouTube enabled)

### Database
- ✅ Course entry in `courses` table
- ✅ All columns populated correctly
- ✅ Modules stored as JSONB
- ✅ Chapter entries in `chapters` table
- ✅ Quiz data stored in chapter records

---

## 🎯 Final Verification

Run this quick test to verify everything:

1. [ ] Create course: "React Hooks"
2. [ ] Difficulty: Intermediate
3. [ ] Include Quiz: YES
4. [ ] Generate and Save
5. [ ] Check console for success messages
6. [ ] View course in `/courses`
7. [ ] Verify content structure
8. [ ] Verify quiz questions
9. [ ] All working? **Setup Complete!** 🎉

---

## 📚 Reference Documents

- **Environment Setup**: `ENVIRONMENT_SETUP.md`
- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Database Migration**: `scripts/fix-schema.sql`

---

## ✅ Setup Complete!

Once all checkboxes are ticked, your OpenRouter AI integration is complete and ready to generate high-quality educational courses!

**Next Steps:**
1. Start creating courses with different topics
2. Experiment with different difficulty levels
3. Compare Beginner vs Intermediate vs Advanced content
4. Test quiz generation quality
5. Share feedback and iterate

**Happy Course Building!** 🚀
