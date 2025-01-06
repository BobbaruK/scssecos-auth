"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { newVerification } from "../actions/new-verification";

interface Props {
  searchParamToken: string;
}

export const NewVerificationForm = ({ searchParamToken }: Props) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!searchParamToken) {
      setError("Missing token!");
      return;
    }

    newVerification(searchParamToken)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [searchParamToken, success, error]);

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
