# 🚀 AlphaWave Course Generator

A full-stack AI-powered course creation platform built with Next.js 14, TailwindCSS, Framer Motion, and Google Gemini AI.

## ✨ Features

- **AI-Powered Course Generation**: Uses Google Gemini AI to create comprehensive courses
- **3-Step Course Creation Wizard**: Intuitive flow for course setup
- **Beautiful Dashboard**: Modern UI with glassmorphism effects and gradients
- **Chapter Management**: Expandable accordion chapters with embedded YouTube videos
- **Authentication**: Secure user management with Clerk
- **Responsive Design**: Works perfectly on all devices
- **Real-time Editing**: Inline editing for course content

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TailwindCSS
- **UI Components**: shadcn/ui, Framer Motion
- **Authentication**: Clerk
- **AI Integration**: Google Generative AI (Gemini)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS with custom gradients and animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- Google AI Studio account for Gemini API

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mindcourse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and fill in your credentials:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mindcourse"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google Generative AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup

Run the database migrations:

```bash
npm run db:generate
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
mindcourse/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── create-course/     # Course creation wizard
│   └── course/            # Course detail pages
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── CourseCard.jsx    # Course display card
│   ├── ChapterAccordion.jsx # Chapter expandable component
│   └── LoadingModal.jsx  # AI generation loading modal
├── lib/                   # Utility functions
│   ├── db/               # Database configuration
│   └── utils.js          # Helper functions
└── public/                # Static assets
```

## 🔑 API Endpoints

- `POST /api/generate-course` - Generate course content with Gemini AI
- `GET /api/courses` - Fetch user's courses
- `POST /api/courses` - Create new course
- `GET /api/courses/[id]` - Fetch specific course with chapters

## 🎨 UI Components

### CourseCard
Beautiful course display cards with:
- Gradient backgrounds based on category
- Hover animations and effects
- Metadata display (difficulty, duration, chapters)

### ChapterAccordion
Expandable chapter components featuring:
- Smooth expand/collapse animations
- Embedded YouTube video support
- Rich content display

### LoadingModal
Animated loading modal for AI generation with:
- Pulsing animations
- Orbiting elements
- Progress indicators

## 🎯 Usage Flow

1. **Sign In**: Users authenticate with Clerk
2. **Dashboard**: View existing courses and create new ones
3. **Course Creation**: 3-step wizard for course setup
4. **AI Generation**: Gemini AI creates course content and structure
5. **Course View**: Display generated course with editable content
6. **Chapter Management**: Expandable chapters with videos and content

## 🎨 Design Features

- **Glassmorphism**: Modern backdrop blur effects
- **Gradient Themes**: Purple to blue color schemes
- **Smooth Animations**: Framer Motion transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Hover Effects**: Interactive elements with smooth transitions

## 🔧 Customization

### Colors
Update the gradient themes in `tailwind.config.js`:

```js
extend: {
  colors: {
    primary: {
      50: '#faf5ff',
      500: '#8b5cf6',
      600: '#7c3aed',
    }
  }
}
```

### Animations
Modify Framer Motion animations in component files:

```js
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

Built with ❤️ using Next.js 14 and modern web technologies.
