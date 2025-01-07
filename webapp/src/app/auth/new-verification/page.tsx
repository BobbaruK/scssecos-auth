import { NewVerificationForm } from "@/features/auth/components";

interface Props {
  searchParams: Promise<{
    token: string;
  }>;
}

const NewVerificationPage = async ({ searchParams }: Props) => {
  const { token } = await searchParams;
  return (
    <div className="container grid h-full place-items-center">
      <NewVerificationForm searchParamToken={token} />
    </div>
  );
};

export default NewVerificationPage;
