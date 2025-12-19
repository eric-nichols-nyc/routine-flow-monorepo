"use client";

import { useActionState } from "react";
import { cn } from "@repo/design-system/lib/utils";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import {
  Alert,
  AlertDescription,
} from "@repo/design-system/components/ui/alert";
import { login } from "../../../actions/auth/action.login";
import { signup } from "../../../actions/auth/action.signup";
import { type AuthState } from "@/types/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginState, loginAction, loginPending] = useActionState<
    AuthState | null,
    FormData
  >(login, null);
  const [signupState, signupAction, signupPending] = useActionState<
    AuthState | null,
    FormData
  >(signup, null);

  const error = loginState?.error || signupState?.error;
  const fieldErrors = loginState?.fieldErrors || signupState?.fieldErrors;
  const isPending = loginPending || signupPending;

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
          <form>
            <FieldGroup>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="usera@test.com"
                  required
                  disabled={isPending}
                />
                {fieldErrors?.email && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="12345678"
                  required
                  disabled={isPending}
                />
                {fieldErrors?.password && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.password[0]}
                  </p>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  formAction={loginAction}
                  disabled={isPending}
                >
                  {loginPending ? "Logging in..." : "Login"}
                </Button>
                <Button
                  variant="outline"
                  type="submit"
                  formAction={signupAction}
                  disabled={isPending}
                >
                  {signupPending ? "Signing up..." : "Sign up"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
