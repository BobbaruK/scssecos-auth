
import { UserRole } from "@prisma/client";
import { ReactNode } from "react";
import { FormError } from "./form-error";
import { useCurrentRole } from "../hooks";

interface Props {
  children: ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ allowedRole, children }: Props) => {
  const role = useCurrentRole();

  if (role !== allowedRole)
    return (
      <FormError message="You do not have permission to view this content!" />
    );

  return <>{children}</>;
};
