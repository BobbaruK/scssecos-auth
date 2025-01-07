"use client";

// https://github.com/nextauthjs/next-auth/issues/11034#issuecomment-2383875841

import { Session } from "next-auth";
import React, { createContext, ReactNode, useContext } from "react";

const FactoriesSessionContext = createContext({} as Session | null);

export const useFactoriesSession = () => useContext(FactoriesSessionContext);

export function FactoriesSessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <FactoriesSessionContext.Provider value={session}>
      {children}
    </FactoriesSessionContext.Provider>
  );
}
