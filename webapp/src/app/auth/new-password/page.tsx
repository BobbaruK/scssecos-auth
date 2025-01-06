import { NewPasswordForm } from "@/features/auth/components";

interface Props {
  searchParams: {
    token: string;
  };
}

const NewPasswordPage = async ({ searchParams }: Props) => {
  const { token } = await searchParams;

  return (
    <div className="container grid h-full place-items-center">
      <NewPasswordForm searchParamToken={token} />
    </div>
  );
};

export default NewPasswordPage;
