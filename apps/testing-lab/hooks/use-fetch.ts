"use client";

import { useState, useEffect, useCallback } from "react";

interface UseFetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => Promise<void>;
}

interface UseFetchOptions {
  immediate?: boolean;
}

/**
 * A custom hook for fetching data from an API
 */
export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {},
): UseFetchReturn<T> {
  const { immediate = true } = options;

  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, error: null, isLoading: false });
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      });
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { ...state, refetch: fetchData };
}
