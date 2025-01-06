"use server";

import { signIn } from "@/auth";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import z from "zod";
import {
  getTwoFactorConfirmatioByUserId,
  getTwoFactorTokenByEmail,
  getUserByEmail,
} from "../data";
import {
  generateTwoFactorToken,
  generateVerificationToken,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "../lib";
import { LoginSchema } from "../schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants";

/**
 * **{@linkcode login} server function**
 *
 * 1. Safeparse the values
 * 2. If it is not success return `{ error: "Invalid fields!" }`
 * 3. Deconstruct the values
 * 4. Fetch existing user from the database. See {@linkcode getUserByEmail}.
 * 5. Check if *user*, *user email* and *user password* exists. If not return `{ error: "Email does not exist!" }`
 * 6. Check if email is  __not__ verified
 *    1. Generate verification token by the users email. See {@linkcode generateVerificationToken}
 *    2. Send verification email. See {@linkcode sendVerificationEmail}
 *    3. return `{ success: "Confirmation email sent!" }`
 * 7. Check if users 2FA is enabled __and__ if user has an email
 *    1. Check if _code_ exists
 *       1. Get 2FA Token by email. See {@linkcode getTwoFactorTokenByEmail}
 *       2. If 2FA is null return `{ error: "Invalid code!" }`
 *       3. If the token received is not the same as the code return `{ error: "Invalid code!" }`
 *       4. Check if the code has expired. If _true_ return `{ error: "Code expired!" }`
 *       5. Remove the 2FA Token from the database
 *       6. Get 2FA Confirmation by users id. See {@linkcode getTwoFactorConfirmatioByUserId}
 *       7. Check if 2FA Confirmation exist. If _true_ it will be deleted from the database
 *       8. Create 2FA Confirmation in the database where `userId` is users id
 *    2. If _code_ does not exist
 *       1. Generate 2FA Token. See {@linkcode generateTwoFactorToken}
 *       2. Send 2FA Token email. See {@linkcode sendTwoFactorTokenEmail}
 *       3. return `{ twoFactor: true }`
 * 8. Try and sign in, see {@linkcode signIn}, and then catch the error
 *
 * @tutorial https://zod.dev/?id=safeparse
 * @param values {@linkcode LoginSchema}
 * @yields Returns a `Promise` that returns an `Object` with success and error messages and if 2FA is active
 *
 */
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string,
) => {
  // 1
  const validatedFields = LoginSchema.safeParse(values);

  // 2
  if (!validatedFields.success) return { error: "Invalid fields!" };

  // 3
  const { email, password, code } = validatedFields.data;

  // 4
  const existingUser = await getUserByEmail(email);

  // 5
  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "Email does not exist!" };

  // 6
  if (!existingUser.emailVerified) {
    // 6.1
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    // 6.2
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    // 6.3
    return { success: "Confirmation email sent!" };
  }

  const passwordMatch = await bcrypt.compare(
    values.password,
    existingUser.password,
  );

  if (!passwordMatch) return { error: "Invalid credentials!" };

  // 7
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    // 7.1
    if (code) {
      // 7.1.1
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      // 7.1.2
      if (!twoFactorToken) return { error: "Invalid code!" };

      // 7.1.3
      if (twoFactorToken.token !== code) return { error: "Invalid code!" };

      // 7.1.4
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) return { error: "Code expired!" };

      // 7.1.5
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      // 7.1.6
      const existingConfirmation = await getTwoFactorConfirmatioByUserId(
        existingUser.id,
      );

      // 7.1.7
      if (existingConfirmation)
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });

      // 7.1.8
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      // 7.2
      // 7.2.1
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      // 7.2.2
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      // 7.2.3
      return { twoFactor: true };
    }
  }

  // 8
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
