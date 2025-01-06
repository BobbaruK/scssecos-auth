"use client";

import { revalidate } from "@/actions/reavalidate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { userRoles } from "@/constants";
import { logout } from "@/features/auth/actions";
import { FormError, FormSuccess } from "@/features/auth/components";
import { useCurrentUser } from "@/features/auth/hooks";
import { settings } from "@/features/settings/actions";
import { SettingsSchema } from "@/features/settings/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SettingsPage = () => {
  const user = useCurrentUser();

  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    setSuccess(undefined);
    setError(undefined);

    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            update();
            setSuccess(data.success);
          }

          if (data.logout) setTimeout(logout, 700);

          revalidate();
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <p className="text-center text-2xl font-semibold">Settings</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.isOAuth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="john.doe@example.com"
                              type="email"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="******"
                              type="password"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="******"
                              type="password"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userRoles().map((role) => (
                            <SelectItem value={role} key={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.isOAuth === false && (
                  <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Two Factor Authentication</FormLabel>
                          <FormDescription>
                            Enable 2FA for your account.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
