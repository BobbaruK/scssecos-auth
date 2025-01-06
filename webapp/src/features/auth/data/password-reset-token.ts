import db from "@/lib/db";

/**
 * {@linkcode getPasswordResetTokenByToken}
 *
 * @param {string} token - Search in the database by this token
 * @yields a `Promise` that resolve in an Token `Object`
 */
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

/**
 * {@linkcode getPasswordResetTokenByEmail}
 *
 * @param {string} email - Search in the database by this email
 * @yields a `Promise` that resolve in an Token `Object`
 */
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};
