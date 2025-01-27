"use server";

import z from "zod";
import { getUserByEmail } from "../data/user";
import { generatePasswordResetToken } from "../lib/tokens";
import { sendPasswordResetEmail } from "../lib/mail";
import { ResetSchema } from "../schemas";

const MESSAGES = {
  INVALID_EMAIL: "Invalid email!",
  EMAIL_NOT_FOUND: "Email not found!",
  RESET_EMAIL_SENT: "Reset email sent!",
  GENERIC_ERROR: "Something went wrong!",
};

/**
 * **{@linkcode reset} server function**
 *
 * @tutorial https://zod.dev/?id=safeparse
 * @param values {@linkcode ResetSchema}
 * @yields Returns a `Promise` with success or error messages
 */
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  try {
    // 1. Validate fields
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: MESSAGES.INVALID_EMAIL };
    }

    // 2. Extract email
    const { email } = validatedFields.data;

    // 3. Check if user exists
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: MESSAGES.EMAIL_NOT_FOUND };
    }

    // 4. Generate password reset token
    const passwordResetToken = await generatePasswordResetToken(email);

    // 5. Send password reset email
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );

    // 6. Return success message
    return { success: MESSAGES.RESET_EMAIL_SENT };
  } catch (error) {
    console.error("Error in reset function:", error);
    return { error: MESSAGES.GENERIC_ERROR };
  }
};
