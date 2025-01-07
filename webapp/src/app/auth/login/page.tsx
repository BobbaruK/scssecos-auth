import { LoginForm } from "@/features/auth/components";

interface Props {
  searchParams: Promise<{
    error: string;
    callbackUrl: string;
  }>;
}

const LoginPage = async ({ searchParams }: Props) => {
  const { error, callbackUrl } = await searchParams;

  return (
    <div className="container grid h-full place-items-center">
      <LoginForm
        searchParamError={error || ""}
        callbackUrl={callbackUrl || ""}
      />
    </div>
  );
};

export default LoginPage;
