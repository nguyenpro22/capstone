"use client";

import React from "react";

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
import { create } from "zustand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AnimatedText } from "@/components/ui/animated-text";

interface ClinicFormData {
  name: string;
  email: string;
  phoneNumber: string;
  taxCode: string;
  bankName: string;
  bankAccountNumber: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  operatingLicenseExpiryDate: string;
}

interface ClinicFiles {
  operatingLicense: File | null;
  businessLicense: File | null;
  profilePictureUrl: File | null;
}

interface ClinicStore {
  formData: ClinicFormData;
  files: ClinicFiles;
  setFormData: (field: keyof ClinicFormData, value: string) => void;
  setFiles: (field: keyof ClinicFiles, file: File | null) => void;
}

const useClinicStore = create<ClinicStore>((set) => ({
  formData: {
    name: "",
    email: "",
    phoneNumber: "",
    taxCode: "",
    bankName: "",
    bankAccountNumber: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    operatingLicenseExpiryDate: "",
  },
  files: {
    operatingLicense: null,
    businessLicense: null,
    profilePictureUrl: null,
  },
  setFormData: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  setFiles: (field, file) =>
    set((state) => ({
      files: { ...state.files, [field]: file },
    })),
}));

export function ContactSection() {
  const t = useTranslations("home");
  const { formData, files, setFormData, setFiles } = useClinicStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Uploaded Files:", files);
  };

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      Object.values(files).forEach((file) => {
        if (file) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, [files]);

  const contactItems = [
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: t("contact.info.visit.title"),
      content: t("contact.info.visit.content"),
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: t("contact.info.call.title"),
      content: t("contact.info.call.content"),
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: t("contact.info.email.title"),
      content: t("contact.info.email.content"),
    },
    {
      icon: <Calendar className="h-5 w-5 text-primary" />,
      title: t("contact.info.hours.title"),
      content: [
        t("contact.info.hours.weekdays"),
        t("contact.info.hours.weekend"),
      ],
    },
  ];

  const socialLinks = [
    { icon: <Instagram className="h-5 w-5 text-primary" />, href: "#" },
    { icon: <Facebook className="h-5 w-5 text-primary" />, href: "#" },
    { icon: <Twitter className="h-5 w-5 text-primary" />, href: "#" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
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

            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    {Array.isArray(item.content) ? (
                      item.content.map((line, i) => (
                        <p key={i} className="text-muted-foreground text-sm">
                          {line}
                        </p>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  aria-label={`Social media link ${index + 1}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <Card className="border-primary/10 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-6">
                  {t("contact.form.title")}
                </h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Clinic Information */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Clinic Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData("name", e.target.value)}
                        placeholder="Enter clinic name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData("email", e.target.value)}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  {/* Phone & Tax Code */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData("phoneNumber", e.target.value)
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxCode">Tax Code</Label>
                      <Input
                        id="taxCode"
                        value={formData.taxCode}
                        onChange={(e) => setFormData("taxCode", e.target.value)}
                        placeholder="Enter tax code"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData("city", e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData("district", e.target.value)
                        }
                        placeholder="Enter district"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Ward</Label>
                      <Input
                        id="ward"
                        value={formData.ward}
                        onChange={(e) => setFormData("ward", e.target.value)}
                        placeholder="Enter ward"
                      />
                    </div>
                  </div>

                  {/* Bank Information */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) =>
                          setFormData("bankName", e.target.value)
                        }
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountNumber">
                        Bank Account Number
                      </Label>
                      <Input
                        id="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={(e) =>
                          setFormData("bankAccountNumber", e.target.value)
                        }
                        placeholder="Enter bank account number"
                      />
                    </div>
                  </div>

                  {/* License Expiry Date */}
                  <div className="space-y-2">
                    <Label htmlFor="operatingLicenseExpiryDate">
                      Operating License Expiry Date
                    </Label>
                    <Input
                      id="operatingLicenseExpiryDate"
                      type="date"
                      value={formData.operatingLicenseExpiryDate}
                      onChange={(e) =>
                        setFormData(
                          "operatingLicenseExpiryDate",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(
                      [
                        "operatingLicense",
                        "businessLicense",
                        "profilePictureUrl",
                      ] as (keyof ClinicFiles)[]
                    ).map((field) => (
                      <div className="space-y-2" key={field}>
                        <Label htmlFor={field}>
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </Label>
                        {files[field] ? (
                          <div className="relative h-32 w-full group">
                            {files[field]?.type.startsWith("image/") ? (
                              <div className="h-full w-full rounded-lg border-2 border-primary overflow-hidden">
                                <img
                                  src={
                                    URL.createObjectURL(files[field] as File) ||
                                    "/placeholder.svg"
                                  }
                                  alt={`Preview of ${field}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full w-full rounded-lg border-2 border-primary bg-primary/5">
                                <p className="text-sm font-medium text-center px-2">
                                  {files[field]?.name}
                                  <br />
                                  <span className="text-xs text-muted-foreground">
                                    {(files[field]?.size / 1024 / 1024).toFixed(
                                      2
                                    )}{" "}
                                    MB
                                  </span>
                                </p>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => setFiles(field, null)}
                                className="h-8"
                              >
                                Remove
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                  document
                                    .getElementById(`${field}-input`)
                                    ?.click()
                                }
                                className="h-8"
                              >
                                Change
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor={`${field}-input`}
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PNG, JPG or PDF (max. 10MB)
                                </p>
                              </div>
                              <Input
                                id={`${field}-input`}
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 10 * 1024 * 1024) {
                                      alert("File size must be less than 10MB");
                                      return;
                                    }
                                    setFiles(field, file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full">
                    Submit Registration
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
