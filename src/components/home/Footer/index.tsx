"use client";

import { useTranslations } from "next-intl";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FooterSection() {
  const t = useTranslations("home");
  const quickLinks = t.raw("footer.quickLinks.links");
  const linkList = Array.isArray(quickLinks) ? quickLinks : [];

  return (
    <footer className="py-12 bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-primary/10">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">
              {t("footer.about.title")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("footer.about.description")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="h-4 w-4 text-primary" />
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="h-4 w-4 text-primary" />
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">
              {t("footer.quickLinks.title")}
            </h3>
            <ul className="space-y-2 text-sm">
              {linkList.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">
              {t("footer.services.title")}
            </h3>
            <ul className="space-y-2 text-sm">
              {linkList.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">
              {t("footer.newsletter.title")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("footer.newsletter.description")}
            </p>
            <div className="flex gap-2">
              <Input
                placeholder={t("footer.newsletter.placeholder")}
                className="h-10"
              />
              <Button variant="outline" size="sm" className="h-10">
                {t("footer.newsletter.button")}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-12 pt-6 text-center text-sm text-muted-foreground">
          <p>
            {t("footer.copyright").replace(
              "{year}",
              new Date().getFullYear().toString()
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
