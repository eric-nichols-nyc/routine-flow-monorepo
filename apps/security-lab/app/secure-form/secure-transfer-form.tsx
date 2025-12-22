"use client";

/**
 * =============================================================================
 * SECURITY LAB: Secure Form Client Component
 * =============================================================================
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * WHY CLIENT-SIDE VALIDATION ISN'T ENOUGH:
 * ---------------------------------------------------------------------------
 * - JavaScript can be disabled
 * - Attackers can use curl, Postman, or browser DevTools
 * - They can modify the DOM and remove validation
 * - Client validation is for UX, server validation is for SECURITY
 *
 * USING ZOD FOR VALIDATION:
 * ---------------------------------------------------------------------------
 * - Define schema ONCE, use on both client AND server
 * - TypeScript types are inferred from schema (no duplication)
 * - Consistent validation rules everywhere
 * - Rich error messages for better UX
 *
 * REACT'S BUILT-IN XSS PROTECTION:
 * ---------------------------------------------------------------------------
 * - React automatically escapes values in JSX: {userInput}
 * - This prevents: <script>alert('xss')</script> from executing
 * - DANGER: dangerouslySetInnerHTML bypasses this protection
 * - DANGER: href="javascript:..." can still execute code
 *
 * SECURE STATE MANAGEMENT:
 * ---------------------------------------------------------------------------
 * - Never store sensitive data (tokens, passwords) in localStorage
 * - localStorage is accessible to any JavaScript (XSS vulnerable)
 * - Use HTTP-only cookies for sensitive tokens
 * - Session storage is slightly better but still XSS vulnerable
 */

import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/design-system/components/ui/alert";
import { Shield, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

/**
 * =============================================================================
 * ZOD SCHEMA FOR TRANSFER FORM
 * =============================================================================
 *
 * KEY INTERVIEW TALKING POINTS:
 *
 * WHY USE ZOD?
 * - Single source of truth for validation rules
 * - Works on both client (for UX) and server (for security)
 * - TypeScript integration: z.infer<typeof schema> gives you types
 * - Composable: schemas can be extended, merged, or picked from
 *
 * SECURITY BENEFITS:
 * - Enforce max lengths to prevent DoS attacks
 * - Validate email format before it hits your database
 * - Coerce and transform data safely
 * - Clear, specific error messages for each field
 *
 * IMPORTANT: This same schema should be used server-side!
 * Export it from a shared location and import in your API routes.
 */
const transferSchema = z.object({
  recipient: z
    .string({ error: "Recipient email is required" })
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),

  amount: z
    .string({ error: "Amount is required" })
    .min(1, "Amount is required")
    // Transform string input to number for validation
    .transform((val) => parseFloat(val))
    // Refine with custom validation after transformation
    .refine((val) => !isNaN(val), "Please enter a valid number")
    .refine((val) => val > 0, "Amount must be greater than 0")
    .refine((val) => val <= 10000, "Maximum transfer amount is $10,000"),
});

// Infer TypeScript type from schema
type TransferFormData = z.infer<typeof transferSchema>;

interface FormErrors {
  recipient?: string[];
  amount?: string[];
  general?: string;
}

interface FormResult {
  success: boolean;
  message: string;
}

export function SecureTransferForm() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<FormResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  /**
   * FETCH CSRF TOKEN ON MOUNT
   *
   * We fetch the token from our API route which:
   * 1. Generates a new CSRF token
   * 2. Sets it in an HTTP-only cookie
   * 3. Returns it to us for embedding in the form
   *
   * This is secure because:
   * - Same-origin policy prevents other sites from calling our API
   * - The token is cryptographically random and signed
   * - Even if XSS steals the token, the cookie is HTTP-only
   */
  useEffect(() => {
    async function fetchCSRFToken() {
      try {
        const response = await fetch("/api/csrf-demo", {
          credentials: "same-origin",
        });
        const data = await response.json();
        setCsrfToken(data.csrf_token);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        setErrors({
          general: "Failed to initialize form security. Please refresh.",
        });
      } finally {
        setIsLoadingToken(false);
      }
    }

    fetchCSRFToken();
  }, []);

  /**
   * CLIENT-SIDE VALIDATION WITH ZOD
   *
   * Purpose: Better UX with immediate feedback
   * NOT Purpose: Security (that's server-side)
   *
   * Using safeParse():
   * - Returns { success, data, error } instead of throwing
   * - Gives us control over error handling
   * - Same schema can be used server-side for consistent validation
   */
  function validateForm(): TransferFormData | null {
    const result = transferSchema.safeParse({ recipient, amount });

    if (!result.success) {
      // Zod v4 uses flatten() to get a clean error structure
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        recipient: fieldErrors.recipient,
        amount: fieldErrors.amount,
      });
      return null;
    }

    setErrors({});
    return result.data;
  }

  /**
   * SECURE FORM SUBMISSION
   *
   * The validated data from Zod is type-safe:
   * - recipient is guaranteed to be a valid email string
   * - amount is guaranteed to be a number between 0 and 10000
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (!csrfToken) {
      setErrors({
        general: "Security token not loaded. Please refresh the page.",
      });
      return;
    }

    // Validate with Zod - returns typed data or null
    const validatedData = validateForm();
    if (!validatedData) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/csrf-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          csrf_token: csrfToken,
          action: "transfer",
          // Use validated data from Zod (already typed correctly)
          recipient: validatedData.recipient,
          amount: validatedData.amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setErrors({
            general:
              "Security validation failed. Please refresh the page and try again.",
          });
          // Refetch token on CSRF failure
          setCsrfToken(null);
          setIsLoadingToken(true);
          const tokenResponse = await fetch("/api/csrf-demo", {
            credentials: "same-origin",
          });
          const tokenData = await tokenResponse.json();
          setCsrfToken(tokenData.csrf_token);
          setIsLoadingToken(false);
        } else if (response.status === 429) {
          setErrors({
            general: "Too many requests. Please wait a moment and try again.",
          });
        } else {
          setErrors({
            general: data.error || "An error occurred. Please try again.",
          });
        }
        return;
      }

      setResult({
        success: true,
        message: `Transfer of $${validatedData.amount.toFixed(2)} to ${validatedData.recipient} was processed successfully!`,
      });

      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Transfer error:", error);
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingToken) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Initializing secure form...
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Secure Money Transfer</CardTitle>
        </div>
        <CardDescription>
          This form is protected against CSRF attacks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/**
           * CSRF TOKEN - HIDDEN FIELD
           *
           * The token is:
           * - Fetched from our API on component mount
           * - Unpredictable to attackers (cryptographically random)
           * - Also stored in HTTP-only cookie for double-submit validation
           */}
          <input type="hidden" name="csrf_token" value={csrfToken || ""} />

          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {result?.success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success!</AlertTitle>
              <AlertDescription className="text-green-600">
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="recipient@example.com"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (errors.recipient) {
                  setErrors((prev) => ({ ...prev, recipient: undefined }));
                }
              }}
              autoComplete="email"
              aria-invalid={!!(errors.recipient && errors.recipient.length > 0)}
              aria-describedby={
                errors.recipient?.length ? "recipient-error" : undefined
              }
            />
            {errors.recipient && errors.recipient.length > 0 && (
              <p id="recipient-error" className="text-sm text-destructive">
                {errors.recipient[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="100.00"
              min="0.01"
              max="10000"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) {
                  setErrors((prev) => ({ ...prev, amount: undefined }));
                }
              }}
              autoComplete="off"
              aria-invalid={!!(errors.amount && errors.amount.length > 0)}
              aria-describedby={
                errors.amount?.length ? "amount-error" : undefined
              }
            />
            {errors.amount && errors.amount.length > 0 && (
              <p id="amount-error" className="text-sm text-destructive">
                {errors.amount[0]}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !csrfToken}
          >
            {isSubmitting ? "Processing..." : "Transfer Securely"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            🔒 Protected by CSRF token validation
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
