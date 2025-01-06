"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import z from "zod";
import { getPasswordResetTokenByToken, getUserByEmail } from "../data";
import { NewPasswordSchema } from "../schemas";

/**
 * **{@linkcode newPassword} server function**
 *
 * 1. If token is missing return `{ error: "Missing token!" }`
 * 2. Safeparse the values
 * 3. If _validatedFields_ does not exist __or__ _validatedFields.data_ is __undefined__ return `{ error: "Invalid email!" }`
 * 4. Deconstruct the values
 * 5. Get password reset Token. See {@linkcode getPasswordResetTokenByToken}
 * 6. If password reset Token does not exists return `{ error: "Invalid token!" }`
 * 7. Check if Token is expired. If yes return `{ error: "Token has expired!" }`
 * 8. Get user by email. See {@linkcode getUserByEmail}
 * 9. If user does __not__ exists return `{ error: "Email does note exist!" }`
 * 10. Hash the password
 * 11. Update the user
 * 12. Delete password Reset Token
 * 13. Return `{ success: "Password updated!" }`
 *
 *
 * @param values {@linkcode NewPasswordSchema}
 * @param {string} token
 * @yields Returns a `Promise` that returns an `Object` with success and error messages
 */
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null,
) => {
  // 1
  if (!token) return { error: "Missing token!" };

  // 2
  const validatedFields = NewPasswordSchema.safeParse(values);

  // 3
  if (!validatedFields || !validatedFields.data)
    return { error: "Invalid fields!" };

  // 4
  const { password } = validatedFields.data;

  // 5
  const existingToken = await getPasswordResetTokenByToken(token);

  // 6
  if (!existingToken) return { error: "Invalid token!" };

  // 7
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired!" };

  // 8
  const existingUser = await getUserByEmail(existingToken.email);

  // 9
  if (!existingUser) return { error: "Email does note exist!" };

  // 10
  const hashedPassword = await bcrypt.hash(password, 10);

  // 11
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  // 12
  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  // 13
  return {
    success: "Password updated!",
  };
};
