"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import LedWallShader from "@/components/LedWallShader";
import {
  Ticket, MapPin, Clock, Instagram, Youtube, Music2,
  ExternalLink, Send, ChevronRight, ArrowUpRight, Phone, Mail, Facebook,
  Flame, Sparkles, Mic2, MonitorPlay, PartyPopper, Cherry,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

/* ════════════════════════════════════════ */
/* ═══ DATA ══════════════════════════════ */
/* ════════════════════════════════════════ */

const TL = "https://www.ticketline.pt";
const EVENT = new Date("2026-07-18T18:30:00");

const CONCERTS = [
  { day: "18", month: "JUL 2026", venue: "Academia das Artes do Estoril", city: "Cascais", time: "Portas 18:30h", url: TL, next: true },
  { day: "25", month: "JUL 2026", venue: "Coliseu dos Recreios", city: "Lisboa", time: "Portas 20:00h", url: TL, next: false },
  { day: "02", month: "AGO 2026", venue: "Theatro Circo", city: "Braga", time: "Portas 19:00h", url: TL, next: false },
  { day: "09", month: "AGO 2026", venue: "Centro de Artes e Espetáculos", city: "Porto", time: "Portas 20:00h", url: TL, next: false },
];

/* ═══ HOOKS ═══ */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.unobserve(el); } }, { threshold: 0.12 });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return { ref, visible: v };
}

const Rv = React.memo(function Rv({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`rv ${visible ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
});

/* ═══ COUNTDOWN ═══ */

function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const tick = () => {
      const diff = EVENT.getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff/864e5), h: Math.floor((diff/36e5)%24), m: Math.floor((diff/6e4)%60), s: Math.floor((diff/1e3)%60) });
    };
    tick();
    setMounted(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex gap-5 sm:gap-8 justify-center">
      {[{v:t.d,l:"Dias"},{v:t.h,l:"Horas"},{v:t.m,l:"Min"},{v:t.s,l:"Seg"}].map(u=>(
        <div key={u.l} className="flex flex-col items-center">
          <span className="text-3xl sm:text-5xl font-extralight tabular-nums tracking-tight" style={{color:"var(--t1)"}} suppressHydrationWarning>
            {mounted ? String(u.v).padStart(2,"0") : "\u2013\u2013"}
          </span>
          <span className="sec-num mt-1.5">{u.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══ MARQUEE ═══ */

const Marquee = React.memo(function Marquee({ text }: { text: string }) {
  const r = Array(10).fill(text).join("  ✦  ");
  return (
    <div className="overflow-hidden border-y py-5" style={{borderColor:"rgba(200,80,255,0.08)"}}>
      <div className="marquee-track whitespace-nowrap">
        <span className="text-xl sm:text-3xl font-extralight tracking-widest mx-4" style={{color:"var(--t3)"}}>{r}</span>
        <span className="text-xl sm:text-3xl font-extralight tracking-widest mx-4" style={{color:"var(--t3)"}}>{r}</span>
      </div>
    </div>
  );
});

/* ═══ LED WALL — WebGL Shader (zero compression, max quality, infinite loop) ═══ */
/* Build: 2026-06-16-v11 */

/* ═══ IDENTIDADE DUAL — Character → Performer Card ═══ */

/* SVG character silhouettes — demon hunter poses with weapons */
const CHAR_SILHOUETTES: Record<string, string> = {
  RUMI: "M80,15 C85,10 95,10 100,15 C105,10 115,10 120,15 C125,8 130,5 128,0 C135,8 140,20 135,30 C130,25 120,28 115,35 C112,40 115,50 110,55 C105,50 100,45 95,48 C88,52 85,60 82,68 C78,78 75,90 72,100 C68,115 65,130 62,145 C58,160 55,175 52,190 L55,195 C58,192 62,188 65,185 L68,195 C70,192 73,188 76,185 L78,195 L82,185 C85,175 88,165 90,155 C92,145 95,135 98,125 C100,115 105,105 110,100 L120,108 C125,112 130,120 135,130 C140,140 138,155 135,165 L132,175 L136,170 L134,182 L138,178 C135,188 130,195 125,200 C120,195 115,185 112,175 C108,165 105,155 102,145 C98,140 92,138 88,140 C85,145 82,155 80,165 C78,175 75,188 72,200 L75,205 L78,198 L80,205 L84,198 C87,185 90,170 92,155 C94,140 90,130 85,125 C80,120 75,118 72,120 C70,125 68,135 65,145 C62,160 58,178 55,195 L52,200 L56,193 L54,203 L60,195",
  MIRAE: "M90,12 C95,8 105,8 110,12 C115,5 120,2 118,0 C125,5 128,15 125,25 C120,20 115,22 110,28 C105,35 108,45 102,52 C98,48 92,42 88,45 C82,50 78,60 75,70 C72,82 70,95 68,108 C65,122 62,138 60,152 L62,158 L66,148 L68,158 L72,148 L74,158 C76,148 78,138 80,128 C82,118 85,108 88,100 C92,92 98,88 105,85 L112,92 C118,100 120,112 118,125 C116,138 112,150 108,162 L106,172 L110,165 L108,175 L112,170 C110,180 105,190 100,198 C95,190 90,180 88,170 C85,158 82,145 80,132 C78,125 74,122 70,125 C66,130 62,140 60,152 C58,162 55,175 52,190 L54,196 L58,188 L56,198 L62,190 C64,178 68,165 72,150 C75,138 72,128 68,122 C64,118 60,120 58,128 C55,138 52,155 48,172 L46,180 L50,174 L48,185 L54,178",
  ZOE: "M85,15 C90,10 100,10 105,15 C110,8 115,3 112,0 C120,5 125,18 120,28 C115,22 108,25 105,32 C100,40 105,50 98,58 C92,52 85,45 82,48 C76,55 72,65 70,78 C68,90 66,105 64,118 C62,132 58,148 55,162 L58,168 L62,158 L64,168 L68,158 L70,168 C72,155 75,142 78,130 C82,118 86,108 92,100 C98,95 105,92 112,95 C118,100 122,110 120,122 C118,135 114,148 110,160 L108,170 L112,162 L110,172 L114,168 C112,178 108,188 102,198 C96,190 92,180 88,168 C84,155 82,142 80,128 C78,120 74,118 70,122 C66,128 62,140 60,155 C58,168 55,182 52,195 L54,200 L58,192 L56,202 L62,195 C65,180 68,165 72,148 C75,132 72,120 66,118 C60,118 56,125 55,140 C54,155 50,172 46,188 L44,195 L48,188 L46,198 L52,192",
};

const DualRevealCard = React.memo(function DualRevealCard({ name, color, delay, animImg, realImg }: {
  name: string; color: string; delay: number; animImg: string; realImg: string;
}) {
  return (
    <div
      className="dual-card"
      style={{ '--char-color': color, '--card-delay': `${delay}ms` } as React.CSSProperties}
    >
      {/* Neon SVG border traces */}
      <svg className="neon-border-svg" viewBox="0 0 300 891" preserveAspectRatio="none">
        <rect className="nb-rect" x="2" y="2" width="296" height="887" rx="2" ry="2"/>
        <path className="nb-vine nb-vine-l" d="M4,60 C12,80 4,120 10,160 C4,200 12,240 6,280 C4,320 10,360 6,400 C4,440 10,470 6,500 C4,530 10,560 6,590 C4,620 10,650 6,680 C4,710 10,740 6,770 C4,800 10,830 6,860"/>
        <path className="nb-vine nb-vine-r" d="M296,50 C288,70 296,110 290,150 C296,190 288,230 294,270 C296,310 290,350 296,390 C294,430 296,470 294,510 C296,540 290,570 296,600 C294,630 296,660 294,690 C296,720 290,750 296,780 C294,810 296,840 294,870"/>
        <path className="nb-arc nb-arc-top" d="M60,4 C120,20 180,20 240,4"/>
        <path className="nb-arc nb-arc-bot" d="M60,887 C120,871 180,871 240,887"/>
        <circle className="nb-eye" cx="6" cy="250" r="2.5"/>
        <circle className="nb-eye" cx="6" cy="262" r="2.5"/>
        <circle className="nb-eye" cx="294" cy="250" r="2.5"/>
        <circle className="nb-eye" cx="294" cy="262" r="2.5"/>
        <circle className="nb-dot" cx="4" cy="4" r="3"/>
        <circle className="nb-dot" cx="296" cy="4" r="3"/>
        <circle className="nb-dot" cx="296" cy="887" r="3"/>
        <circle className="nb-dot" cx="4" cy="887" r="3"/>
      </svg>

      {/* Neon sweep line — sweeps down on hover, up on leave */}
      <div className="dc-neon-sweep"/>

      {/* Animated character layer (on top, clips away on hover) */}
      <div className="dc-layer dc-anim">
        <img src={animImg} alt={`${name} animated`} className="dc-img" loading="lazy" decoding="async"/>
      </div>

      {/* Real performer layer (underneath, revealed on hover) */}
      <div className="dc-layer dc-real">
        <img src={realImg} alt={name} className="dc-img" loading="lazy" decoding="async"/>
      </div>
    </div>
  );
});

/* ═══ CARREGA O HONMOON — Interactive Charging ═══ */

const HonmoonCharger = React.memo(function HonmoonCharger() {
  const [energy, setEnergy] = useState(0);
  const [charged, setCharged] = useState(false);
  const [pulses, setPulses] = useState<Array<{id: number; x: number; y: number}>>([]);
  const chargerRef = useRef<HTMLDivElement>(null);
  const chargedRef = useRef(false);

  const charge = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (chargedRef.current) return;
    setEnergy(prev => {
      const newEnergy = Math.min(prev + 8, 100);
      if (newEnergy >= 100) { chargedRef.current = true; setCharged(true); }
      return newEnergy;
    });
    const rect = e.currentTarget.getBoundingClientRect();
    setPulses(prev => [...prev.slice(-6), { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  }, []);

  useEffect(() => {
    if (charged) {
      const t = setTimeout(() => { setCharged(false); setEnergy(0); chargedRef.current = false; }, 6000);
      return () => clearTimeout(t);
    }
  }, [charged]);

  const ringLen = 565; // 2 * PI * 90
  const strokeColor = charged ? "var(--gold)" : energy > 50 ? "var(--pink-kpop)" : "var(--neon-purple)";
  const btnBg = charged ? "var(--gold)" : energy > 50 ? "var(--pink-kpop)" : "var(--neon-purple)";

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Background glow */}
      <div className="honmoon-bg-glow" style={{
        opacity: 0.3 + energy * 0.007,
        background: `radial-gradient(circle, ${charged ? 'rgba(255,245,164,0.12)' : 'rgba(200,80,255,0.08)'} 0%, transparent 70%)`,
        width: `${300 + energy * 1.5}px`,
        height: `${300 + energy * 1.5}px`,
      }}/>

      {/* Floating particles */}
      {Array.from({length: 8}, (_, i) => (
        <div key={i} className="honmoon-particle" style={{
          left: `${20 + (i * 10) % 60}%`,
          top: `${15 + (i * 13) % 70}%`,
          animationDelay: `${i * 0.5}s`,
          background: charged ? 'var(--gold)' : 'var(--neon-purple)',
          opacity: charged ? 0.6 : 0.3 + energy * 0.005,
        }}/>
      ))}

      {/* Charger circle */}
      <div ref={chargerRef} className="honmoon-charger" onClick={charge}>
        <svg className="honmoon-ring-svg" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(200,80,255,0.08)" strokeWidth="1.5"/>
          <circle cx="100" cy="100" r="90" fill="none" stroke={strokeColor} strokeWidth="1.5"
            strokeDasharray={`${energy / 100 * ringLen} ${ringLen}`} strokeLinecap="round"
            transform="rotate(-90 100 100)" style={{ transition: 'stroke-dasharray 0.3s ease, stroke 0.5s ease' }}/>
        </svg>
        <div className={`honmoon-center ${charged ? "honmoon-active" : ""}`}>
          <span className="honmoon-pct" style={{ color: charged ? 'var(--gold)' : strokeColor }}>
            {charged ? '\u2726' : `${energy}%`}
          </span>
          <span className="honmoon-pct-label">{charged ? 'ATIVO' : 'ENERGIA'}</span>
        </div>
        {pulses.map(p => (
          <div key={p.id} className="honmoon-pulse" style={{ left: p.x, top: p.y }}/>
        ))}
      </div>

      {/* Charge button */}
      <button className="honmoon-btn" style={{
        background: btnBg,
        boxShadow: `0 0 ${20 + energy * 0.4}px ${charged ? 'rgba(255,245,164,0.3)' : energy > 50 ? 'rgba(255,45,120,0.3)' : 'rgba(200,80,255,0.3)'}`,
        display: charged ? 'none' : 'inline-flex',
      }}>
        CARREGA O HONMOON
      </button>

      {/* Success message */}
      {charged && (
        <div className="honmoon-message">
          <span style={{ color: 'var(--gold)' }}>HONMOON ATIVO!</span>
          <p>O escudo est\u00e1 protegido. Est\u00e1s pronto para o concerto!</p>
        </div>
      )}
    </div>
  );
});

/* ════════════════════════════════════════ */
/* ═══ MAIN PAGE ══════════════════════════ */
/* ════════════════════════════════════════ */

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [burstKey, setBurstKey] = useState(0);
  const [ripple, setRipple] = useState<{active:boolean; x:number; y:number; toMode:'dark'|'light'}|null>(null);
  const [waveActive, setWaveActive] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLElement[] | null>(null);
  const { ref: manifestoRef, visible: manifestoVisible } = useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* Pause ALL CSS animations when tab is hidden — massive CPU/GPU savings */
  useEffect(() => {
    const onVis = () => {
      document.body.style.setProperty("--anim-state", document.hidden ? "paused" : "running");
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // localStorage persistence for theme — read on mount
  useEffect(() => {
    const saved = localStorage.getItem('honmoon-theme');
    if (saved === 'light') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeMode('light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('honmoon-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const navLinks = useMemo(() => [
    { l: "Espetáculo", h: "#espetaculo" },
    { l: "Identidade", h: "#identidade" },
    { l: "Lineup", h: "#lineup" },
    { l: "Concertos", h: "#concertos" },
    { l: "Bilhetes", h: "#bilhetes" },
    { l: "Honmoon", h: "#honmoon" },
  ], []);

  return (
    <>
      {/* ═══ RIPPLE BG LAYER — new theme background spreads from orb via clip-path ═══ */}
      {ripple?.active && (
        <div className="hm-ripple-bg-layer">
          <div
            className={`hm-ripple-bg ${ripple.toMode === 'light' ? 'awaken' : 'dormant'}`}
            style={{'--rx': `${ripple.x}%`, '--ry': `${ripple.y}%`} as React.CSSProperties}
          />
        </div>
      )}

      {/* ═══ MAIN CONTENT — always visible, transparent bg during transition ═══ */}
      <div
        className={`min-h-screen flex flex-col relative z-10 ${themeMode === 'light' ? 'light-mode' : ''} ${waveActive ? 'wave-transition' : ''}`}
        style={{background: ripple?.active ? 'transparent' : 'var(--deep)'}}
      >

      {/* ═══ RIPPLE SHIMMER — subtle wave glow that passes over content ═══ */}
      {ripple?.active && (
        <div className="hm-ripple-shimmer-layer">
          <div
            className={`hm-shimmer-ring hm-shimmer-ring-1 ${ripple.toMode === 'light' ? 'awaken' : 'dormant'}`}
            style={{left:`${ripple.x}%`, top:`${ripple.y}%`}}
          />
          <div
            className={`hm-shimmer-ring hm-shimmer-ring-2 ${ripple.toMode === 'light' ? 'awaken' : 'dormant'}`}
            style={{left:`${ripple.x}%`, top:`${ripple.y}%`}}
          />
          <div
            className={`hm-shimmer-ring hm-shimmer-ring-3 ${ripple.toMode === 'light' ? 'awaken' : 'dormant'}`}
            style={{left:`${ripple.x}%`, top:`${ripple.y}%`}}
          />
        </div>
      )}

      {/* ═══ PRELOADER ═══ */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${loaded?"opacity-0 pointer-events-none":"opacity-100"}`} style={{background:"var(--void)"}}>
        <div className="w-28 h-px relative overflow-hidden" style={{background:"var(--subtle)"}}>
          <div className="absolute inset-y-0 left-0 h-full" style={{background:"var(--neon-purple)",animation:"load 1.6s cubic-bezier(0.16,1,0.3,1) forwards"}}/>
        </div>
      </div>

      {/* ═══ SOUL PARTICLES — fixed overlay across entire site ═══ */}
      <div className="soul-particles-site">
        {Array.from({length: 12}, (_, i) => (
          <div
            key={i}
            className="soul-particle-site"
            style={{
              left: `${5 + (i * 7.5) % 90}%`,
              animationDelay: `${(i * 1.1) % 8}s`,
              animationDuration: `${8 + (i % 4) * 2}s`,
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
            }}
          />
        ))}
      </div>

      {/* ═══ HERO — FULL SCREEN ═══ */}
      <section className="hero-section" style={{background:"var(--void)"}}>
        {/* Background image — full bleed */}
        <img
          src="/hero-girls.png"
          alt=""
          className="hero-bg-img"
          fetchPriority="high"
          decoding="async"
        />

        {/* Grid texture overlay */}
        <div className="hero-grid"/>

        {/* Depth overlay — fade at bottom */}
        <div className="hero-bg-overlay"/>

        {/* Vignette — darkens edges */}
        <div className="hero-vignette"/>

        {/* Glow orbs */}
        <div className="hero-glow-orb" style={{width:"40vw",height:"40vw",left:"25%",top:"30%",color:"rgba(200,80,255,0.15)"}}/>
        <div className="hero-glow-orb" style={{width:"25vw",height:"25vw",right:"10%",top:"55%",color:"rgba(74,144,226,0.10)",animationDelay:"3s"}}/>
        <div className="hero-glow-orb" style={{width:"20vw",height:"20vw",left:"5%",bottom:"20%",color:"rgba(255,45,120,0.08)",animationDelay:"6s"}}/>

        {/* Side decorative lines */}
        <div className="hero-side-line hidden sm:block" style={{left:"5%",top:"15%",height:"30%"}}/>
        <div className="hero-side-line hidden sm:block" style={{right:"5%",top:"25%",height:"25%"}}/>

        {/* ═══ HAMBURGER NAV — pinned at top of hero ═══ */}
        <nav className="absolute top-0 inset-x-0 z-[95] py-6" style={{background:"transparent"}}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 flex items-center justify-between">
            {/* LEFT: Hamburger only */}
            <button
              onClick={()=>setMenuOpen(!menuOpen)}
              className={`hamburger ${menuOpen?"open":""}`}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
            {/* RIGHT: Mini Honmoon Toggle */}
            <button
              className="mini-honmoon-toggle"
              onClick={toggleTheme}
              aria-label={themeMode === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              <span className={`mini-honmoon-orb ${themeMode}`}/>
            </button>
          </div>
        </nav>

        {/* ═══ FULLSCREEN MENU OVERLAY — cascade from LEFT ═══ */}
        <div className={`menu-overlay ${menuOpen?"open":""}`}>
          <div className="flex flex-col items-start gap-1 sm:gap-2 mb-16">
            {navLinks.map((n, i) => (
              <a
                key={n.l}
                href={n.h}
                onClick={()=>setMenuOpen(false)}
                className="menu-link"
                style={{ transitionDelay: menuOpen ? `${i * 80 + 100}ms` : "0ms", color:"var(--t3)" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}
              >
                <span className="menu-link-text">{n.l}</span>
                <span className="link-num">0{i+1}</span>
              </a>
            ))}
          </div>
          {/* Menu CTA */}
          <div style={{ transitionDelay: menuOpen ? `${navLinks.length * 80 + 200}ms` : "0ms", transform: menuOpen ? "translateX(0)" : "translateX(-40px)", opacity: menuOpen ? 1 : 0, transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
            <a href={TL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-10 py-4 text-[11px] tracking-[0.22em] uppercase font-semibold transition-all duration-400" style={{background:"var(--neon-purple)",color:"#fff"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 0 40px rgba(200,80,255,0.4)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none"}}>
              <Ticket className="w-4 h-4"/> Comprar Bilhete <ExternalLink className="w-3 h-3"/>
            </a>
          </div>
          {/* Menu Footer — social bottom right */}
          <div className="absolute bottom-8 right-8 sm:right-12 flex gap-7" style={{ transitionDelay: menuOpen ? `${navLinks.length * 80 + 350}ms` : "0ms", transform: menuOpen ? "translateX(0)" : "translateX(20px)", opacity: menuOpen ? 1 : 0, transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
              <Instagram className="w-7 h-7"/>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
              <Facebook className="w-7 h-7"/>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
              <Youtube className="w-7 h-7"/>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
              <Music2 className="w-7 h-7"/>
            </a>
          </div>
          {/* Decorative circle */}
          <div className="hero-circle hidden sm:block" style={{width:"500px",height:"500px",right:"-150px",top:"50%",transform:"translateY(-50%)",borderColor:"rgba(200,80,255,0.06)"}}/>
        </div>

        {/* ═══ HERO CTA — temporarily hidden, re-enable when ready ═══ */}
        {/* <a
          href={TL}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta"
          style={{marginBottom:"10vh"}}
        >
          <Ticket className="w-4 h-4"/> Comprar Bilhete <ExternalLink className="w-3 h-3"/>
        </a> */}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="scroll-line"/>
        </div>
      </section>

      {/* ═══ HONMOON SHIELD — Theme Toggle (like the anime) ═══ */}
      <section className="honmoon-shield-section">
        {/* Background glow */}
        <div className={`hm-bg-glow ${themeMode}`}/>

        {/* Floating ambient particles */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`hm-particle hm-particle-${i} ${themeMode}`}/>
        ))}

        {/* Outer energy rings */}
        <div className={`hm-ring hm-ring-1 ${themeMode}`}/>
        <div className={`hm-ring hm-ring-2 ${themeMode}`}/>
        <div className={`hm-ring hm-ring-3 ${themeMode}`}/>

        {/* ═══ Neon rose circles — anime Honmoon aesthetic, dark mode only ═══ */}
        <div className={`hm-neon-circle hm-neon-circle-1 ${themeMode}`}/>
        <div className={`hm-neon-circle hm-neon-circle-2 ${themeMode}`}/>
        <div className={`hm-neon-circle hm-neon-circle-3 ${themeMode}`}/>
        <div className={`hm-neon-circle hm-neon-circle-4 ${themeMode}`}/>
        <div className={`hm-neon-arc hm-neon-arc-1 ${themeMode}`}/>
        <div className={`hm-neon-arc hm-neon-arc-2 ${themeMode}`}/>
        <div className={`hm-neon-arc hm-neon-arc-3 ${themeMode}`}/>

        {/* Orbiting energy nodes */}
        <div className={`hm-node hm-node-a ${themeMode}`}/>
        <div className={`hm-node hm-node-b ${themeMode}`}/>
        <div className={`hm-node hm-node-c ${themeMode}`}/>
        <div className={`hm-node hm-node-d ${themeMode}`}/>
        <div className={`hm-node hm-node-e ${themeMode}`}/>
        <div className={`hm-node hm-node-f ${themeMode}`}/>

        {/* Central shield orb — clickable */}
        <div
          ref={orbRef}
          className={`hm-orb ${themeMode}`}
          onClick={() => {
            if (ripple?.active) return;
            const orb = orbRef.current;
            if (!orb) return;
            const rect = orb.getBoundingClientRect();
            const orbCX = rect.left + rect.width / 2;
            const orbCY = rect.top + rect.height / 2;
            const x = (orbCX / window.innerWidth) * 100;
            const y = (orbCY / window.innerHeight) * 100;
            const toMode = themeMode === 'dark' ? 'light' as const : 'dark' as const;
            setRipple({ active: true, x, y, toMode });
            setBurstKey(k => k + 1);
            setWaveActive(true);

            // ─── Wave delay: sections closer to orb change first ───
            const maxDist = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
            /* Cache section refs on first click to avoid querySelectorAll on every click */
            if (!sectionRefs.current) {
              sectionRefs.current = Array.from(document.querySelectorAll('section, header, footer, nav, .fixed.bottom-0'));
            }
            const allSections = sectionRefs.current;
            allSections.forEach(el => {
              const r = el.getBoundingClientRect();
              const cx = r.left + r.width / 2;
              const cy = r.top + r.height / 2;
              const dist = Math.sqrt((orbCX - cx) ** 2 + (orbCY - cy) ** 2);
              const normalized = dist / maxDist;
              // 0ms near orb → 700ms far from orb
              const delay = Math.round(normalized * 700);
              (el as HTMLElement).style.setProperty('--wave-delay', `${delay}ms`);
            });

            // Switch theme when clip-path covers viewport (~50% of 1.5s)
            setTimeout(() => { toggleTheme(); }, 650);
            // Clean up wave delays + remove ripple
            setTimeout(() => {
              setRipple(null);
              setWaveActive(false);
              allSections.forEach(el => {
                (el as HTMLElement).style.removeProperty('--wave-delay');
              });
            }, 2200);
          }}
          role="button"
          title={themeMode === 'dark' ? 'Toca para despertar o Honmoon' : 'Toca para adormecer o Honmoon'}
          aria-label={themeMode === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {/* Inner energy strands */}
          <div className={`hm-strand hm-strand-1 ${themeMode}`}/>
          <div className={`hm-strand hm-strand-2 ${themeMode}`}/>
          <div className={`hm-strand hm-strand-3 ${themeMode}`}/>

          {/* Center text — MODO DIA / MODO NOITE */}
          <span className={`hm-label ${themeMode}`}>
            {themeMode === 'light' ? 'MODO DIA' : 'MODO NOITE'}
          </span>

          {/* Click hint — finger tap indicator */}
          <span className={`hm-tap-hint ${themeMode}`}/>

          {/* Hover hint — appears on hover */}
          <span className="hm-hover-hint">
            {themeMode === 'dark' ? 'DESPERTAR' : 'ADORMECER'}
          </span>
        </div>

        {/* Click burst — expanding rings on click */}
        <div key={burstKey} className="hm-burst">
          <div className="hm-burst-ring hm-burst-ring-1"/>
          <div className="hm-burst-ring hm-burst-ring-2"/>
          <div className="hm-burst-ring hm-burst-ring-3"/>
        </div>

      </section>

      {/* ═══ MANIFESTO — LED WALL FULLSCREEN TUNNEL ═══ */}
      <section
        ref={manifestoRef}
        className={`manifesto-section ${manifestoVisible ? "manifesto-in" : ""}`}
        style={{background:"var(--void)"}}
      >
        {/* Fullscreen shader — fills entire viewport */}
        <LedWallShader active={manifestoVisible}/>

        {/* Power-on flash overlay */}
        <div className="led-power-flash"/>

        {/* Dynamic LED ambient — synced with shader color */}
        <div className="led-ambient-sync"/>

        {/* Monitor glow — light spill onto page sides */}
        <div className="monitor-glow monitor-glow-left"/>
        <div className="monitor-glow monitor-glow-right"/>
      </section>

      {/* ═══ ESPETÁCULO — Descrição + Galeria ═══ */}
      <section id="espetaculo" className="espetaculo-section px-5 sm:px-10">
        {/* ═══ Atmospheric layers ═══ */}
        <div className="esp-spotlight esp-spotlight-left"/>
        <div className="esp-spotlight esp-spotlight-center"/>
        <div className="esp-spotlight esp-spotlight-right"/>
        <div className="esp-glow-orb esp-glow-pink"/>
        <div className="esp-glow-orb esp-glow-purple"/>
        <div className="esp-glow-orb esp-glow-blue"/>
        <div className="esp-grid-texture"/>
        <div className="esp-vignette"/>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="esp-layout">
            {/* LEFT — Description */}
            <div className="esp-left">
              <Rv>
                <p className="sec-num mb-4" style={{color:"var(--pink-light)"}}>Tributo Ao Vivo</p>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-8" style={{color:"var(--t1)"}}>
                  O grande fen&oacute;meno em palco: O Universo <span className="esp-title-accent">K-Pop das Hunters</span> ao Vivo
                </h2>
              </Rv>
              <Rv delay={200}>
                <p className="text-[16px] leading-[1.8] mb-6" style={{color:"var(--t2)"}}>
                  No universo da s&eacute;rie, tr&ecirc;s idolas de K-Pop vivem uma dupla identidade: de dia s&atilde;o estrelas
                  brilhantes do palco, de noite transformam-se em ca&ccedil;adoras de dem&oacute;nios que protegem o mundo
                  atrav&eacute;s do poder do Honmoon. O nosso tributo traz essa magia para o palco ao vivo &mdash; onde a fic&ccedil;&atilde;o
                  se torna realidade e cada nota musical carrega o poder de um universo inteiro.
                </p>
              </Rv>
              <Rv delay={350}>
                <p className="text-[16px] leading-[1.8] mb-6" style={{color:"var(--t2)"}}>
                  Essa mesma energia atravessa o ecr&atilde; e ganha forma ao vivo - com <span style={{color:"var(--neon-purple)"}}>coreografias de</span> BLACKPINK, BTS e aespa executadas por performers de elite, luzes deslumbrantes e <span style={{color:"var(--pink-kpop)"}}>efeitos pirot&eacute;cnicos</span>.
                  Os maiores hits K-Pop ressoam num palco que se transforma em campo de batalha, e cada momento
                  &eacute; uma fatia do universo das Hunters servida ao vivo.
                </p>
              </Rv>
              <Rv delay={420}>
                <p className="text-[16px] leading-[1.8] mb-10" style={{color:"var(--t2)"}}>
                  Um espet&aacute;culo de variedades que transcende o concerto tradicional &mdash; onde o palco se transforma
                  num mundo m&aacute;gico e cada momento se torna uma mem&oacute;ria inesquec&iacute;vel.
                </p>
              </Rv>
              <Rv delay={500}>
                <a href={TL} target="_blank" rel="noopener noreferrer" className="esp-cta">
                  <Ticket className="w-3.5 h-3.5"/> Reservar Lugar <ArrowUpRight className="w-3 h-3"/>
                </a>
              </Rv>
            </div>

            {/* RIGHT — Photo Grid */}
            <div className="esp-right">
              <Rv delay={150}>
                <p className="sec-num mb-4" style={{color:"var(--pink-light)"}}>Eventos Anteriores</p>
              </Rv>
              <div className="esp-photo-frame">
                <div className="esp-photo-grid">
                  {Array.from({length: 6}, (_, i) => (
                    <Rv key={i} delay={200 + i * 80}>
                      <div className="esp-photo-slot" data-num={`0${i + 1}`}>
                        <div className="esp-photo-placeholder">
                          <Music2 className="w-5 h-5" style={{color:"rgba(255,45,120,0.4)"}}/>
                          <span className="esp-photo-label">Foto {i + 1}</span>
                        </div>
                      </div>
                    </Rv>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ IDENTIDADE DUAL — Character → Performer Scroll Reveal ═══ */}
      <section id="identidade" className="identidade-section px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Rv>
            <p className="sec-num mb-4">Identidade Dual</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-4" style={{color:"var(--t1)"}}>
              De Demon Hunter<br/>a <span className="neon-shimmer">Estrela K-Pop</span>
            </h2>
          </Rv>
          <Rv delay={120}>
            <p className="text-[16px] leading-[1.8] mb-12 max-w-lg" style={{color:"var(--t2)"}}>
              Cada guerreira esconde uma identidade secreta. Passa com o rato por cima para descobrir
              quem se esconde por tr&aacute;s de cada Demon Hunter.
            </p>
          </Rv>
          <div className="dual-grid">
            {[
              { name: "ZOE", color: "var(--blue-accent)", animImg: "/real-zoe.png", realImg: "/char-zoe.png" },
              { name: "RUMI", color: "var(--neon-purple)", animImg: "/real-rumi.png", realImg: "/char-rumi.png" },
              { name: "MIRAE", color: "var(--pink-kpop)", animImg: "/real-mirae.png", realImg: "/char-mirae.png" },
            ].map((c, i) => (
              <DualRevealCard key={c.name} name={c.name} color={c.color} delay={i * 200} animImg={c.animImg} realImg={c.realImg}/>
            ))}
          </div>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ LINEUP ═══ */}
      <section id="lineup" className="py-24 sm:py-40 px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Rv>
            <p className="sec-num mb-4">02 - Lineup</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-16" style={{color:"var(--t1)"}}>
              As Nossas Guerreiras
            </h2>
          </Rv>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2px]">
            {[
              {name:"HUNTRIX",sub:"Headliner - Demon Hunters",c:"var(--gold)"},
              {name:"RUMI",sub:"Vocal Principal",c:"var(--pink-kpop)"},
              {name:"MIRAE",sub:"Dança & Rap",c:"var(--blue-accent)"},
              {name:"ZOE",sub:"Performance Especial",c:"var(--neon-purple)"},
            ].map((a,i)=>(
              <Rv key={a.name} delay={i*100}>
                <div className="group relative overflow-hidden cursor-pointer" style={{background:"var(--surface)"}}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src="/poster.png" alt={a.name} className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105" style={{filter:"grayscale(75%) brightness(0.5)"}} loading="lazy" decoding="async"
                      onMouseEnter={e=>{(e.target as HTMLImageElement).style.filter="grayscale(0%) brightness(0.8)"}} 
                      onMouseLeave={e=>{(e.target as HTMLImageElement).style.filter="grayscale(75%) brightness(0.5)"}}/>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5" style={{background:"linear-gradient(to top, var(--void) 5%, transparent 100%)"}}>
                    <p className="text-[8px] tracking-[0.3em] font-semibold mb-1 uppercase" style={{color:a.c}}>{a.sub}</p>
                    <h3 className="text-lg sm:text-xl font-light tracking-[-0.01em] transition-colors duration-300" style={{color:"var(--t1)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color=a.c}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t1)"}}>{a.name}</h3>
                    <div className="flex gap-3 mt-2">
                      <Instagram className="w-3 h-3 transition-colors cursor-pointer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as SVGElement).style.color="var(--pink-kpop)"}} onMouseLeave={e=>{(e.currentTarget as SVGElement).style.color="var(--t3)"}}/>
                      <Youtube className="w-3 h-3 transition-colors cursor-pointer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as SVGElement).style.color="#ff0000"}} onMouseLeave={e=>{(e.currentTarget as SVGElement).style.color="var(--t3)"}}/>
                      <Music2 className="w-3 h-3 transition-colors cursor-pointer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as SVGElement).style.color="#00F2EA"}} onMouseLeave={e=>{(e.currentTarget as SVGElement).style.color="var(--t3)"}}/>
                    </div>
                  </div>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </section>

      <Marquee text="HUNTRIX · RUMI · MIRAE · ZOE · DEMON HUNTERS · K-POP TRIBUTE"/>

      {/* ═══ PRÓXIMOS CONCERTOS ═══ */}
      <section id="concertos" className="concerts-section px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <Rv>
              <p className="sec-num mb-4">Pr&oacute;ximos Concertos</p>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05]" style={{color:"var(--t1)"}}>
                Em <span style={{color:"var(--pink-kpop)"}}>Tour</span>
              </h2>
            </Rv>
            <Rv delay={150}>
              <p className="text-[13px] max-w-xs" style={{color:"var(--t3)"}}>
                N&atilde;o percas a oportunidade de ver as Guerreiras ao vivo.
                Cada concerto &eacute; uma experi&ecirc;ncia &uacute;nica.
              </p>
            </Rv>
          </div>
          <div className="concerts-grid">
            {CONCERTS.map((c, i) => (
              <Rv key={c.city} delay={i * 100}>
                <div className={`concert-card ${c.next ? "next" : ""}`}>
                  {c.next && <div className="concert-badge">PR&Oacute;XIMO</div>}
                  <div className="concert-date-strip">
                    <div className="concert-day">{c.day}</div>
                    <div className="concert-month">{c.month}</div>
                  </div>
                  <div className="concert-details">
                    <div>
                      <p className="concert-venue">{c.venue}</p>
                      <p className="concert-city">{c.city}</p>
                      <p className="concert-time">{c.time}</p>
                    </div>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="concert-buy-btn">
                      <Ticket className="w-3.5 h-3.5"/> Comprar Bilhete <ExternalLink className="w-3 h-3"/>
                    </a>
                  </div>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BILHETES ═══ */}
      <section id="bilhetes" className="py-24 sm:py-40 px-5 sm:px-10" style={{background:"var(--surface)"}}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <Rv>
              <p className="sec-num mb-4">03 - Bilhetes</p>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em]" style={{color:"var(--t1)"}}>
                Escolhe o Teu Lugar
              </h2>
            </Rv>
            <Rv delay={200}>
              <a href={TL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] tracking-[0.15em]" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
                ticketline.pt <ExternalLink className="w-3 h-3"/>
              </a>
            </Rv>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {name:"GERAL",price:"25€",features:["Acesso a todos os palcos","Random Play Dance","K-Culture Zone"],c:"var(--t2)",featured:false},
              {name:"VIP",price:"45€",features:["Tudo do Geral","Zona VIP frente ao palco","Meet & Greet inclusivo","Merch exclusivo"],c:"var(--neon-purple)",featured:true},
              {name:"PREMIUM",price:"75€",features:["Tudo do VIP","Backstage Experience","Jantar K-Food inclusivo","Kit Premium completo"],c:"var(--gold)",featured:false},
            ].map((t,i)=>(
              <Rv key={t.name} delay={i*120}>
                <div className={`tk p-8 sm:p-10 flex flex-col h-full ${t.featured?"glass-neon":"glass"}`}>
                  {t.featured && <span className="self-start text-[8px] tracking-[0.3em] font-bold px-2.5 py-1 mb-6 uppercase" style={{background:"var(--neon-purple)",color:"#fff"}}>Popular</span>}
                  <h3 className="text-[10px] tracking-[0.3em] font-semibold uppercase mb-2" style={{color:t.c}}>{t.name}</h3>
                  <span className="text-5xl sm:text-6xl font-extralight tracking-[-0.03em] mb-8" style={{color:"var(--t1)"}}>{t.price}</span>
                  <ul className="space-y-3 mb-10 flex-1">
                    {t.features.map(f=>(
                      <li key={f} className="flex items-start gap-3 text-[14px]" style={{color:"var(--t2)"}}>
                        <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{background:t.c}}/>{f}
                      </li>
                    ))}
                  </ul>
                  <a href={TL} target="_blank" rel="noopener noreferrer" className="block text-center py-3.5 text-[10px] tracking-[0.22em] font-semibold uppercase transition-all duration-400" style={t.featured?{background:"var(--neon-purple)",color:"#fff"}:{background:"transparent",border:"1px solid rgba(200,80,255,0.15)",color:"var(--neon-purple)"}} onMouseEnter={e=>{if(!t.featured){(e.currentTarget as HTMLElement).style.background="var(--neon-purple)";(e.currentTarget as HTMLElement).style.color="#fff"}}} onMouseLeave={e=>{if(!t.featured){(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}}}>
                    Comprar <ExternalLink className="w-3 h-3 inline ml-1"/>
                  </a>
                </div>
              </Rv>
            ))}
          </div>
          <Rv className="mt-10 text-center">
            <p className="text-[13px]" style={{color:"var(--t3)"}}>Desconto de grupo: 4+ bilhetes com 10% desconto. <a href={TL} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{color:"var(--neon-purple)"}}>Saber mais</a></p>
          </Rv>
        </div>
      </section>

      {/* ═══ LOCAL ═══ */}
      <section id="local" className="py-24 sm:py-40 px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7">
              <Rv>
                <p className="sec-num mb-4">04 - Local</p>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-8" style={{color:"var(--t1)"}}>
                  Academia das Artes<br/>do Estoril
                </h2>
              </Rv>
              <Rv delay={120}>
                <p className="text-[16px] leading-[1.8] mb-8 max-w-lg" style={{color:"var(--t2)"}}>
                  Um espaço icónico na costa de Cascais, onde a arte e a cultura se encontram.
                  A localização perfeita para receber as Guerreiras do K-Pop, com vista sobre
                  o Atlântico e infraestruturas de primeiro nível.
                </p>
              </Rv>
              <Rv delay={220}>
                <div className="space-y-5 mb-10">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{color:"var(--neon-purple)"}}/>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-1" style={{color:"var(--t3)"}}>Morada</p>
                      <p className="text-[14px]" style={{color:"var(--t1)"}}>Av. Marginal, 2765-282 Estoril, Cascais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-4 h-4 mt-1 flex-shrink-0" style={{color:"var(--neon-purple)"}}/>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-1" style={{color:"var(--t3)"}}>Data & Hora</p>
                      <p className="text-[14px]" style={{color:"var(--t1)"}}>18 Julho 2026 - Portas às 18:30h</p>
                    </div>
                  </div>
                </div>
              </Rv>
              <Rv delay={320}>
                <a href="https://maps.google.com/?q=Academia+das+Artes+do+Estoril" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 text-[10px] tracking-[0.22em] uppercase font-semibold border transition-all duration-400" style={{borderColor:"rgba(200,80,255,0.25)",color:"var(--neon-purple)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--neon-purple)";(e.currentTarget as HTMLElement).style.color="#fff";(e.currentTarget as HTMLElement).style.borderColor="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="var(--neon-purple)";(e.currentTarget as HTMLElement).style.borderColor="rgba(200,80,255,0.25)"}}>
                  <MapPin className="w-3.5 h-3.5"/> Google Maps <ArrowUpRight className="w-3 h-3"/>
                </a>
              </Rv>
            </div>
            <div className="lg:col-span-5">
              <Rv delay={200}>
                <div className="overflow-hidden" style={{borderRadius:"2px"}}>
                  <img src="/venue-bg.png" alt="Academia das Artes do Estoril" className="w-full h-64 sm:h-80 object-cover cin" loading="lazy" decoding="async"/>
                </div>
                <p className="text-[12px] leading-relaxed mt-4" style={{color:"var(--t3)"}}>
                  Estação de comboios do Estoril a 5 min a pé. Estacionamento gratuito nas proximidades. Acessível para mobilidade reduzida.
                </p>
              </Rv>
            </div>
          </div>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24 sm:py-40 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto">
          <Rv>
            <p className="sec-num mb-4">05 - FAQ</p>
            <h2 className="text-3xl sm:text-5xl font-extralight tracking-[-0.03em] mb-14" style={{color:"var(--t1)"}}>Perguntas Frequentes</h2>
          </Rv>
          <Rv delay={100}>
            <Accordion type="single" collapsible className="space-y-[2px]">
              {[
                {q:"Qual a idade mínima para entrar no festival?",a:"O festival é para todas as idades! Crianças até aos 5 anos não pagam entrada (desde que acompanhadas por um adulto). Menores de 12 anos devem estar sempre acompanhados por um responsável adulto. O ambiente é familiar e seguro."},
                {q:"Onde posso comprar bilhetes?",a:"Os bilhetes estão disponíveis exclusivamente na Ticketline, o nosso parceiro oficial. Podes comprar online em ticketline.pt ou nos pontos de venda habituais."},
                {q:"Posso trazer a minha lightstick?",a:"Claro que sim! As lightsticks são bem-vindas e encorajadas. Não são permitidos objetos perigosos como bastões com pontas metálicas ou lasers."},
                {q:"Há estacionamento no local?",a:"Sim, existe estacionamento gratuito nas proximidades da Academia das Artes do Estoril. A estação de comboios fica a 5 minutos a pé."},
                {q:"O evento acontece com chuva?",a:"Os palcos principais são cobertos. Aconselhamos impermeável leve. Em condições extremas, o evento poderá ser adiado e os bilhetes mantêm-se válidos."},
                {q:"Posso reembolsar o meu bilhete?",a:"Bilhetes reembolsáveis até 7 dias após compra, com 48h de antecedência. Contacta a Ticketline diretamente."},
              ].map((f,i)=>(
                <AccordionItem key={i} value={`f-${i}`} style={{background:"var(--surface)",border:"none",borderRadius:0}}>
                  <AccordionTrigger className="text-left text-[14px] font-normal px-6 py-5 hover:no-underline transition-colors" style={{color:"var(--t1)"}}>{f.q}</AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-[14px] leading-relaxed" style={{color:"var(--t2)"}}>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Rv>
        </div>
      </section>

      {/* ═══ CARREGA O HONMOON — Interactive ═══ */}
      <section id="honmoon" className="honmoon-section px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto text-center">
          <Rv>
            <p className="sec-num mb-4">Carrega o Honmoon</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-4" style={{color:"var(--t1)"}}>
              Protege o <span className="gold-shimmer">Honmoon</span>
            </h2>
          </Rv>
          <Rv delay={120}>
            <p className="text-[16px] leading-[1.8] mb-12 max-w-md mx-auto" style={{color:"var(--t2)"}}>
              O escudo Honmoon protege o mundo dos dem&oacute;nios.
              Clica para carregar a energia e ativar a prote&ccedil;&atilde;o!
            </p>
          </Rv>
          <Rv delay={200}>
            <HonmoonCharger/>
          </Rv>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ CONTACT ═══ */}
      <section className="py-20 sm:py-28 px-5 sm:px-10" style={{background:"var(--surface)"}}>
        <div className="max-w-[1400px] mx-auto">
          <Rv>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div>
                <p className="sec-num mb-3">Contacto</p>
                <div className="space-y-3">
                  <a href="tel:+351926828841" className="flex items-center gap-2.5 text-[14px] transition-colors" style={{color:"var(--t2)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t2)"}}>
                    <Phone className="w-3.5 h-3.5"/> +351 926 828 841
                  </a>
                  <a href="mailto:producao@guerreirasdokpop.pt" className="flex items-center gap-2.5 text-[14px] transition-colors" style={{color:"var(--t2)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t2)"}}>
                    <Mail className="w-3.5 h-3.5"/> producao@guerreirasdokpop.pt
                  </a>
                </div>
              </div>
              <div>
                <p className="sec-num mb-3">Produção</p>
                <a href="https://jovsta.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[14px] transition-colors" style={{color:"var(--t2)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t2)"}}>
                  JOVSTA <ArrowUpRight className="w-3 h-3"/>
                </a>
              </div>
              <div>
                <p className="sec-num mb-3">Redes Sociais</p>
                <div className="flex gap-4">
                  {[
                    {i:<Instagram className="w-5 h-5"/>,l:"Instagram"},
                    {i:<Facebook className="w-5 h-5"/>,l:"Facebook"},
                    {i:<Youtube className="w-5 h-5"/>,l:"YouTube"},
                    {i:<Music2 className="w-5 h-5"/>,l:"TikTok"},
                  ].map(s=>(
                    <a key={s.l} href="#" className="transition-colors duration-300" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}} aria-label={s.l}>{s.i}</a>
                  ))}
                </div>
              </div>
            </div>
          </Rv>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-5 sm:px-10 mt-auto border-t" style={{background:"var(--void)",borderColor:"rgba(200,80,255,0.04)"}}>
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center" style={{background:"var(--neon-purple)"}}>
              <span className="text-[8px] font-black" style={{color:"#fff"}}>GK</span>
            </div>
            <span className="text-[10px] tracking-[0.1em]" style={{color:"var(--t3)"}}>&copy; 2026 Guerreiras do K-Pop</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={TL} target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.1em] hover:underline" style={{color:"var(--neon-purple)"}}>Ticketline</a>
            <a href="https://guerreirasdokpop.pt" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.1em] hover:underline" style={{color:"var(--t3)"}}>guerreirasdokpop.pt</a>
          </div>
        </div>
      </footer>

      {/* ═══ MOBILE STICKY CTA ═══ */}
      <div className={`fixed bottom-0 inset-x-0 z-40 sm:hidden p-3 backdrop-blur-2xl border-t transition-opacity duration-300 ${loaded?"":"opacity-0 pointer-events-none"}`} style={{background:"rgba(11,8,19,0.92)",borderColor:"rgba(200,80,255,0.08)"}}>
        <a href={TL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 text-[10px] tracking-[0.22em] font-semibold uppercase" style={{background:"var(--neon-purple)",color:"#fff"}}>
          <Ticket className="w-4 h-4"/> Comprar Bilhete <ExternalLink className="w-3 h-3"/>
        </a>
      </div>
    </div>
    </>
  );
}
