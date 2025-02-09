"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Props } from "../type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClinicRegistrationMutation } from "@/features/landing/api";

export default function RegistrationForm({ t }: Props) {
  const [registrationForm] = useClinicRegistrationMutation();
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    PhoneNumber: "",
    Address: "",
    TaxCode: "",
    BusinessLicense: "",
    OperatingLicense: "",
    OperatingLicenseExpiryDate: new Date().toISOString().split("T")[0],
    ProfilePictureUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === "OperatingLicenseExpiryDate"
          ? new Date(value).toISOString().split("T")[0]
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    try {
      const res = await registrationForm(formData);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
    // Here you would typically send the data to your backend
  };

  return (
    <section
      id="registration"
      className="py-20 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900"
    >
      <div className="container mx-auto">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              {t("form.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formData).map((key) => (
                  <div key={key}>
                    <Label
                      htmlFor={key}
                      className="block mb-2 text-sm font-medium"
                    >
                      {t(`form.${key}`)}
                    </Label>
                    <Input
                      type={
                        key === "OperatingLicenseExpiryDate"
                          ? "date"
                          : key === "Email"
                          ? "email"
                          : key === "BusinessLicense" ||
                            key === "OperatingLicense" ||
                            key === "ProfilePictureUrl"
                          ? "file"
                          : "text"
                      }
                      id={key}
                      name={key}
                      value={formData[key as keyof typeof formData] || ""} // Đảm bảo giá trị không undefined
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full">
                {"submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
