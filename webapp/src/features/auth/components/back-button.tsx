"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: Props) => {
  return (
    <Button
      variant={"link"}
      className={cn("w-full font-normal text-foreground")}
      size={"sm"}
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
