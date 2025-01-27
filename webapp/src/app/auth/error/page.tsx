import { ErrorCard } from "@/features/auth/components/error-card";

const AuthErrorPage = () => {
  return (
    <div className="container grid h-full place-items-center">
      <ErrorCard />
    </div>
  );
};

export default AuthErrorPage;
