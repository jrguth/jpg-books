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
import z from "zod";
import LoadingButton from "@/components/loading-button";
import { useState } from "react";

type Flow = "login" | "register";

const RootComponent = () => {
  const { user } = useAuth();
  const [flow, setFlow] = useState<Flow>("login");
  return (
    <div className="bg-background text-foreground font-sans min-h-dvh w-dvw">
      <header>
        <StickyNavbar />
      </header>
      <main className="mt-10 p-8 flex flex-col gap-16">
        <h1 className="text-4xl leading-none font-bold text-center">
          Books Books Books!
        </h1>
        {user ? (
          <Outlet />
        ) : flow == "login" ? (
          <LoginForm setFlow={setFlow} />
        ) : (
          <RegisterForm setFlow={setFlow} />
        )}
      </main>
      <Toaster />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});

const LoginSchema = z.object({
  emailOrUsername: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export function LoginForm({ setFlow }: { setFlow: (flow: Flow) => void }) {
  const { mutate: login, isPending } = useLogin();
  const form = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    validators: {
      onChange: LoginSchema,
      onSubmit: LoginSchema,
    },
    onSubmit: ({ value }) => {
      login(value);
    },
  });
  return (
    <div className="container mx-auto flex flex-col gap-6 max-w-xl">
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
                <form.Field name="emailOrUsername">
                  {(field) => (
                    <>
                      <Label htmlFor="email" className="inline-flex gap-1">
                        Email
                        {field.state.meta.errors.length > 0 && (
                          <em className="text-xs text-rose-700">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </em>
                        )}
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={"@username or email"}
                        className={
                          field.state.meta.errors.length > 0
                            ? "ring-rose-700 ring-2"
                            : ""
                        }
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid gap-3">
                <form.Field name="password">
                  {(field) => (
                    <>
                      <Label htmlFor="password" className="inline-flex gap-1">
                        Password
                        {field.state.meta.errors.length > 0 && (
                          <em className="text-xs text-rose-700">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </em>
                        )}
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={
                          field.state.meta.errors.length > 0
                            ? "ring-rose-700 ring-2"
                            : ""
                        }
                        type="password"
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="flex flex-col gap-3">
                <LoadingButton
                  type="submit"
                  className="w-full"
                  isLoading={isPending}
                >
                  Login
                </LoadingButton>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?
              <Button
                variant="link"
                onClick={() => setFlow("register")}
                className="hover:cursor-pointer px-1"
              >
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const RegisterSchema = z.object({
  emailOrUsername: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
  confirmPassword: z.string().min(1),
  name: z.string(),
});

function RegisterForm({ setFlow }: { setFlow: (flow: Flow) => void }) {
  const { mutate: register, isPending } = useRegister();
  const form = useForm({
    defaultValues: {
      emailOrUsername: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: RegisterSchema,
      onSubmit: RegisterSchema,
    },
    onSubmit: ({ value }) => {
      register(value);
    },
  });
  return (
    <div className={cn("container mx-auto flex flex-col gap-6 max-w-xl")}>
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter the details below to get started
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
                <form.Field name="emailOrUsername">
                  {(field) => (
                    <>
                      <Label
                        htmlFor="emailOrUsername"
                        className="inline-flex gap-1"
                      >
                        Email or username
                        {field.state.meta.errors.length > 0 && (
                          <em className="text-xs text-rose-700">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </em>
                        )}
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={"Email or @username"}
                        className={
                          field.state.meta.errors.length > 0
                            ? "ring-rose-700 ring-2"
                            : ""
                        }
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid gap-3">
                <form.Field name="password">
                  {(field) => (
                    <>
                      <Label htmlFor="password" className="inline-flex gap-1">
                        Password
                        {field.state.meta.errors.length > 0 && (
                          <em className="text-xs text-rose-700">
                            {field.state.meta.errors
                              .map((e) => e?.message)
                              .join(", ")}
                          </em>
                        )}
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={
                          field.state.meta.errors.length > 0
                            ? "ring-rose-700 ring-2"
                            : ""
                        }
                        type="password"
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid gap-3">
                <form.Field name="name">
                  {(field) => (
                    <>
                      <Label htmlFor="name">
                        Name <span className="font-light">(optional)</span>
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="John Doe"
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="flex flex-col gap-3">
                <LoadingButton
                  type="submit"
                  className="w-full"
                  isLoading={isPending}
                >
                  Login
                </LoadingButton>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Button
                variant="link"
                className="hover:cursor-pointer px-1"
                onClick={() => setFlow("login")}
              >
                Log in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
