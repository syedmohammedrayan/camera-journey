import {
  motion,
  useAnimationControls,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "motion/react";
import { useEffect, useMemo, useRef, type ReactNode } from "react";

export type RevealVariant =
  | "rise"
  | "drop"
  | "slide-left"
  | "slide-right"
  | "tilt-left"
  | "tilt-right"
  | "swing"
  | "pop"
  | "blur"
  | "skew";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "h1" | "h2" | "h3" | "p";
  variant?: RevealVariant;
}

const VARIANTS: RevealVariant[] = [
  "rise",
  "slide-left",
  "tilt-right",
  "pop",
  "slide-right",
  "swing",
  "drop",
  "tilt-left",
  "blur",
  "skew",
];

function buildVariants(variant: RevealVariant, y: number): Variants {
  const base = { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, skewX: 0, skewY: 0, filter: "blur(0px)" };
  switch (variant) {
    case "drop":
      return {
        hidden: { opacity: 0, y: -y * 1.2, rotate: -3, filter: "blur(10px)" },
        show: { ...base, filter: "blur(0px)" },
        exit: { opacity: 0, y: y * 0.6, rotate: 2, filter: "blur(6px)" },
      };
    case "slide-left":
      return {
        hidden: { opacity: 0, x: -90, rotate: -2, filter: "blur(8px)" },
        show: base,
        exit: { opacity: 0, x: 60, rotate: 1.5, filter: "blur(5px)" },
      };
    case "slide-right":
      return {
        hidden: { opacity: 0, x: 90, rotate: 2, filter: "blur(8px)" },
        show: base,
        exit: { opacity: 0, x: -60, rotate: -1.5, filter: "blur(5px)" },
      };
    case "tilt-left":
      return {
        hidden: { opacity: 0, y: y * 0.6, rotate: -8, scale: 0.94, filter: "blur(6px)" },
        show: base,
        exit: { opacity: 0, y: -y * 0.4, rotate: -4, scale: 0.97, filter: "blur(4px)" },
      };
    case "tilt-right":
      return {
        hidden: { opacity: 0, y: y * 0.6, rotate: 8, scale: 0.94, filter: "blur(6px)" },
        show: base,
        exit: { opacity: 0, y: -y * 0.4, rotate: 4, scale: 0.97, filter: "blur(4px)" },
      };
    case "swing":
      return {
        hidden: { opacity: 0, x: -40, y: y * 0.4, rotate: -10, filter: "blur(6px)" },
        show: base,
        exit: { opacity: 0, x: 40, y: -y * 0.3, rotate: 10, filter: "blur(4px)" },
      };
    case "pop":
      return {
        hidden: { opacity: 0, scale: 0.72, y: y * 0.4, filter: "blur(8px)" },
        show: base,
        exit: { opacity: 0, scale: 0.85, y: -y * 0.3, filter: "blur(5px)" },
      };
    case "blur":
      return {
        hidden: { opacity: 0, scale: 1.08, filter: "blur(18px)" },
        show: base,
        exit: { opacity: 0, scale: 1.04, filter: "blur(12px)" },
      };
    case "skew":
      return {
        hidden: { opacity: 0, x: -30, skewX: -8, skewY: 2, filter: "blur(6px)" },
        show: base,
        exit: { opacity: 0, x: 30, skewX: 6, skewY: -2, filter: "blur(4px)" },
      };
    case "rise":
    default:
      return {
        hidden: { opacity: 0, y, filter: "blur(8px)" },
        show: base,
        exit: { opacity: 0, y: -y * 0.6, filter: "blur(6px)" },
      };
  }
}

export function Reveal({ children, delay = 0, y = 32, className, as = "div", variant }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  const ref = useRef<HTMLElement>(null);
  const controls = useAnimationControls();
  const isInView = useInView(ref, { margin: "-8% 0px -8% 0px", amount: 0.2 });
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const lastDirection = useRef<"up" | "down" | null>(null);
  const hasPlayedThisPass = useRef(false);

  // If no variant specified, pick a pseudo-random one from delay so each Reveal
  // on the page feels different — creating the "messy" choreography.
  const picked = useMemo<RevealVariant>(() => {
    if (variant) return variant;
    const seed = Math.floor((delay + 0.001) * 1000);
    return VARIANTS[seed % VARIANTS.length];
  }, [variant, delay]);

  const variants = useMemo(() => buildVariants(picked, y), [picked, y]);

  useEffect(() => {
    if (typeof window !== "undefined") lastScrollY.current = window.scrollY;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    if (isInView && lastDirection.current !== "up" && !hasPlayedThisPass.current) {
      controls.start("show");
      hasPlayedThisPass.current = true;
      return;
    }

    const rect = el.getBoundingClientRect();
    if (!isInView && rect.top > window.innerHeight) {
      controls.set("hidden");
      hasPlayedThisPass.current = false;
    }
  }, [controls, isInView, reduce]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window === "undefined" || reduce) return;

    const delta = latest - lastScrollY.current;
    if (Math.abs(delta) < 0.75) return;

    const dir = delta > 0 ? "down" : "up";
    const changedToDown = dir === "down" && lastDirection.current === "up";
    lastDirection.current = dir;
    lastScrollY.current = latest;

    const el = ref.current;
    if (!el) return;

    if (dir === "up") {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        controls.set("hidden");
        hasPlayedThisPass.current = false;
      }
      return;
    }

    if (isInView && (changedToDown || !hasPlayedThisPass.current)) {
      controls.set("hidden");
      controls.start("show");
      hasPlayedThisPass.current = true;
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      controls.set("hidden");
      hasPlayedThisPass.current = false;
    }
  });

  if (reduce) {
    return (
      <MotionTag
        ref={ref as never}
        initial={false}
        animate={{ opacity: 1 }}
        className={className}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      ref={ref as never}
      variants={variants}
      initial="hidden"
      animate={controls}
      transition={{
        duration: 0.95,
        delay,
        ease: [0.22, 1, 0.36, 1],
        // spring-ish for rotation/scale sub-motion
        rotate: { type: "spring", stiffness: 120, damping: 14, delay },
        scale: { type: "spring", stiffness: 140, damping: 16, delay },
      }}
      style={{ willChange: "transform, filter, opacity" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
