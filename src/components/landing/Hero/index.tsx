import { Button } from "@/components/ui/button"
import { Props } from "../type"

export default function Hero({ t }: Props) {
  return (
    <section className="py-20 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">{t("hero.title")}</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{t("hero.description")}</p>
        <Button size="lg">{t("hero.cta")}</Button>
      </div>
    </section>
  )
}

