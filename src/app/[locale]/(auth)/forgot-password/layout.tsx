import { ReactNode } from 'react'

interface ResetPasswordLayoutProps {
  children: ReactNode
}

export default function ResetPasswordLayout({ children }: ResetPasswordLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Column */}
      <div className="flex-1 px-8 py-12 sm:px-12 lg:px-16 flex flex-col">
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Beautify
          </h1>
        </div>
        
        {children}

        <div className="mt-auto pt-12 text-center text-sm text-gray-500">
          &copy; 2024 Beautify. All rights reserved.
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden lg:block flex-1">
        <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-grid-indigo-600/[0.03] bg-[size:20px_20px]" />
          <div className="absolute h-96 w-96 -top-24 -right-24 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute h-96 w-96 bottom-0 left-0 bg-purple-600/10 rounded-full blur-3xl" />
          
          {/* Abstract Shape */}
          <svg className="absolute bottom-0 left-0 w-full text-indigo-600/20" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" fillOpacity="1" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
    </div>
  )
}
