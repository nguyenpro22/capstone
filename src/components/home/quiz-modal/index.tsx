"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Sparkles, ClipboardCheck } from "lucide-react";
import { QuizItem } from "@/features/quiz/types";
import { useQuiz } from "../quiz/context";
import { QuestionCard } from "../quiz/question-card";
import { QuizResults } from "../quiz/quiz-results";

interface FloatingQuizButtonProps {
  quizzes: QuizItem[];
}

export function FloatingQuizButton({ quizzes }: FloatingQuizButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const {
    currentQuiz,
    currentQuestionIndex,
    isCompleted,
    resetQuiz,
    setCurrentQuiz,
  } = useQuiz();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Handle starting a specific quiz
  const handleStartQuiz = (quiz: QuizItem) => {
    resetQuiz();
    setCurrentQuiz(quiz);
    setIsOpen(false);
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
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-gradient hover:opacity-90 transition-all p-6 z-50"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      {/* Quiz Selection Modal */}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="glass-effect border-none shadow-xl rounded-xl max-w-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gradient text-center mb-6">
              Chọn Bài Khảo Sát
            </h2>

            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full py-4 px-4 bg-white/10 hover:bg-white/20 border border-white/20 transition-all rounded-xl text-left h-auto flex items-start"
                    variant="ghost"
                  >
                    <div className="mr-4 bg-gradient p-2 rounded-full">
                      {quiz.id.includes("detail") ? (
                        <ClipboardCheck className="h-5 w-5 text-white" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{quiz.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {quiz.description}
                      </span>
                      <div className="mt-1 text-xs bg-white/10 px-2 py-0.5 rounded-full w-fit">
                        {quiz.questions.length} câu hỏi
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Modal */}
      <Dialog
        open={questionModalOpen && !!currentQuiz && !isCompleted}
        onOpenChange={setQuestionModalOpen}
      >
        <DialogContent className="glass-effect border-none shadow-xl rounded-xl max-w-lg p-0">
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
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog
        open={resultsModalOpen && isCompleted}
        onOpenChange={setResultsModalOpen}
      >
        <DialogContent className="glass-effect border-none shadow-xl rounded-xl max-w-xl p-0">
          <QuizResults onClose={handleCloseResults} />
        </DialogContent>
      </Dialog>
    </>
  );
}
