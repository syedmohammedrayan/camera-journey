import { useMotionValue, useMotionValueEvent, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Downward-only replay progress.
 *
 * - While the page scrolls upward, output holds: no reverse parallax playback.
 * - When the user starts scrolling downward again from any page position, the
 *   local cycle is re-armed so the element animates forward again from there.
 * - If the element is below the viewport, the cycle returns to the beginning.
 */
export function useMonotonicProgress(source: MotionValue<number>): MotionValue<number> {
  const out = useMotionValue(0);
  const lastScrollY = useRef(0);
  const lastSource = useRef(source.get());
  const cycleStart = useRef(source.get());
  const direction = useRef<"up" | "down" | null>(null);
  const shouldReplayOnNextDown = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") lastScrollY.current = window.scrollY;
  }, []);

  useMotionValueEvent(source, "change", (v) => {
    if (typeof window === "undefined") return;

    const scrollY = window.scrollY;
    const scrollDelta = scrollY - lastScrollY.current;
    const sourceDelta = v - lastSource.current;
    const movedDown = scrollDelta > 0.75 || (Math.abs(scrollDelta) <= 0.75 && sourceDelta > 0.002);
    const movedUp = scrollDelta < -0.75 || (Math.abs(scrollDelta) <= 0.75 && sourceDelta < -0.002);

    if (v <= 0.001) {
      out.set(0);
      cycleStart.current = 0;
      shouldReplayOnNextDown.current = false;
    } else if (movedUp) {
      direction.current = "up";
      shouldReplayOnNextDown.current = true;
      lastSource.current = v;
      lastScrollY.current = scrollY;
      return;
    } else if (movedDown) {
      if (direction.current === "up" || shouldReplayOnNextDown.current) {
        cycleStart.current = Math.min(Math.max(v, 0), 0.96);
        out.set(0);
        shouldReplayOnNextDown.current = false;
      }

      direction.current = "down";

      const remainingRange = Math.max(1 - cycleStart.current, 0.08);
      const replayProgress = Math.min(1, Math.max(0, (v - cycleStart.current) / remainingRange));
      if (replayProgress > out.get()) out.set(replayProgress);
    }

    lastSource.current = v;
    lastScrollY.current = scrollY;
  });
  return out;
}
