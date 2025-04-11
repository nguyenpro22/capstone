import { z } from "zod";

export const createRegisterSchema = z
  .object({
    Email: z.string().email("Invalid email format"),
    Password: z.string().min(8, "Password must be at least 8 characters")
    .max(20,"Password must be at least 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    ),
    ConfirmPassword: z.string(),
    FirstName: z
      .string()
      .min(1, "First Name is required")
      .min(2, "First Name must be at least 2 characters"),

    LastName: z.string().min(1, "Last Name is required"),
    PhoneNumber: z
      .string()
      .regex(
        /^\d{10}$/,
        "Phone number must have 10 digits"
      ),
    DateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    Address: z.string().min(8, "Address must be at least 8 characters"),
  })
  .refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords do not match",
    path: ["ConfirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof createRegisterSchema>;
