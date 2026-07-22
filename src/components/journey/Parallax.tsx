import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMonotonicProgress } from "./useMonotonicProgress";

/**
 * Scroll-driven parallax wrapper. Progress is monotonic — animation only
 * advances on downward scroll and holds its position when scrolling back up.
 */
export function Parallax({
  children,
  speed = 0.3,
  axis = "y",
  rotate = 0,
  sway = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  speed?: number;
  axis?: "x" | "y" | "xy";
  rotate?: number;
  sway?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useMonotonicProgress(scrollYProgress);
  const distance = 340 * speed;
  const rawY = useTransform(progress, [0, 1], [distance, -distance]);
  const rawX = useTransform(progress, [0, 0.5, 1], [distance * 0.6, sway * 40, -distance * 0.6]);
  const rawRot = useTransform(progress, [0, 0.5, 1], [-rotate, 0, rotate]);
  const springCfg = { stiffness: 80, damping: 22, mass: 0.5 };
  const y = useSpring(rawY, springCfg);
  const x = useSpring(rawX, springCfg);
  const rot = useSpring(rawRot, springCfg);

  const MotionTag = as === "span" ? motion.span : motion.div;
  const style = reduce
    ? undefined
    : ({
        ...(axis === "y" || axis === "xy" ? { y } : {}),
        ...(axis === "x" || axis === "xy" ? { x } : {}),
        ...(rotate ? { rotate: rot } : {}),
        willChange: "transform" as const,
      } as const);
  return (
    <MotionTag ref={ref as never} style={style} className={className}>
      {children}
    </MotionTag>
  );
}
