import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { useMotionValueEvent } from "motion/react";
import { Reveal } from "@/components/journey/Reveal";
import { ParallaxImage } from "@/components/journey/ParallaxImage";
import { Parallax } from "@/components/journey/Parallax";
import { ViewfinderFrame } from "@/components/journey/ViewfinderFrame";
import { GenZAccents } from "@/components/journey/GenZAccents";

import { ThemeToggle } from "@/components/journey/ThemeToggle";
import { ContactSection } from "@/components/journey/ContactSection";

/* Real photography — Unsplash, sized per breakpoint */
const IMG = {
  hero: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=2000&q=80&auto=format&fit=crop",
  lensFront: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=1400&q=80&auto=format&fit=crop",
  lensSide: "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=1200&q=80&auto=format&fit=crop",
  lensMacro: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=1200&q=80&auto=format&fit=crop",
  aperture: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80&auto=format&fit=crop",
  glass: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=1400&q=80&auto=format&fit=crop",
  glassMacro: "https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?w=1200&q=80&auto=format&fit=crop",
  shutter: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=1400&q=80&auto=format&fit=crop",
  focus: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1200&q=80&auto=format&fit=crop",
  sensor: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80&auto=format&fit=crop",
  chip: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=1400&q=80&auto=format&fit=crop",
  raw: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80&auto=format&fit=crop",
  rawGraded: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=80&auto=format&fit=crop",
  swatch: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80&auto=format&fit=crop",
  hdrDark: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&q=80&auto=format&fit=crop",
  hdrBright: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1400&q=80&auto=format&fit=crop",
  final: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80&auto=format&fit=crop",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Journey Inside a Camera — From light to photograph" },
      {
        name: "description",
        content:
          "A scroll-driven editorial tracing the path of light through a camera — lens, aperture, shutter, sensor, ISP and final photograph.",
      },
      { property: "og:title", content: "Journey Inside a Camera" },
      { property: "og:description", content: "The path of light from lens to final photograph, told as a scrolling editorial." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: IMG.hero },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Journey Inside a Camera" },
      { name: "twitter:description", content: "The path of light from lens to final photograph." },
      { name: "twitter:image", content: IMG.hero },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Page,
});

const SECTIONS = [
  { id: "lens", index: "01", label: "Lens" },
  { id: "aperture", index: "02", label: "Aperture" },
  { id: "glass", index: "03", label: "Glass" },
  { id: "shutter", index: "04", label: "Shutter & Focus" },
  { id: "sensor", index: "05", label: "Sensor" },
  { id: "isp", index: "06", label: "ISP" },
  { id: "raw", index: "07", label: "RAW" },
  { id: "color", index: "08", label: "Color" },
  { id: "hdr", index: "09", label: "HDR" },
  { id: "final", index: "10", label: "Photograph" },
];

function Page() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <TopBar />
      
      <ScrollLightBeam />
      <BackgroundWash />
      <GlassOverlay />
      <GenZAccents />
      <main id="main-content" className="relative z-10 min-h-screen text-foreground antialiased">

        <Hero />
        <LensSection />
        <ApertureSection />
        <GlassSection />
        <ShutterSection />
        <SensorSection />
        <IspSection />
        <RawSection />
        <ColorSection />
        <HdrSection />
        <FinalSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}

/* ============================================================
   Global scroll-progress light beam — travels down the viewport
============================================================ */
function ScrollLightBeam() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const top = useTransform(scrollYProgress, [0, 1], ["-20%", "110%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.9, 0.9, 0]);
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      style={{ top, opacity }}
      className="pointer-events-none fixed left-0 right-0 z-[5] h-[26vh] blur-2xl bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-brass)_45%,transparent),transparent_70%)]"
    />
  );
}

/* ============================================================
   Background wash — soft sage + brass gradients, film grain
============================================================ */
function BackgroundWash() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();

  // Whole-page background drift — slowest layer of all
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Cinematic nature photography backdrop — the world photographers chase.
  // Layer 1: dawn mist through pine forest (Lens / Glass / Light — cool, atmospheric)
  // Layer 2: golden-hour mountain ridge (Sensor / ISP / RAW — technical, warm)
  // Layer 3: sunlit dunes + sky (Color / HDR / Photograph — bright, resolved)
  const bg1 =
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80"; // misty pine forest, sun rays
  const bg2 =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80"; // golden mountain ridge at sunset
  const bg3 =
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80"; // sunlit valley + soft sky

  // Cross-fade opacities across the scroll
  const op1 = useTransform(scrollYProgress, [0, 0.28, 0.42], [1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.28, 0.5, 0.72], [0, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0.6, 0.78, 1], [0, 1, 1]);

  // Slow Ken-Burns drift + zoom for each nature layer
  const kbY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const kbScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);

  // Dark-mode aurora: scroll-driven position + hue shifts.
  const auroraX = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], ["10%", "70%", "25%", "80%", "40%"]);
  const auroraY = useTransform(scrollYProgress, [0, 0.5, 1], ["8%", "60%", "30%"]);
  const auroraHue = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const auroraFilter = useTransform(auroraHue, (h) => `hue-rotate(${h}deg) saturate(1.15)`);

  const beamX = useTransform(scrollYProgress, [0, 1], ["-20%", "40%"]);
  const beamHue = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const beamFilter = useTransform(beamHue, (h) => `hue-rotate(${h}deg)`);

  const glowRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const natureLayer = (src: string, opacity: typeof op1) => (
    <motion.div
      style={
        reduce
          ? { opacity, backgroundImage: `url(${src})` }
          : { opacity, y: kbY, scale: kbScale, backgroundImage: `url(${src})`, willChange: "transform, opacity" }
      }
      className="absolute inset-0 bg-cover bg-center"
    />
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Nature photography backdrop — cross-fading Ken-Burns layers */}
      <div className="absolute inset-0">
        {natureLayer(bg1, op1)}
        {natureLayer(bg2, op2)}
        {natureLayer(bg3, op3)}
      </div>

      {/* Dark-mode aurora — layered over the nature photo for cinematic mood */}
      <motion.div
        style={reduce ? undefined : { x: auroraX, y: auroraY, filter: auroraFilter, willChange: "transform, filter" }}
        className="dark-only absolute -left-1/4 -top-1/4 h-[110vh] w-[110vh] rounded-full blur-3xl opacity-60 mix-blend-screen bg-[radial-gradient(circle_at_center,#d6a659_0%,#c97a5a_35%,transparent_70%)]"
      />
      <motion.div
        style={reduce ? undefined : { x: beamX, filter: beamFilter, willChange: "transform, filter" }}
        className="dark-only absolute -right-1/3 top-1/3 h-[90vh] w-[120vh] rounded-full blur-3xl opacity-50 mix-blend-screen bg-[radial-gradient(circle_at_center,#6c8b6a_0%,#3a6e8c_45%,transparent_75%)]"
      />
      <motion.div
        style={reduce ? undefined : { rotate: glowRotate, willChange: "transform" }}
        className="dark-only absolute left-1/2 top-1/2 h-[140vh] w-[140vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-25 mix-blend-screen bg-[conic-gradient(from_120deg,transparent_0deg,#d6a659_60deg,transparent_140deg,#8a6cc2_200deg,transparent_280deg,#dc8767_340deg,transparent_360deg)]"
      />

      {/* Light-mode gradient tints — soft warmth over the photograph */}
      <motion.div
        style={reduce ? undefined : { y: y1 }}
        className="absolute inset-x-0 -top-[20%] h-[140%] mix-blend-soft-light opacity-80 bg-[radial-gradient(60%_50%_at_15%_10%,color-mix(in_oklab,var(--color-sage)_35%,transparent),transparent_60%),radial-gradient(50%_40%_at_90%_30%,color-mix(in_oklab,var(--color-brass)_32%,transparent),transparent_70%),radial-gradient(60%_50%_at_50%_100%,color-mix(in_oklab,var(--color-clay)_25%,transparent),transparent_70%)] dark-hide"
      />
      <motion.div
        style={reduce ? undefined : { y: y2 }}
        className="absolute inset-x-0 -top-[10%] h-[130%] mix-blend-soft-light opacity-70 bg-[radial-gradient(40%_30%_at_80%_70%,color-mix(in_oklab,var(--color-sage-deep)_25%,transparent),transparent_70%),radial-gradient(40%_30%_at_20%_60%,color-mix(in_oklab,var(--color-brass)_22%,transparent),transparent_70%)] dark-hide"
      />
    </div>
  );
}

/* ============================================================
   Glass overlay — full-page frosted glass between the nature
   backdrop and the site content. Blurs the photo, tints with
   the theme so text/cards stay premium and readable.
============================================================ */
function GlassOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden backdrop-blur-[5px] backdrop-saturate-150 backdrop-contrast-110 backdrop-brightness-105"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--color-background) 19%, transparent) 0%, color-mix(in oklab, var(--color-background) 15%, transparent) 45%, color-mix(in oklab, var(--color-background) 22%, transparent) 100%)",
      }}
    >
      {/* crystal prism sheen — faint chromatic highlight sliding across the sheet */}
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, transparent 38%, rgba(255,255,255,0.10) 46%, rgba(190,215,255,0.06) 50%, rgba(255,220,180,0.08) 54%, transparent 62%, transparent 100%)",
        }}
      />
      {/* top gloss — the light catching the top edge of a glass pane */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)",
        }}
      />
      {/* subtle edge vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,color-mix(in_oklab,var(--color-background)_18%,transparent)_100%)]" />
      {/* micro grain — keeps the crystal from looking plastic */}
      <div className="absolute inset-0 grain opacity-20" />
      {/* hairline top+bottom edges — the glass "sheet" */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
    </div>

  );
}



/* ============================================================
   Chrome
============================================================ */
function TopBar() {
  const tickerItems = [
    "VOL. 07",
    "OPTICS × SILICON",
    "f/1.4 · 1/8000s",
    "ISO 100 → 25600",
    "10 CHAPTERS",
    "SCROLL TO ROLL",
    "PHOTON → PIXEL",
  ];
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    if (y < 20) setHidden(false);
    else if (delta > 4) setHidden(true);
    else if (delta < -4) setHidden(true); // hide on any scroll movement
    lastY.current = y;
  });
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-10"
      animate={{ y: hidden ? "-140%" : "0%", opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 rounded-full border border-foreground/20 bg-background/45 py-1.5 pl-1.5 pr-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-2xl backdrop-saturate-150 sm:gap-3 sm:py-2 sm:pl-2 sm:pr-3">
        {/* Brand mark: rotating aperture ring + wordmark */}
        <a href="#top" className="group flex min-w-0 items-center gap-2 rounded-full pl-1 pr-2 sm:gap-2.5">
          <span className="relative grid h-8 w-8 shrink-0 place-items-center sm:h-9 sm:w-9">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border border-brass/70"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(200,155,74,0.9) 60deg, transparent 140deg, rgba(200,155,74,0.55) 220deg, transparent 320deg)",
                WebkitMask: "radial-gradient(circle, transparent 55%, black 56%)",
                mask: "radial-gradient(circle, transparent 55%, black 56%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 9, ease: "linear", repeat: Infinity }}
            />
            <span className="absolute inset-[3px] rounded-full border border-foreground/20 bg-background/80" />
            <motion.span
              className="relative block h-1.5 w-1.5 rounded-full bg-brass shadow-[0_0_10px_rgba(200,155,74,0.9)]"
              animate={{ scale: [1, 1.4, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <div className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="font-display text-[13px] font-semibold tracking-tight text-foreground">
              Aperture<span className="text-brass">/</span>Journal
            </span>
            <span className="mt-0.5 font-mono text-[9px] font-semibold tracking-[0.24em]" style={{ color: "var(--color-brass-deep)" }}>
              A STUDY OF LIGHT
            </span>
          </div>
          <span className="font-display text-[13px] font-semibold text-foreground sm:hidden">
            A<span className="text-brass">/</span>J
          </span>
        </a>

        {/* Live ticker */}
        <div className="relative hidden min-w-0 flex-1 items-center overflow-hidden rounded-full border border-foreground/15 bg-background/30 backdrop-blur-xl md:flex">
          <span className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-background/70 to-transparent" />
          <span className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-background/70 to-transparent" />
          <span className="relative z-20 ml-2 flex shrink-0 items-center gap-1.5 rounded-full bg-background/50 px-2 py-1 backdrop-blur">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-clay shadow-[0_0_8px_rgba(220,135,103,0.9)]"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <span className="font-mono text-[9px] font-bold tracking-[0.22em] text-foreground">LIVE</span>
          </span>
          <motion.div
            className="flex shrink-0 items-center gap-6 py-1.5 pl-4 pr-4 font-mono text-[10px] font-bold tracking-[0.22em] text-foreground"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {[...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="flex items-center gap-6 whitespace-nowrap">
                <span>{t}</span>
                <span className="text-brass/80">✦</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href="#contact"
            className="group hidden items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-background transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            CONTACT
            <span className="grid h-4 w-4 place-items-center rounded-full bg-brass text-[9px] text-ink transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}


function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-10 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 text-xs text-foreground/50 md:flex-row md:items-center">
        <span className="mono-label">© Aperture Journal · Vol. 07</span>
        <span className="italic">An editorial study of the photographic instrument.</span>
        <a href="#top" className="mono-label hover:text-clay">
          Return to top ↑
        </a>
      </div>
    </footer>
  );
}

/* ============================================================
   Reusable pieces
============================================================ */
function SectionShell({
  id,
  index,
  kicker,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32 lg:px-14"
    >
      <Parallax speed={-0.4}>
        <div className="mb-10 flex items-baseline gap-4">
          <span className="font-mono text-xs font-bold tracking-[0.28em]" style={{ color: "#6b3e0a" }}>{index}</span>
          <span className="h-px flex-1 hairline" />
          <span className="mono-label font-bold" style={{ color: "#6b3e0a" }}>{kicker}</span>
        </div>
      </Parallax>
      {children}
    </section>
  );
}

function PolaroidCard({
  src,
  alt,
  caption,
  rotate = "-1.5deg",
  className = "",
  eager,
  intensity,
  hasTape,
  speed,
}: {
  src: string;
  alt: string;
  caption?: string;
  rotate?: string;
  className?: string;
  eager?: boolean;
  intensity?: number;
  hasTape?: boolean;
  speed?: number;
}) {
  // Derive a deterministic parallax speed from rotation so a cluster of cards
  // naturally moves at different rates — foreground cards drift faster.
  const derived = speed ?? 0.25 + Math.min(0.5, Math.abs(parseFloat(rotate)) / 20);
  return (
    <Parallax speed={derived} className={className}>
      <div
        className={`polaroid ${hasTape ? "tape" : ""} relative`}
        style={{ transform: `rotate(${rotate})` }}
      >
        <ParallaxImage
          src={src}
          alt={alt}
          eager={eager}
          intensity={intensity ?? 0.32}
          className="aspect-[4/5] w-full"
        />
        {caption && (
          <p className="mt-3 text-center font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft/70">
            {caption}
          </p>
        )}
      </div>
    </Parallax>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full p-[1px] transition-transform hover:-translate-y-0.5">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-80 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from 140deg, rgba(200,155,74,0.9), rgba(220,135,103,0.4), rgba(108,139,106,0.6), rgba(200,155,74,0.9))",
        }}
      />
      <span className="relative inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.22em] uppercase text-foreground/85 backdrop-blur">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-brass shadow-[0_0_8px_rgba(200,155,74,0.9)]"
          animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {children}
        <span className="pointer-events-none absolute inset-y-0 -left-8 w-8 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/15 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100" />
      </span>
    </span>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-background/40 p-4 backdrop-blur">
      <div className="mono-label mb-1">{k}</div>
      <div className="font-display text-xl text-foreground">{v}</div>
    </div>
  );
}

/* ============================================================
   HERO
============================================================ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Multi-layer parallax — background moves slow, foreground fast
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yFg = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const yBody = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden pb-20 pt-44 md:pt-52">
      {/* BG layer — slowest */}
      {/* Midground floating polaroids — sit BEHIND the orange hero card, peeking from its edges */}
      <motion.div
        style={reduce ? undefined : { y: yMid, opacity }}
        aria-hidden
        className="absolute top-20 right-[3%] z-[1] hidden w-40 md:block lg:top-24 lg:w-56 will-change-transform"
      >
        <div className="polaroid shadow-2xl" style={{ transform: "rotate(6deg)" }}>
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <img src={IMG.lensMacro} alt="" className="h-full w-full object-cover" />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft/70">f/1.4 · 35mm</p>
        </div>
      </motion.div>
      <motion.div
        style={reduce ? undefined : { y: yFg, opacity }}
        aria-hidden
        className="absolute top-72 left-[3%] z-[1] hidden w-36 md:block lg:top-80 lg:w-48 will-change-transform"
      >
        <div className="polaroid tape relative shadow-2xl" style={{ transform: "rotate(-8deg)" }}>
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <img src={IMG.aperture} alt="" className="h-full w-full object-cover" />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft/70">Aperture blades</p>
        </div>
      </motion.div>

      {/* Orange hero card — sits ABOVE the polaroids so they peek from behind */}
      <motion.div
        style={reduce ? undefined : { y: yBg, scale }}
        className="absolute inset-x-0 top-32 md:top-40 z-[2] mx-auto h-[65vh] w-[92%] max-w-6xl overflow-hidden rounded-3xl shadow-2xl will-change-transform"
      >
        <img
          src={IMG.hero}
          alt="Vintage 35mm camera lens catching studio light"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/60" />
      </motion.div>


      {/* Foreground text — centered within the orange stage */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center lg:px-14">
        <motion.div style={reduce ? undefined : { y: yTitle }} className="flex justify-center">
          <Reveal delay={0.08}>
            <ViewfinderFrame padding="px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-col items-center text-center">
                <h1
                  id="hero-title"
                  className="title-display max-w-4xl text-[12vw] text-foreground sm:text-[8vw] lg:text-[6.5vw]"
                >
                  Journey <span className="title-serif">Inside</span> <br />
                  a Camera.
                </h1>
                <Reveal delay={0.16}>
                  <p className="hero-subtitle mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed md:text-lg">
                    A scroll through the instrument. From the first photon on the front element to the
                    image that finally leaves the chip — this is what happens in a fraction of a second.
                  </p>
                </Reveal>
              </div>
            </ViewfinderFrame>
          </Reveal>
        </motion.div>
        <motion.div style={reduce ? undefined : { y: yBody }} className="w-full">
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#lens"
                className="cta-primary group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Begin the journey
                <span className="cta-primary__chip grid h-7 w-7 place-items-center rounded-full text-[13px] font-black transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>

              <span className="hero-meta font-mono text-[11px] font-bold tracking-[0.24em]">
                10 CHAPTERS · ~4 MIN READ
              </span>
            </div>
          </Reveal>

        </motion.div>
      </div>


    </section>
  );
}

/* ============================================================
   01 · LENS  (expanded content — how light enters)
============================================================ */
function LensSection() {
  return (
    <SectionShell id="lens" index="01" kicker="Chapter I · The Lens">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="lens-title" className="title-display text-4xl sm:text-5xl md:text-6xl">
              Where the <span className="title-serif" style={{color:"var(--color-clay)"}}>light</span> begins.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-md text-foreground/75">
              Every photograph starts as scattered light bouncing off the world. The lens is the
              first appointment — a machined tube of glass and metal that gathers those photons
              and gives them a direction.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 max-w-md text-foreground/70">
              Focal length decides how much of the scene squeezes onto the sensor. Aperture
              decides how much light gets through. Together they set the mood of the image
              before any pixel is ever recorded.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
              <Stat k="Focal length" v="35 mm" />
              <Stat k="Max aperture" v="f / 1.4" />
              <Stat k="Elements" v="11 / 9 groups" />
              <Stat k="Filter thread" v="Ø 67 mm" />
            </div>
          </Reveal>
        </div>

        {/* Messy card cluster */}
        <div className="relative space-y-6 lg:col-span-7 lg:min-h-[560px] lg:space-y-0">
          <Reveal className="lg:absolute lg:left-2 lg:top-0 lg:w-[55%] max-w-sm mx-auto lg:mx-0">
            <PolaroidCard src={IMG.lensFront} alt="Front element of a prime lens" rotate="-3deg" caption="Front element · coated" eager />
          </Reveal>
          <Reveal delay={0.1} className="lg:absolute lg:right-0 lg:top-14 lg:w-[48%] max-w-xs mx-auto lg:mx-0">
            <PolaroidCard src={IMG.lensSide} alt="Lens side profile" rotate="5deg" caption="35mm · f/1.4" hasTape />
          </Reveal>
          <Reveal delay={0.2} className="lg:absolute lg:bottom-0 lg:left-16 lg:w-[52%] max-w-sm mx-auto lg:mx-0">
            <PolaroidCard src={IMG.lensMacro} alt="Macro reflection inside lens" rotate="-6deg" caption="Internal reflection" />
          </Reveal>
          <Reveal delay={0.28} className="hidden lg:absolute lg:-bottom-4 lg:right-6 lg:block lg:w-40">
            <div className="rotate-3 rounded-xl border border-hairline bg-card p-4 shadow-lg">
              <div className="mono-label mb-1">Note</div>
              <p className="text-xs italic text-foreground/70">
                "Glass has memory. Every coating you see was engineered against a specific
                wavelength."
              </p>
            </div>
          </Reveal>
        </div>

      </div>
    </SectionShell>
  );
}

/* ============================================================
   02 · APERTURE  (new section)
============================================================ */
function ApertureSection() {
  return (
    <SectionShell id="aperture" index="02" kicker="Chapter II · Aperture">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="relative lg:col-span-7 lg:min-h-[420px]">
          <Reveal className="lg:absolute lg:inset-0">
            <div className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-hairline sm:h-[420px] lg:h-full">
              <ParallaxImage
                src={IMG.aperture}
                alt="Iris of a lens showing aperture blades"
                className="h-full"
                intensity={0.22}
              />
              {/* Aperture blades SVG overlay */}
              <svg
                aria-hidden
                viewBox="0 0 200 200"
                className="absolute inset-0 m-auto h-40 w-40 mix-blend-overlay opacity-70 sm:h-56 sm:w-56 md:h-64 md:w-64"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <polygon
                    key={i}
                    points="100,20 130,100 100,120 70,100"
                    fill="none"
                    stroke="#c79a4a"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 40} 100 100)`}
                  />
                ))}
                <circle cx="100" cy="100" r="22" fill="none" stroke="#c79a4a" strokeWidth="1.2" />
              </svg>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-6 max-w-sm mx-auto lg:mx-0 lg:mt-0 lg:absolute lg:-bottom-8 lg:right-6 lg:w-56">
            <div className="rotate-[-4deg] rounded-2xl p-5 shadow-xl" style={{ backgroundColor: "#f6b0bb", color: "#2a0a10" }}>
              <div className="mono-label" style={{ color: "#7a1a2a" }}>Depth of field</div>
              <p className="mt-2 text-sm leading-snug">
                A wider aperture keeps only a thin sliver of the world in focus. Everything else
                melts.
              </p>
            </div>
          </Reveal>
        </div>


        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="aperture-title" className="title-display text-4xl sm:text-5xl md:text-6xl">
              An iris of <span className="title-serif" style={{color:"var(--color-sage-deep)"}}>nine blades</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-foreground/75">
              Behind the front element, a set of overlapping metal leaves opens and closes like a
              mechanical eye. This is the aperture — it decides how much light survives the trip.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 text-foreground/70">
              Open it wide and the shot floods with brightness and creamy background blur. Close
              it down and the scene sharpens from foreground to horizon. Every f-stop is a
              conversation between light and geometry.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-2">
              {["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-foreground/25 px-3 py-1 font-mono text-xs text-foreground/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

/* ============================================================
   03 · GLASS
============================================================ */
function GlassSection() {
  return (
    <SectionShell id="glass" index="03" kicker="Chapter III · Glass Elements">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="glass-title" className="title-display text-4xl sm:text-5xl md:text-6xl">
              Shaped by <span className="title-serif">glass</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-foreground/75">
              Inside the barrel, a stack of precisely-ground elements refracts the light again and
              again. Convex, concave, aspheric — each surface corrects a specific fault of the
              one before it.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <ul className="mt-6 space-y-2 text-sm text-foreground/70">
              <li className="flex gap-3"><span className="mono-label !text-clay">01</span> Chromatic aberration is nudged back into alignment.</li>
              <li className="flex gap-3"><span className="mono-label !text-clay">02</span> Coma and distortion are quietly corrected.</li>
              <li className="flex gap-3"><span className="mono-label !text-clay">03</span> Coatings kill the flare that would wash out contrast.</li>
            </ul>
          </Reveal>
        </div>

        <div className="relative space-y-6 lg:col-span-7 lg:min-h-[520px] lg:space-y-0">
          <Reveal className="lg:absolute lg:right-0 lg:top-0 lg:w-[60%] max-w-md mx-auto lg:mx-0">
            <PolaroidCard src={IMG.glass} alt="Stack of optical glass elements" rotate="4deg" caption="Optical stack" />
          </Reveal>
          <Reveal delay={0.12} className="lg:absolute lg:left-2 lg:top-24 lg:w-[46%] max-w-xs mx-auto lg:mx-0">
            <PolaroidCard src={IMG.glassMacro} alt="Macro view of glass surface" rotate="-5deg" caption="Aspheric surface" hasTape />
          </Reveal>
          <Reveal delay={0.22} className="lg:absolute lg:-bottom-2 lg:right-14 lg:w-[42%] max-w-xs mx-auto lg:mx-0">
            <div className="rotate-2 rounded-2xl border border-hairline bg-card p-5">
              <div className="mono-label">Coating</div>
              <p className="mt-2 text-xs text-foreground/70">
                Nano-thin layers of magnesium fluoride cancel unwanted reflections between elements.
              </p>
              <div className="mt-4 flex gap-1">
                {["#8aa688", "#c79a4a", "#c97a5a", "#5f7a5e"].map((c) => (
                  <span key={c} className="h-3 flex-1 rounded" style={{ background: c }} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </SectionShell>
  );
}

/* ============================================================
   04 · SHUTTER & FOCUS  (new section — inner processing)
============================================================ */
function ShutterSection() {
  return (
    <SectionShell id="shutter" index="04" kicker="Chapter IV · Shutter & Focus">
      <div className="grid gap-8 md:grid-cols-6">
        <Reveal className="md:col-span-4 md:col-start-1">
          <div className="relative overflow-hidden rounded-3xl border border-hairline bg-card">
            <ParallaxImage
              src={IMG.shutter}
              alt="Camera shutter mechanism"
              className="aspect-[16/10] w-full"
              intensity={0.2}
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="mono-label !text-ivory/80">1 / 8000 s</div>
              <p className="mt-1 max-w-md text-ivory">The curtain opens, the sensor is briefly exposed, and the curtain closes.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-2 md:col-start-5 md:row-start-1 md:mt-16">
          <PolaroidCard src={IMG.focus} alt="Focus ring on lens" rotate="5deg" caption="AF · phase detect" hasTape />
        </Reveal>

        <div className="md:col-span-6 grid gap-6 md:grid-cols-2 mt-6">
          <Reveal>
            <div className="rounded-2xl bg-ink p-6 text-ivory">
              <div className="mono-label !text-brass">Focus</div>
              <h3 className="mt-2 font-display text-2xl">Finding the plane of sharpness.</h3>
              <p className="mt-3 text-sm text-ivory/75">
                A small motor nudges an internal glass group forward and back. Autofocus sensors
                measure phase and contrast dozens of times a second until the subject snaps into
                agreement with the image plane.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-hairline bg-background/60 p-6 backdrop-blur">
              <div className="mono-label">Shutter</div>
              <h3 className="mt-2 font-display text-2xl text-foreground">The exposure window.</h3>
              <p className="mt-3 text-sm text-foreground/75">
                Two curtains chase each other across the sensor. The slit between them decides how
                long each pixel gets to drink light — from a slow thirty-second breath to a
                one-eight-thousandth-of-a-second flinch.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

/* ============================================================
   05 · SENSOR
============================================================ */
function SensorSection() {
  return (
    <SectionShell id="sensor" index="05" kicker="Chapter V · The Sensor">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="relative lg:col-span-7 lg:min-h-[520px]">
          <Reveal className="lg:absolute lg:inset-0">
            <div className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-hairline sm:h-[420px] lg:h-[520px]">
              <ParallaxImage src={IMG.sensor} alt="CMOS sensor macro" className="h-full" intensity={0.22} />
              {/* Bayer grid overlay */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(199,154,74,0.35) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(138,166,136,0.35) 0 1px, transparent 1px 22px)",
                }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.18} className="mt-6 max-w-sm mx-auto lg:mx-0 lg:mt-0 lg:absolute lg:-bottom-6 lg:left-6 lg:w-56">
            <div className="rotate-[-3deg] rounded-2xl bg-sage p-5 text-ink shadow-xl">
              <div className="mono-label !text-ink/70">Full-frame · 24.2 MP</div>
              <p className="mt-2 text-sm">Each photosite counts photons and returns a number.</p>
            </div>
          </Reveal>
        </div>


        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="sensor-title" className="title-display text-4xl sm:text-5xl md:text-6xl">
              Light becomes <span className="title-serif" style={{color:"var(--color-sage-deep)"}}>signal</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-foreground/75">
              The sensor is a grid of millions of tiny wells. Each one accumulates a charge in
              proportion to the light it receives. A checkerboard of red, green and blue filters
              — the Bayer array — tells the camera which color each well was drinking.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Stat k="Type" v="CMOS · BSI" />
              <Stat k="Resolution" v="6000 × 4000" />
              <Stat k="Pixel pitch" v="5.94 μm" />
              <Stat k="Dynamic range" v="14.6 EV" />
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

/* ============================================================
   06 · ISP
============================================================ */
function IspSection() {
  return (
    <SectionShell id="isp" index="06" kicker="Chapter VI · Image Signal Processor">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="isp-title" className="title-display text-4xl sm:text-5xl md:text-6xl">
              The silent <span className="title-serif" style={{color:"var(--color-clay)"}}>interpreter</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-foreground/75">
              Raw sensor data is not yet a photograph — it's a mosaic of monochrome brightness
              values. The image signal processor is a dedicated chip that assembles those values
              into color, in real time, before you've even lifted your finger off the shutter.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <ol className="mt-8 space-y-3 text-sm">
              {[
                ["Demosaic", "Infer full RGB at every pixel from the Bayer pattern."],
                ["Denoise", "Separate genuine detail from thermal and read noise."],
                ["White balance", "Neutralize the color of the light source."],
                ["Sharpen", "Restore acuity lost to the anti-alias filter."],
              ].map(([k, v], i) => (
                <li key={k} className="flex gap-4 rounded-lg border border-hairline bg-background/40 p-3 backdrop-blur">
                  <span className="mono-label !text-brass-deep">0{i + 1}</span>
                  <div>
                    <div className="font-display text-base text-foreground">{k}</div>
                    <div className="text-foreground/65">{v}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <div className="relative space-y-6 lg:col-span-7 lg:min-h-[520px] lg:space-y-0">
          <Reveal className="lg:absolute lg:right-0 lg:top-0 lg:w-[70%] max-w-lg mx-auto lg:mx-0">
            <PolaroidCard src={IMG.chip} alt="Camera processor die" rotate="-3deg" caption="ISP · dedicated silicon" />
          </Reveal>
          <Reveal delay={0.12} className="lg:absolute lg:-bottom-2 lg:left-0 lg:w-[55%] max-w-sm mx-auto lg:mx-0">
            <div className="-rotate-2 rounded-2xl border border-hairline bg-card p-5">
              <div className="mono-label">Pipeline</div>
              <svg viewBox="0 0 200 60" className="mt-3 h-16 w-full">
                <polyline
                  points="0,45 20,42 40,20 60,32 80,10 100,28 120,15 140,38 160,20 180,30 200,18"
                  fill="none"
                  stroke="var(--color-brass)"
                  strokeWidth="1.5"
                />
                <polyline
                  points="0,50 20,48 40,35 60,44 80,30 100,42 120,32 140,48 160,36 180,42 200,34"
                  fill="none"
                  stroke="var(--color-sage-deep)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              </svg>
              <p className="mt-3 text-xs text-foreground/60">
                Waveform of a single line — noise floor beneath, signal above.
              </p>
            </div>
          </Reveal>
        </div>

      </div>
    </SectionShell>
  );
}

/* ============================================================
   07 · RAW
============================================================ */
function RawSection() {
  return (
    <SectionShell id="raw" index="07" kicker="Chapter VII · RAW">
      <Reveal>
        <h2 id="raw-title" className="max-w-3xl title-display text-4xl sm:text-5xl md:text-6xl">
          Data, not yet a <span className="title-serif">photograph</span>.
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="mt-6 max-w-xl text-foreground/75">
          A RAW file is the sensor's honest report — flat, unclipped, and slightly gray. Every
          decision about how the image should look is still on the table.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-hairline">
            <img src={IMG.raw} alt="Unprocessed RAW capture — flat and neutral" className="aspect-[4/3] w-full object-cover saturate-50 brightness-95 contrast-90" loading="lazy" />
            <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/75 backdrop-blur">
              RAW · 14-bit
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl border border-hairline">
            <img src={IMG.rawGraded} alt="Graded, processed version of the same scene" className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <span className="absolute left-4 top-4 rounded-full bg-clay px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ivory">
              Graded
            </span>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

/* ============================================================
   08 · COLOR
============================================================ */
function ColorSection() {
  const swatches = ["#efe9dc", "#c97a5a", "#c79a4a", "#8aa688", "#5f7a5e", "#14201a"];
  return (
    <SectionShell id="color" index="08" kicker="Chapter VIII · Color Processing">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="color-title" className="title-display text-4xl sm:text-5xl md:text-6xl">
              Numbers into <span className="title-serif" style={{color:"var(--color-clay)"}}>color</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-foreground/75">
              A color profile maps the sensor's native response onto human vision. Then a tone
              curve pulls midtones up, tucks shadows down, and gives the image the personality
              the maker intended.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 flex overflow-hidden rounded-full border border-hairline">
              {swatches.map((c) => (
                <span key={c} className="h-8 flex-1" style={{ background: c }} title={c} />
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7">
          <Reveal>
            <div className="rounded-2xl border border-hairline bg-card p-6">
              <div className="mono-label mb-4">Tone Curve</div>
              <svg viewBox="0 0 300 180" className="h-64 w-full">
                <defs>
                  <linearGradient id="tc" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#14201a" />
                    <stop offset="0.5" stopColor="#c79a4a" />
                    <stop offset="1" stopColor="#efe9dc" />
                  </linearGradient>
                </defs>
                {/* grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={`h${i}`} x1="0" x2="300" y1={i * 45} y2={i * 45} stroke="rgba(20,32,26,0.08)" />
                ))}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line key={`v${i}`} x1={i * 50} x2={i * 50} y1="0" y2="180" stroke="rgba(20,32,26,0.08)" />
                ))}
                {/* reference diagonal */}
                <line x1="0" y1="180" x2="300" y2="0" stroke="rgba(20,32,26,0.25)" strokeDasharray="3 4" />
                {/* the curve */}
                <path
                  d="M0,170 C60,150 90,100 150,80 C210,60 240,25 300,10"
                  fill="none"
                  stroke="url(#tc)"
                  strokeWidth="3"
                />
              </svg>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-foreground/65">
                <div><div className="mono-label">Shadows</div>-0.4 EV</div>
                <div><div className="mono-label">Midtones</div>+0.2 EV</div>
                <div><div className="mono-label">Highlights</div>-0.1 EV</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-6">
            <PolaroidCard src={IMG.swatch} alt="Fabric swatches in warm and sage tones" rotate="-2deg" caption="Palette study" className="max-w-sm" />
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

/* ============================================================
   09 · HDR
============================================================ */
function HdrSection() {
  return (
    <SectionShell id="hdr" index="09" kicker="Chapter IX · High Dynamic Range">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <h2 id="hdr-title" className="title-display text-4xl sm:text-5xl md:text-6xl">
              Holding shadow and <span className="title-serif" style={{color:"var(--color-sage-deep)"}}>highlight</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-foreground/75">
              Real scenes carry far more contrast than any sensor can capture in a single frame.
              HDR stitches multiple exposures — or a single deep-well capture — into an image
              where the sun and the shadow both keep their detail.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-hairline">
              <img src={IMG.hdrDark} alt="Under-exposed frame preserving highlight detail" className="aspect-[4/5] w-full object-cover brightness-75" loading="lazy" />
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-[10px] tracking-widest text-ivory">-2 EV</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-2xl border border-hairline mt-8">
              <img src={IMG.hdrBright} alt="Over-exposed frame preserving shadow detail" className="aspect-[4/5] w-full object-cover brightness-125" loading="lazy" />
              <span className="absolute bottom-3 left-3 rounded-full bg-brass/90 px-3 py-1 font-mono text-[10px] tracking-widest text-ink">+2 EV</span>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

/* ============================================================
   10 · FINAL
============================================================ */
function FinalSection() {
  return (
    <section id="final" aria-labelledby="final-title" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto mb-10 flex max-w-7xl items-baseline gap-4 px-5 sm:px-8 lg:px-14">
        <span className="font-mono text-xs tracking-[0.28em] text-brass-deep">10</span>
        <span className="h-px flex-1 hairline" />
        <span className="mono-label">Chapter X · The Photograph</span>
      </div>

      {/* Kinetic marquee — gen-z ticker banner */}
      <div className="mb-10 overflow-hidden border-y border-hairline py-3">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          className="flex w-max gap-8 whitespace-nowrap font-display text-2xl uppercase tracking-[0.22em] sm:text-3xl"
        >
          {Array.from({ length: 2 }).flatMap((_, r) =>
            ["shot on light", "★", "developed in code", "✦", "printed by pixels", "◐", "one exact moment", "✧"].map((t, i) => (
              <span key={`${r}-${i}`} className="title-serif">{t}</span>
            ))
          )}
        </motion.div>
      </div>

      <Reveal>
        <div className="relative mx-auto w-[80%] max-w-3xl">
          {/* Scattered washi-tape corners + sticker chaos */}
          <div className="pointer-events-none absolute -top-6 left-8 z-30 h-10 w-32 -rotate-6" style={{
            background: "repeating-linear-gradient(135deg, #f6b0bb 0 10px, #e88a99 10px 20px)",
            boxShadow: "0 8px 22px -12px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.35)",
          }} />
          <div className="pointer-events-none absolute -top-4 right-10 z-30 h-9 w-28 rotate-6" style={{
            background: "repeating-linear-gradient(135deg, #f2c266 0 10px, #d6a659 10px 20px)",
            boxShadow: "0 8px 22px -12px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.35)",
          }} />

          {/* The "polaroid" white picture card straight out of the camera */}
          <motion.figure
            initial={{ y: 40, rotate: -1.2, opacity: 0 }}
            whileInView={{ y: 0, rotate: -0.6, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
            className="relative mx-auto"
            style={{
              background: "#f6f1e4",
              padding: "22px 22px 84px 22px",
              boxShadow: "0 40px 80px -30px rgba(0,0,0,0.45), 0 20px 40px -20px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.06)",
              borderRadius: 6,
            }}
          >
            {/* Camera slot shadow — hint that it just slid out */}
            <div className="pointer-events-none absolute -top-3 left-1/2 h-3 w-40 -translate-x-1/2 rounded-b-lg" style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent)",
              filter: "blur(2px)",
            }} />

            <div className="relative overflow-hidden">
              <img
                src={IMG.final}
                alt="Final processed photograph — a warm cinematic scene"
                className="aspect-[16/10] w-full object-cover"
                loading="lazy"
              />
              {/* Corner crop marks */}
              {[
                "left-2 top-2 border-l-2 border-t-2",
                "right-2 top-2 border-r-2 border-t-2",
                "left-2 bottom-2 border-l-2 border-b-2",
                "right-2 bottom-2 border-r-2 border-b-2",
              ].map((c, i) => (
                <span key={i} className={`pointer-events-none absolute h-5 w-5 border-ivory/70 ${c}`} />
              ))}
            </div>

            {/* Polaroid caption — handwritten + typewriter mix */}
            <figcaption className="absolute inset-x-6 bottom-4 flex items-end justify-between">
              <div>
                <div className="mono-label" style={{ color: "#5a3808" }}>Output · 24 / 24</div>
                <h2
                  id="final-title"
                  className="mt-1 max-w-xl font-display text-2xl leading-none sm:text-3xl md:text-4xl"
                  style={{ color: "#1a1208" }}
                >
                  Precision, made <span className="italic" style={{ fontFamily: "'Playfair Display', serif" }}>visible</span>.
                </h2>
              </div>
              <span className="hidden font-mono text-[10px] tracking-widest md:block" style={{ color: "#5a3808" }}>
                ISO 200 · 1/250 · f/2.8
              </span>
            </figcaption>
          </motion.figure>

          {/* Floating annotation stickers around the polaroid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute -right-4 top-10 z-20 hidden rotate-6 md:block"
          >
            <div className="rounded-full border px-4 py-2 font-serif text-sm italic" style={{
              background: "color-mix(in oklab, #f6f1e4 92%, transparent)",
              borderColor: "rgba(26,18,8,0.25)", color: "#1a1208",
              boxShadow: "0 10px 22px -14px rgba(0,0,0,0.4)", backdropFilter: "blur(6px)",
            }}>
              “this one made the cut ✦”
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 90, damping: 12, delay: 0.5 }}
            className="absolute -left-6 bottom-24 z-20 hidden md:block"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 text-center font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.16em]" style={{
              borderColor: "#c97a5a", color: "#c97a5a",
              background: "color-mix(in oklab, #f6f1e4 70%, transparent)",
              boxShadow: "0 6px 16px -10px rgba(0,0,0,0.4)",
            }}>
              KEEPER<br/>· NO. 07 ·<br/>2026
            </div>
          </motion.div>
        </div>
      </Reveal>

      {/* Contact-sheet strip: the runners-up */}
      <Reveal delay={0.15}>
        <div className="mx-auto mt-16 w-[94%] max-w-6xl">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="mono-label">Contact sheet · runners-up</div>
            <div className="font-mono text-[11px] tracking-widest text-foreground/60">roll 01 · frames 18–23</div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {[IMG.hero, IMG.lensFront, IMG.hdrBright, IMG.rawGraded, IMG.glass, IMG.focus].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, rotate: (i % 2 ? 3 : -3) }}
                whileInView={{ opacity: 1, y: 0, rotate: (i % 2 ? 1.5 : -1.5) }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.05 * i, type: "spring", stiffness: 90, damping: 14 }}
                whileHover={{ rotate: 0, scale: 1.06, zIndex: 5 }}
                className="relative aspect-square overflow-hidden bg-ivory p-1.5 shadow-lg"
                style={{ boxShadow: "0 10px 24px -14px rgba(0,0,0,0.5)" }}
              >
                <img src={src} alt="" className="h-full w-full object-cover grayscale-[0.15]" loading="lazy" />
                <span className="absolute bottom-1 right-2 font-mono text-[8px] tracking-widest" style={{ color: "#1a1208" }}>
                  0{18 + i}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Metadata + closing note */}
      <div className="mx-auto mt-16 grid w-[94%] max-w-6xl gap-8 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <div className="rounded-2xl border border-hairline p-6 sm:p-8 backdrop-blur-sm" style={{ background: "color-mix(in oklab, var(--color-background) 55%, transparent)" }}>
            <div className="mono-label">EXIF · the fingerprint of a photograph</div>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-sm sm:grid-cols-3">
              {[
                ["Camera", "Full-frame"],
                ["Lens", "35mm f/1.4"],
                ["Shutter", "1/250 s"],
                ["Aperture", "f/2.8"],
                ["ISO", "200"],
                ["Format", "RAW · 14-bit"],
                ["WB", "5200 K"],
                ["Metering", "Matrix"],
                ["Frame", "24 / 24"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-foreground/55">{k}</dt>
                  <dd className="mt-1 font-semibold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between gap-6">
            <p className="font-serif text-xl leading-snug text-foreground/85 md:text-2xl">
              What began as unruly light is now a <span className="italic">photograph</span> —
              a small, exact object carrying a fraction of a second forward in time.
            </p>
            <div className="flex flex-wrap gap-2">
              {["#lightdiscipline", "#roll01", "#keeper", "#analogfeel", "#pixelsdidthat"].map((t) => (
                <span key={t} className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] tracking-wider text-foreground/75">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
