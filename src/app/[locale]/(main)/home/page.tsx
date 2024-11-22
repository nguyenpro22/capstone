"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LangToggle = dynamic(() => import("@/components/common/LangToggle"), {
  ssr: false,
});

const ThemeToggle = dynamic(() => import("@/components/common/ThemeToggle"), {
  ssr: false,
});

interface UserDetailProps {
  user: {
    name: string;
    email: string;
    phone: string;
    location: string;
    occupation: string;
    avatar: string;
    status: "active" | "inactive";
  };
}

function UserDetailCard({ user }: UserDetailProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <Badge
              variant={user.status === "active" ? "default" : "secondary"}
              className="mt-2"
            >
              {user.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { Icon: Mail, text: user.email },
            { Icon: Phone, text: user.phone },
            { Icon: MapPin, text: user.location },
            { Icon: Briefcase, text: user.occupation },
          ].map(({ Icon, text }, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const t = useTranslations("home");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    occupation: "Software Engineer",
    avatar: "/placeholder.svg?height=128&width=128",
    status: "active" as const,
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              Test Toggle Theme and Lang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <ThemeToggle />
              <LangToggle />
              <Button onClick={() => router.push("/login")}>Login</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserDetailCard user={user} />

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">{t("header")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg">
                  {t("currentTheme")}:{" "}
                  <span className="font-semibold">
                    {mounted ? t(theme) : ""}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    {t("primaryAction")}
                  </Button>
                  <Button variant="secondary" className="w-full">
                    {t("secondaryAction")}
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                  <span>{t("mutedBackground")}</span>
                  <Badge>New</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
