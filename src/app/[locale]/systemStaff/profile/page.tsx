"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User, UserCheck, MapPin, Calendar } from "lucide-react";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  // Use translations
  const t = useTranslations("profile");

  // Use your existing functions to get token data
  const token = getAccessToken();
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  console.log("data ne: ", tokenData);
  // Initialize location states outside the conditional block
  const [location, setLocation] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim API for reverse geocoding (free and doesn't require API key)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location data");
          }

          const data = await response.json();

          // Format the address based on available data
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "";
          const state = data.address.state || "";
          const country = data.address.country || "";

          const formattedLocation = [city, state, country]
            .filter(Boolean)
            .join(", ");
          setLocation(formattedLocation);
        } catch (error) {
          setLocationError("Could not determine your location");
          console.error("Error getting location:", error);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("An unknown error occurred");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Automatically get location when component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  if (!tokenData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-xl font-medium mb-2">{t("sessionExpired")}</p>
              <p className="text-muted-foreground">{t("sessionExpiredDesc")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get initials for avatar fallback
  const initials =
    tokenData.name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "U";

  // Format date if needed
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return null;

    // Check if it's the default date (0001-01-01)
    if (dateString.startsWith("0001-01-01")) {
      return null;
    }

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return null;

      // Check if year is less than 1970 (likely a default date)
      if (date.getFullYear() < 1970) {
        return null;
      }

      // Format: "Month Year" (e.g., "April 2023")
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{t("pageTitle")}</h1>
            <p className="text-muted-foreground mt-1">{t("pageDescription")}</p>
          </div>

          {/* Profile card */}
          <Card className="overflow-hidden border-0 shadow-xl">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

            {/* Profile header */}
            <div className="px-6 sm:px-8 relative">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-background -mt-12 shadow-md">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left mt-4 sm:mt-0 pb-6">
                  <h2 className="text-2xl font-bold">{tokenData.name}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                    <Badge variant="secondary" className="font-normal">
                      {tokenData.roleName}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="font-normal bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                    >
                      {t("activeAccount")}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Profile content */}
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("contactInformation")}
                  </h3>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("emailAddress")}
                      </p>
                      <p className="font-medium">{tokenData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("phoneNumber")}
                      </p>
                      <p className="font-medium">
                        {tokenData.phone || t("notProvided")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("location")}
                      </p>
                      <div>
                        {location ? (
                          <p className="font-medium">{location}</p>
                        ) : (
                          <p className="font-medium text-muted-foreground">
                            {isLoadingLocation
                              ? t("detectingLocation")
                              : t("notAvailable")}
                          </p>
                        )}
                        {locationError && (
                          <p className="text-xs text-red-500 mt-1">
                            {locationError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("accountDetails")}
                  </h3>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("userId")}
                      </p>
                      <p className="font-medium">{tokenData.userId}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 transition-colors">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("memberSince")}
                      </p>
                      <p className="font-medium">
                        {formatDate(tokenData.dateJoined) || t("notAvailable")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  {t("accountStatus")}
                </h3>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("currentStatus")}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                        <p className="font-medium">{t("accountActive")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
