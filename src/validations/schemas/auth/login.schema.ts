import { useTranslations } from "next-intl";
import * as z from "zod";

export const useLoginSchema = () => {
  const t = useTranslations("api");

  const schema = z.object({
    email: z.string()
      .min(1, { message: t("auth.login.requiredEmail") })
      .email({ message: t("auth.login.invalidEmail") }),
    password: z.string()
      .min(6, { message: t("auth.login.minPassword") })
      .max(50, { message: t("auth.login.maxPassword") }),
  });

  return schema;
};

export type LoginFormValues = z.infer<ReturnType<typeof useLoginSchema>>;
