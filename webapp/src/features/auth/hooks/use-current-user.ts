import { useFactoriesSession } from "@/providers/session-provider";

export const useCurrentUser = () => {
  const session = useFactoriesSession();

  return session?.user;
};
