import { z } from "zod";

export const createRegisterSchema = (t: any) =>
  z
    .object({
      Email: z.string().email(t("form.validation.email.invalid")),
      Password: z
        .string()
        .min(8, t("form.validation.password.min"))
        .max(20, t("form.validation.password.max"))
        .regex(/[A-Z]/, t("form.validation.password.uppercase"))
        .regex(/[a-z]/, t("form.validation.password.lowercase"))
        .regex(/[0-9]/, t("form.validation.password.number"))
        .regex(/[@$!%*?&]/, t("form.validation.password.special")),
      ConfirmPassword: z.string(),
      FirstName: z
        .string()
        .min(1, t("form.validation.required"))
        .min(2, t("form.validation.firstName.min")),
      LastName: z.string().min(1, t("form.validation.lastName.required")),
      PhoneNumber: z
        .string()
        .regex(/^\d{10}$/, t("form.validation.phoneNumber.format")),
      DateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: t("form.validation.dateOfBirth.invalid"),
      }),
      Address: z.string().min(8, t("form.validation.address.min")),
    })
    .refine((data) => data.Password === data.ConfirmPassword, {
      message: t("form.validation.confirmPassword.match"),
      path: ["ConfirmPassword"],
    });

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
