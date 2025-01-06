"use server";

import z from "zod";
import { getUserByEmail } from "../data";
import { generatePasswordResetToken, sendPasswordResetEmail } from "../lib";
import { ResetSchema } from "../schemas";

/**
 * **{@linkcode reset} server function**
 *
 * 1. Safeparse the values
 * 2. If _validatedFields_ does not exist __or__ _validatedFields.data_ is __undefined__ return `{ error: "Invalid email!" }`
 * 3. Deconstruct the values
 * 4. Get user by email. See {@linkcode getUserByEmail}
 * 5. If user does __not__ exists return `{ error: "Email not found!" }`
 * 6. Generate password reset Token. See {@linkcode generatePasswordResetToken}
 * 7. Send password reset email. See {@linkcode generatePasswordResetToken}
 * 8. return `{ success: "Reset email sent!" }`
 *
 * @tutorial https://zod.dev/?id=safeparse
 * @param values {@linkcode ResetSchema}
 * @yields Returns a `Promise` that returns an `Object` with success and error messages
 */
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  // 1
  const validatedFields = ResetSchema.safeParse(values);

  // 2
  if (!validatedFields || !validatedFields.data)
    return { error: "Invalid email!" };

  // 3
  const { email } = validatedFields.data;

  // 4
  const existingUser = await getUserByEmail(email);

  // 5
  if (!existingUser) {
    return { error: "Email not found!" };
  }

  // 6
  const passwordResetToken = await generatePasswordResetToken(email);

  // 7
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  // 8
  return { success: "Reset email sent!" };
};
