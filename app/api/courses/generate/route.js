import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAndEnhanceCourse, formatCourseToStructuredJSON } from '@/lib/utils/courseBuilder';
// import { searchYouTubeCached } from '@/lib/youtube'; // Disabled YouTube integration

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced course generation function with structured output
async function generateCourseWithAI(topic, category, difficulty, duration, chapterCount, includeVideos = false, includeQuiz = false) {
  console.log('Generating course with AI:', { topic, category, difficulty, duration, chapterCount, includeVideos, includeQuiz });
  
  // Helper function to generate fallback course with enhanced structure
  const generateFallbackCourse = () => {
    console.log('Generating enhanced fallback course data');
    return {
      course_title: `${topic} - Complete ${difficulty} Course`,
      overview: `A comprehensive ${difficulty.toLowerCase()} course covering all essential aspects of ${topic}. Learn through structured modules, practical examples, and hands-on exercises.`,
      category: category || 'General',
      difficulty: difficulty || 'Beginner',
      duration: duration || '3-5 hours',
      modules: Array.from({ length: parseInt(chapterCount) || 5 }, (_, i) => ({
        id: `module-${i + 1}`,
        title: `Module ${i + 1}: Fundamentals of ${topic}`,
        description: `This module introduces you to the core concepts of ${topic}. You'll learn the essential principles, understand key terminology, and explore practical applications. By the end of this module, you'll have a solid foundation to build upon in subsequent lessons.\n\nWe'll cover both theoretical concepts and practical implementations, ensuring you understand not just the 'what' but also the 'why' and 'how' of ${topic}. Real-world examples and case studies will help you connect the learning to practical scenarios.`,
        objectives: [
          `Understand the fundamental concepts and principles of ${topic}`,
          `Identify key terminology and definitions in the ${topic} domain`,
          `Apply basic ${topic} concepts to real-world scenarios`,
          `Evaluate different approaches and methodologies in ${topic}`,
          `Create simple projects or solutions using ${topic} knowledge`
        ],
        keywords: [topic.toLowerCase(), "fundamentals", "basics", "introduction"],
        videoSearchTerms: `${topic} tutorial basics fundamentals introduction ${difficulty.toLowerCase()}`
      }))
    };
  };

  // If no API key, return fallback response
  if (!process.env.GEMINI_API_KEY) {
    console.log('No Gemini API key found, using fallback response');
    return generateFallbackCourse();
  }

  try {
    // Create the enhanced prompt for Gemini AI Course Builder
    const prompt = `You are an AI Course Builder assistant for "MindCourse". Generate a complete educational course outline.

🎓 COURSE TOPIC: ${topic}
📚 CATEGORY: ${category || 'General'}
⚡ DIFFICULTY: ${difficulty || 'Beginner'}
⏱️ DURATION: ${duration || '3-5 hours'}
📖 MODULES: ${chapterCount || 5}

Generate a JSON response with this EXACT structure:
{
  "course_title": "Engaging Course Title",
  "overview": "Brief 2-3 line course description explaining what students will learn",
  "category": "${category || 'General'}",
  "difficulty": "${difficulty || 'Beginner'}",
  "duration": "${duration || '3-5 hours'}",
  "modules": [
    {
      "id": "module-1",
      "title": "Module Title",
      "description": "Detailed 2-3 paragraph explanation of what this module covers, why it's important, and how it fits into the overall course. Make it engaging and educational.",
      "objectives": [
        "Clear learning objective 1",
        "Specific skill or knowledge objective 2",
        "Practical application objective 3",
        "Assessment or evaluation objective 4"
      ],
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "videoSearchTerms": "specific search terms for finding relevant YouTube videos"
    }
  ]
}

🧩 REQUIREMENTS:
1. **Course Title**: Make it catchy, SEO-friendly, and clearly indicate the subject and level
2. **Overview**: 2-3 lines explaining the course value proposition
3. **Modules**: Create exactly ${chapterCount || 5} comprehensive modules
4. **Module Descriptions**: 2-3 detailed paragraphs explaining:
   - What the module covers
   - Why it's important for learning ${topic}
   - How it connects to other modules
   - Real-world applications
5. **Learning Objectives**: 3-5 specific, measurable learning outcomes using action verbs
6. **Keywords**: 2-4 relevant terms for video searching
7. **Video Search Terms**: Specific phrases to find educational YouTube content

🎯 FOCUS AREAS:
- Make content progressive (beginner to advanced concepts)
- Include practical applications and real-world examples
- Ensure each module builds upon previous knowledge
- Use engaging, educational language appropriate for ${difficulty || 'Beginner'} level
- Structure content for ${duration || '3-5 hours'} of learning

Return ONLY valid JSON, no additional text or explanations.`;

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);

    // Parse the JSON response
    let courseData;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        courseData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      console.log('Falling back to fallback response due to parsing error');
      return generateFallbackCourse();
    }

    // Validate the enhanced response structure
    if (!courseData.course_title && !courseData.title) {
      console.log('Invalid AI response structure, falling back to fallback response');
      return generateFallbackCourse();
    }

    // Handle both old and new response formats
    const title = courseData.course_title || courseData.title;
    const overview = courseData.overview || `Learn ${topic} with this comprehensive course.`;
    const modules = courseData.modules || courseData.chapters || [];

    if (!Array.isArray(modules)) {
      console.log('Invalid modules structure, falling back to fallback response');
      return generateFallbackCourse();
    }

    // Use the validation utility to ensure proper structure
    const rawCourse = {
      course_title: title,
      overview: overview,
      category: courseData.category || category || 'General',
      difficulty: courseData.difficulty || difficulty || 'Beginner',
      duration: courseData.duration || duration || '3-5 hours',
      modules: modules
    };

    // Validate and enhance the course structure
    const normalizedCourse = validateAndEnhanceCourse(rawCourse);
    
    return normalizedCourse;

    // YouTube integration disabled - videos will be null
    // if (includeVideos) {
    //   const apiKey = process.env.YOUTUBE_API_KEY;
    //   if (apiKey) {
    //     const courseTitleForQuery = courseData.title || topic;
    //     const enriched = await Promise.all(courseData.chapters.map(async (ch) => {
    //       if (ch.videoUrl) return ch;
    //       const query = `${courseTitleForQuery} ${ch.title}`;
    //       const videoId = await searchYouTubeCached(query, apiKey);
    //       if (videoId) {
    //         return { ...ch, videoUrl: `https://www.youtube.com/watch?v=${videoId}` };
    //       }
    //       return ch; // leave without video when none found
    //     }));
    //     courseData.chapters = enriched;
    //   }
    // }

    return courseData;

  } catch (geminiError) {
    console.error('Gemini API error:', geminiError);
    console.log('Falling back to fallback response due to Gemini API error');
    return generateFallbackCourse();
  }
}

// Search YouTube for top N video IDs
async function searchYouTubeVideoIds(query, apiKey, max = 3) {
  try {
    const params = new URLSearchParams({
      key: apiKey,
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: String(Math.min(Math.max(max, 1), 5)),
      safeSearch: 'moderate'
    });
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    const ids = (data.items || [])
      .map((item) => item?.id?.videoId)
      .filter(Boolean);
    return ids;
  } catch (e) {
    return [];
  }
}

// Legacy mock courses generator (moved into a function to avoid top-level returns)
function generateLegacyCourse(topic) {
  const mockCourses = {
    'machine learning': {
      title: 'Introduction to Machine Learning for Beginners',
      description: 'A comprehensive introduction to machine learning concepts, algorithms, and practical applications for beginners.',
      difficulty: 'Beginner',
      duration: '8 weeks',
      outline: `# Introduction to Machine Learning for Beginners

## Course Overview
A comprehensive introduction to machine learning concepts, algorithms, and practical applications designed for beginners with no prior experience in AI or data science.

## Learning Objectives
By the end of this course, students will be able to:
- Understand fundamental machine learning concepts and terminology
- Implement basic ML algorithms using Python
- Evaluate and improve model performance
- Deploy ML models for real-world applications
- Continue learning advanced ML topics independently

## Prerequisites
- Basic programming knowledge (Python recommended)
- High school level mathematics
- No prior machine learning experience required

---

## Module 1: Foundations of Machine Learning

### Learning Objectives
- Define machine learning and its applications
- Understand different types of machine learning
- Compare ML with traditional programming approaches

### Key Topics
- **What is Machine Learning?**
  - Definition and core concepts
  - Historical development and milestones
  - Current applications in various industries

- **Types of Machine Learning**
  - Supervised Learning: Classification and Regression
  - Unsupervised Learning: Clustering and Dimensionality Reduction
  - Reinforcement Learning: Decision Making and Control

- **Machine Learning vs Traditional Programming**
  - Rule-based vs Data-driven approaches
  - When to use machine learning
  - Limitations and considerations

- **Real-world Applications**
  - Healthcare and medical diagnosis
  - Finance and fraud detection
  - E-commerce and recommendation systems
  - Autonomous vehicles and robotics

### Practical Exercise
Create a simple decision tree to classify emails as spam or not spam using sample data.

---

## Module 2: Mathematics Fundamentals

### Learning Objectives
- Understand essential mathematical concepts for ML
- Apply linear algebra in machine learning contexts
- Use statistics for data analysis and model evaluation

### Key Topics
- **Linear Algebra Basics**
  - Vectors and matrices
  - Matrix operations and properties
  - Eigenvalues and eigenvectors
  - Applications in ML algorithms

- **Statistics and Probability**
  - Descriptive statistics (mean, median, mode, variance)
  - Probability distributions
  - Hypothesis testing
  - Correlation and covariance

- **Calculus Concepts for ML**
  - Derivatives and gradients
  - Optimization techniques
  - Gradient descent algorithm
  - Chain rule and backpropagation

- **Mathematical Notation**
  - Common symbols and conventions
  - Reading ML papers and documentation
  - Communicating mathematical concepts

### Practical Exercise
Implement gradient descent from scratch to find the minimum of a simple function.

---

## Module 3: Python for Machine Learning

### Learning Objectives
- Master essential Python libraries for ML
- Manipulate and visualize data effectively
- Set up a proper ML development environment

### Key Topics
- **Python Basics Review**
  - Data types and structures
  - Functions and classes
  - Error handling and debugging
  - Code organization and best practices

- **Essential Libraries**
  - **NumPy**: Numerical computing and array operations
  - **Pandas**: Data manipulation and analysis
  - **Matplotlib/Seaborn**: Data visualization
  - **Scikit-learn**: Machine learning algorithms

- **Jupyter Notebooks**
  - Interactive development environment
  - Markdown and code cells
  - Data exploration and prototyping
  - Sharing and collaboration

- **Data Manipulation**
  - Loading and saving data
  - Data cleaning and preprocessing
  - Feature engineering
  - Handling missing values

### Practical Exercise
Analyze a real dataset using Pandas and create visualizations with Matplotlib.

---

## Module 4: Supervised Learning

### Learning Objectives
- Implement and evaluate supervised learning algorithms
- Understand when to use different algorithms
- Optimize model performance

### Key Topics
- **Linear Regression**
  - Simple and multiple linear regression
  - Assumptions and limitations
  - Regularization (Ridge, Lasso)
  - Model evaluation metrics

- **Logistic Regression**
  - Binary and multiclass classification
  - Sigmoid function and decision boundaries
  - Maximum likelihood estimation
  - Performance metrics for classification

- **Decision Trees**
  - Tree construction algorithms
  - Splitting criteria (Gini, Entropy)
  - Pruning and overfitting prevention
  - Random Forests and ensemble methods

- **Support Vector Machines**
  - Maximum margin classifier
  - Kernel trick and non-linear boundaries
  - Hyperparameter tuning
  - Advantages and limitations

- **Model Evaluation Metrics**
  - Cross-validation techniques
  - Confusion matrix and classification metrics
  - ROC curves and AUC
  - Bias-variance tradeoff

### Practical Exercise
Build a complete supervised learning pipeline to predict house prices using multiple algorithms.

---

## Module 5: Unsupervised Learning

### Learning Objectives
- Apply unsupervised learning techniques to real data
- Understand clustering and dimensionality reduction
- Discover hidden patterns in data

### Key Topics
- **Clustering Algorithms**
  - K-means clustering
  - Hierarchical clustering
  - DBSCAN and density-based clustering
  - Choosing the right number of clusters

- **Dimensionality Reduction**
  - Principal Component Analysis (PCA)
  - Linear Discriminant Analysis (LDA)
  - t-SNE and UMAP for visualization
  - Feature selection techniques

- **Association Rules**
  - Market basket analysis
  - Apriori algorithm
  - Support, confidence, and lift
  - Applications in recommendation systems

- **Anomaly Detection**
  - Statistical methods
  - Isolation Forest
  - One-class SVM
  - Applications in fraud detection

### Practical Exercise
Perform customer segmentation using clustering algorithms on e-commerce data.

---

## Module 6: Neural Networks Basics

### Learning Objectives
- Understand neural network architecture and training
- Implement basic neural networks
- Apply neural networks to classification and regression

### Key Topics
- **Introduction to Neural Networks**
  - Perceptron and multilayer perceptron
  - Network architecture and layers
  - Forward and backward propagation
  - Activation functions

- **Activation Functions**
  - Sigmoid, Tanh, and ReLU
  - Choosing appropriate activation functions
  - Vanishing gradient problem
  - Modern activation functions (Leaky ReLU, ELU)

- **Backpropagation**
  - Chain rule and gradient computation
  - Weight updates and learning rate
  - Batch vs stochastic gradient descent
  - Common optimization algorithms

- **Building Simple Neural Networks**
  - Architecture design principles
  - Hyperparameter tuning
  - Regularization techniques
  - Debugging neural networks

### Practical Exercise
Build a neural network to classify handwritten digits using the MNIST dataset.

---

## Module 7: Model Deployment

### Learning Objectives
- Deploy machine learning models to production
- Create APIs for model serving
- Monitor and maintain deployed models

### Key Topics
- **Model Serialization**
  - Pickle and joblib for Python models
  - ONNX for cross-platform deployment
  - Model versioning and management
  - Best practices for model storage

- **Web APIs with Flask/FastAPI**
  - RESTful API design principles
  - Request/response handling
  - Input validation and error handling
  - API documentation and testing

- **Cloud Deployment Options**
  - AWS SageMaker and Azure ML
  - Google Cloud AI Platform
  - Docker containerization
  - Serverless deployment options

- **Model Monitoring**
  - Performance monitoring and alerting
  - Data drift detection
  - Model retraining strategies
  - A/B testing for models

### Practical Exercise
Deploy a trained model as a web API and create a simple frontend to interact with it.

---

## Module 8: Capstone Project

### Learning Objectives
- Apply all learned concepts in a comprehensive project
- Demonstrate end-to-end ML workflow
- Present findings and insights effectively

### Key Topics
- **End-to-End ML Project**
  - Problem definition and business understanding
  - Data collection and exploration
  - Feature engineering and selection
  - Model development and evaluation

- **Data Collection and Preprocessing**
  - Data sources and APIs
  - Data quality assessment
  - Cleaning and transformation
  - Feature scaling and encoding

- **Model Training and Evaluation**
  - Algorithm selection and comparison
  - Hyperparameter optimization
  - Cross-validation and testing
  - Performance analysis and interpretation

- **Presentation and Documentation**
  - Technical documentation
  - Visualization and storytelling
  - Code organization and version control
  - Future improvements and extensions

### Capstone Project Requirements
- Choose a real-world problem
- Collect and analyze relevant data
- Implement at least 3 different algorithms
- Compare and evaluate model performance
- Deploy the best model
- Create comprehensive documentation
- Present findings to peers

---

## Assessment Methods

### Weekly Quizzes (30%)
- Multiple choice questions on concepts
- Coding challenges and mini-projects
- Peer review and discussion participation

### Hands-on Projects (40%)
- Module-specific practical exercises
- Data analysis and visualization projects
- Algorithm implementation assignments
- Code review and best practices

### Final Capstone Project (30%)
- End-to-end machine learning project
- Technical presentation and documentation
- Peer evaluation and feedback
- Portfolio development

---

## Learning Resources

### Required Materials
- Jupyter Notebooks with course content
- Sample datasets and code examples
- Online documentation and tutorials
- Community forums and discussion boards

### Recommended Reading
- "Hands-On Machine Learning" by Aurélien Géron
- "Python Machine Learning" by Sebastian Raschka
- "The Elements of Statistical Learning" by Hastie, Tibshirani, and Friedman
- "Pattern Recognition and Machine Learning" by Christopher Bishop

### Tools and Software
- Python 3.8+ with Anaconda distribution
- Jupyter Notebook or JupyterLab
- Git for version control
- Cloud platforms (AWS, Google Cloud, or Azure)

---

## Course Schedule

| Week | Module | Topics | Assignment Due |
|------|--------|--------|----------------|
| 1 | Module 1 | ML Foundations | Quiz 1 |
| 2 | Module 2 | Mathematics | Quiz 2, Project 1 |
| 3 | Module 3 | Python for ML | Quiz 3, Project 2 |
| 4 | Module 4 | Supervised Learning | Quiz 4, Project 3 |
| 5 | Module 5 | Unsupervised Learning | Quiz 5, Project 4 |
| 6 | Module 6 | Neural Networks | Quiz 6, Project 5 |
| 7 | Module 7 | Model Deployment | Quiz 7, Project 6 |
| 8 | Module 8 | Capstone Project | Final Project |

---

## Support and Community

### Instructor Support
- Office hours: Tuesdays and Thursdays, 2-4 PM
- Email response within 24 hours
- One-on-one consultations available

### Peer Learning
- Study groups and collaboration
- Code review sessions
- Project showcase events
- Alumni network access

### Technical Support
- Installation and setup assistance
- Debugging help and troubleshooting
- Performance optimization guidance
- Career advice and mentorship`
    },
    'web development': {
      title: 'Complete Web Development Bootcamp',
      outline: `Course Title: Complete Web Development Bootcamp

Module 1: Web Fundamentals
- How the Internet Works
- Client-Server Architecture
- HTTP Protocol
- Web Browsers and Developer Tools

Module 2: HTML5 & CSS3
- Semantic HTML Structure
- CSS Layouts (Flexbox, Grid)
- Responsive Design Principles
- CSS Animations and Transitions
- Modern CSS Features

Module 3: JavaScript Fundamentals
- Variables, Data Types, and Functions
- DOM Manipulation
- Event Handling
- Asynchronous Programming (Promises, async/await)
- ES6+ Features

Module 4: Frontend Frameworks
- React.js Fundamentals
- Component Architecture
- State Management (useState, useContext)
- Hooks and Custom Hooks
- React Router

Module 5: Backend Development
- Node.js and Express.js
- RESTful API Design
- Database Integration (MongoDB/PostgreSQL)
- Authentication and Authorization
- API Security Best Practices

Module 6: Full-Stack Integration
- Connecting Frontend and Backend
- State Management (Redux, Zustand)
- API Integration
- Error Handling
- Loading States

Module 7: Advanced Topics
- TypeScript
- Testing (Jest, React Testing Library)
- Performance Optimization
- SEO Best Practices
- Progressive Web Apps

Module 8: Deployment & DevOps
- Version Control with Git
- CI/CD Pipelines
- Cloud Deployment (Vercel, Netlify, AWS)
- Domain Management
- Performance Monitoring

Assessment Methods:
- Weekly Coding Challenges (25%)
- Mini Projects (35%)
- Final Full-Stack Project (40%)

Learning Outcomes:
By the end of this course, students will be able to:
- Build responsive, modern web applications
- Create RESTful APIs and integrate with databases
- Deploy applications to production
- Work with modern development tools and workflows
- Continue learning advanced web technologies`
    },
    'digital marketing': {
      title: 'Digital Marketing Mastery',
      outline: `Course Title: Digital Marketing Mastery

Module 1: Digital Marketing Fundamentals
- Evolution of Marketing
- Digital vs Traditional Marketing
- Customer Journey Mapping
- Marketing Funnel Stages
- Digital Marketing Strategy

Module 2: Content Marketing
- Content Strategy Development
- Blog Writing and SEO
- Video Content Creation
- Social Media Content
- Content Calendar Planning

Module 3: Search Engine Optimization (SEO)
- On-Page SEO Techniques
- Keyword Research and Analysis
- Technical SEO
- Local SEO
- SEO Analytics and Reporting

Module 4: Social Media Marketing
- Platform-Specific Strategies
- Content Creation for Each Platform
- Community Management
- Influencer Marketing
- Social Media Advertising

Module 5: Email Marketing
- Email List Building
- Email Design and Copywriting
- Automation and Segmentation
- A/B Testing
- Email Analytics

Module 6: Pay-Per-Click Advertising
- Google Ads Fundamentals
- Facebook/Instagram Ads
- Ad Copywriting
- Landing Page Optimization
- Campaign Management

Module 7: Analytics and Data
- Google Analytics Setup
- Key Performance Indicators (KPIs)
- Data Analysis and Reporting
- Conversion Tracking
- Marketing Attribution

Module 8: Marketing Automation
- CRM Systems
- Marketing Automation Tools
- Lead Nurturing
- Customer Retention Strategies
- Marketing Technology Stack

Assessment Methods:
- Marketing Plan Development (30%)
- Campaign Creation and Execution (40%)
- Analytics and Reporting (30%)

Learning Outcomes:
By the end of this course, students will be able to:
- Develop comprehensive digital marketing strategies
- Execute campaigns across multiple channels
- Analyze and optimize marketing performance
- Use marketing automation tools effectively
- Stay current with digital marketing trends`
    }
  };

  // Find the best matching topic or generate a generic course
  const lowerTopic = topic.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [key, course] of Object.entries(mockCourses)) {
    if (lowerTopic.includes(key) || key.includes(lowerTopic)) {
      const score = Math.max(lowerTopic.length, key.length);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = course;
      }
    }
  }

  if (bestMatch) {
    return bestMatch;
  }

  // Generate a generic course if no specific match
  return {
    title: `Complete Course on ${topic}`,
    outline: `Course Title: Complete Course on ${topic}

Module 1: Introduction to ${topic}
- What is ${topic}?
- Why is ${topic} important?
- Historical context and evolution
- Current trends and applications

Module 2: Fundamentals
- Core concepts and principles
- Basic terminology and definitions
- Essential frameworks and models
- Key theories and approaches

Module 3: Practical Applications
- Real-world examples and case studies
- Industry applications
- Best practices and methodologies
- Common challenges and solutions

Module 4: Advanced Concepts
- Complex topics and advanced techniques
- Emerging trends and innovations
- Research and development
- Future directions

Module 5: Tools and Technologies
- Essential tools and software
- Technology stack overview
- Platform selection criteria
- Integration strategies

Module 6: Implementation
- Step-by-step implementation guide
- Project planning and management
- Risk assessment and mitigation
- Quality assurance

Module 7: Evaluation and Optimization
- Performance measurement
- Key performance indicators
- Continuous improvement strategies
- Optimization techniques

Module 8: Capstone Project
- End-to-end project implementation
- Real-world application
- Documentation and presentation
- Future development planning

Assessment Methods:
- Weekly Assignments (30%)
- Mid-term Project (30%)
- Final Capstone Project (40%)

Learning Outcomes:
By the end of this course, students will be able to:
- Understand fundamental concepts of ${topic}
- Apply knowledge to real-world scenarios
- Use relevant tools and technologies
- Develop and implement ${topic}-related projects
- Continue learning and growing in the field`
  };
}

// Function to generate quiz questions for a module
function generateQuizQuestions(moduleTitle, keyTopics, difficulty = 'Beginner') {
  const questionTemplates = {
    'Foundations of Machine Learning': [
      {
        question: "What is the primary difference between supervised and unsupervised learning?",
        options: [
          "Supervised learning uses labeled data, unsupervised learning uses unlabeled data",
          "Supervised learning is faster than unsupervised learning",
          "Unsupervised learning requires more computational power",
          "There is no difference between the two approaches"
        ],
        correct: 0,
        explanation: "Supervised learning uses labeled training data to learn patterns, while unsupervised learning finds hidden patterns in unlabeled data."
      },
      {
        question: "Which of the following is NOT a type of machine learning?",
        options: [
          "Supervised Learning",
          "Unsupervised Learning", 
          "Reinforcement Learning",
          "Deterministic Learning"
        ],
        correct: 3,
        explanation: "Deterministic Learning is not a recognized type of machine learning. The three main types are supervised, unsupervised, and reinforcement learning."
      }
    ],
    'Mathematics Fundamentals': [
      {
        question: "What is the purpose of gradient descent in machine learning?",
        options: [
          "To increase the learning rate",
          "To find the minimum of a cost function",
          "To normalize the data",
          "To visualize the data"
        ],
        correct: 1,
        explanation: "Gradient descent is an optimization algorithm used to minimize the cost function by iteratively moving in the direction of steepest descent."
      }
    ]
  };

  // Return questions for the specific module or generate generic ones
  return questionTemplates[moduleTitle] || [
    {
      question: `What is the main focus of ${moduleTitle}?`,
      options: [
        "Advanced theoretical concepts",
        "Practical applications and implementation",
        "Historical background only",
        "Mathematical proofs exclusively"
      ],
      correct: 1,
      explanation: `This module focuses on practical applications and hands-on implementation of ${moduleTitle.toLowerCase()} concepts.`
    }
  ];
}

// POST /api/courses/generate - Generate a new course using AI
export async function POST(request) {
  try {
    // Use Clerk authentication
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      topic, 
      category = 'General',
      difficulty = 'Beginner',
      duration = '3-5 hours',
      chapterCount = 5,
      includeVideos = true,
      includeQuiz = false 
    } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    console.log('Generating course with parameters:', { 
      topic, category, difficulty, duration, chapterCount, includeVideos, includeQuiz 
    });

    // Generate course using AI
    const generatedCourse = await generateCourseWithAI(
      topic, 
      category, 
      difficulty, 
      duration, 
      chapterCount, 
      includeVideos, 
      includeQuiz
    );

    // Enhanced YouTube video search using keywords and search terms
    if (includeVideos && Array.isArray(generatedCourse.modules)) {
      const apiKey = process.env.YOUTUBE_API_KEY;
      const rateLimited = (arr, size = 3) => {
        // Smaller chunks to avoid rate limits
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
        return chunks;
      };

      if (apiKey) {
        console.log('Searching for YouTube videos using enhanced search terms...');
        const moduleChunks = rateLimited(generatedCourse.modules, 3);
        
        for (const chunk of moduleChunks) {
          // Enhanced parallel video search with multiple search strategies
          const results = await Promise.all(
            chunk.map(async (module) => {
              try {
                // Use multiple search strategies for better results
                const searchQueries = [
                  module.videoSearchTerms || `${topic} ${module.title}`,
                  `${topic} tutorial ${module.keywords?.[0] || ''}`,
                  `learn ${topic} ${module.title.split(':')[1] || module.title}`
                ].filter(Boolean);

                let allVideoIds = [];
                
                // Try each search query to get diverse results
                for (const query of searchQueries.slice(0, 2)) { // Limit to 2 queries per module
                  const ids = await searchYouTubeVideoIds(query.trim(), apiKey, 2);
                  allVideoIds = [...allVideoIds, ...ids];
                  
                  // Small delay to respect rate limits
                  await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Remove duplicates and limit to 3 videos per module
                const uniqueIds = [...new Set(allVideoIds)].slice(0, 3);
                const embedUrls = uniqueIds.map((id) => `https://www.youtube.com/embed/${id}`);
                
                return { module, embedUrls };
              } catch (error) {
                console.error(`Error searching videos for module: ${module.title}`, error);
                return { module, embedUrls: [] };
              }
            })
          );
          
          // Assign video URLs back to modules
          results.forEach(({ module, embedUrls }) => {
            if (embedUrls.length > 0) {
              module.videoUrls = embedUrls;
              console.log(`Found ${embedUrls.length} videos for module: ${module.title}`);
            } else {
              console.log(`No videos found for module: ${module.title}`);
            }
          });
          
          // Delay between chunks to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } else {
        console.log('YouTube API key not found, skipping video search');
      }
    }

    // Generate quizzes if requested
    let quizzes = [];
    if (includeQuiz && generatedCourse.chapters) {
      quizzes = generatedCourse.chapters.map(chapter => ({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        questions: generateQuizQuestions(chapter.title, chapter.points, difficulty)
      }));
    }

    // Convert enhanced structure back to compatible format for database storage
    const compatibleCourse = {
      title: generatedCourse.course_title || generatedCourse.title,
      description: generatedCourse.overview || `Learn ${topic} with this comprehensive course.`,
      category: generatedCourse.category || category || 'General',
      difficulty: generatedCourse.difficulty || difficulty || 'Beginner',
      duration: generatedCourse.duration || duration || '3-5 hours',
      topic,
      chapterCount: generatedCourse.modules?.length || generatedCourse.chapters?.length || 0,
      id: 'generated-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Convert modules to chapters for database compatibility
      chapters: (generatedCourse.modules || generatedCourse.chapters || []).map((module, index) => ({
        id: module.id || `chapter-${index + 1}`,
        title: module.title,
        description: module.description,
        points: module.objectives || module.points || [],
        keywords: module.keywords || [],
        videoSearchTerms: module.videoSearchTerms || '',
        videoUrls: module.videoUrls || [],
        orderIndex: index + 1
      })),
      
      // Include enhanced metadata
      enhancedStructure: {
        course_title: generatedCourse.course_title,
        overview: generatedCourse.overview,
        modules: generatedCourse.modules
      },
      
      quizzes: includeQuiz ? quizzes : undefined
    };

    return NextResponse.json({ 
      course: compatibleCourse
    });
  } catch (error) {
    console.error('Error generating course:', error);
    return NextResponse.json({ 
      error: 'Failed to generate course: ' + error.message 
    }, { status: 500 });
  }
}


