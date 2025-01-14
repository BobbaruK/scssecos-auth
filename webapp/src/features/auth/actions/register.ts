"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import z from "zod";
import { getUserByEmail } from "../data";
import { generateVerificationToken } from "../lib/tokens";
import { sendVerificationEmail } from "../lib/mail";
import { RegisterSchema } from "../schemas";

const MESSAGES = {
  INVALID_FIELDS: "Invalid fields!",
  EMAIL_IN_USE: "Email already in use",
  CONFIRMATION_SENT: "Confirmation email sent!",
  GENERIC_ERROR: "Something went wrong!",
};

/**
 * **{@linkcode register} server function**
 */
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { email, name, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: MESSAGES.EMAIL_IN_USE };

  try {
    await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    let verificationToken;
    try {
      verificationToken = await generateVerificationToken(email);
    } catch (error) {
      console.error("Error generating verification token:", error);
      return { error: "Failed to generate verification token!" };
    }

    try {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );
    } catch (error) {
      console.error("Error sending verification email:", error);
      return { error: "Failed to send verification email!" };
    }

    return { success: MESSAGES.CONFIRMATION_SENT };
  } catch (error) {
    console.error("Error in register function:", error);
    return { error: MESSAGES.GENERIC_ERROR };
  }
};
