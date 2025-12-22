import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCounter } from "./use-counter";

describe("useCounter", () => {
  describe("initialization", () => {
    it("should initialize with default value of 0", () => {
      const { result } = renderHook(() => useCounter());
      expect(result.current.count).toBe(0);
    });

    it("should initialize with custom initial value", () => {
      const { result } = renderHook(() => useCounter({ initialValue: 10 }));
      expect(result.current.count).toBe(10);
    });
  });

  describe("increment", () => {
    it("should increment by 1 by default", () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });

    it("should increment by custom step", () => {
      const { result } = renderHook(() => useCounter({ step: 5 }));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(5);
    });

    it("should not exceed max value", () => {
      const { result } = renderHook(() =>
        useCounter({ initialValue: 9, max: 10 }),
      );

      act(() => {
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(10);
    });
  });

  describe("decrement", () => {
    it("should decrement by 1 by default", () => {
      const { result } = renderHook(() => useCounter({ initialValue: 5 }));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(4);
    });

    it("should decrement by custom step", () => {
      const { result } = renderHook(() =>
        useCounter({ initialValue: 10, step: 3 }),
      );

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(7);
    });

    it("should not go below min value", () => {
      const { result } = renderHook(() =>
        useCounter({ initialValue: 1, min: 0 }),
      );

      act(() => {
        result.current.decrement();
        result.current.decrement();
      });

      expect(result.current.count).toBe(0);
    });
  });

  describe("reset", () => {
    it("should reset to initial value", () => {
      const { result } = renderHook(() => useCounter({ initialValue: 5 }));

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.reset();
      });

      expect(result.current.count).toBe(5);
    });
  });

  describe("set", () => {
    it("should set to specific value", () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        result.current.set(42);
      });

      expect(result.current.count).toBe(42);
    });

    it("should clamp value to min/max bounds", () => {
      const { result } = renderHook(() => useCounter({ min: 0, max: 100 }));

      act(() => {
        result.current.set(150);
      });
      expect(result.current.count).toBe(100);

      act(() => {
        result.current.set(-50);
      });
      expect(result.current.count).toBe(0);
    });
  });
});
