import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Props } from "../type"

export default function Testimonials({ t }: Props) {
  const testimonials = [
    {
      name: t("testimonials.1.name"),
      content: t("testimonials.1.content"),
      avatar: "/avatar1.jpg",
    },
    {
      name: t("testimonials.2.name"),
      content: t("testimonials.2.content"),
      avatar: "/avatar2.jpg",
    },
    {
      name: t("testimonials.3.name"),
      content: t("testimonials.3.content"),
      avatar: "/avatar3.jpg",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{t("testimonials.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{testimonial.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

