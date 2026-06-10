import { z } from "zod";

export const loginSchema = z.object({
  userId: z
    .string()
    .min(3, "Username required"),

  password: z
    .string()
    .min(6, "Password required"),
});

export type LoginFormData =
  z.infer<typeof loginSchema>;