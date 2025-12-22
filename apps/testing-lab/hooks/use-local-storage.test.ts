import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should return initial value when localStorage is empty", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "default"),
      );
      expect(result.current.value).toBe("default");
    });

    it("should return stored value when localStorage has data", () => {
      window.localStorage.setItem("test-key", JSON.stringify("stored-value"));

      const { result } = renderHook(() =>
        useLocalStorage("test-key", "default"),
      );
      expect(result.current.value).toBe("stored-value");
    });

    it("should handle complex objects", () => {
      const initialValue = { name: "John", age: 30, hobbies: ["reading"] };

      const { result } = renderHook(() =>
        useLocalStorage("user", initialValue),
      );
      expect(result.current.value).toEqual(initialValue);
    });
  });

  describe("setValue", () => {
    it("should update state and localStorage", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "initial"),
      );

      act(() => {
        result.current.setValue("updated");
      });

      expect(result.current.value).toBe("updated");
      expect(JSON.parse(window.localStorage.getItem("test-key") || "")).toBe(
        "updated",
      );
    });

    it("should support functional updates", () => {
      const { result } = renderHook(() => useLocalStorage("counter", 0));

      act(() => {
        result.current.setValue((prev) => prev + 1);
      });
      expect(result.current.value).toBe(1);

      act(() => {
        result.current.setValue((prev) => prev + 1);
      });
      expect(result.current.value).toBe(2);
    });

    it("should handle object updates", () => {
      const { result } = renderHook(() =>
        useLocalStorage("user", { name: "John", age: 30 }),
      );

      act(() => {
        result.current.setValue({ name: "Jane", age: 25 });
      });

      expect(result.current.value).toEqual({ name: "Jane", age: 25 });
    });
  });

  describe("removeValue", () => {
    it("should remove from localStorage and reset to initial", () => {
      window.localStorage.setItem("test-key", JSON.stringify("stored"));

      const { result } = renderHook(() =>
        useLocalStorage("test-key", "initial"),
      );

      expect(result.current.value).toBe("stored");

      act(() => {
        result.current.removeValue();
      });

      expect(result.current.value).toBe("initial");
      expect(window.localStorage.getItem("test-key")).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should handle invalid JSON in localStorage gracefully", () => {
      window.localStorage.setItem("test-key", "not-valid-json");
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage("test-key", "default"),
      );

      expect(result.current.value).toBe("default");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("arrays", () => {
    it("should handle array values", () => {
      const { result } = renderHook(() =>
        useLocalStorage<string[]>("items", []),
      );

      act(() => {
        result.current.setValue(["a", "b", "c"]);
      });

      expect(result.current.value).toEqual(["a", "b", "c"]);

      act(() => {
        result.current.setValue((prev) => [...prev, "d"]);
      });

      expect(result.current.value).toEqual(["a", "b", "c", "d"]);
    });
  });
});
