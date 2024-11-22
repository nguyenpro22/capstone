import * as z from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    emailOrUserName: z
      .string()
      .min(1, t("requiredEmail"))
      .email(t("invalidEmail")),
    password: z.string().min(6, t("minPassword")).max(50, t("maxPassword")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
