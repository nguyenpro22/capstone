"use client";

import { QuizAnswers, QuizItem } from "@/features/quiz/types";
import { createContext, useContext, useState, type ReactNode } from "react";

interface QuizContextType {
  currentQuiz: QuizItem | null;
  setCurrentQuiz: (quiz: QuizItem) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: QuizAnswers;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  isCompleted: boolean;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentQuiz, setCurrentQuiz] = useState<QuizItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const setAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const completeQuiz = () => {
    // Đánh dấu khảo sát đã hoàn thành
    setIsCompleted(true);
    console.log("Quiz completed, setting isCompleted to true");
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  return (
    <QuizContext.Provider
      value={{
        currentQuiz,
        setCurrentQuiz,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        setAnswer,
        isCompleted,
        completeQuiz,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
