"use server";

import { signIn } from "@/auth";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import z from "zod";
import { getTwoFactorConfirmatioByUserId } from "../data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "../data/two-factor-token";
import { getUserByEmail } from "../data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "../lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "../lib/mail";
import { LoginSchema } from "../schemas/login";

type LoginResponse =
  | {
      error: string;
      success?: undefined;
      emailSent?: undefined;
      twoFactor?: undefined;
    }
  | {
      success: string;
      emailSent: boolean;
      error?: undefined;
      twoFactor?: undefined;
    }
  | {
      twoFactor: boolean;
      error?: undefined;
      success?: undefined;
      emailSent?: undefined;
    }
  | {
      success: string;
      error?: undefined;
      emailSent?: undefined;
      twoFactor?: undefined;
    };

// Centralize messages
const MESSAGES = {
  INVALID_FIELDS: "Invalid fields!",
  EMAIL_NOT_EXIST: "Email does not exist!",
  INVALID_CREDENTIALS: "Invalid credentials!",
  EMAIL_NOT_VERIFIED: "Confirmation email sent!",
  INVALID_CODE: "Invalid code!",
  CODE_EXPIRED: "Code expired!",
  SIGN_IN_SUCCESS: "You have been signed in successfully!",
  UNKNOWN_ERROR: "Something went wrong!",
};

/**
 * Handle email verification
 */
const handleEmailVerification = async (
  email: string,
): Promise<LoginResponse> => {
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: MESSAGES.EMAIL_NOT_VERIFIED, emailSent: true };
};

/**
 * Handle two-factor authentication (2FA)
 */
const handleTwoFactorAuthentication = async (
  email: string,
  userId: string,
  code?: string,
): Promise<LoginResponse> => {
  if (code) {
    const twoFactorToken = await getTwoFactorTokenByEmail(email);

    if (!twoFactorToken || twoFactorToken.token !== code) {
      return { error: MESSAGES.INVALID_CODE };
    }

    if (new Date(twoFactorToken.expires) < new Date()) {
      return { error: MESSAGES.CODE_EXPIRED };
    }

    await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

    const existingConfirmation = await getTwoFactorConfirmatioByUserId(userId);
    if (existingConfirmation) {
      await db.twoFactorConfirmation.delete({
        where: { id: existingConfirmation.id },
      });
    }

    await db.twoFactorConfirmation.create({ data: { userId } });
    return { success: MESSAGES.SIGN_IN_SUCCESS }; // Optionally, return success after 2FA is confirmed
  } else {
    const twoFactorToken = await generateTwoFactorToken(email);
    await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
    return { twoFactor: true };
  }
};

/**
 * Main login function
 */
export const login = async (
  values: z.infer<typeof LoginSchema>,
): Promise<LoginResponse> => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: MESSAGES.EMAIL_NOT_EXIST };
  }

  if (!existingUser.emailVerified) {
    return await handleEmailVerification(existingUser.email);
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) return { error: MESSAGES.INVALID_CREDENTIALS };

  if (existingUser.isTwoFactorEnabled) {
    const twoFactorResult = await handleTwoFactorAuthentication(
      existingUser.email,
      existingUser.id,
      code,
    );
    if (twoFactorResult.error || twoFactorResult.twoFactor) {
      return twoFactorResult;
    }
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: MESSAGES.SIGN_IN_SUCCESS };
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { error: MESSAGES.INVALID_CREDENTIALS };
    }
    console.error("Sign-in error:", error);
    return { error: MESSAGES.UNKNOWN_ERROR };
  }
};
