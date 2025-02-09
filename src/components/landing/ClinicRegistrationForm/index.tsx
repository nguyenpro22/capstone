"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Props } from "../type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClinicRegistrationMutation } from "@/features/landing/api";

const formSchema = z.object({
  Name: z.string().min(1, "Name is required"),
  Email: z.string().email("Invalid email"),
  PhoneNumber: z.string().min(1, "Phone number is required"),
  Address: z.string().min(1, "Address is required"),
  TaxCode: z.string().min(1, "Tax code is required"),
  OperatingLicenseExpiryDate: z.string().min(1, "Expiry date is required"),
  BusinessLicense: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Business license is required"),
  OperatingLicense: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Operating license is required"),
  ProfilePictureUrl: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Profile picture is required"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function RegistrationForm({ t }: Props) {
  const [registrationForm] = useClinicRegistrationMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await registrationForm(formData);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formSchema.shape).map((key) => (
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
                      {...register(key as keyof FormSchemaType)}
                      className="w-full"
                    />
                    {errors[key as keyof FormSchemaType] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[key as keyof FormSchemaType]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full">
                {t("form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
