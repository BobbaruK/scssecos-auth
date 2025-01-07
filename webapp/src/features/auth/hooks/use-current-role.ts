import { useFactoriesSession } from "@/providers/session-provider";

export const useCurrentRole = () => {
  const session = useFactoriesSession();

  return session?.user.role;
};
