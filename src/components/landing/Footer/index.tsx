import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Props } from "../type"


export default function Footer({ t }: Props) {
  return (
    <footer id="contact" className="bg-muted text-muted-foreground py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">{t("footer.title")}</h3>
          <p className="mb-4">{t("footer.description")}</p>
          <p>{t("footer.address")}</p>
          <p>{t("footer.phone")}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#services" className="hover:text-primary">
                {t("footer.services")}
              </Link>
            </li>
            <li>
              <Link href="#livestream" className="hover:text-primary">
                {t("footer.livestream")}
              </Link>
            </li>
            <li>
              <Link href="#testimonials" className="hover:text-primary">
                {t("footer.testimonials")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">{t("footer.newsletter")}</h3>
          <p className="mb-4">{t("footer.newsletterDescription")}</p>
          <div className="flex space-x-2">
            <Input type="email" placeholder={t("footer.emailPlaceholder")} className="bg-background text-foreground" />
            <Button variant="secondary">{t("footer.subscribe")}</Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-muted-foreground/20 text-center">
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  )
}

