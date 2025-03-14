"use client";

import { ContactSection } from "@/components/home/contact-section";
import { ExpertsSection } from "@/components/home/experts-section";
import { FooterSection } from "@/components/home/Footer";
import { GallerySection } from "@/components/home/gallery-section";
import SiteHeader from "@/components/home/Header";
import { HeroSection } from "@/components/home/hero-section";
import { OffersSection } from "@/components/home/offers-section";
import { FloatingQuizButton } from "@/components/home/quiz-modal";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhyChooseUsSection } from "@/components/home/why-choose-us";
import { QuizItem } from "@/features/quiz/types";
import { IListResponse, IResCommon } from "@/lib/api";

async function getQuizData(): Promise<IResCommon<IListResponse<QuizItem>>> {
  // For demo purposes, we're using the data from the provided JSON
  return {
    value: {
      items: [
        {
          id: "11111111-1111-1111-1111-111111111111",
          name: "Khảo sát da",
          description: "Nhận biết loại da",
          categoryName: "Căng Da Bụng",
          questions: [
            {
              id: "22222222-1111-1111-1111-111111111111",
              question:
                "Sau khi rửa mặt (không bôi kem) da bạn thường cảm thấy thế nào?",
              questionType: "Multiple Choice",
              options: [
                {
                  option: "A) Rất căng khô hoặc bong tróc",
                },
                {
                  option: "B) Khá cân bằng không quá khô hay dầu",
                },
                {
                  option: "C) Hơi bóng ở vùng chữ T",
                },
                {
                  option: "D) Bóng dầu toàn mặt",
                },
                {
                  option: "E) Đỏ hoặc châm chích",
                },
              ],
            },
            {
              id: "22222222-2222-1111-1111-111111111111",
              question:
                "Vào giữa ngày da bạn trông thế nào (nếu không thấm dầu)?",
              questionType: "Multiple Choice",
              options: [
                {
                  option: "A) Không hầu như chỉ khô",
                },
                {
                  option: "B) Không khá đồng đều",
                },
                {
                  option: "C) Thường khô ở má nhưng dầu vùng chữ T",
                },
                {
                  option: "D) Oily toàn mặt",
                },
                {
                  option: "E) Thay đổi theo độ nhạy cảm",
                },
              ],
            },
            {
              id: "22222222-3333-1111-1111-111111111111",
              question: "Tần suất bong tróc hoặc khô mảng?",
              questionType: "Multiple Choice",
              options: [
                {
                  option: "A) Rất nhỏ hoặc gần như không thấy",
                },
                {
                  option: "B) Thấy ở mức vừa phải",
                },
                {
                  option: "C) Rõ hơn ở vùng chữ T",
                },
                {
                  option: "D) To và dễ thấy toàn mặt",
                },
                {
                  option: "E) Rõ hơn khi da ửng đỏ hoặc kích ứng",
                },
              ],
            },
          ],
        },
        {
          id: "4c002d6a-c2f7-41aa-a775-eae93d04fbdf",
          name: "Khảo sát da chi tiết",
          description: "Nhận biết loại da chi tiết",
          categoryName: "Căng Da Bụng",
          questions: [
            {
              id: "0e6b00b2-8ca7-4204-a2fb-1ccd7a2f2f1c",
              question:
                "Vào giữa ngày da bạn trông thế nào nếu không thấm dầu hay dặm lại sản phẩm?",
              questionType: "Single Choice",
              options: [
                {
                  option: "A) Vẫn khô hoặc căng",
                },
                {
                  option: "B) Khá cân bằng ít bóng",
                },
                {
                  option: "C) Có chút bóng ở vùng chữ T",
                },
                {
                  option: "D) Bóng dầu toàn khuôn mặt",
                },
                {
                  option: "E) Dễ kích ứng hoặc ửng đỏ",
                },
              ],
            },
            {
              id: "ca1c13d4-868c-4f54-b180-51cd3ac2b22b",
              question:
                "Sau khi rửa mặt (không bôi kem dưỡng) da bạn thường cảm thấy thế nào trong vòng 15–30 phút?",
              questionType: "Single Choice",
              options: [
                {
                  option: "A) Rất căng khô hoặc bong tróc",
                },
                {
                  option: "B) Khá cân bằng không quá khô hay dầu",
                },
                {
                  option: "C) Hơi bóng ở vùng chữ T",
                },
                {
                  option: "D) Bóng dầu toàn mặt",
                },
                {
                  option: "E) Đỏ hoặc châm chích",
                },
              ],
            },
          ],
        },
      ],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 4,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isSuccess: true,
    isFailure: false,
    error: {
      code: "",
      message: "",
    },
  };
}

export default async function Home() {
  const quizData = await getQuizData();
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <SiteHeader />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <GallerySection />
      <ExpertsSection />
      <OffersSection />
      <ContactSection />
      <FooterSection />
      <FloatingQuizButton quizzes={quizData.value.items} />
    </div>
  );
}
