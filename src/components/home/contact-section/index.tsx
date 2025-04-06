"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showError, showSuccess } from "@/utils";
import { useClinicRegistrationMutation } from "@/features/landing/api";

// Componente para la carga de archivos
const FileUploadField = ({
  label,
  file,
  onChange,
  accept = "image/*,.pdf",
  t,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  t: any;
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {file ? (
        <div className="relative h-32 w-full group">
          {file.type.startsWith("image/") ? (
            <div className="h-full w-full rounded-lg border-2 border-primary overflow-hidden">
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={`Preview of ${label}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full rounded-lg border-2 border-primary bg-primary/5">
              <p className="text-sm font-medium text-center px-2">
                {file.name}
                <br />
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange(null)}
              className="h-8"
            >
              {t("form.fileUpload.remove")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById(`${label}-input`)?.click()}
              className="h-8"
            >
              {t("form.fileUpload.change")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`${label}-input`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  {t("form.fileUpload.clickToUpload")}
                </span>{" "}
                {t("form.fileUpload.orDragAndDrop")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("form.fileUpload.fileTypes")}
              </p>
            </div>
            <Input
              id={`${label}-input`}
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    alert(t("form.fileUpload.sizeError"));
                    return;
                  }
                  onChange(file);
                }
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export function RegisterClinicForm() {
  const t = useTranslations("registerClinic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerClinic] = useClinicRegistrationMutation();
  // Estado para los archivos
  const [files, setFiles] = useState<{
    operatingLicense: File | null;
    businessLicense: File | null;
    profilePictureUrl: File | null;
  }>({
    operatingLicense: null,
    businessLicense: null,
    profilePictureUrl: null,
  });

  // Esquema de validación con Zod
  const formSchema = z.object({
    name: z.string().min(1, t("form.validation.nameRequired")),
    email: z.string().email(t("form.validation.emailInvalid")),
    phoneNumber: z.string().min(1, t("form.validation.phoneRequired")),
    taxCode: z.string().min(1, t("form.validation.taxCodeRequired")),
    bankName: z.string().min(1, t("form.validation.bankNameRequired")),
    bankAccountNumber: z
      .string()
      .min(1, t("form.validation.bankAccountRequired")),
    address: z.string().min(1, t("form.validation.addressRequired")),
    city: z.string().min(1, t("form.validation.cityRequired")),
    district: z.string().min(1, t("form.validation.districtRequired")),
    ward: z.string().min(1, t("form.validation.wardRequired")),
    operatingLicenseExpiryDate: z
      .string()
      .min(1, t("form.validation.expiryDateRequired")),
  });

  // Configuración del formulario con React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Validar que se hayan cargado todos los archivos requeridos
    if (
      !files.operatingLicense ||
      !files.businessLicense ||
      !files.profilePictureUrl
    ) {
      showError(
        t("form.validation.fileUploadRequired") +
          " " +
          t("form.validation.fileUploadRequiredTitle")
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear FormData para enviar los datos
      const formData = new FormData();

      // Agregar campos de texto
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Agregar archivos
      formData.append("operatingLicense", files.operatingLicense);
      formData.append("businessLicense", files.businessLicense);
      formData.append("profilePictureUrl", files.profilePictureUrl);

      // Enviar datos a la API
      const response = await registerClinic(formData).unwrap();

      // Mostrar mensaje de éxito
      showSuccess(
        t("form.toast.success.title") +
          " " +
          t("form.toast.success.description")
      );

      // Limpiar formulario
      form.reset();
      setFiles({
        operatingLicense: null,
        businessLicense: null,
        profilePictureUrl: null,
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);

      // Manejar diferentes tipos de errores
      if (error.status === 400) {
        if (error.data?.detail === "Clinics Request is handling !") {
          showError(t("form.toast.error.pendingRequest"));
        } else if (error.data?.detail === "Information Already Exist") {
          showError(t("form.toast.error.duplicateInfo"));
        } else {
          showError(
            t("form.toast.error.title") +
              " " +
              t("form.toast.error.description")
          );
        }
      } else if (error.status === 422) {
        // Error de validación
        const validationErrors = error.data?.errors;
        if (validationErrors && validationErrors.length > 0) {
          const errorMessages = validationErrors
            .map((err: any) => err.message)
            .join(", ");
          showError(t("form.toast.error.validation") + " " + errorMessages);
        } else {
          showError(t("form.toast.error.validation"));
        }
      } else {
        showError(
          t("form.toast.error.title") + " " + t("form.toast.error.description")
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/10 shadow-md">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Clinic Information */}
            <div className="space-y-2">
              <h2 className="text-xl font-medium">
                {t("form.sections.clinicInfo")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.name")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("form.placeholders.email")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <h2 className="text-xl font-medium">
                {t("form.sections.contactInfo")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.phoneNumber")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.phoneNumber")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.taxCode")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.taxCode")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <h2 className="text-xl font-medium">
                {t("form.sections.address")}
              </h2>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.fields.address")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.address")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.city")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.city")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.district")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.district")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.ward")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.ward")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bank Information */}
            <div className="space-y-2">
              <h2 className="text-xl font-medium">
                {t("form.sections.bankInfo")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.bankName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.bankName")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.fields.bankAccountNumber")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.bankAccountNumber")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* License Information */}
            <div className="space-y-2">
              <h2 className="text-xl font-medium">
                {t("form.sections.licenseInfo")}
              </h2>
              <FormField
                control={form.control}
                name="operatingLicenseExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.fields.operatingLicenseExpiryDate")}
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-2">
              <h2 className="text-xl font-medium">
                {t("form.sections.documents")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FileUploadField
                  label={t("form.fields.operatingLicense")}
                  file={files.operatingLicense}
                  onChange={(file) =>
                    setFiles({ ...files, operatingLicense: file })
                  }
                  t={t}
                />
                <FileUploadField
                  label={t("form.fields.businessLicense")}
                  file={files.businessLicense}
                  onChange={(file) =>
                    setFiles({ ...files, businessLicense: file })
                  }
                  t={t}
                />
                <FileUploadField
                  label={t("form.fields.profilePictureUrl")}
                  file={files.profilePictureUrl}
                  onChange={(file) =>
                    setFiles({ ...files, profilePictureUrl: file })
                  }
                  t={t}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("form.submitting")}
                </>
              ) : (
                t("form.submit")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
