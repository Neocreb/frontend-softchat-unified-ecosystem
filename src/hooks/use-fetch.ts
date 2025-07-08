import { useState, useEffect, useRef, useCallback } from "react";

export interface UseFetchOptions {
  immediate?: boolean;
  timeout?: number;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
  abort: () => void;
}

export function useFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  options: UseFetchOptions = {},
): UseFetchResult<T> {
  const { immediate = false, timeout = 10000 } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const execute = useCallback(async () => {
    // Abort any previous request
    abort();

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, timeout);

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFn(signal);

      // Only update state if component is still mounted and request wasn't aborted
      if (mountedRef.current && !signal.aborted) {
        setData(result);
      }
    } catch (err) {
      // Only set error if component is still mounted and it's not an abort error
      if (mountedRef.current && err instanceof Error) {
        if (err.name !== "AbortError" && !signal.aborted) {
          setError(err);
        }
      }
    } finally {
      clearTimeout(timeoutId);
      if (mountedRef.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [fetchFn, timeout, abort]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    abort,
  };
}

// Hook for handling multiple fetch operations
export function useMultipleFetch() {
  const activeRequests = useRef<Set<AbortController>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // Abort all active requests on unmount
      activeRequests.current.forEach((controller) => {
        controller.abort();
      });
      activeRequests.current.clear();
    };
  }, []);

  const executeRequest = useCallback(
    async <T>(
      fetchFn: (signal: AbortSignal) => Promise<T>,
      timeout = 10000,
    ): Promise<T> => {
      const controller = new AbortController();
      const signal = controller.signal;

      activeRequests.current.add(controller);

      // Set up timeout
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      try {
        const result = await fetchFn(signal);

        if (!mountedRef.current || signal.aborted) {
          throw new Error("Request was aborted");
        }

        return result;
      } finally {
        clearTimeout(timeoutId);
        activeRequests.current.delete(controller);
      }
    },
    [],
  );

  const abortAll = useCallback(() => {
    activeRequests.current.forEach((controller) => {
      controller.abort();
    });
    activeRequests.current.clear();
  }, []);

  return {
    executeRequest,
    abortAll,
  };
}
