import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mx-4 ">
      <div className="flex items-center mt-10">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className={`h-0.5 w-10 ${
                  currentStep >= index + 1
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-500 dark:to-purple-600"
                    : "bg-gray-200 dark:bg-indigo-900/40"
                }`}
              ></div>
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                currentStep >= index + 1
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 dark:bg-indigo-900/40 dark:text-indigo-300 border border-gray-200 dark:border-indigo-800/30"
              }`}
            >
              {index + 1}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
