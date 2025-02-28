import { useTranslations } from "next-intl";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedText } from "@/components/ui/animated-text";

export function ContactSection() {
  const t = useTranslations("home");

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="outline" className="mb-2">
              {t("contact.badge")}
            </Badge>
            <AnimatedText
              text={t("contact.title")}
              variant="h2"
              className="mb-6"
            />

            <p className="text-muted-foreground">{t("contact.description")}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {t("contact.info.visit.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.info.visit.content")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {t("contact.info.call.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.info.call.content")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {t("contact.info.email.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.info.email.content")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {t("contact.info.hours.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.info.hours.weekdays")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.info.hours.weekend")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>

          <div>
            <Card className="border-primary/10 dark:bg-gray-800/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-6">
                  {t("contact.form.title")}
                </h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        {t("contact.form.fields.firstName")}
                      </label>
                      <Input
                        id="firstName"
                        placeholder={t(
                          "contact.form.fields.firstNamePlaceholder"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        {t("contact.form.fields.lastName")}
                      </label>
                      <Input
                        id="lastName"
                        placeholder={t(
                          "contact.form.fields.lastNamePlaceholder"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t("contact.form.fields.email")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("contact.form.fields.emailPlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      {t("contact.form.fields.phone")}
                    </label>
                    <Input
                      id="phone"
                      placeholder={t("contact.form.fields.phonePlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium">
                      {t("contact.form.fields.service")}
                    </label>
                    <select
                      id="service"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">
                        {t("contact.form.fields.servicePlaceholder")}
                      </option>
                      <option value="facial">
                        {t("contact.form.fields.serviceOptions.facial")}
                      </option>
                      <option value="body">
                        {t("contact.form.fields.serviceOptions.body")}
                      </option>
                      <option value="laser">
                        {t("contact.form.fields.serviceOptions.laser")}
                      </option>
                      <option value="skin">
                        {t("contact.form.fields.serviceOptions.skin")}
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      {t("contact.form.fields.message")}
                    </label>
                    <Textarea
                      id="message"
                      placeholder={t("contact.form.fields.messagePlaceholder")}
                      rows={4}
                    />
                  </div>

                  <GradientButton className="w-full">
                    {t("contact.form.button")}
                  </GradientButton>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
