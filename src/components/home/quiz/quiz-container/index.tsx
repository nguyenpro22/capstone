"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { QuizItem } from "@/features/quiz/types";
import { useQuiz } from "../context";
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background";
import { QuizModal } from "../quiz-modal";
import { QuestionCard } from "../question-card";
import { QuizResults } from "../quiz-results";

interface QuizContainerProps {
  quizzes: QuizItem[];
}

export function QuizContainer({ quizzes }: QuizContainerProps) {
  const {
    currentQuiz,
    currentQuestionIndex,
    isCompleted,
    resetQuiz,
    setCurrentQuiz,
  } = useQuiz();
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);

  // Handle starting a specific quiz
  const handleStartQuiz = (quiz: QuizItem) => {
    resetQuiz();
    setCurrentQuiz(quiz);
    setQuestionModalOpen(true);
  };

  // Handle quiz completion
  const handleQuizComplete = () => {
    setQuestionModalOpen(false);
    setResultsModalOpen(true);
  };

  // Handle closing the results and going back to the quiz selection
  const handleCloseResults = () => {
    setResultsModalOpen(false);
    resetQuiz();
  };

  return (
    <AnimatedGradientBackground>
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-3 text-gradient">Khảo Sát Da</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Hãy chọn một bài khảo sát để nhận biết loại da của bạn và nhận được
            lời khuyên phù hợp
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="w-full md:w-auto"
              >
                <Button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full md:w-auto py-6 px-8 bg-gradient hover:opacity-90 transition-all rounded-xl shadow-lg group"
                  size="lg"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-2 bg-white/20 p-2 rounded-full">
                      {quiz.id.includes("detail") ? (
                        <ClipboardCheck className="h-6 w-6 text-white" />
                      ) : (
                        <Sparkles className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <span className="text-lg font-medium">{quiz.name}</span>
                    <span className="text-sm text-white/80">
                      {quiz.description}
                    </span>
                    <div className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">
                      {quiz.questions.length} câu hỏi
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Question Modal */}
        <QuizModal
          open={questionModalOpen && !!currentQuiz && !isCompleted}
          onOpenChange={setQuestionModalOpen}
          size="lg"
          showCloseButton={true}
        >
          {currentQuiz &&
            !isCompleted &&
            currentQuiz.questions[currentQuestionIndex] && (
              <QuestionCard
                question={currentQuiz.questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={currentQuiz.questions.length}
                onComplete={handleQuizComplete}
              />
            )}
        </QuizModal>

        {/* Results Modal */}
        <QuizModal
          open={resultsModalOpen && isCompleted}
          onOpenChange={setResultsModalOpen}
          size="xl"
          showCloseButton={true}
        >
          <QuizResults onClose={handleCloseResults} />
        </QuizModal>
      </div>
    </AnimatedGradientBackground>
  );
}
