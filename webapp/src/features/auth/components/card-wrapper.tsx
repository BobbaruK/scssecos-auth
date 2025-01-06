"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ReactNode } from "react";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";

interface Props {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  backButtonHref,
  backButtonLabel,
  children,
  headerLabel,
  showSocial,
}: Props) => {
  return (
    <Card className="min-w-full shadow-md sm:min-w-[400px] sm:max-w-[450px]">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
