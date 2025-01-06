import { PiLockKeyFill } from "react-icons/pi";

interface Props {
  label: string;
}

export const Header = ({ label }: Props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1 className="flex items-center gap-4 text-6xl font-semibold text-foreground drop-shadow-md">
        <PiLockKeyFill />
        Auth
      </h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
