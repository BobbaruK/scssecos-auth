import { BsExclamationCircle } from "react-icons/bs";

interface Props {
  message?: string;
}

export const FormError = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <BsExclamationCircle size={25} />
      <p>{message}</p>
    </div>
  );
};
