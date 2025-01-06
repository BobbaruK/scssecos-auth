"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        className="w-full"
        size={"lg"}
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <FcGoogle size={25} />
      </Button>
      <Button
        className="w-full"
        size={"lg"}
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        <FaGithub size={25} />
      </Button>
    </div>
  );
};
