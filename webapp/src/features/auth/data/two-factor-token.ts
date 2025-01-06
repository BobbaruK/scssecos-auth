import db from "@/lib/db";

/**
 * {@linkcode getTwoFactorTokenByToken}
 *
 * @param {string} token - search in the database by token
 * @yields a `Promise` that resolve in an 2FA Token `Object`
 */
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

/**
 * {@linkcode getTwoFactorTokenByEmail}
 *
 * @param {string} email - search in the database by email
 * @yields a `Promise` that resolve in an 2FA Token `Object`
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
