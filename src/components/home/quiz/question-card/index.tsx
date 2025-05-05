"use client";

import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { QuizQuestion } from "@/features/quiz/types";
import { useQuiz } from "../context";
import { ProgressBar } from "../progress-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubmitSurveyAnswersMutation } from "@/features/landing/api";
import { toast } from "react-toastify";

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onComplete?: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onComplete,
}: QuestionCardProps) {
  const {
    answers,
    setAnswer,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuiz,
    completeQuiz,
  } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitSurveyAnswers] = useSubmitSurveyAnswersMutation();

  useEffect(() => {
    // Initialize from existing answers
    if (answers[question.id]) {
      if (Array.isArray(answers[question.id])) {
        setSelectedOptions(answers[question.id] as string[]);
      } else {
        setSelectedOption(answers[question.id] as string);
      }
    } else {
      setSelectedOptions([]);
      setSelectedOption("");
    }
  }, [question.id, answers]);

  const handleSingleChoice = (value: string) => {
    setSelectedOption(value);
    setAnswer(question.id, value);
  };

  const handleMultipleChoice = (value: string) => {
    const updatedSelection = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];

    setSelectedOptions(updatedSelection);
    setAnswer(question.id, updatedSelection);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!currentQuiz) return;

    setIsSubmitting(true);
    try {
      // Transform answers into the required format
      const surveyAnswers = currentQuiz.questions.map((q) => {
        const answer = answers[q.id];
        return {
          answer: Array.isArray(answer) ? answer.join(", ") : answer,
          surveyQuestionId: q.id,
        };
      });

      // Submit survey answers
      await submitSurveyAnswers({
        surveyId: currentQuiz.id,
        surveyAnswers,
      }).unwrap();

      // Đánh dấu khảo sát đã hoàn thành
      completeQuiz();

      // Gọi callback onComplete nếu được cung cấp
      if (onComplete) {
        await onComplete();
      }

      toast.success("Khảo sát đã được gửi thành công!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const isNextDisabled =
    question.questionType === "Single Choice"
      ? !selectedOption
      : selectedOptions.length === 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {currentQuiz?.name}
          </span>
          <h2 className="text-lg font-semibold text-gradient">
            {currentQuiz?.description}
          </h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {question.questionType === "Single Choice"
            ? "Chọn một đáp án"
            : "Chọn nhiều đáp án"}
        </div>
      </div>

      <ProgressBar
        currentQuestion={questionNumber}
        totalQuestions={totalQuestions}
      />

      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center mb-1">
          <span className="bg-gradient text-white w-7 h-7 flex items-center justify-center rounded-full mr-2 text-sm">
            {questionNumber}
          </span>
          <span>Câu hỏi</span>
        </h3>
        <p className="text-lg">{question.question}</p>
      </div>

      <div className="my-8">
        {question.questionType === "Single Choice" ? (
          <RadioGroup
            value={selectedOption}
            onValueChange={handleSingleChoice}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSingleChoice(option.option)}
                className={`flex items-center space-x-2 rounded-lg border p-4 transition-all duration-200 cursor-pointer ${
                  selectedOption === option.option
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "hover:border-primary/30 hover:bg-white/10"
                }`}
              >
                <div
                  className={`flex items-center justify-center h-6 w-6 rounded-full ${
                    selectedOption === option.option
                      ? "bg-gradient text-white"
                      : "bg-white/20 text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <RadioGroupItem
                  value={option.option}
                  id={`option-${index}`}
                  className="sr-only"
                  onClick={() => handleSingleChoice(option.option)}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer ml-2"
                  onClick={() => handleSingleChoice(option.option)}
                >
                  {option.option.replace(/^[A-Z]\)\s*/, "")}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleMultipleChoice(option.option)}
                className={`flex items-center space-x-2 rounded-lg border p-4 transition-all duration-200 ${
                  selectedOptions.includes(option.option)
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "hover:border-primary/30 hover:bg-white/10"
                }`}
              >
                <div
                  className={`flex items-center justify-center h-6 w-6 rounded-full ${
                    selectedOptions.includes(option.option)
                      ? "bg-gradient text-white"
                      : "bg-white/20 text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <Checkbox
                  id={`option-${index}`}
                  checked={selectedOptions.includes(option.option)}
                  onCheckedChange={() => handleMultipleChoice(option.option)}
                  onClick={() => handleMultipleChoice(option.option)}
                  className="sr-only"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer ml-2"
                  onClick={() => handleMultipleChoice(option.option)}
                >
                  {option.option.replace(/^[A-Z]\)\s*/, "")}
                </Label>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="border-primary/50 text-primary hover:bg-primary/5 hover:border-primary transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Câu trước
        </Button>

        <div className="flex items-center font-medium">
          <span className="text-primary">{questionNumber}</span>
          <span className="mx-2 text-muted-foreground">/</span>
          <span>{totalQuestions}</span>
        </div>

        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="bg-gradient hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          {currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1 ? (
            <>
              Câu tiếp <ChevronRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Hoàn thành <Sparkles className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="glass-effect border-none shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-gradient text-xl">
              Xác nhận hoàn thành
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Bạn có chắc chắn muốn hoàn thành bài khảo sát này? Sau khi hoàn
              thành, bạn sẽ không thể thay đổi câu trả lời.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-primary/50 text-primary hover:bg-primary/5"
            >
              Quay lại
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="bg-gradient hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  Xác nhận hoàn thành <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
