import * as z from "zod";

export const createLoginSchema = z.object({
  email: z.string().min(1, "requiredEmail").email("invalidEmail"),
  password: z.string().min(6, "minPassword").max(50, "maxPassword"),
});

export type LoginFormValues = z.infer<typeof createLoginSchema>;
