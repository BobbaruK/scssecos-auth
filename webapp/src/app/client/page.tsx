"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/features/auth/hooks";

const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <>
      <div className="container">
        <UserInfo user={user} label={"Client Component"} />
      </div>
    </>
  );
};

export default ClientPage;
