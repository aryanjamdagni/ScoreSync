import { z } from "zod";

const email = z.string().email();
const address = z.string().max(400);
const password = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[^a-zA-Z0-9]/, "Must include at least one special character");

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(60),
    email,
    address,
    password,
    role: z.enum(["ADMIN", "USER", "OWNER"]),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(["ADMIN", "USER", "OWNER"]).optional(),
    sortBy: z.enum(["createdAt", "name", "email", "role"]).optional(),
    sortDir: z.enum(["asc", "desc"]).optional(),
  }),
});

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(120),
    email,
    address,
    ownerUserId: z.string().optional().nullable(),
  }),
});

export const listStoresSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    sortBy: z.enum(["createdAt", "name", "email"]).optional(),
    sortDir: z.enum(["asc", "desc"]).optional(),
  }),
});
