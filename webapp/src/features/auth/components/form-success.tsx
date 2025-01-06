import { BsCheckCircle } from "react-icons/bs";

interface Props {
  message?: string;
}

export const FormSuccess = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <BsCheckCircle size={25} />
      <p>{message}</p>
    </div>
  );
};
