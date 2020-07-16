import { useState, useEffect } from "react";

export default function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [value, setValue] = useState<T>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fn();
        setValue(res);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { value, loading, error };
}
