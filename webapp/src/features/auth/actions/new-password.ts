"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import z from "zod";
import { getPasswordResetTokenByToken, getUserByEmail } from "../data";
import { NewPasswordSchema } from "../schemas";

type NewPasswordResponse =
  | { error: string; success?: undefined }
  | { success: string; error?: undefined };

/**
 * **{@linkcode newPassword} server function**
 *
 * Handles password reset logic.
 *
 * @param values {@linkcode NewPasswordSchema}
 * @param token Reset token as a `string | null`
 * @returns A `Promise` resolving to an object with either `error` or `success` properties.
 */
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
): Promise<NewPasswordResponse> => {
  // 1. Check for missing token
  if (!token) return { error: "Missing token!" };

  // 2. Validate the input
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success || !validatedFields.data) {
    return { error: "Invalid fields!" };
  }

  // 3. Destructure the validated password
  const { password } = validatedFields.data;

  // 4. Retrieve the reset token
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Invalid token!" };

  // 5. Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  // 6. Retrieve the user by email
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email does not exist!" };

  // 7. Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 8. Update the user's password
    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    // 9. Delete the reset token
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    // 10. Return success message
    return { success: "Password updated!" };
  } catch (error) {
    console.error("Error updating password:", error);

    // Return a generic error message
    return { error: "Something went wrong!" };
  }
};
