
import { useEffect, useState } from "react";

export function useDelayedRender(delay: number = 100): boolean {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldRender;
}

export function useStaggeredChildren(
  count: number,
  baseDelay: number = 75
): number[] {
  const [delays, setDelays] = useState<number[]>([]);

  useEffect(() => {
    const newDelays = Array.from({ length: count }, (_, i) => (i + 1) * baseDelay);
    setDelays(newDelays);
  }, [count, baseDelay]);

  return delays;
}
