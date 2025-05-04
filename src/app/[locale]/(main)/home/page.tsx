"use client";

import { useState, useEffect } from "react";
import { ExpertsSection } from "@/components/home/experts-section";
import { FooterSection } from "@/components/home/Footer";
import { GallerySection } from "@/components/home/gallery-section";
import SiteHeader from "@/components/home/Header";
import { HeroSection } from "@/components/home/hero-section";
import { OffersSection } from "@/components/home/offers-section";
import { FloatingQuizButton } from "@/components/home/quiz-modal";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhyChooseUsSection } from "@/components/home/why-choose-us";
import type { IListResponse, IResCommon } from "@/lib/api";
import { ServicesSection } from "@/components/home/services-section";
import LoadingSpinner from "./loading";
import { ClinicsSliderSection } from "@/components/clinic-view/clinics-slider-section";
import { useGetSurveyQuery } from "@/features/landing/api";
import type { SurveyItem, SurveyQuestion } from "@/features/landing/types";
import type { QuizItem, QuizQuestion } from "@/features/quiz/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const convertToQuizItems = (surveys: SurveyItem[]): QuizItem[] => {
  return surveys.map((survey) => ({
    id: survey.id,
    name: survey.name,
    description: survey.description,
    categoryName: survey.categoryName || "",
    questions: survey.questions.map((q) => ({
      id: q.id,
      question: q.question,
      questionType: q.questionType as "Single Choice" | "Multiple Choice",
      options: q.options,
    })),
  }));
};

export default function Home() {
  const [quizData, setQuizData] = useState<IResCommon<
    IListResponse<SurveyItem>
  > | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: quizResponse } = useGetSurveyQuery(
    {
      searchTerm: "",
      page: 1,
      pageSize: 10,
      sortColumn: "",
      sortOrder: "",
    },
    { skip: !user?.hasSurvey }
  );
  useEffect(() => {
    setQuizData(quizResponse || null);
  }, [quizResponse]);

  // // Show loading state while fetching data
  // if (!quizData) {
  //   return <LoadingSpinner key={1} size={40} />;
  // }
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <ClinicsSliderSection />
      <TestimonialsSection />
      <FooterSection />
      {quizData && (
        <FloatingQuizButton
          quizzes={convertToQuizItems(quizData.value.items)}
        />
      )}
    </div>
  );
}
