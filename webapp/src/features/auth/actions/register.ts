"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import z from "zod";
import { getUserByEmail } from "../data";
import { generateVerificationToken, sendVerificationEmail } from "../lib";
import { RegisterSchema } from "../schemas";

/**
 * **{@linkcode register} server function**
 *
 * 1. Safeparse the values
 * 2. If it is not success return `{ error: "Invalid fields!" }`
 * 3. Deconstruct the values
 * 4. Hash the password
 * 5. Get user by email. See {@linkcode getUserByEmail}
 * 6. If user exists return `{ error: "Email already in use" }`
 * 7. Create user
 * 8. Generate verification Token. See {@linkcode generateVerificationToken}
 * 9. Send verification email. See {@linkcode sendVerificationEmail}
 * 10. return `{ success: "Confirmation email sent!" }`
 *
 * @tutorial https://zod.dev/?id=safeparse
 * @param values {@linkcode RegisterSchema}
 * @yields Returns a `Promise` that returns an `Object` with success and error messages
 */
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // 1
  const validatedFields = RegisterSchema.safeParse(values);

  // 2
  if (!validatedFields.success) return { error: "Invalid fields!" };

  // 3
  const { email, name, password } = validatedFields.data;

  // 4
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5
  const existingUser = await getUserByEmail(email);

  // 6
  if (existingUser) return { error: "Email already in use" };

  // 7
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 8
  const verificationToken = await generateVerificationToken(email);

  // 9
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  // 10
  return { success: "Confirmation email sent!" };
};
