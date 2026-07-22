import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Camera viewfinder frame — four L-shaped corner brackets around the wrapped
 * content that continuously auto-focus and "click" like a shutter locking on.
 */
export function ViewfinderFrame({
  children,
  className = "",
  padding = "p-4 sm:p-6",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  const reduce = useReducedMotion();

  const MAROON = "#f01e2c";

  const cornerBase = "pointer-events-none absolute h-12 w-12 sm:h-16 sm:w-16";

  const cornerAnim = reduce
    ? undefined
    : {
        opacity: [1, 0.2, 1, 0.2, 1, 1],
        scale: [1, 0.94, 1, 0.94, 1.12, 1],
        filter: [
          `drop-shadow(0 0 2px ${MAROON})`,
          `drop-shadow(0 0 0px ${MAROON})`,
          `drop-shadow(0 0 10px ${MAROON})`,
          `drop-shadow(0 0 0px ${MAROON})`,
          `drop-shadow(0 0 22px ${MAROON})`,
          `drop-shadow(0 0 4px ${MAROON})`,
        ],
      };
  const cornerTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatDelay: 1.2,
    ease: "easeInOut" as const,
    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
  };


  const cornerStyle = {
    borderColor: MAROON,
    filter: `drop-shadow(0 0 4px ${MAROON}) drop-shadow(0 0 10px rgba(240,30,44,0.55))`,
  } as const;


  return (
    <div className={`relative inline-block ${padding} ${className}`}>
      {/* REC indicator above top-right corner */}
      {!reduce && (
        <div className="pointer-events-none absolute -top-5 right-0 flex items-center gap-1.5 sm:-top-6">
          <motion.span
            aria-hidden
            className="block h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: MAROON,
              boxShadow: `0 0 8px ${MAROON}, 0 0 14px rgba(240,30,44,0.6)`,
            }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="font-mono text-[9px] font-semibold tracking-[0.32em]"
            style={{ color: MAROON }}
          >
            REC
          </span>
        </div>
      )}

      {/* Four L-shaped corner brackets */}

      <motion.span
        aria-hidden
        className={`${cornerBase} left-0 top-0 border-l-[3px] border-t-[3px] sm:border-l-4 sm:border-t-4 rounded-tl-sm`}
        style={{ ...cornerStyle, transformOrigin: "top left" }}
        animate={cornerAnim}
        transition={cornerTransition}
      />
      <motion.span
        aria-hidden
        className={`${cornerBase} right-0 top-0 border-r-[3px] border-t-[3px] sm:border-r-4 sm:border-t-4 rounded-tr-sm`}
        style={{ ...cornerStyle, transformOrigin: "top right" }}
        animate={cornerAnim}
        transition={cornerTransition}
      />
      <motion.span
        aria-hidden
        className={`${cornerBase} bottom-0 left-0 border-b-[3px] border-l-[3px] sm:border-b-4 sm:border-l-4 rounded-bl-sm`}
        style={{ ...cornerStyle, transformOrigin: "bottom left" }}
        animate={cornerAnim}
        transition={cornerTransition}
      />
      <motion.span
        aria-hidden
        className={`${cornerBase} bottom-0 right-0 border-b-[3px] border-r-[3px] sm:border-b-4 sm:border-r-4 rounded-br-sm`}
        style={{ ...cornerStyle, transformOrigin: "bottom right" }}
        animate={cornerAnim}
        transition={cornerTransition}
      />

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
