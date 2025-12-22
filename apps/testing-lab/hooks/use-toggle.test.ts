import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useToggle } from "./use-toggle";

describe("useToggle", () => {
  it("should initialize with false by default", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });

  it("should initialize with custom initial value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });

  it("should toggle value", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(false);
  });

  it("should set to true with setTrue", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current.setTrue();
    });
    expect(result.current.value).toBe(true);

    // Calling setTrue again should keep it true
    act(() => {
      result.current.setTrue();
    });
    expect(result.current.value).toBe(true);
  });

  it("should set to false with setFalse", () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current.setFalse();
    });
    expect(result.current.value).toBe(false);
  });

  it("should set specific value with set", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.set(true);
    });
    expect(result.current.value).toBe(true);

    act(() => {
      result.current.set(false);
    });
    expect(result.current.value).toBe(false);
  });
});
