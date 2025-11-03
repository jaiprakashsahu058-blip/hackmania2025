'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Sparkles, BookOpen, Zap, Users, Target, Shield, Play, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Typing animation component
function TypingAnimation() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = ['Data Science', 'Web Development', 'AI & ML', 'Digital Marketing', 'Mobile Apps', 'Blockchain'];
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
        if (currentText === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium mb-8 bg-white/10 text-white border border-white/20 backdrop-blur-md"
            >
              <Sparkles size={18} className="animate-spin" />
              <span>AI-Powered Course Generation</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight"
            >
              Create Amazing{' '}
              <br className="sm:hidden" />
              <TypingAnimation />
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl">Courses</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Transform your ideas into comprehensive, structured learning experiences. 
              Our AI-powered platform creates detailed course outlines, learning objectives, 
              and curriculum structures in moments.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 hover:from-orange-700 hover:via-red-700 hover:to-orange-800 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3"
                  >
                    Get Started Free
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </SignInButton>
              ) : (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/dashboard"
                  className="group bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 hover:from-orange-700 hover:via-red-700 hover:to-orange-800 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-3"
                >
                  Go to Dashboard
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              )}
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group text-white/90 hover:text-white px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-md flex items-center gap-3"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Watch Demo
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 bg-gray-900 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create professional courses in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Enter Your Course Topic',
                description: 'Simply type what you want to teach. Our AI understands any subject from coding to cooking.',
                icon: BookOpen,
                color: 'from-orange-500 to-red-500'
              },
              {
                step: '02',
                title: 'AI Generates Outline Instantly',
                description: 'Watch as our AI creates a comprehensive course structure with modules, lessons, and objectives.',
                icon: Zap,
                color: 'from-red-500 to-orange-600'
              },
              {
                step: '03',
                title: 'Export or Customize',
                description: 'Download your course as PDF, share online, or customize further with our editing tools.',
                icon: ArrowRight,
                color: 'from-orange-600 to-red-600'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative"
              >
                <div className="bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 group-hover:scale-105">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 overflow-hidden bg-gradient-to-br from-black to-gray-900">
        {/* Animated gradient blobs */}
        <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-16 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-red-500/20 to-orange-600/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6">
              Why Choose MindCourse?
            </h2>
            <div className="flex justify-center mb-6">
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600" />
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform blends cutting-edge AI with instructional design to craft premium learning experiences.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Lightning Fast', 
                desc: 'Generate comprehensive outlines in seconds. Go from idea to structure instantly.', 
                icon: Zap, 
                grad: 'from-orange-500 to-red-500',
                bgGrad: 'from-orange-900/20 to-red-900/20'
              },
              { 
                title: 'Comprehensive Content', 
                desc: 'Learning objectives, modules, and assessments aligned to best practices.', 
                icon: BookOpen, 
                grad: 'from-red-500 to-orange-600',
                bgGrad: 'from-red-900/20 to-orange-900/20'
              },
              { 
                title: 'Customizable', 
                desc: 'Tune for audience, level, and outcomes. Regenerate and refine with ease.', 
                icon: Target, 
                grad: 'from-orange-600 to-red-600',
                bgGrad: 'from-orange-900/20 to-red-900/20'
              },
              { 
                title: 'Educator Approved', 
                desc: 'Built with input from seasoned educators to ensure quality.', 
                icon: Users, 
                grad: 'from-red-600 to-orange-500',
                bgGrad: 'from-red-900/20 to-orange-900/20'
              },
              { 
                title: 'Secure & Private', 
                desc: 'Your ideas stay yours. Privacy-first by design.', 
                icon: Shield, 
                grad: 'from-orange-500 to-red-500',
                bgGrad: 'from-orange-900/20 to-red-900/20'
              },
              { 
                title: 'AI-Powered', 
                desc: 'Harness state-of-the-art AI to deliver engaging, effective courses.', 
                icon: Sparkles, 
                grad: 'from-red-500 to-orange-600',
                bgGrad: 'from-red-900/20 to-orange-900/20'
              }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                className="group"
              >
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative rounded-3xl p-8 bg-gradient-to-br ${f.bgGrad} border border-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden`}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.grad} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon with enhanced styling */}
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg bg-gradient-to-br ${f.grad} group-hover:shadow-xl transition-all duration-300`}
                  >
                    <f.icon className="h-8 w-8" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-orange-400 group-hover:to-red-400 transition-all duration-300">
                    {f.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {f.desc}
                  </p>
                  
                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            Join thousands of educators who are already saving time and creating better courses with AI.
          </p>
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                Start Creating Today
              </button>
            </SignInButton>
          ) : (
            <a
              href="/dashboard"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
            >
              Go to Dashboard
            </a>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
