"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import { useTranslations } from "next-intl";

export default function PolicyPage() {
  const t = useTranslations("policy");

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
              {t("header.title")}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-purple-100">
              {t("header.subtitle")}
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
                    {t("navigation.tableOfContents")}
                  </h2>
                </div>
                <nav className="p-4">
                  <div className="space-y-1">
                    {[
                      {
                        name: t("navigation.sections.privacy"),
                        href: "#privacy",
                        icon: Shield,
                      },
                      {
                        name: t("navigation.sections.terms"),
                        href: "#terms",
                        icon: FileText,
                      },
                      {
                        name: t("navigation.sections.guidelines"),
                        href: "#guidelines",
                        icon: UserCheck,
                      },
                      {
                        name: t("navigation.sections.standards"),
                        href: "#standards",
                        icon: HeartHandshake,
                      },
                      {
                        name: t("navigation.sections.disputes"),
                        href: "#disputes",
                        icon: Scale,
                      },
                      {
                        name: t("navigation.sections.safety"),
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
                    {t("navigation.backToTop")}
                  </a>
                </div>
              </div>

              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-purple-100 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t("navigation.needHelp.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {t("navigation.needHelp.description")}
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  {t("navigation.needHelp.contactButton")}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Table of Contents */}
          <div className="lg:hidden mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-purple-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-800 dark:to-pink-700 px-4 py-3">
                <h2 className="text-lg font-bold text-white">
                  {t("navigation.quickNavigation")}
                </h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {[
                  {
                    name: t("navigation.sections.privacy").split(" ")[0],
                    href: "#privacy",
                    icon: Shield,
                  },
                  {
                    name: t("navigation.sections.terms").split(" ")[0],
                    href: "#terms",
                    icon: FileText,
                  },
                  {
                    name: t("navigation.sections.guidelines").split(" ")[0],
                    href: "#guidelines",
                    icon: UserCheck,
                  },
                  {
                    name: t("navigation.sections.standards").split(" ")[0],
                    href: "#standards",
                    icon: HeartHandshake,
                  },
                  {
                    name: t("navigation.sections.disputes").split(" ")[0],
                    href: "#disputes",
                    icon: Scale,
                  },
                  {
                    name: t("navigation.sections.safety").split(" ")[0],
                    href: "#safety",
                    icon: AlertCircle,
                  },
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
                  {t("introduction.welcome")}
                </p>

                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    <span className="font-bold">
                      {t("introduction.lastUpdated")}
                    </span>{" "}
                    {t("introduction.date")}
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
                      {t("privacyPolicy.title")}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{t("privacyPolicy.introduction")}</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("privacyPolicy.informationWeCollect.title")}
                    </h3>
                    <p className="mb-2">
                      {t("privacyPolicy.informationWeCollect.introduction")}
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            {
                              t(
                                "privacyPolicy.informationWeCollect.items.personal"
                              ).split("(")[0]
                            }
                          </strong>{" "}
                          (
                          {t(
                            "privacyPolicy.informationWeCollect.items.personal"
                          )
                            .split("(")[1]
                            ?.replace(")", "")}
                          )
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            {
                              t(
                                "privacyPolicy.informationWeCollect.items.profile"
                              ).split("(")[0]
                            }
                          </strong>{" "}
                          (
                          {t("privacyPolicy.informationWeCollect.items.profile")
                            .split("(")[1]
                            ?.replace(")", "")}
                          )
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            {
                              t(
                                "privacyPolicy.informationWeCollect.items.payment"
                              ).split("(")[0]
                            }
                          </strong>{" "}
                          (
                          {t("privacyPolicy.informationWeCollect.items.payment")
                            .split("(")[1]
                            ?.replace(")", "")}
                          )
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            {
                              t(
                                "privacyPolicy.informationWeCollect.items.communication"
                              ).split("(")[0]
                            }
                          </strong>{" "}
                          (
                          {t(
                            "privacyPolicy.informationWeCollect.items.communication"
                          )
                            .split("(")[1]
                            ?.replace(")", "")}
                          )
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-900 dark:text-white">
                            {t(
                              "privacyPolicy.informationWeCollect.items.serviceHistory"
                            )}
                          </strong>
                        </span>
                      </li>
                    </ul>

                    <div className="border-l-4 border-purple-500 pl-4 py-2 my-6 bg-purple-50 dark:bg-purple-900/20 rounded-r">
                      <p className="text-purple-800 dark:text-purple-200 font-medium">
                        {t("privacyPolicy.informationWeCollect.priorityNote")}
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("privacyPolicy.howWeUse.title")}
                    </h3>
                    <p className="mb-2">
                      {t("privacyPolicy.howWeUse.introduction")}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {t
                        .raw("privacyPolicy.howWeUse.items")
                        .map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("privacyPolicy.dataSharing.title")}
                    </h3>
                    <p>{t("privacyPolicy.dataSharing.content")}</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("privacyPolicy.yourRights.title")}
                    </h3>
                    <p>{t("privacyPolicy.yourRights.content")}</p>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {t("privacyPolicy.yourRights.importantRights.title")}
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>
                            {t(
                              "privacyPolicy.yourRights.importantRights.access"
                            )}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>
                            {t(
                              "privacyPolicy.yourRights.importantRights.rectification"
                            )}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>
                            {t(
                              "privacyPolicy.yourRights.importantRights.erasure"
                            )}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>
                            {t(
                              "privacyPolicy.yourRights.importantRights.restrictProcessing"
                            )}
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
                      {t("termsOfService.title")}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{t("termsOfService.introduction")}</p>

                    <div className="border-l-4 border-yellow-500 pl-4 py-2 my-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-r">
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                        <strong>
                          {t("termsOfService.importantNote").split(":")[0]}:
                        </strong>{" "}
                        {t("termsOfService.importantNote").split(":")[1]}
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("termsOfService.platformDescription.title")}
                    </h3>
                    <p>{t("termsOfService.platformDescription.content")}</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("termsOfService.userAccounts.title")}
                    </h3>
                    <p>{t("termsOfService.userAccounts.content")}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          {t("termsOfService.usage.acceptable.title")}
                        </h4>
                        <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                          {t
                            .raw("termsOfService.usage.acceptable.items")
                            .map((item: string, index: number) => (
                              <li key={index}>• {item}</li>
                            ))}
                        </ul>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <h4 className="font-semibold text-red-800 dark:text-red-300 flex items-center mb-2">
                          <XCircle className="h-5 w-5 mr-2" />
                          {t("termsOfService.usage.prohibited.title")}
                        </h4>
                        <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                          {t
                            .raw("termsOfService.usage.prohibited.items")
                            .map((item: string, index: number) => (
                              <li key={index}>• {item}</li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("termsOfService.bookingsAndPayments.title")}
                    </h3>
                    <p>{t("termsOfService.bookingsAndPayments.content")}</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("termsOfService.intellectualProperty.title")}
                    </h3>
                    <p>{t("termsOfService.intellectualProperty.content")}</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("termsOfService.limitationOfLiability.title")}
                    </h3>
                    <p>{t("termsOfService.limitationOfLiability.content")}</p>
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
                      {t("userGuidelines.title")}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{t("userGuidelines.introduction")}</p>

                    <div className="my-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                        {t("userGuidelines.communityValues.title")}
                      </h4>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">
                        {t("userGuidelines.communityValues.content")}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Info className="h-5 w-5 text-purple-500 mr-2" />
                          {t("userGuidelines.clientResponsibilities.title")}
                        </h3>
                        <ul className="space-y-3">
                          {t
                            .raw("userGuidelines.clientResponsibilities.items")
                            .map((item: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>
                                  <strong className="text-gray-900 dark:text-white">
                                    {index === 0 || index === 1
                                      ? item.split(" ").slice(0, 3).join(" ")
                                      : ""}
                                  </strong>{" "}
                                  {index === 0 || index === 1
                                    ? item.split(" ").slice(3).join(" ")
                                    : item}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Info className="h-5 w-5 text-purple-500 mr-2" />
                          {t("userGuidelines.clinicResponsibilities.title")}
                        </h3>
                        <ul className="space-y-3">
                          {t
                            .raw("userGuidelines.clinicResponsibilities.items")
                            .map((item: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>
                                  <strong className="text-gray-900 dark:text-white">
                                    {index === 0 || index === 1
                                      ? item.split(" ").slice(0, 3).join(" ")
                                      : ""}
                                  </strong>{" "}
                                  {index === 0 || index === 1
                                    ? item.split(" ").slice(3).join(" ")
                                    : item}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("userGuidelines.prohibitedActivities.title")}
                    </h3>
                    <p className="mb-3">
                      {t("userGuidelines.prohibitedActivities.introduction")}
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                      <ul className="space-y-2 text-red-800 dark:text-red-300">
                        {t
                          .raw("userGuidelines.prohibitedActivities.items")
                          .map((item: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <XCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                              <span>
                                <strong>
                                  {index === 0 || index === 1
                                    ? item.split(" ").slice(0, 3).join(" ")
                                    : ""}
                                </strong>{" "}
                                {index === 0 || index === 1
                                  ? item.split(" ").slice(3).join(" ")
                                  : item}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("userGuidelines.violationNote")}
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
                      {t("clinicStandards.title")}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{t("clinicStandards.introduction")}</p>

                    <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        {t("clinicStandards.qualityAssurance.title")}
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        {t("clinicStandards.qualityAssurance.content")}
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("clinicStandards.qualificationRequirements.title")}
                    </h3>
                    <p className="mb-3">
                      {t(
                        "clinicStandards.qualificationRequirements.introduction"
                      )}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {t
                        .raw("clinicStandards.qualificationRequirements.items")
                        .map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                {index === 0 || index === 1
                                  ? item.split(" ").slice(0, 3).join(" ")
                                  : ""}
                              </strong>{" "}
                              {index === 0 || index === 1
                                ? item.split(" ").slice(3).join(" ")
                                : item}
                            </span>
                          </li>
                        ))}
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("clinicStandards.facilityStandards.title")}
                    </h3>
                    <p className="mb-3">
                      {t("clinicStandards.facilityStandards.introduction")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                {t(
                                  "clinicStandards.facilityStandards.items.regulations"
                                )}
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              {t(
                                "clinicStandards.facilityStandards.items.equipment"
                              )}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                {t(
                                  "clinicStandards.facilityStandards.items.sanitation"
                                )}
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              {t(
                                "clinicStandards.facilityStandards.items.environment"
                              )}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("clinicStandards.serviceQuality.title")}
                    </h3>
                    <p className="mb-3">
                      {t("clinicStandards.serviceQuality.introduction")}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {t
                        .raw("clinicStandards.serviceQuality.items")
                        .map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                {index === 0 || index === 1 || index === 2
                                  ? item.split(" ").slice(0, 3).join(" ")
                                  : ""}
                              </strong>{" "}
                              {index === 0 || index === 1 || index === 2
                                ? item.split(" ").slice(3).join(" ")
                                : item}
                            </span>
                          </li>
                        ))}
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("clinicStandards.verificationProcess.title")}
                    </h3>
                    <p>{t("clinicStandards.verificationProcess.content")}</p>
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
                      {t("disputeResolution.title")}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{t("disputeResolution.introduction")}</p>

                    <div className="my-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                        {t("disputeResolution.commitment.title")}
                      </h4>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">
                        {t("disputeResolution.commitment.content")}
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("disputeResolution.reportingDispute.title")}
                    </h3>
                    <p className="mb-3">
                      {t("disputeResolution.reportingDispute.introduction")}
                    </p>
                    <ol className="space-y-2 mb-6 list-decimal pl-5">
                      {t
                        .raw("disputeResolution.reportingDispute.steps")
                        .map((step: string, index: number) => (
                          <li key={index} className="pl-2">
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                {index === 0
                                  ? step.split(" ").slice(0, 3).join(" ")
                                  : ""}
                              </strong>{" "}
                              {index === 0
                                ? step.split(" ").slice(3).join(" ")
                                : step}
                            </span>
                          </li>
                        ))}
                    </ol>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("disputeResolution.resolutionProcess.title")}
                    </h3>
                    <p className="mb-3">
                      {t("disputeResolution.resolutionProcess.introduction")}
                    </p>
                    <div className="relative mb-6">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200 dark:bg-purple-800"></div>
                      <ol className="space-y-6 relative">
                        <li className="pl-10 relative">
                          <div className="absolute left-0 top-0 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            1
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t(
                              "disputeResolution.resolutionProcess.steps.initialReview.title"
                            )}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {t(
                              "disputeResolution.resolutionProcess.steps.initialReview.description"
                            )}
                          </p>
                        </li>
                        <li className="pl-10 relative">
                          <div className="absolute left-0 top-0 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            2
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t(
                              "disputeResolution.resolutionProcess.steps.informationGathering.title"
                            )}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {t(
                              "disputeResolution.resolutionProcess.steps.informationGathering.description"
                            )}
                          </p>
                        </li>
                        <li className="pl-10 relative">
                          <div className="absolute left-0 top-0 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            3
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t(
                              "disputeResolution.resolutionProcess.steps.mediation.title"
                            )}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {t(
                              "disputeResolution.resolutionProcess.steps.mediation.description"
                            )}
                          </p>
                        </li>
                        <li className="pl-10 relative">
                          <div className="absolute left-0 top-0 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            4
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t(
                              "disputeResolution.resolutionProcess.steps.finalDetermination.title"
                            )}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {t(
                              "disputeResolution.resolutionProcess.steps.finalDetermination.description"
                            )}
                          </p>
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("disputeResolution.refundsAndCompensation.title")}
                    </h3>
                    <p>
                      {t("disputeResolution.refundsAndCompensation.content")}
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("disputeResolution.appeals.title")}
                    </h3>
                    <p>{t("disputeResolution.appeals.content")}</p>
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
                      {t("safetyAndSecurity.title")}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{t("safetyAndSecurity.introduction")}</p>

                    <div className="border-l-4 border-red-500 pl-4 py-2 my-6 bg-red-50 dark:bg-red-900/20 rounded-r">
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        <strong>
                          {t("safetyAndSecurity.importantNotice").split(":")[0]}
                          :
                        </strong>{" "}
                        {t("safetyAndSecurity.importantNotice").split(":")[1]}
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("safetyAndSecurity.dataSecurity.title")}
                    </h3>
                    <p className="mb-3">
                      {t("safetyAndSecurity.dataSecurity.introduction")}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {t
                        .raw("safetyAndSecurity.dataSecurity.items")
                        .map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-gray-900 dark:text-white">
                                {index === 0 || index === 1
                                  ? item.split(" ").slice(0, 2).join(" ")
                                  : ""}
                              </strong>{" "}
                              {index === 0 || index === 1
                                ? item.split(" ").slice(2).join(" ")
                                : item}
                            </span>
                          </li>
                        ))}
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("safetyAndSecurity.userVerification.title")}
                    </h3>
                    <p>{t("safetyAndSecurity.userVerification.content")}</p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("safetyAndSecurity.treatmentSafety.title")}
                    </h3>
                    <p>{t("safetyAndSecurity.treatmentSafety.content")}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          {t("safetyAndSecurity.measures.safetyMeasures.title")}
                        </h4>
                        <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                          {t
                            .raw(
                              "safetyAndSecurity.measures.safetyMeasures.items"
                            )
                            .map((item: string, index: number) => (
                              <li key={index}>• {item}</li>
                            ))}
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center mb-2">
                          <Info className="h-5 w-5 mr-2" />
                          {t(
                            "safetyAndSecurity.measures.clientResources.title"
                          )}
                        </h4>
                        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                          {t
                            .raw(
                              "safetyAndSecurity.measures.clientResources.items"
                            )
                            .map((item: string, index: number) => (
                              <li key={index}>• {item}</li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-purple-500 mr-2" />
                      {t("safetyAndSecurity.reportingConcerns.title")}
                    </h3>
                    <p>{t("safetyAndSecurity.reportingConcerns.content")}</p>

                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {t(
                          "safetyAndSecurity.reportingConcerns.howToReport.title"
                        )}
                      </h4>
                      <ol className="space-y-1 text-sm text-gray-700 dark:text-gray-300 list-decimal pl-5">
                        {t
                          .raw(
                            "safetyAndSecurity.reportingConcerns.howToReport.steps"
                          )
                          .map((step: string, index: number) => (
                            <li key={index} className="pl-1">
                              {step}
                            </li>
                          ))}
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
                  {t("downloadDocuments.title")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    {
                      name: t("downloadDocuments.documents.privacy"),
                      icon: Shield,
                    },
                    {
                      name: t("downloadDocuments.documents.terms"),
                      icon: FileText,
                    },
                    {
                      name: t("downloadDocuments.documents.guidelines"),
                      icon: UserCheck,
                    },
                    {
                      name: t("downloadDocuments.documents.standards"),
                      icon: HeartHandshake,
                    },
                    {
                      name: t("downloadDocuments.documents.disputes"),
                      icon: Scale,
                    },
                    {
                      name: t("downloadDocuments.documents.safety"),
                      icon: AlertCircle,
                    },
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
              {t("footer.lastUpdated")} {t("footer.date")}{" "}
              <Link
                href="/contact"
                className="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                {t("footer.contactUs")}
              </Link>
              .
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                {t("footer.links.terms")}
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                {t("footer.links.privacy")}
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                {t("footer.links.cookies")}
              </Link>
              <Link
                href="/legal"
                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                {t("footer.links.legal")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
