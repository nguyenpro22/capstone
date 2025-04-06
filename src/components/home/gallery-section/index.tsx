"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedText } from "@/components/ui/animated-text";

export function GallerySection() {
  const t = useTranslations("home");
  const facials = t.raw("gallery.items.facial");
  const facialsList = Array.isArray(facials) ? facials : [];
  const bodys = t.raw("gallery.items.body");
  const bodysList = Array.isArray(bodys) ? bodys : [];
  const skins = t.raw("gallery.items.skin");
  const skinsList = Array.isArray(skins) ? skins : [];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("gallery.badge")}
          </Badge>
          <AnimatedText
            text={t("gallery.title")}
            variant="h2"
            className="mb-4"
          />
          <p className="text-muted-foreground font-light">
            {t("gallery.description")}
          </p>
        </div>

        <Tabs defaultValue="facial" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="facial">
                {t("gallery.tabs.facial")}
              </TabsTrigger>
              <TabsTrigger value="body">{t("gallery.tabs.body")}</TabsTrigger>
              <TabsTrigger value="skin">{t("gallery.tabs.skin")}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="facial" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facialsList.map((item, index) => (
                <Card key={index} className="overflow-hidden border-primary/10">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2">
                      <div className="relative h-64">
                        <Image
                          src="https://placehold.co/200x300.png"
                          alt="Before Treatment"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 bg-black/60 text-white px-3 py-1 text-sm">
                          {t("gallery.labels.before")}
                        </div>
                      </div>
                      <div className="relative h-64">
                        <Image
                          src="https://placehold.co/200x300.png"
                          alt="After Treatment"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 bg-primary/80 text-white px-3 py-1 text-sm">
                          {t("gallery.labels.after")}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.sessions}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="body" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bodysList.map((item, index) => (
                <Card key={index} className="overflow-hidden border-primary/10">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2">
                      <div className="relative h-64">
                        <Image
                          src="https://placehold.co/200x300.png"
                          alt="Before Treatment"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 bg-black/60 text-white px-3 py-1 text-sm">
                          {t("gallery.labels.before")}
                        </div>
                      </div>
                      <div className="relative h-64">
                        <Image
                          src="https://placehold.co/200x300.png"
                          alt="After Treatment"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 bg-primary/80 text-white px-3 py-1 text-sm">
                          {t("gallery.labels.after")}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.sessions}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skin" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skinsList.map((item, index) => (
                <Card key={index} className="overflow-hidden border-primary/10">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2">
                      <div className="relative h-64">
                        <Image
                          src="https://placehold.co/200x300.png"
                          alt="Before Treatment"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 bg-black/60 text-white px-3 py-1 text-sm">
                          {t("gallery.labels.before")}
                        </div>
                      </div>
                      <div className="relative h-64">
                        <Image
                          src="https://placehold.co/200x300.png"
                          alt="After Treatment"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 bg-primary/80 text-white px-3 py-1 text-sm">
                          {t("gallery.labels.after")}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.sessions}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
