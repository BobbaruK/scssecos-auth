import { MAX_PASSWORD, MIN_PASSWORD } from "@/constants";
import { passwordRefine } from "@/lib/utils";
import { z } from "zod";

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(MIN_PASSWORD, {
      message: `Password must be ${MIN_PASSWORD} or more characters long`,
    })
    .max(MAX_PASSWORD, {
      message: `Password must be ${MAX_PASSWORD} or fewer characters long`,
    })
    .superRefine((password, ctx) => passwordRefine(password, ctx)),
});
