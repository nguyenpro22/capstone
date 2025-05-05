"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShiftTable } from "@/components/clinicManager/configs/shift-table";
import { Clock } from "lucide-react";

export default function ConfigsContent() {
  const t = useTranslations("configs");
  const [activeTab, setActiveTab] = useState("shifts");

  return (
    <Tabs
      defaultValue="shifts"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="bg-purple-100/50 dark:bg-purple-900/10 p-1 rounded-xl">
        <TabsTrigger
          value="shifts"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/10 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-300"
        >
          <Clock className="h-4 w-4 mr-2" />
          {t("shifts.title")}
        </TabsTrigger>
        {/* Additional tabs can be added here */}
      </TabsList>
      <TabsContent value="shifts" className="mt-6">
        <Card className="border-purple-100 dark:border-purple-800/20 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/5 dark:to-indigo-900/5 rounded-t-lg">
            {/* <CardTitle className="text-xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("shifts.title")}
            </CardTitle> */}
            <CardDescription className="text-purple-600/80 dark:text-purple-400/80">
              {t("shifts.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ShiftTable />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
