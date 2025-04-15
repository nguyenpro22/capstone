"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Download, Eye, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLazyGetDoctorCertificatesQuery } from "@/features/doctor/api";
import Image from "next/image";

export type Certificate = {
  id: string;
  doctorName: string;
  certificateUrl: string;
  certificateName: string;
  expiryDate: string;
  note: string | null;
};

interface DoctorCertificatesProps {
  doctorId: string;
}

export default function DoctorCertificates({
  doctorId,
}: DoctorCertificatesProps) {
  const t = useTranslations("doctorCertificate");
  const date = useTranslations("doctorProfile");
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [getDoctorCertificates] = useLazyGetDoctorCertificatesQuery();
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Replace with actual API call
        const response = await getDoctorCertificates({ doctorId }).unwrap();

        // Simulate API call
        setCertificates(response?.value as Certificate[]);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
        toast({
          variant: "destructive",
          title: t("errorFetchingCertificates"),
          description: t("tryAgainLater"),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [doctorId, toast, t]);

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    return expiry <= threeMonthsFromNow && expiry > today;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();

    return expiry < today;
  };

  const getExpiryBadge = (expiryDate: string) => {
    if (isExpired(expiryDate)) {
      return <Badge variant="destructive">{t("expired")}</Badge>;
    }

    if (isExpiringSoon(expiryDate)) {
      return (
        <Badge variant="warning" className="bg-amber-500 hover:bg-amber-600">
          {t("expiringSoon")}
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800/30"
      >
        {t("valid")}
      </Badge>
    );
  };

  return (
    <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/20">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {t("certificates")}
        </CardTitle>
        <CardDescription>{t("certificatesDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">{t("noCertificates")}</h3>
            <p className="text-muted-foreground mt-1">
              {t("noCertificatesDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-purple-100 dark:border-purple-800/30 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {certificate.certificateName}
                    </h3>
                    {getExpiryBadge(certificate.expiryDate)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {t("expiresOn")}:{" "}
                    {date("formattedDate", {
                      date: new Date(certificate.expiryDate).getDate(),
                      month: date(
                        `months.${new Date(certificate.expiryDate).getMonth()}`
                      ),
                      year: new Date(certificate.expiryDate).getFullYear(),
                    })}
                  </div>
                  {certificate.note && (
                    <div className="text-sm mt-1">{certificate.note}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedCertificate?.certificateName}
                        </DialogTitle>
                        <DialogDescription>
                          {t("expiresOn")}:{" "}
                          {selectedCertificate?.expiryDate &&
                            format(
                              new Date(selectedCertificate.expiryDate),
                              "PPP"
                            )}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                        <Image
                          src={
                            selectedCertificate?.certificateUrl ||
                            "/placeholder.svg"
                          }
                          alt={
                            selectedCertificate?.certificateName ||
                            "Certificate"
                          }
                          width={500}
                          height={375}
                          className="w-full max-w-[500px] h-auto object-contain mx-auto"
                          priority
                          quality={100}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
