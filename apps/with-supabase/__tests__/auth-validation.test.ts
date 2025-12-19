import { describe, it, expect } from "vitest";
import { z } from "zod";

// Same schema used in the login/signup actions
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

describe("Auth Validation Schema", () => {
  it("accepts valid email and password", () => {
    const result = authSchema.safeParse({
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = authSchema.safeParse({
      email: "invalid-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects short password", () => {
    const result = authSchema.safeParse({
      email: "test@example.com",
      password: "123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("rejects empty email", () => {
    const result = authSchema.safeParse({
      email: "",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = authSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
