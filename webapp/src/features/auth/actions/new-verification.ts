"use server";

import db from "@/lib/db";
import { getUserByEmail, getVerificationTokenByToken } from "../data";

/**
 * **{@linkcode newVerification} server function**
 *
 * 1. Get verification token. See {@linkcode getVerificationTokenByToken}
 * 2. If Token does not exist return `{ error: "Token does not exist!" }`
 * 3. Check if Token is expired. If yes return `{ error: "Token has expired!" }`
 * 4. Get user by email. See {@linkcode getUserByEmail}
 * 5. If user does __not__ exists return `{ error: "Email does note exist!" }`
 * 6. Update the user
 * 7. Delete verification Token
 * 8. Return `{ success: ""Email verified!" }`
 *
 * @param {string} token
 * @yields Returns a `Promise` that returns an `Object` with success and error messages
 */
export const newVerification = async (token: string) => {
  // 1
  const existingToken = await getVerificationTokenByToken(token);

  // 2
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  // 3
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired)
    return {
      error: "Token has expired!",
    };

  // 4
  const existingUser = await getUserByEmail(
    existingToken.emailOld || existingToken.email,
  );

  // 5
  if (!existingUser)
    return {
      error: "Email does not exist!",
    };

  // 6
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // 7
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  // 8
  return {
    success: "Email verified!",
  };
};
