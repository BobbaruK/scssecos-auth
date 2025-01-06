import { BsExclamationCircle } from "react-icons/bs";
import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel={"Ooops! Something went wrong!"}
      backButtonLabel={"Back to login"}
      backButtonHref={"/auth/login"}
    >
      <div className="grid w-full place-items-center text-destructive">
        <BsExclamationCircle size={25} />
      </div>
    </CardWrapper>
  );
};
