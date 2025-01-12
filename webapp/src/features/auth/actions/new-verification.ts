"use server";

import db from "@/lib/db";
import { getUserByEmail, getVerificationTokenByToken } from "../data";

const MESSAGES = {
  TOKEN_NOT_FOUND: "Token does not exist!",
  TOKEN_EXPIRED: "Token has expired!",
  EMAIL_NOT_FOUND: "Email does not exist!",
  EMAIL_VERIFIED: "Email verified!",
  GENERIC_ERROR: "Something went wrong!",
};

/**
 * **{@linkcode newVerification} server function**
 */
export const newVerification = async (token: string) => {
  try {
    // 1. Verificarea tokenului
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) return { error: MESSAGES.TOKEN_NOT_FOUND };

    // 2. Verificarea expirării
    if (new Date(existingToken.expires) < new Date()) {
      return { error: MESSAGES.TOKEN_EXPIRED };
    }

    // 3. Verificarea utilizatorului
    const existingUser = await getUserByEmail(
      existingToken.emailOld || existingToken.email,
    );

    if (!existingUser) return { error: MESSAGES.EMAIL_NOT_FOUND };

    // 4. Actualizarea utilizatorului
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    // 5. Ștergerea tokenului
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: MESSAGES.EMAIL_VERIFIED };
  } catch (error) {
    console.error("Error in newVerification function:", error);
    return { error: MESSAGES.GENERIC_ERROR };
  }
};
