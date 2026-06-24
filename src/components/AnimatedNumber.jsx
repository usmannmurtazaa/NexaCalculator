import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * AnimatedNumber – Smoothly transitions between numeric values using cubic ease‑out.
 */
export default function AnimatedNumber({
  value,
  decimals = 2,
  duration = 800,
  useGrouping = true,
}) {
  const [display, setDisplay] = useState(() =>
    formatNumber(parseFloat(value) || 0, decimals, useGrouping),
  );

  const rafIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(parseFloat(value) || 0);
  const targetValueRef = useRef(parseFloat(value) || 0);
  const currentAnimatedRef = useRef(parseFloat(value) || 0);

  useEffect(() => {
    const newTarget = parseFloat(value) || 0;
    if (newTarget !== targetValueRef.current) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      startValueRef.current = currentAnimatedRef.current;
      targetValueRef.current = newTarget;
      startTimeRef.current = null;
      rafIdRef.current = requestAnimationFrame(animate);
    }
  }, [value, decimals, useGrouping]);

  const animate = useCallback(
    (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current =
        startValueRef.current +
        (targetValueRef.current - startValueRef.current) * eased;

      currentAnimatedRef.current = current;

      setDisplay(formatNumber(current, decimals, useGrouping));

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        currentAnimatedRef.current = targetValueRef.current;
        rafIdRef.current = null;
      }
    },
    [duration, decimals, useGrouping],
  );

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const ariaValue = useMemo(
    () => parseFloat(value).toFixed(decimals),
    [value, decimals],
  );

  return (
    <span
      aria-label={ariaValue}
      role="status"
      aria-live="polite"
      style={{ whiteSpace: "nowrap" }}
    >
      {display}
    </span>
  );
}

function formatNumber(num, decimals, grouping) {
  if (grouping) {
    try {
      return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch {
      // fallback
    }
  }
  return num.toFixed(decimals);
}
