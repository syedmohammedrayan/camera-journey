import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import type { ReactNode } from "react";

/**
 * GenZAccents — a fixed, pointer-events-none overlay of messy
 * sticker/tape/doodle elements that parallax + rotate as the user
 * scrolls. Designed to layer between the glass overlay (z-1) and
 * the main content (z-10), so text stays readable while the whole
 * page picks up a crispy, hand-collaged, gen-z editorial vibe.
 */
export function GenZAccents() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const spring = { stiffness: 60, damping: 20, mass: 0.6 };
  const p = useSpring(scrollYProgress, spring);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[6] overflow-hidden"
      style={{ mixBlendMode: "normal" }}
    >
      {/* Washi tape — top-left, drifts up + tilts */}
      <Floater p={p} from={[8, 6]} to={[6, -4]} rotate={[-14, -22]} className="left-[4%] top-[18vh]">
        <Tape colors={["#f6b0bb", "#e88a99"]} width={168} label="ROLL · 01" />
      </Floater>

      {/* Star burst sticker — right rail */}
      <Floater p={p} from={[92, 22]} to={[86, 12]} rotate={[8, 46]} scale={[1, 1.08]} className="right-[4%] top-[26vh]">
        <StarBurst size={116} fill="#f2c266" text="SHOT ✦ ON FILM" />
      </Floater>

      {/* Handwritten arrow doodle mid-left */}
      <Floater p={p} from={[10, 46]} to={[14, 34]} rotate={[-8, 6]} className="left-[6%] top-[50vh]">
        <ScribbleArrow />
      </Floater>

      {/* Quote badge — center-right */}
      <Floater p={p} from={[80, 62]} to={[72, 52]} rotate={[6, -6]} className="right-[8%] top-[62vh]">
        <QuoteChip>“light does the talking”</QuoteChip>
      </Floater>

      {/* Highlighter swipe — bottom left */}
      <Floater p={p} from={[6, 82]} to={[10, 72]} rotate={[-4, -10]} className="left-[3%] top-[84vh]">
        <Highlight color="#8bb26a" width={220}>focus · frame · fire</Highlight>
      </Floater>

      {/* Little polaroid clip — bottom right */}
      <Floater p={p} from={[86, 90]} to={[82, 78]} rotate={[10, -4]} scale={[0.95, 1.05]} className="right-[5%] top-[86vh]">
        <MiniPolaroid />
      </Floater>

      {/* Star sparkle scatter — anchored near mid-top */}
      <Floater p={p} from={[52, 8]} to={[48, -2]} rotate={[0, 120]} className="left-[50%] top-[12vh]">
        <Sparkle size={44} />
      </Floater>

      {/* Circle stamp — right upper */}
      <Floater p={p} from={[88, 72]} to={[92, 60]} rotate={[-12, 22]} className="right-[3%] top-[72vh]">
        <CircleStamp />
      </Floater>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floater: positions a doodle and drives parallax from scroll        */
/* ------------------------------------------------------------------ */
function Floater({
  p,
  from,
  to,
  rotate = [0, 0],
  scale = [1, 1],
  className,
  children,
}: {
  p: MotionValue<number>;
  from: [number, number]; // starting [x%, y-viewport-offset%]
  to: [number, number]; // ending [x%, y-viewport-offset%]
  rotate?: [number, number];
  scale?: [number, number];
  className?: string;
  children: ReactNode;
}) {
  const x = useTransform(p, [0, 1], [`${from[0] - 50}vw`, `${to[0] - 50}vw`]);
  const y = useTransform(p, [0, 1], [`${(from[1] - 50) * 0.6}vh`, `${(to[1] - 50) * 0.6}vh`]);
  const r = useTransform(p, [0, 1], [rotate[0], rotate[1]]);
  const s = useTransform(p, [0, 1], [scale[0], scale[1]]);

  return (
    <motion.div
      style={{ x, y, rotate: r, scale: s, willChange: "transform" }}
      className={"absolute " + (className ?? "")}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Doodles ---------------------------- */

function Tape({ colors, width, label }: { colors: [string, string]; width: number; label: string }) {
  return (
    <div
      className="relative select-none font-mono text-[10px] uppercase tracking-[0.24em]"
      style={{
        width,
        height: 34,
        background: `repeating-linear-gradient(135deg, ${colors[0]} 0 10px, ${colors[1]} 10px 20px)`,
        boxShadow: "0 8px 22px -12px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.35)",
        color: "#3a0a12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.9,
      }}
    >
      <span style={{ mixBlendMode: "multiply" }}>{label}</span>
      <span className="absolute inset-y-0 left-0 w-2" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.18), transparent)" }} />
      <span className="absolute inset-y-0 right-0 w-2" style={{ background: "linear-gradient(270deg, rgba(0,0,0,0.18), transparent)" }} />
    </div>
  );
}

function StarBurst({ size, fill, text }: { size: number; fill: string; text: string }) {
  const points = 12;
  const outer = size / 2;
  const inner = outer * 0.78;
  const path = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    return `${outer + r * Math.cos(a)},${outer + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <div className="relative" style={{ width: size, height: size, filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.18))" }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <polygon points={path} fill={fill} stroke="#1a1208" strokeWidth={1.2} />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
        style={{ color: "#1a1208" }}
      >
        {text}
      </div>
    </div>
  );
}

function ScribbleArrow() {
  return (
    <svg width="120" height="70" viewBox="0 0 120 70" fill="none" style={{ filter: "drop-shadow(0 2px 0 rgba(255,255,255,0.35))" }}>
      <path
        d="M4 46 C 26 8, 58 62, 92 22"
        stroke="#1a1208"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M84 12 L94 22 L82 30" stroke="#1a1208" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function QuoteChip({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-full border px-4 py-2 font-serif text-sm italic"
      style={{
        background: "color-mix(in oklab, #f6f1e4 88%, transparent)",
        borderColor: "rgba(26,18,8,0.25)",
        color: "#1a1208",
        boxShadow: "0 10px 22px -14px rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
      }}
    >
      {children}
    </div>
  );
}

function Highlight({ color, width, children }: { color: string; width: number; children: ReactNode }) {
  return (
    <div
      className="font-mono text-xs font-bold uppercase tracking-[0.2em]"
      style={{
        width,
        padding: "6px 10px",
        background: `linear-gradient(180deg, transparent 45%, ${color} 45%, ${color} 88%, transparent 88%)`,
        color: "#1a1208",
      }}
    >
      {children}
    </div>
  );
}

function MiniPolaroid() {
  return (
    <div
      className="rotate-3"
      style={{
        width: 96,
        padding: 8,
        paddingBottom: 22,
        background: "#f6f1e4",
        boxShadow: "0 14px 28px -18px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          background:
            "linear-gradient(135deg, #c97a5a, #d6a659), radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)",
          backgroundBlendMode: "screen",
        }}
      />
      <div className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "#1a1208" }}>
        f/1.4 · 1/2000
      </div>
    </div>
  );
}

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="#f2c266" stroke="#1a1208" strokeWidth="0.8" />
    </svg>
  );
}

function CircleStamp() {
  return (
    <div
      className="flex h-20 w-20 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.16em]"
      style={{
        borderColor: "#c97a5a",
        color: "#c97a5a",
        background: "color-mix(in oklab, #f6f1e4 65%, transparent)",
        transform: "rotate(-8deg)",
        textAlign: "center",
        boxShadow: "0 6px 16px -10px rgba(0,0,0,0.4)",
      }}
    >
      APPROVED<br />· 24 ·<br />FRAMES
    </div>
  );
}
