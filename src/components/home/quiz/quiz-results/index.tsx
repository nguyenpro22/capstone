"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, Share2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useQuiz } from "../context";

interface QuizResultsProps {
  onClose?: () => void;
}

export function QuizResults({ onClose }: QuizResultsProps) {
  const { currentQuiz, answers, resetQuiz } = useQuiz();

  useEffect(() => {
    // Trigger confetti when results are shown
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    resetQuiz();
    if (onClose) {
      onClose();
    }
  };

  if (!currentQuiz) return null;

  const totalQuestions = currentQuiz.questions.length;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="max-h-[90vh] overflow-hidden flex flex-col ">
      <div className="p-6 pb-0 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mx-auto bg-gradient p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4"
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gradient mb-2">Hoàn thành!</h1>
        <p className="text-muted-foreground">
          {currentQuiz.name} - {currentQuiz.description}
        </p>
      </div>

      <div className="p-6 flex-grow overflow-hidden flex flex-col">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/20 text-center mb-4"
        >
          <p className="font-medium text-lg">
            Số câu hỏi đã trả lời:{" "}
            <span className="font-bold">
              {answeredQuestions}/{totalQuestions}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex-grow overflow-hidden"
        >
          <h3 className="text-xl font-medium mb-3 text-gradient">
            Chi tiết câu trả lời
          </h3>
          <ScrollArea className="h-[calc(100vh-1000px)] min-h-[200px] rounded-md border border-white/20 p-4 bg-white/10 backdrop-blur-sm">
            <div className="space-y-6">
              {currentQuiz.questions.map((question, index) => {
                const answer = answers[question.id];
                return (
                  <div key={question.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient text-white font-medium rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary">
                          {question.question}
                        </h3>
                        <div className="mt-2 pl-4 border-l-2 border-primary/30">
                          <p className="text-sm text-muted-foreground">
                            Câu trả lời của bạn:
                          </p>
                          {answer ? (
                            Array.isArray(answer) ? (
                              <ul className="mt-1 space-y-1">
                                {answer.map((opt, i) => (
                                  <li
                                    key={i}
                                    className="text-sm bg-white/10 px-3 py-1.5 rounded-md"
                                  >
                                    {opt}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm bg-white/10 px-3 py-1.5 rounded-md mt-1">
                                {answer}
                              </p>
                            )
                          ) : (
                            <p className="text-sm italic">Chưa trả lời</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </motion.div>
      </div>

      <div className="p-6 border-t border-white/10 flex flex-col gap-3">
        <Button
          onClick={handleClose}
          className="w-full bg-gradient hover:opacity-90 transition-opacity shadow-md"
        >
          <Home className="mr-2 h-4 w-4" />
          Quay lại danh sách khảo sát
        </Button>

        <Button
          variant="outline"
          className="w-full border-white/20 hover:bg-white/10"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Chia sẻ kết quả
        </Button>
      </div>
    </div>
  );
}
