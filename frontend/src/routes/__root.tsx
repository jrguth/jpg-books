import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import StickyNavbar from "@/components/sticky-navbar";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLogin, useRegister } from "@/hooks/gable-api";

import { useForm } from "@tanstack/react-form";

const RootComponent = () => {
  const { user } = useAuth();
  return (
    <div className="bg-background text-foreground font-sans min-h-dvh w-dvw">
      <header>
        <StickyNavbar />
      </header>
      <main className="mt-10 p-8 flex flex-col gap-16">
        <h1 className="text-4xl leading-none font-bold text-center">
          Books Books Books!
        </h1>
        {user ? <Outlet /> : <SignInForm />}
      </main>
      <Toaster />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: login, isPending } = useLogin();
  const form = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
