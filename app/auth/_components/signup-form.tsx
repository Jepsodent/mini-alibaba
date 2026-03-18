"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchemaForm, type SignUp } from "@/validation/auth-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export function SignUpForm() {
  const form = useForm<SignUp>({
    resolver: zodResolver(signUpSchemaForm),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: SignUp) => {
    console.log(data);
  };

  return (
    <div className="w-full max-w-md mx-auto z-10">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center border border-chart-3/20">
            <ShieldCheck className="h-6 w-6 text-chart-3" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to start protecting your revenue
        </p>
      </div>

      <div className="bg-card text-card-foreground shadow-xl border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-chart-3/5 rounded-full blur-3xl pointer-events-none"></div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 relative z-10"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...form.register("name")}
                className={
                  form.formState.errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                // disabled={isLoading}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
                // disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                // disabled={isLoading}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="••••••••"
                {...form.register("confirm_password")}
                className={
                  form.formState.errors.confirm_password
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                // disabled={isLoading}
              />
              {form.formState.errors.confirm_password && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold"
            // disabled={isLoading}
          >
            {/* {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 text-primary-foreground animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )} */}
            Sign Up
          </Button>
        </form>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary hover:underline hover:text-primary/80 font-medium transition-colors"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
