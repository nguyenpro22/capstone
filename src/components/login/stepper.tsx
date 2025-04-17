import React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function Stepper({ currentStep, totalSteps, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <Step
            number={index + 1}
            status={
              index + 1 < currentStep
                ? "completed"
                : index + 1 === currentStep
                ? "current"
                : "upcoming"
            }
          />

          {index < totalSteps - 1 && (
            <div
              className={cn(
                "flex-1 h-1 mx-2",
                index + 1 < currentStep
                  ? "bg-indigo-600"
                  : "bg-gray-200 dark:bg-gray-700"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

interface StepProps {
  number: number;
  status: "completed" | "current" | "upcoming";
}

export function Step({ number, status }: StepProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          status === "completed" && "bg-indigo-600 text-white",
          status === "current" &&
            "bg-indigo-100 text-indigo-600 border-2 border-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 dark:border-indigo-500",
          status === "upcoming" &&
            "bg-gray-100 text-gray-500 border border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
        )}
      >
        {number}
      </div>
    </div>
  );
}
