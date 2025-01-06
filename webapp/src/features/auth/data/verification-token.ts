import db from "@/lib/db";

/**
 * {@linkcode getVerificationTokenByToken}
 *
 * @param {string} token - search in the database by token
 * @yields a `Promise` that resolve in an user `Object`
 */
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

/**
 * {@linkcode getVerificationTokenByEmail}
 *
 * @param {string} email - search in the database by email
 * @yields a `Promise` that resolve in an user `Object`
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
