import db from "@/lib/db";

/**
 * {@linkcode getTwoFactorConfirmatioByUserId}
 *
 * @param {string} userId - search in the database by userId
 * @yields a `Promise` that resolve in an 2FA `Object`
 */
export const getTwoFactorConfirmatioByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
