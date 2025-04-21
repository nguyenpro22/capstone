import Link from "next/link";
import type { Metadata } from "next";
import {
  ChevronRight,
  Shield,
  UserCheck,
  FileText,
  Scale,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  ArrowUp,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Policies | Beauty Service Platform",
  description:
    "Our platform policies for connecting clients and aesthetic clinics",
};

export default function PolicyPage() {
  return (
    <div className="bg-gradient-to-b from-purple-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen">
      {/* Decorative header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-900 dark:to-pink-800">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-tight">
              Platform Policies
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-purple-100">
              Our commitment to transparency, safety, and quality service
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-purple-50 to-transparent dark:from-gray-950 dark:to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative">
        {/* Sticky Table of Contents */}
        <div className="lg:flex gap-8 relative">
          <div className="lg:w-1/4">
            <div className="sticky top-4 lg:block hidden">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-800 dark:to-pink-700 px-4 py-3">
                  <h2 className="text-lg font-bold text-white">
                    Table of Contents
                  </h2>
                </div>
                <nav className="p-4">
                  <div className="space-y-1">
                    {[
                      {
                        name: "Privacy Policy",
                        href: "#privacy",
                        icon: Shield,
                      },
                      {
                        name: "Terms of Service",
                        href: "#terms",
                        icon: FileText,
                      },
                      {
                        name: "User Guidelines",
                        href: "#guidelines",
                        icon: UserCheck,
                      },
                      {
                        name: "Clinic Standards",
                        href: "#standards",
                        icon: HeartHandshake,
                      },
                      {
                        name: "Dispute Resolution",
                        href: "#disputes",
                        icon: Scale,
                      },
                      {
                        name: "Safety & Security",
                        href: "#safety",
                        icon: AlertCircle,
                      },
                    ].map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center p-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 group transition-colors"
                      >
                        <item.icon className="mr-3 h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                      </a>
                    ))}
                  </div>
                </nav>
                <div className="px-4 py-3 bg-purple-50 dark:bg-gray-700/50 border-t border-purple-100 dark:border-gray-700">
                  <a
                    href="#"
                    className="flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Back to top
                  </a>
                </div>
              </div>

              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-purple-100 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  If you have questions about our policies, our support team is
                  here to help.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Table of Contents */}
          <div className="lg:hidden mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-purple-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-800 dark:to-pink-700 px-4 py-3">
                <h2 className="text-lg font-bold text-white">
                  Quick Navigation
                </h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {[
                  { name: "Privacy", href: "#privacy", icon: Shield },
                  { name: "Terms", href: "#terms", icon: FileText },
                  { name: "Guidelines", href: "#guidelines", icon: UserCheck },
                  {
                    name: "Standards",
                    href: "#standards",
                    icon: HeartHandshake,
                  },
                  { name: "Disputes", href: "#disputes", icon: Scale },
                  { name: "Safety", href: "#safety", icon: AlertCircle },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center p-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
                  >
                    <item.icon className="mr-2 h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="lg:w-3/4 space-y-8">
            {/* Introduction */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700">
              <div className="px-6 py-5">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Welcome to our platform's policy center. These policies govern
                  your use of our beauty service platform that connects clients
                  with aesthetic clinics. We've designed these policies to
                  ensure a
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {" "}
                    safe, transparent, and high-quality experience{" "}
                  </span>
                  for all users. Please take the time to familiarize yourself
                  with these important guidelines.
                </p>

                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    <span className="font-bold">Last Updated:</span> April 19,
                    2025. These policies are regularly reviewed and updated to
                    ensure compliance with regulations and best practices.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <section id="privacy" className="scroll-mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 px-6 py-4 border-b border-purple-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Privacy Policy
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      Our platform is committed to protecting your privacy and
                      ensuring the security of your personal information. This
                      Privacy Policy outlines how we collect, use, disclose, and
                      safeguard your data when you use our beauty service
                      platform.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Information We Collect
                    </h3>
                    <p className="mb-2">
                      We collect information that you provide directly to us,
                      including:
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Personal identification information
                          </strong>{" "}
                          (name, email address, phone number)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Profile information
                          </strong>{" "}
                          (profile picture, beauty preferences)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Payment information
                          </strong>{" "}
                          (processed through secure third-party payment
                          processors)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Communication data
                          </strong>{" "}
                          (messages between clients and clinics)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Service history and appointment details
                          </strong>
                        </span>
                      </li>
                    </ul>

                    <div className="border-l-4 border-purple-500 pl-4 py-2 my-6 bg-purple-50 dark:bg-purple-900/20 rounded-r">
                      <p className="text-purple-800 dark:text-purple-200 font-medium">
                        We prioritize data minimization and only collect
                        information necessary to provide our services.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      How We Use Your Information
                    </h3>
                    <p className="mb-2">
                      We use the information we collect to:
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          Provide, maintain, and improve our platform services
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          Process transactions and send related information
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Connect clients with appropriate aesthetic clinics
                          </strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          Send notifications, updates, and support messages
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          Personalize your experience and provide tailored
                          content
                        </span>
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Data Sharing and Disclosure
                    </h3>
                    <p>
                      We may share your information with aesthetic clinics you
                      choose to connect with through our platform.{" "}
                      <strong className="text-gray-900 dark:text-white">
                        We do not sell your personal information to third
                        parties.
                      </strong>{" "}
                      We may share data with service providers who help us
                      operate our platform, always under strict confidentiality
                      agreements.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Your Rights and Choices
                    </h3>
                    <p>
                      You have the right to access, correct, or delete your
                      personal information. You can manage your communication
                      preferences and opt out of marketing communications at any
                      time.
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Important Privacy Rights:
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Right to Access:</strong> You can request a
                            copy of your personal data
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Right to Rectification:</strong> You can
                            correct inaccurate information
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Right to Erasure:</strong> You can request
                            deletion of your data
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Right to Restrict Processing:</strong> You
                            can limit how we use your data
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms of Service */}
            <section id="terms" className="scroll-mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 px-6 py-4 border-b border-purple-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Terms of Service
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      These Terms of Service govern your use of our beauty
                      service platform. By accessing or using our platform, you
                      agree to be bound by these terms.
                    </p>

                    <div className="border-l-4 border-yellow-500 pl-4 py-2 my-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-r">
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                        <strong>Important:</strong> By using our platform, you
                        acknowledge that you have read, understood, and agree to
                        be bound by these Terms of Service.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Platform Description
                    </h3>
                    <p>
                      Our platform connects clients seeking aesthetic services
                      with qualified clinics. We facilitate the discovery,
                      booking, and management of beauty services but{" "}
                      <strong className="text-gray-900 dark:text-white">
                        are not directly responsible for the services provided
                        by the clinics.
                      </strong>
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      User Accounts
                    </h3>
                    <p>
                      You must create an account to use certain features of our
                      platform.{" "}
                      <strong className="text-gray-900 dark:text-white">
                        You are responsible for maintaining the confidentiality
                        of your account credentials
                      </strong>{" "}
                      and for all activities that occur under your account.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Acceptable Use
                        </h4>
                        <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                          <li>• Providing accurate information</li>
                          <li>• Respecting other users</li>
                          <li>• Following booking procedures</li>
                          <li>• Maintaining account security</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <h4 className="font-semibold text-red-800 dark:text-red-300 flex items-center mb-2">
                          <XCircle className="h-5 w-5 mr-2" />
                          Prohibited Activities
                        </h4>
                        <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                          <li>• Creating false accounts</li>
                          <li>• Sharing account credentials</li>
                          <li>• Unauthorized access attempts</li>
                          <li>• Misrepresenting identity</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Service Bookings and Payments
                    </h3>
                    <p>
                      When you book a service through our platform, you enter
                      into a direct agreement with the clinic.
                      <strong className="text-gray-900 dark:text-white">
                        {" "}
                        Payment terms, cancellation policies, and service
                        details are set by individual clinics
                      </strong>{" "}
                      and should be reviewed before booking.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Intellectual Property
                    </h3>
                    <p>
                      All content, features, and functionality of our platform,
                      including but not limited to text, graphics, logos, and
                      software, are owned by our company and protected by
                      intellectual property laws.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Limitation of Liability
                    </h3>
                    <p>
                      We strive to provide a reliable platform but cannot
                      guarantee uninterrupted access or the accuracy of
                      information provided by clinics.{" "}
                      <strong className="text-gray-900 dark:text-white">
                        We are not liable for any damages arising from your use
                        of, or inability to use, our platform.
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Guidelines */}
            <section id="guidelines" className="scroll-mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 px-6 py-4 border-b border-purple-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <UserCheck className="h-6 w-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      User Guidelines
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      Our user guidelines are designed to ensure a positive,
                      respectful, and safe experience for all platform users.
                      Following these guidelines is essential for maintaining
                      the integrity of our community.
                    </p>

                    <div className="my-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                        Community Values
                      </h4>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">
                        Our platform is built on <strong>trust</strong>,{" "}
                        <strong>respect</strong>, and{" "}
                        <strong>professionalism</strong>. We expect all users to
                        uphold these values in every interaction.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Info className="h-5 w-5 text-purple-500 mr-2" />
                          Client Responsibilities
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                Provide accurate personal information
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                Attend scheduled appointments
                              </strong>{" "}
                              or cancel within the clinic's cancellation window
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Communicate respectfully with clinics</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Provide honest and constructive feedback
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Report any concerns or issues promptly</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Info className="h-5 w-5 text-purple-500 mr-2" />
                          Clinic Responsibilities
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                Maintain accurate service listings and
                                availability
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                Provide services as described
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Maintain appropriate licensing and qualifications
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Respond to client inquiries in a timely manner
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Handle client information with confidentiality
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Prohibited Activities
                    </h3>
                    <p className="mb-3">
                      The following activities are{" "}
                      <strong className="text-red-600 dark:text-red-400">
                        strictly prohibited
                      </strong>{" "}
                      on our platform:
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                      <ul className="space-y-2 text-red-800 dark:text-red-300">
                        <li className="flex items-start">
                          <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>
                              Harassment or discriminatory behavior
                            </strong>{" "}
                            of any kind
                          </span>
                        </li>
                        <li className="flex items-start">
                          <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>
                              Fraudulent activities or misrepresentation
                            </strong>{" "}
                            of credentials or services
                          </span>
                        </li>
                        <li className="flex items-start">
                          <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Sharing inappropriate or offensive content
                          </span>
                        </li>
                        <li className="flex items-start">
                          <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Creating multiple accounts for deceptive purposes
                          </span>
                        </li>
                        <li className="flex items-start">
                          <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Any illegal activities or promotion of illegal
                            services
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Violation of these guidelines may result in account
                        suspension or termination. We regularly review user
                        activity to ensure compliance with our community
                        standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Clinic Standards */}
            <section id="standards" className="scroll-mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 px-6 py-4 border-b border-purple-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <HeartHandshake className="h-6 w-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Clinic Standards
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      We maintain{" "}
                      <strong className="text-gray-900 dark:text-white">
                        high standards for the aesthetic clinics
                      </strong>{" "}
                      on our platform to ensure quality, safety, and
                      professionalism. All clinics must meet these standards to
                      participate in our network.
                    </p>

                    <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        Quality Assurance
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Every clinic on our platform undergoes a thorough
                        verification process before being approved. We
                        continuously monitor service quality through client
                        feedback and regular reviews.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Qualification Requirements
                    </h3>
                    <p className="mb-3">All clinics on our platform must:</p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Hold valid licenses and permits
                          </strong>{" "}
                          required by local regulations
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Employ qualified professionals
                          </strong>{" "}
                          with appropriate certifications
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Maintain proper insurance coverage</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Demonstrate a history of safe practice</span>
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Facility Standards
                    </h3>
                    <p className="mb-3">
                      Clinics must maintain facilities that:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                Meet health and safety regulations
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Use approved equipment and products</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                Implement proper sanitation protocols
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Provide comfortable and accessible environments
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Service Quality
                    </h3>
                    <p className="mb-3">We expect clinics to:</p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Provide accurate descriptions of services
                          </strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Deliver consistent quality of care</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Conduct thorough consultations before treatments
                          </strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Offer appropriate aftercare instructions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Maintain high customer satisfaction ratings</span>
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Verification Process
                    </h3>
                    <p>
                      All clinics undergo a{" "}
                      <strong className="text-gray-900 dark:text-white">
                        verification process before joining our platform
                      </strong>
                      , which includes document review, background checks, and
                      potentially in-person inspections. We also conduct
                      periodic reviews to ensure ongoing compliance.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section id="disputes" className="scroll-mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 px-6 py-4 border-b border-purple-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <Scale className="h-6 w-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Dispute Resolution
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      We understand that disagreements may arise between clients
                      and clinics. Our dispute resolution process is designed to
                      address concerns fairly and efficiently.
                    </p>

                    <div className="my-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                        Our Commitment
                      </h4>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">
                        We are committed to fair and transparent dispute
                        resolution. Our goal is to ensure both clients and
                        clinics are treated equitably and that all concerns are
                        addressed promptly.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Reporting a Dispute
                    </h3>
                    <p className="mb-3">
                      If you encounter an issue with a service or user, you
                      should:
                    </p>
                    <ol className="space-y-2 mb-6 list-decimal pl-5">
                      <li className="pl-2">
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            First attempt to resolve the issue directly
                          </strong>{" "}
                          with the other party
                        </span>
                      </li>
                      <li className="pl-2">
                        <span>
                          If unsuccessful, report the issue through our
                          platform's support system
                        </span>
                      </li>
                      <li className="pl-2">
                        <span>
                          Provide all relevant details, including dates,
                          communications, and specific concerns
                        </span>
                      </li>
                      <li className="pl-2">
                        <span>
                          Submit any supporting documentation or evidence
                        </span>
                      </li>
                    </ol>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Resolution Process
                    </h3>
                    <p className="mb-3">
                      Our dispute resolution process typically follows these
                      steps:
                    </p>
                    <div className="relative mb-6">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200 dark:bg-purple-800"></div>
                      <ol className="space-y-6 relative">
                        <li className="pl-10 relative">
                          <div className="absolute left-0 top-0 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            1
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Initial Review
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Our support team reviews the reported issue and
                            determines the appropriate next steps.
                          </p>
                        </li>
                        <li className="pl-10 relative">
                          <div className="absolute left-0 top-0 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            2
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Information Gathering
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            We collect information from all involved parties to
                            understand the full context of the dispute.
                          </p>
                        </li>
                        <li className="pl-10 relative">
                          <div className="absolute left-0 top-0 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            3
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Mediation
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            We facilitate communication between parties to reach
                            a mutually acceptable solution.
                          </p>
                        </li>
                        <li className="pl-10 relative">
                          <div className="absolute left-0 top-0 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            4
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Final Determination
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            If necessary, we make a final determination based on
                            our policies and the evidence provided.
                          </p>
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Refunds and Compensation
                    </h3>
                    <p>
                      <strong className="text-gray-900 dark:text-white">
                        Refund policies are set by individual clinics
                      </strong>{" "}
                      and should be reviewed before booking. In cases where a
                      clinic has clearly violated our policies or failed to
                      provide the agreed-upon service, we may facilitate refunds
                      or other appropriate remedies.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Appeals
                    </h3>
                    <p>
                      If you disagree with the outcome of a dispute resolution,
                      you may submit an appeal for review by a senior member of
                      our team.{" "}
                      <strong className="text-gray-900 dark:text-white">
                        Appeals must be submitted within 14 days
                      </strong>{" "}
                      of the initial decision.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Safety & Security */}
            <section id="safety" className="scroll-mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 px-6 py-4 border-b border-purple-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Safety & Security
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      Your safety and security are our top priorities. We
                      implement various measures to protect our users and
                      maintain the integrity of our platform.
                    </p>

                    <div className="border-l-4 border-red-500 pl-4 py-2 my-6 bg-red-50 dark:bg-red-900/20 rounded-r">
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        <strong>Important Safety Notice:</strong> In case of a
                        medical emergency related to a treatment, seek immediate
                        medical attention first, then report the incident to our
                        support team.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Data Security
                    </h3>
                    <p className="mb-3">We protect your data through:</p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Encryption of sensitive information
                          </strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            Secure payment processing
                          </strong>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Regular security audits and updates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Strict access controls for our staff</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Compliance with data protection regulations</span>
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      User Verification
                    </h3>
                    <p>
                      We implement{" "}
                      <strong className="text-gray-900 dark:text-white">
                        verification processes for both clients and clinics
                      </strong>{" "}
                      to reduce the risk of fraudulent activities and ensure the
                      authenticity of platform users.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Treatment Safety
                    </h3>
                    <p>
                      While we cannot guarantee the safety of every treatment,
                      we require clinics to follow industry best practices,
                      maintain proper qualifications, and provide appropriate
                      consultations before procedures.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Safety Measures
                        </h4>
                        <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                          <li>• Clinic verification process</li>
                          <li>• Professional qualification checks</li>
                          <li>• Regular safety audits</li>
                          <li>• Client feedback monitoring</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center mb-2">
                          <Info className="h-5 w-5 mr-2" />
                          Client Resources
                        </h4>
                        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                          <li>• Treatment safety guides</li>
                          <li>• Pre-treatment checklists</li>
                          <li>• Aftercare instructions</li>
                          <li>• Emergency contact information</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      Reporting Safety Concerns
                    </h3>
                    <p>
                      If you encounter any safety concerns or suspicious
                      activities on our platform, please report them immediately
                      through our support system.{" "}
                      <strong className="text-gray-900 dark:text-white">
                        We investigate all reports promptly
                      </strong>{" "}
                      and take appropriate action to maintain a safe
                      environment.
                    </p>

                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        How to Report a Safety Concern:
                      </h4>
                      <ol className="space-y-1 text-sm text-gray-700 dark:text-gray-300 list-decimal pl-5">
                        <li className="pl-1">
                          Use the "Report" button on the clinic profile or
                          service page
                        </li>
                        <li className="pl-1">
                          Contact our support team through the Help Center
                        </li>
                        <li className="pl-1">
                          Email us at{" "}
                          <a
                            href="mailto:safety@beautyplatform.com"
                            className="text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            safety@beautyplatform.com
                          </a>
                        </li>
                        <li className="pl-1">
                          For emergencies, use the emergency contact feature in
                          our app
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Download Policy Documents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-gray-700 mt-8">
              <div className="px-6 py-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Download Policy Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: "Privacy Policy", icon: Shield },
                    { name: "Terms of Service", icon: FileText },
                    { name: "User Guidelines", icon: UserCheck },
                    { name: "Clinic Standards", icon: HeartHandshake },
                    { name: "Dispute Resolution", icon: Scale },
                    { name: "Safety & Security", icon: AlertCircle },
                  ].map((item) => (
                    <a
                      key={item.name}
                      href="#"
                      className="flex items-center p-3 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 group transition-colors"
                    >
                      <item.icon className="mr-2 h-5 w-5 text-purple-500 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-purple-500" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Last updated: April 19, 2025. For questions about our policies,
              please{" "}
              <Link
                href="/contact"
                className="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                contact us
              </Link>
              .
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Cookies
              </Link>
              <Link
                href="/legal"
                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
