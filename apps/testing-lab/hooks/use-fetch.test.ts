import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { useFetch } from "./use-fetch";
import type { User } from "@/mocks/handlers";

describe("useFetch", () => {
  describe("successful requests", () => {
    it("should fetch data successfully", async () => {
      const { result } = renderHook(() => useFetch<User[]>("/api/users"));

      // Initial loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      // Wait for fetch to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveLength(3);
      expect(result.current.data?.[0].name).toBe("John Doe");
      expect(result.current.error).toBeNull();
    });

    it("should refetch data on demand", async () => {
      const { result } = renderHook(() => useFetch<User[]>("/api/users"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialData = result.current.data;

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.data).toEqual(initialData);
    });
  });

  describe("error handling", () => {
    it("should handle HTTP errors", async () => {
      const { result } = renderHook(() => useFetch("/api/error"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain("500");
      expect(result.current.data).toBeNull();
    });

    it("should handle 404 errors", async () => {
      const { result } = renderHook(() => useFetch("/api/users/999"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain("404");
    });

    it("should handle network errors", async () => {
      server.use(
        http.get("/api/network-error", () => {
          throw new Error("Network error");
        }),
      );

      const { result } = renderHook(() => useFetch("/api/network-error"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBeNull();
    });
  });

  describe("options", () => {
    it("should not fetch immediately when immediate is false", async () => {
      const { result } = renderHook(() =>
        useFetch<User[]>("/api/users", { immediate: false }),
      );

      // Should not be loading
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();

      // Manually trigger fetch
      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.data).toHaveLength(3);
    });
  });

  describe("dynamic handler overrides", () => {
    it("should use overridden handlers for specific test cases", async () => {
      // Override the handler for this specific test
      server.use(
        http.get("/api/users", () => {
          return HttpResponse.json([
            {
              id: 99,
              name: "Test User",
              email: "test@test.com",
              role: "admin",
            },
          ]);
        }),
      );

      const { result } = renderHook(() => useFetch<User[]>("/api/users"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].name).toBe("Test User");
    });
  });
});
