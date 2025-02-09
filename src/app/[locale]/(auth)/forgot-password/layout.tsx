import { ReactNode } from "react";
import Image from "next/image";

interface RegisterLayoutProps {
  children: ReactNode;
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100">
      {/* Left Column (Content) */}
      <div className="flex-1 flex flex-col justify-between px-8 py-12 sm:px-12 lg:px-16">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            BEAUTIFY
          </h1>
        </div>

        <div className="max-w-md w-full mx-auto bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-pink-200">
          {children}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          &copy; 2024 Beautify. All rights reserved.
        </div>
      </div>

      {/* Right Column (Decorative) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-400 rounded-l-3xl opacity-90" />

        {/* Main Image */}
        <div className="relative z-10 w-full h-full">
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Beautiful woman in spa"
            layout="fill"
            objectFit="cover"
            className="rounded-l-3xl"
          />
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black bg-opacity-30 rounded-l-3xl">
          <h2 className="text-5xl font-bold text-white mb-6">
            Discover Your Beauty
          </h2>
          <p className="text-white text-xl mb-8 max-w-md text-center">
            Indulge in our premium beauty treatments and transform yourself
          </p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-white text-sm">Facial</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <span className="text-white text-sm">Massage</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <span className="text-white text-sm">Nail Care</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}
