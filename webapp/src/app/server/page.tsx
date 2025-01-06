import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/features/auth/lib/auth";

const serverPage = async () => {
  const user = await currentUser();

  return (
    <div className="container">
      <UserInfo user={user} label={"Server Component"} />
    </div>
  );
};

export default serverPage;
