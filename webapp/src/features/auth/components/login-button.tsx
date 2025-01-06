"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";

interface Props {
  children: ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: Props) => {
  const router = useRouter();

  const onClick = () => router.push("/auth/login");

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="w-auto border-none bg-transparent p-0">
          <DialogHeader className="hidden">
            <DialogTitle>Auth</DialogTitle>
            <DialogDescription>Welcome back</DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
