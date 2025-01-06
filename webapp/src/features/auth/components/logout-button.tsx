"use client";

import { signOut } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export const LogoutButton = ({ children }: Props) => {
  return (
    <span onClick={() => signOut()} className="cursor-pointer">
      {children}
    </span>
  );
};
