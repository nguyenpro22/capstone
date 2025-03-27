export interface QuizOption {
  option: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionType: "Single Choice" | "Multiple Choice";
  options: QuizOption[];
}

export interface QuizItem {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  questions: QuizQuestion[];
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}
