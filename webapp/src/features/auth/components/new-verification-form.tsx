"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { newVerification } from "../actions/new-verification";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  searchParamToken: string;
}

export const NewVerificationForm = ({ searchParamToken }: Props) => {
  const [error, setError] = useState<string | undefined>("");
  const [success] = useState<string | undefined>("");
  const router = useRouter();

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!searchParamToken) {
      setError("Missing token!");
      return;
    }

    newVerification(searchParamToken)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.push("/auth/login");
        }

        if (data.error) {
          setError(data.error);
        }
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [searchParamToken, success, error, router]);

  useEffect(() => {
    onSubmit();

    return () => {};
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel={"Confirming your verification"}
      backButtonLabel={"Back to login"}
      backButtonHref={"/auth/login"}
    >
      <div className="flex items-center justify-center">
        {!success && !error && <BeatLoader color="currentColor" />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
