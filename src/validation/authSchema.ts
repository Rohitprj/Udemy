import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Password must contain letter, number and special character",
    ),
  role: z.enum(["ADMIN", "USER"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
