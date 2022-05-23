import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UseMutationResult<T> = [(data:any) => void, UseMutationState<T>];

export default function useMutation<T = any>(url: string): UseMutationResult<T> {
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<undefined|any>(undefined);
  const [error, setError] = useState<undefined|any>(undefined);

  function mutation(data: any) {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return [mutation, {loading, data, error}];
} 