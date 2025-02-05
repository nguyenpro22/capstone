import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Scissors, PaintbrushIcon as PaintBrush } from "lucide-react"
import { Props } from "../type"

export default function Services({ t }: Props) {
  const services = [
    {
      title: t("services.facial.title"),
      description: t("services.facial.description"),
      icon: Sparkles,
    },
    {
      title: t("services.hair.title"),
      description: t("services.hair.description"),
      icon: Scissors,
    },
    {
      title: t("services.makeup.title"),
      description: t("services.makeup.description"),
      icon: PaintBrush,
    },
  ]

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{t("services.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <service.icon className="w-10 h-10 text-primary mb-4" />
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

