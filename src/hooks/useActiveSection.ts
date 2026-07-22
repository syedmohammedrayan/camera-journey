import { useEffect, useRef, useState } from "react";

/**
 * Tracks the section currently in view. Does NOT touch the URL hash —
 * deep linking is intentionally disabled.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const idsKey = ids.join("|");
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible[0]) return;
        const id = visible[0].target.id;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => setActive(id));
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    els.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return active;
}
