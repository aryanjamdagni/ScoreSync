import { z } from "zod";

const email = z.string().email();
const address = z.string().max(400);
const password = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[^a-zA-Z0-9]/, "Must include at least one special character");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(60),
    email,
    address,
    password,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1),
    newPassword: password,
  }),
});
