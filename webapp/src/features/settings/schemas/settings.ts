import { MAX_PASSWORD, MIN_PASSWORD, userRoles } from "@/constants";
import { passwordRefine } from "@/lib/utils";
import { z } from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(userRoles()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z
        .string()
        .min(MIN_PASSWORD, {
          message: `Password must be ${MIN_PASSWORD} or more characters long`,
        })
        .max(MAX_PASSWORD, {
          message: `Password must be ${MAX_PASSWORD} or fewer characters long`,
        })
        .superRefine((password, ctx) => passwordRefine(password, ctx)),
    ),
    newPassword: z.optional(
      z
        .string()
        .min(MIN_PASSWORD, {
          message: `Password must be ${MIN_PASSWORD} or more characters long`,
        })
        .max(MAX_PASSWORD, {
          message: `Password must be ${MAX_PASSWORD} or fewer characters long`,
        })
        .superRefine((password, ctx) => passwordRefine(password, ctx)),
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) return false;

      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) return false;

      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    },
  );
