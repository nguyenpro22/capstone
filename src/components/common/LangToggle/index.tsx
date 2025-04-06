"use client";

import { memo, useTransition, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type Language = "en" | "vi";

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  fullName: string;
}

const languages: LanguageOption[] = [
  {
    code: "en",
    name: "EN",
    fullName: "English",
    flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="12">
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z"/>
      </clipPath>
      <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
      </clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>`,
  },
  {
    code: "vi",
    name: "VI",
    fullName: "Tiếng Việt",
    flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="24" height="16">
      <rect width="30" height="20" fill="#DA251D"/>
      <polygon points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85" fill="#FFFF00"/>
    </svg>`,
  },
];

const LangToggle = memo(() => {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Language;

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: Language) => {
    if (langCode === locale) return;

    startTransition(() => {
      const segments = pathname.split("/");
      const isLocaleSegment = segments[1] === "vi" || segments[1] === "en";
      const pathWithoutLocale = isLocaleSegment
        ? "/" + segments.slice(2).join("/")
        : pathname;

      const newPath = `/${langCode}${pathWithoutLocale}`;
      router.replace(newPath);
    });
  };

  if (!mounted) {
    return (
      <div className="w-[120px] h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex items-center justify-between w-[120px] h-10 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          <div className="flex items-center">
            <span
              className="mr-2 flex-shrink-0 rounded-sm overflow-hidden shadow-sm"
              dangerouslySetInnerHTML={{ __html: currentLanguage.flag }}
            />
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {currentLanguage.name}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[200px] p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
        align="end"
        sideOffset={5}
      >
        <AnimatePresence>
          {languages.map((lang) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuItem
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  flex items-center px-3 py-2.5 m-1 rounded-md cursor-pointer transition-all duration-200
                  ${
                    locale === lang.code
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                <span
                  className="mr-3 flex-shrink-0 rounded-sm overflow-hidden shadow-sm"
                  dangerouslySetInnerHTML={{ __html: lang.flag }}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{lang.fullName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {lang.name}
                  </span>
                </div>
                {locale === lang.code && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
                )}
              </DropdownMenuItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

LangToggle.displayName = "LangToggle";

export default LangToggle;
