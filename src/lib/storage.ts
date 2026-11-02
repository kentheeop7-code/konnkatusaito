"use client";
import { useCallback, useEffect, useState } from "react";

// localStorage に保存する state。SSR との差異を避けるため、読み込み後に ready=true になる。
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const nv = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(nv));
        } catch {}
        return nv;
      });
    },
    [key],
  );

  return [value, update, ready] as const;
}
