"use server";

import { getUserByEmail, getUserById } from "@/features/auth/data";
import {
  currentUser,
  generateVerificationToken,
  sendVerificationEmail,
} from "@/features/auth/lib";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { SettingsSchema } from "../schemas";

type SettingsResponse =
  | { error: string; success?: undefined; logout?: undefined }
  | { success: string; logout: boolean; error?: undefined }
  | { success: string; error?: undefined; logout?: undefined };

// Mesaje centralizate pentru claritate
const MESSAGES = {
  UNAUTHORIZED: "Unauthorized!",
  EMAIL_IN_USE: "Email already in use!",
  VERIFICATION_SENT: "Verification email sent!",
  INCORRECT_PASSWORD: "Incorrect password!",
  SETTINGS_UPDATED: "Settings Updated!",
  UNKNOWN_ERROR: "Something went wrong!",
};

/**
 * Handle email change and send verification email
 */
const handleEmailChange = async (email: string, userId: string, currentEmail: string): Promise<SettingsResponse> => {
  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.id !== userId) {
    return { error: MESSAGES.EMAIL_IN_USE };
  }

  const verificationToken = await generateVerificationToken(email, currentEmail);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: MESSAGES.VERIFICATION_SENT, logout: true };
};

/**
 * Handle password change
 */
const handlePasswordChange = async (
  currentPassword: string,
  newPassword: string,
  hashedPassword: string
): Promise<string | SettingsResponse> => {
  const passwordMatch = await bcrypt.compare(currentPassword, hashedPassword);

  if (!passwordMatch) {
    return { error: MESSAGES.INCORRECT_PASSWORD };
  }

  return await bcrypt.hash(newPassword, 10);
};

/**
 * Main settings update function
 */
export const settings = async (values: z.infer<typeof SettingsSchema>): Promise<SettingsResponse> => {
  const user = await currentUser();
  if (!user) return { error: MESSAGES.UNAUTHORIZED };

  const dbUser = await getUserById(user.id!);
  if (!dbUser) return { error: MESSAGES.UNAUTHORIZED };

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    return await handleEmailChange(values.email, user.id!, user.email!);
  }

  if (values.password && values.newPassword && dbUser.password) {
    const newHashedPassword = await handlePasswordChange(
      values.password,
      values.newPassword,
      dbUser.password
    );

    if (typeof newHashedPassword === "object" && "error" in newHashedPassword) {
      return newHashedPassword;
    }

    values.password = newHashedPassword as string;
    values.newPassword = undefined;
  }

  try {
    await db.user.update({
      where: { id: dbUser.id },
      data: { ...values },
    });

    return { success: MESSAGES.SETTINGS_UPDATED };
  } catch {
    return { error: MESSAGES.UNKNOWN_ERROR };
  }
};
