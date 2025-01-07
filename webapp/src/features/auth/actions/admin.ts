"use server";

import { UserRole } from "@prisma/client";
import { currentRole } from "../lib";

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: "Allow server action!" };
  }

  return { error: "Forbidden server action!" };
};
