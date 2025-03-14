"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { QuizItem } from "@/features/quiz/types";
import { useQuiz } from "../context";

interface QuizSelectorProps {
  quizzes: QuizItem[];
}

export function QuizSelector({ quizzes }: QuizSelectorProps) {
  const { setCurrentQuiz, resetQuiz } = useQuiz();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSelectQuiz = (quiz: QuizItem) => {
    resetQuiz();
    setCurrentQuiz(quiz);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-3 text-gradient">Khảo Sát Da</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Hãy chọn một bài khảo sát để nhận biết loại da của bạn và nhận được
          lời khuyên phù hợp
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            variants={item}
            onMouseEnter={() => setHoveredCard(quiz.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Card
              className={`h-full flex flex-col relative overflow-hidden transition-all duration-300 ${
                hoveredCard === quiz.id
                  ? "shadow-xl shadow-primary/10 scale-[1.02]"
                  : "shadow-md"
              }`}
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-primary">
                      {quiz.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {quiz.description}
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {quiz.questions.length}
                      </span>
                    </div>
                    <span className="text-muted-foreground">Câu hỏi</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-secondary" />
                    </div>
                    <span className="text-muted-foreground">
                      {quiz.categoryName}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  className={`w-full group ${
                    hoveredCard === quiz.id ? "bg-gradient" : "bg-primary/80"
                  } hover:opacity-90 transition-all`}
                  onClick={() => handleSelectQuiz(quiz)}
                  disabled={quiz.questions.length === 0}
                >
                  <span>Bắt đầu</span>
                  <ArrowRight
                    className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                      hoveredCard === quiz.id ? "translate-x-1" : ""
                    }`}
                  />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
