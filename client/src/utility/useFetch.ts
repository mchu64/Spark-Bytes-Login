import { useState, useEffect, useCallback, useRef } from 'react';

interface IUseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: { [key: string]: string };
  body?: BodyInit | null;
};

interface IUseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isFetched: boolean;
};

export function useFetch<T>(url: string, options?: IUseFetchOptions): IUseFetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const optionsRef = useRef<IUseFetchOptions | undefined>(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: optionsRef.current?.method || 'GET',
        headers: optionsRef.current?.headers,
        body: optionsRef.current?.body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      setIsFetched(true);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally{
      setIsLoading(false)
    }
  }, [url]);

  useEffect(() => {
    let didCancel = false;

    const doFetch = async () => {
      if (!didCancel) {
        await fetchData();
      }
    };

    doFetch();

    return () => {
      didCancel = true;
    };
  }, [fetchData]);

  return { data, isLoading, error, isFetched };
}