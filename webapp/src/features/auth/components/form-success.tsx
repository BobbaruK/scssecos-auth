import { BsCheckCircle } from "react-icons/bs";

interface Props {
  message?: string;
}

export const FormSuccess = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-success text-success-foreground flex items-center gap-x-2 rounded-md p-3 text-sm">
      <BsCheckCircle size={25} />
      <p>{message}</p>
    </div>
  );
};
