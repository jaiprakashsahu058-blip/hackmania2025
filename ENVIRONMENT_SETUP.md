# Environment Variables Setup

This document explains all the required environment variables for MindCourse AI Course Builder.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Database Configuration
```env
DATABASE_URL=your_postgresql_connection_string
```

### Authentication (Clerk)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/create-course
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/create-course
```

### AI Models Configuration

#### Option 1: OpenRouter AI (Recommended - Uses 3 Specialized Models)

**Three specialized models for optimal course generation:**

1. **Syllabus Generation** (GPT-3.5 Turbo)
   - Generates course structure and module outline
   - Creates logical progression from fundamentals to advanced
   ```env
   OPENROUTER_SYLLABUS_API_KEY=your_openrouter_api_key
   ```

2. **Content Generation** (Meituan LongChat Flash)
   - Generates 800-1200+ word detailed module content
   - Structured markdown with examples, best practices, and takeaways
   ```env
   OPENROUTER_CONTENT_API_KEY=your_openrouter_api_key
   ```

3. **Quiz Generation** (GPT-OSS-20B)
   - Creates understanding-based quiz questions
   - Includes detailed explanations and plausible options
   ```env
   OPENROUTER_QUIZ_API_KEY=your_openrouter_api_key
   ```

**Note:** You can use the same OpenRouter API key for all three models.

Get your OpenRouter API key at: https://openrouter.ai/

#### Option 2: Google Gemini AI (Fallback)
```env
GEMINI_API_KEY=your_gemini_api_key
```

Get your Gemini API key at: https://makersuite.google.com/app/apikey

### YouTube Integration (Optional)
```env
YOUTUBE_API_KEY=your_youtube_api_key
```

Get your YouTube API key at: https://console.cloud.google.com/apis/credentials

---

## AI Model Selection Logic

The system automatically selects the best available AI service:

1. **Primary**: OpenRouter (if `OPENROUTER_SYLLABUS_API_KEY` and `OPENROUTER_CONTENT_API_KEY` are set)
   - Uses 3 specialized models for optimal quality
   - Generates comprehensive course structure
   - Creates detailed 800-1200+ word module content
   - Produces high-quality quiz questions

2. **Fallback**: Google Gemini (if OpenRouter keys are not available)
   - Uses single model for all generation
   - Still produces quality courses but with less specialization

---

## OpenRouter Models Explained

### 1. Syllabus Model (openai/gpt-3.5-turbo)
**Purpose:** Generate course structure and modules

**What it does:**
- Analyzes the topic to determine optimal number of modules (3-12)
- Creates logical progression from fundamentals to advanced
- Generates clear module titles and 3-5 sub-topics per module
- Ensures comprehensive coverage of the topic

**Output:** JSON array of modules with titles and sub-topics

### 2. Content Model (meituan/longchat-flash)
**Purpose:** Generate detailed chapter content (800-1200+ words)

**What it does:**
- Creates comprehensive module content with exact markdown structure
- Includes:
  - Introduction with hook (100-150 words)
  - Core Concepts with subsections (400-500 words)
  - Real-World Examples (200-300 words)
  - Best Practices (100-150 words)
  - Common Mistakes to Avoid (100-150 words)
  - Key Takeaways (50-100 words)
- Adapts writing style based on difficulty level
- Uses relatable examples and analogies

**Output:** Structured markdown content for each module

### 3. Quiz Model (openai/gpt-oss-20b)
**Purpose:** Generate structured quiz questions with explanations

**What it does:**
- Creates 5 high-quality questions per module
- Tests understanding, not just memorization
- Generates 4 plausible options per question
- Provides detailed explanations
- Mixes question types (conceptual, application, scenario)
- Appropriate difficulty for the specified level

**Output:** JSON array of quiz questions with options, correct answer, and explanations

---

## Content Quality Features

### For Beginner Level:
- Uses everyday language and analogies
- Avoids technical jargon or explains it immediately
- Personal tone with "you" references
- Simple, relatable examples from daily life
- Complex ideas broken into simple steps

### For Intermediate Level:
- Balances technical terms with clear explanations
- Assumes basic knowledge
- Industry-relevant examples
- Some technical details and best practices

### For Advanced Level:
- Uses precise technical terminology
- Focuses on advanced patterns and optimization
- Complex scenarios and edge cases
- Assumes strong foundational knowledge

---

## Example Configuration

### Using OpenRouter (Recommended)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mindcourse

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenRouter AI (same key can be used for all three)
OPENROUTER_SYLLABUS_API_KEY=sk-or-v1-...
OPENROUTER_CONTENT_API_KEY=sk-or-v1-...
OPENROUTER_QUIZ_API_KEY=sk-or-v1-...

# YouTube (Optional)
YOUTUBE_API_KEY=AIza...
```

### Using Gemini (Fallback)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mindcourse

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Gemini
GEMINI_API_KEY=AIza...

# YouTube (Optional)
YOUTUBE_API_KEY=AIza...
```

---

## Testing Your Setup

After configuring your environment variables:

1. Restart your development server
2. Create a new course with quiz enabled
3. Check the console logs to see which AI service is being used
4. Verify the generated content follows the structured format

### Console Output Examples:

**Using OpenRouter:**
```
🚀 Using OpenRouter AI with 3 specialized models
📋 Step 1: Generating course syllabus...
✅ Generated 5 modules
📝 Step 2: Generating detailed content...
   📖 Generating content for: Module 1: Introduction to Java
   🧩 Generating quiz for: Module 1: Introduction to Java
✅ OpenRouter course generation completed!
```

**Using Gemini (Fallback):**
```
⚠️ OpenRouter API keys not found, using Gemini AI
🤖 Raw Gemini response length: 15234
✅ Successfully parsed Gemini JSON response
```

---

## Troubleshooting

### OpenRouter not working?
1. Verify API keys are correct
2. Check OpenRouter dashboard for usage/credits
3. Ensure both SYLLABUS and CONTENT keys are set
4. Check console logs for specific error messages

### Gemini not working?
1. Verify API key is correct
2. Check Google AI Studio for quota limits
3. Ensure GEMINI_API_KEY is set in .env.local

### No content generated?
1. Check if at least one AI service is configured
2. Verify environment variables are loaded (restart server)
3. Check console logs for detailed error messages
4. Ensure database is properly migrated (run fix-schema.sql)

---

## Next Steps

1. Copy `.env.local.example` to `.env.local` (if not exists)
2. Fill in your API keys
3. Run the database migration: `scripts/fix-schema.sql`
4. Restart your development server
5. Test course generation with different topics and difficulty levels
