"use client";

import { useEffect, useRef } from "react";

export function useDebouncedSave<T>(
  value: T,
  onSave: (value: T) => Promise<void> | void,
  delay = 250,
) {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const valueRef = useRef(value);
  valueRef.current = value;

  const serialized = JSON.stringify(value);
  const lastSerializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastSerializedRef.current === null) {
      lastSerializedRef.current = serialized;
      return;
    }

    if (lastSerializedRef.current === serialized) {
      return;
    }

    const timer = setTimeout(() => {
      lastSerializedRef.current = serialized;
      void onSaveRef.current(valueRef.current);
    }, delay);

    return () => clearTimeout(timer);
  }, [serialized, delay]);
}
