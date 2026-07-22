import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useMonotonicProgress } from "./useMonotonicProgress";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  intensity?: number; // 0..1 — image drift inside its frame
  eager?: boolean;
  direction?: "up" | "down" | "left" | "right";
  tilt?: number; // deg of scroll-driven rotation
  drift?: number; // extra cross-axis drift for messy layered motion
}

/**
 * Image that drifts inside its own frame as it crosses the viewport.
 * Progress is monotonic — motion only advances on downward scroll and
 * holds its most-progressed position on reverse scroll.
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  intensity = 0.55,
  eager = false,
  direction = "up",
  tilt = 0,
  drift = 0,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useMonotonicProgress(scrollYProgress);

  const shift = 340 * intensity;
  const primaryRaw = useTransform(
    progress,
    [0, 1],
    direction === "up" || direction === "left" ? [shift, -shift] : [-shift, shift]
  );
  const crossRaw = useTransform(progress, [0, 0.5, 1], [-drift * 60, 0, drift * 60]);
  const springCfg = { stiffness: 80, damping: 22, mass: 0.5 };
  const primary = useSpring(primaryRaw, springCfg);
  const cross = useSpring(crossRaw, springCfg);

  const scale = useTransform(progress, [0, 0.5, 1], [1.35, 1.12, 1.35]);
  const rotateRaw = useTransform(progress, [0, 0.5, 1], [-tilt, 0, tilt]);
  const rotate = useSpring(rotateRaw, springCfg);
  const brightness = useTransform(progress, [0, 0.5, 1], [0.82, 1.05, 0.82]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  const isVertical = direction === "up" || direction === "down";
  const style = reduce
    ? undefined
    : ({
        y: isVertical ? primary : cross,
        x: isVertical ? cross : primary,
        scale,
        rotate,
        filter,
        willChange: "transform, filter",
      } as const);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={style}
        className="h-[135%] w-[110%] -translate-x-[5%] object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/10" />
    </div>
  );
}
