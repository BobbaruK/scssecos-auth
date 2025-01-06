"use server";

import { signOut } from "@/auth";

/**
 * **{@linkcode logout} server function**
 *
 * A signout function. {@linkcode signOut}
 */
export const logout = async () => {
  await signOut({
    redirectTo: "/auth/login",
  });
};
