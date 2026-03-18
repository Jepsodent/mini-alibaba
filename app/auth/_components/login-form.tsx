"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchemaForm, type Login } from "@/validation/auth-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react";
import loginPassword from "../action";
import { INITIAL_STATE_LOGIN } from "@/constant/auth-constant";
import { toast } from "sonner";

export function LoginForm() {
  const form = useForm<Login>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loginState, loginAction, isPendingLogin] = useActionState(
    loginPassword,
    INITIAL_STATE_LOGIN,
  );

  const onSubmit = async (data: Login) => {
    const formData = new FormData();
    Object.entries(data).map(([key, value]) => {
      formData.append(key, value);
    });
    form.reset();
    startTransition(() => {
      loginAction(formData);
    });
  };

  useEffect(() => {
    if (loginState.status === "success") {
      toast.success("Login Successfully");
    } else if (loginState.status === "error") {
      toast.error("Login Failed", { description: loginState.errors?._form[0] });
    }
  }, [loginState]);

  return (
    <div className="w-full max-w-md mx-auto z-10">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your Aegis dashboard
        </p>
      </div>

      <div className="bg-card text-card-foreground shadow-xl border border-border/50 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 relative z-10"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <p className="text-green-700 text-xs">
                paylabs@gmail.com (for hackathon purposes)
              </p>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...form.register("email")}
                className={
                  form.formState.errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={isPendingLogin}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <p className="text-green-700 text-xs">
                12345678 (for hackathon purposes)
              </p>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                className={
                  form.formState.errors.password
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={isPendingLogin}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold"
            disabled={isPendingLogin}
          >
            {isPendingLogin ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 text-primary-foreground animate-spin" />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-primary hover:underline hover:text-primary/80 font-medium transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
