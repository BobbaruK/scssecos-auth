"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { admin } from "@/features/auth/actions";
import { FormSuccess, RoleGate } from "@/features/auth/components";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@prisma/client";

const AdminPage = () => {
  const { toast } = useToast();

  const onApiRouteClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast({
          title: "API Route Test",
          description: "Allow API Route!",
        });
      } else {
        toast({
          title: "API Route Test",
          description: "Forbidden API Route!",
          variant: "destructive",
        });
      }
    });
  };

  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.success) {
        toast({
          title: "Server Action Test",
          description: "Allow Server Action!",
        });
      } else {
        toast({
          title: "Server Action Test",
          description: "Forbidden Server Action!",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <p className="text-center text-2xl font-semibold">Admin</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess message="You are allowed to see this content!" />
          </RoleGate>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only API Route</p>
            <Button onClick={onApiRouteClick}>Click to test</Button>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only Server Action</p>
            <Button onClick={onServerActionClick}>Click to test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
