import { useActiveSection } from "@/hooks/useActiveSection";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type KeyboardEvent } from "react";

interface Item {
  id: string;
  label: string;
  index: string;
}

interface Props {
  items: Item[];
}

/**
 * Keyboard-navigable, screen-reader friendly section rail.
 * - ArrowUp / ArrowDown move focus between chapters and scroll to them.
 * - Home / End jump to the first / last chapter.
 * - `aria-current="location"` marks the section currently in view.
 * - A visually-hidden live region announces active chapter changes.
 */
export function ProgressRail({ items }: Props) {
  const ids = items.map((i) => i.id);
  const active = useActiveSection(ids);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const listRef = useRef<HTMLUListElement>(null);

  const focusChapter = (idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    const item = items[clamped];
    if (!item) return;
    const anchor = listRef.current?.querySelector<HTMLAnchorElement>(
      `a[data-chapter="${item.id}"]`,
    );
    anchor?.focus();
    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${item.id}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const currentIdx = ids.indexOf(active);
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        focusChapter(currentIdx + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        focusChapter(currentIdx - 1);
        break;
      case "Home":
        e.preventDefault();
        focusChapter(0);
        break;
      case "End":
        e.preventDefault();
        focusChapter(items.length - 1);
        break;
    }
  };

  const activeItem = items.find((i) => i.id === active);
  const activeIdx = ids.indexOf(active);

  return (
    <>
      {/* Skip link — first focusable element on the page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-amber focus:px-3 focus:py-2 focus:text-xs focus:font-medium focus:text-background"
      >
        Skip to content
      </a>

      {/* Live region for screen readers */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {activeItem ? `Chapter ${activeItem.index}: ${activeItem.label}` : ""}
      </div>

      {/* Desktop side rail — glass capsule; labels float in their own opaque chip so they never bleed into hero copy or imagery */}
      <nav
        aria-label="Chapter navigation"
        className="pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div className="pointer-events-auto relative">
          {/* Soft amber halo behind the capsule */}
          <div
            aria-hidden
            className="absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklab,var(--amber)_35%,transparent),transparent_70%)] opacity-60 blur-2xl"
          />

          <div className="relative overflow-hidden rounded-full border border-hairline bg-background/55 px-2 py-4 shadow-[0_20px_60px_-30px_color-mix(in_oklab,var(--amber)_50%,transparent)] backdrop-blur-xl">
            {/* Vertical scroll progress trail behind the dots */}
            <div className="pointer-events-none absolute inset-y-4 left-1/2 w-px -translate-x-1/2 overflow-hidden rounded-full bg-foreground/10">
              <motion.div
                aria-hidden
                style={{ scaleY: scaleX, transformOrigin: "0% 0%" }}
                className="h-full w-full bg-gradient-to-b from-amber via-amber/70 to-amber/20"
              />
            </div>

            <ul
              ref={listRef}
              onKeyDown={onKeyDown}
              className="relative flex flex-col items-center gap-3.5"
            >
              {items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="group/item relative">
                    <a
                      href={`#${item.id}`}
                      data-chapter={item.id}
                      className="peer relative flex h-5 w-5 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-current={isActive ? "location" : undefined}
                      aria-label={`Chapter ${item.index} — ${item.label}`}
                    >
                      {isActive && (
                        <motion.span
                          aria-hidden
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: [0.9, 1.6, 0.9], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 rounded-full bg-amber/40 blur-[2px]"
                        />
                      )}
                      <motion.span
                        aria-hidden
                        animate={{
                          scale: isActive ? 1 : 0.55,
                          backgroundColor: isActive
                            ? "var(--amber)"
                            : "color-mix(in oklab, var(--foreground) 30%, transparent)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        className="relative block h-2 w-2 rounded-full shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_15%,transparent)] group-hover/item:scale-100 group-hover/item:bg-foreground/70"
                      />
                    </a>

                    {/* Tooltip chip — opaque background so it stays readable over any image/heading */}
                    <div className="pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2 opacity-0 transition-all duration-300 ease-out group-hover/item:translate-x-1 group-hover/item:opacity-100 peer-focus-visible:translate-x-1 peer-focus-visible:opacity-100">
                      <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-hairline bg-background/95 px-3 py-1.5 shadow-lg backdrop-blur-md">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-amber">
                          {item.index}
                        </span>
                        <span className="text-[11px] font-medium text-foreground">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Compact active-chapter caption pinned under the capsule */}
          <div className="mt-3 flex justify-center">
            <motion.div
              key={activeItem?.id ?? "none"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-full border border-hairline bg-background/90 px-2.5 py-1 backdrop-blur-md"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/70">
                {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Top scroll progress line */}
      <motion.div
        style={{ scaleX, transformOrigin: "0% 50%" }}
        className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-amber"
        aria-hidden
      />

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-hairline bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between text-[10px]">
          <span className="mono-label">
            {activeItem?.index ?? "00"} · {activeItem?.label ?? ""}
          </span>
          <span className="font-mono text-foreground/40">
            {(ids.indexOf(active) + 1).toString().padStart(2, "0")} /{" "}
            {items.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </>
  );
}
