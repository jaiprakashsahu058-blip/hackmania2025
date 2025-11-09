'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Brain, Trophy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ModuleQuiz({ module, onComplete }) {
  const [quizStarted, setQuizStarted] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Reset quiz state when module changes
  useEffect(() => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  }, [module]);

  if (!module.quiz || module.quiz.length === 0) {
    return null; // No quiz for this module
  }

  const handleAnswer = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < module.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    module.quiz.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  const currentQuestion = module.quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / module.quiz.length) * 100;

  // Start Quiz Screen
  if (!quizStarted && !showResults) {
    return (
      <Card className="mt-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <CardTitle className="text-white">Test Your Knowledge</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-white/80">
              Ready to test what you learned? This quiz has {module.quiz.length} questions.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setQuizStarted(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
              <Button
                variant="outline"
                onClick={onComplete}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Skip Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz Results Screen
  if (showResults) {
    const scorePercentage = Math.round((score / module.quiz.length) * 100);
    return (
      <Card className="mt-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <CardTitle className="text-white">Quiz Complete!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-white">
              {scorePercentage}%
            </div>
            <p className="text-xl text-white/80">
              {score} out of {module.quiz.length} correct
            </p>
            <p className="text-white/60">
              {scorePercentage >= 80 ? '🎉 Excellent work!' :
               scorePercentage >= 60 ? '👍 Good job!' :
               '💪 Keep learning!'}
            </p>
          </div>

          {/* Show all questions with answers */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {module.quiz.map((question, index) => {
              const isCorrect = userAnswers[index] === question.correct_answer;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-red-500/50 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-sm text-white/60 mb-1">
                        Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                          {userAnswers[index]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-white/60">
                          Correct answer: <span className="text-green-400">{question.correct_answer}</span>
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-white/70 mt-2 italic">
                          💡 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleRetake}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Continue to Next Module
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz Question Screen
  return (
    <Card className="mt-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <CardTitle className="text-white">Module Quiz</CardTitle>
            </div>
            <span className="text-sm text-white/60">
              Question {currentQuestionIndex + 1} of {module.quiz.length}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <p className="text-lg text-white font-medium">
              {currentQuestion.question}
            </p>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const letter = option.charAt(0); // Extract A, B, C, D
                const isSelected = userAnswers[currentQuestionIndex] === letter;
                
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(currentQuestionIndex, letter)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-purple-400 bg-purple-500/20 text-white'
                        : 'border-white/20 bg-white/5 text-white/80 hover:border-purple-400/50 hover:bg-purple-500/10'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex < module.quiz.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Next Question
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>

        {/* Mark as Done button - always available */}
        <div className="pt-4 border-t border-white/10">
          <Button
            onClick={onComplete}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Done & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
