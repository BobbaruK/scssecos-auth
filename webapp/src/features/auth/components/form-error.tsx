import { BsExclamationCircle } from "react-icons/bs";

interface Props {
  message?: string;
}

export const FormError = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-danger text-danger-foreground flex items-center gap-x-2 rounded-md p-3 text-sm">
      <BsExclamationCircle size={25} />
      <p>{message}</p>
    </div>
  );
};
