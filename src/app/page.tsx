"use client";

import { useEffect, useState, useRef } from "react";
import {
  Ticket,
  MapPin,
  Clock,
  ChevronDown,
  Menu,
  X,
  Instagram,
  Youtube,
  Music2,
  ExternalLink,
  Send,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

/* ─── CONSTANTS ─── */
const TL = "https://www.ticketline.pt";
const EVENT = new Date("2026-07-18T18:30:00");

/* ─── HOOKS ─── */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── COUNTDOWN ─── */

function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = EVENT.getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff / 36e5) % 24),
        m: Math.floor((diff / 6e4) % 60),
        s: Math.floor((diff / 1e3) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-4 sm:gap-6 justify-center">
      {[
        { v: t.d, l: "Dias" },
        { v: t.h, l: "Horas" },
        { v: t.m, l: "Min" },
        { v: t.s, l: "Seg" },
      ].map((u) => (
        <div key={u.l} className="flex flex-col items-center">
          <span className="text-3xl sm:text-5xl font-extralight tabular-nums tracking-tight text-[var(--text-primary)]">
            {String(u.v).padStart(2, "0")}
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[var(--text-dim)] mt-1.5 uppercase">
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── MARQUEE DIVIDER ─── */

function Marquee({ text }: { text: string }) {
  const repeated = Array(8).fill(text).join("  ✦  ");
  return (
    <div className="overflow-hidden border-y border-[var(--gold-dim)]/15 py-5 my-0">
      <div className="marquee-track whitespace-nowrap">
        <span className="text-2xl sm:text-4xl font-extralight tracking-[0.04em] text-[var(--text-dim)]/40 mx-4">
          {repeated}
        </span>
        <span className="text-2xl sm:text-4xl font-extralight tracking-[0.04em] text-[var(--text-dim)]/40 mx-4">
          {repeated}
        </span>
      </div>
    </div>
  );
}

/* ─── REVEAL WRAPPER ─── */

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══ MAIN PAGE ════════════════════════════ */
/* ═══════════════════════════════════════════ */

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Preloader effect */
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-deep)" }}>

      {/* ═══ PRELOADER ═══ */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ background: "var(--bg-void)" }}
      >
        <div className="w-32 h-[1px] relative overflow-hidden" style={{ background: "var(--bg-subtle)" }}>
          <div
            className="absolute inset-y-0 left-0 h-full"
            style={{
              background: "var(--gold)",
              animation: "loading 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          />
        </div>
      </div>

      {/* ═══ NAV ═══ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 backdrop-blur-xl border-b border-white/[0.04]"
            : "py-5"
        }`}
        style={{ background: scrolled ? "rgba(5,2,8,0.85)" : "transparent" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-sm flex items-center justify-center transition-all group-hover:shadow-lg"
              style={{
                background: "var(--gold)",
                boxShadow: "0 0 20px rgba(201,168,76,0.2)",
              }}
            >
              <span className="text-[10px] font-black" style={{ color: "var(--bg-void)" }}>
                GK
              </span>
            </div>
            <span className="text-[13px] font-semibold tracking-[0.15em] text-[var(--text-secondary)] hidden sm:block">
              GUERREIRAS DO K-POP
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {["Lineup", "Bilhetes", "Local", "FAQ"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-[12px] tracking-[0.2em] uppercase text-[var(--text-dim)] hover:text-[var(--gold)] transition-colors duration-300"
              >
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href={TL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold px-5 py-2.5 border transition-all duration-400 hover:bg-[var(--gold)] hover:text-[var(--bg-void)]"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              <Ticket className="w-3.5 h-3.5" />
              Bilhetes
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[var(--text-primary)]"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="md:hidden px-6 py-5 space-y-1 border-t"
            style={{ background: "var(--bg-void)", borderColor: "rgba(201,168,76,0.08)" }}
          >
            {["Lineup", "Bilhetes", "Local", "FAQ"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
              >
                {l}
              </a>
            ))}
            <a
              href={TL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center border px-4 py-3 mt-3 text-sm font-semibold"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              Comprar Bilhetes
            </a>
          </div>
        )}
      </nav>

      {/* ═══ HERO — FULL VIEWPORT CINEMATIC ═══ */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Poster as full background */}
        <div className="absolute inset-0">
          <img
            src="/poster.png"
            alt=""
            className="w-full h-full object-cover object-top cinematic-img"
            style={{ filter: "brightness(0.4) contrast(1.15) saturate(0.7)" }}
          />
          <div className="hero-vignette absolute inset-0" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <Reveal>
            <p
              className="text-[11px] tracking-[0.3em] font-medium mb-8 uppercase"
              style={{ color: "var(--gold)" }}
            >
              Tributo Musical em Tour — Cascais 2026
            </p>
          </Reveal>

          {/* Title — massive, light weight, editorial */}
          <Reveal delay={150}>
            <h1 className="leading-[0.88] tracking-[-0.04em] mb-6">
              <span className="block text-[clamp(3.5rem,13vw,11rem)] font-extralight blue-title">
                GUERREIRAS
              </span>
              <span className="block text-[clamp(3.5rem,13vw,11rem)] font-extralight gold-shimmer">
                DO K-POP
              </span>
            </h1>
          </Reveal>

          {/* Countdown */}
          <Reveal delay={300}>
            <div className="mb-8">
              <Countdown />
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={450}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={TL} target="_blank" rel="noopener noreferrer" className="btn-gold">
                <Ticket className="w-4 h-4" />
                Comprar Bilhete
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="#lineup"
                className="text-[12px] tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors flex items-center gap-2"
              >
                Descobrir Lineup
                <ChevronDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="scroll-line" />
        </div>
      </section>

      {/* ═══ INFO STRIP ═══ */}
      <Reveal>
        <div
          className="py-5 px-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12 border-b"
          style={{ borderColor: "rgba(201,168,76,0.08)", background: "var(--bg-surface)" }}
        >
          {[
            { icon: <Clock className="w-3.5 h-3.5" />, text: "18 JUL 2026 · 18:30H" },
            { icon: <MapPin className="w-3.5 h-3.5" />, text: "ACADEMIA DAS ARTES, ESTORIL" },
            { icon: <Ticket className="w-3.5 h-3.5" />, text: "BILHETES A PARTIR DE 25€" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span style={{ color: "var(--gold)" }}>{item.icon}</span>
              <span className="text-[11px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ═══ MARQUEE ═══ */}
      <Marquee text="GUERREIRAS DO K-POP · DEMON HUNTERS · TRIBUTO AO VIVO · CASCAIS 2026" />

      {/* ═══ LINEUP ═══ */}
      <section id="lineup" className="py-24 sm:py-36 px-6 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[11px] tracking-[0.3em] font-medium uppercase mb-3" style={{ color: "var(--gold)" }}>
              Lineup
            </p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[-0.03em] mb-16" style={{ color: "var(--text-primary)" }}>
              As Guerreiras
            </h2>
          </Reveal>

          {/* Artist Grid — editorial tight gaps */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2px]">
            {[
              { name: "HUNTRIX", sub: "Headliner — Demon Hunters", accent: "var(--gold)" },
              { name: "RUMI", sub: "Vocal Principal", accent: "var(--pink-kpop)" },
              { name: "MIRAE", sub: "Dança & Rap", accent: "#20B2AA" },
              { name: "ZOE", sub: "Performance Especial", accent: "var(--blue-title)" },
            ].map((artist, i) => (
              <Reveal key={artist.name} delay={i * 100}>
                <div className="group relative overflow-hidden cursor-pointer" style={{ background: "var(--bg-surface)" }}>
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src="/poster.png"
                      alt={artist.name}
                      className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
                      style={{ filter: "grayscale(70%) brightness(0.5)" }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLImageElement).style.filter = "grayscale(0%) brightness(0.75)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLImageElement).style.filter = "grayscale(70%) brightness(0.5)";
                      }}
                    />
                  </div>
                  {/* Overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5"
                    style={{ background: "linear-gradient(to top, var(--bg-void) 10%, transparent 100%)" }}
                  >
                    <p
                      className="text-[9px] tracking-[0.25em] font-semibold mb-1 uppercase"
                      style={{ color: artist.accent }}
                    >
                      {artist.sub}
                    </p>
                    <h3
                      className="text-xl sm:text-2xl font-light tracking-[-0.01em] transition-colors duration-300"
                      style={{ color: "var(--text-primary)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = artist.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                      }}
                    >
                      {artist.name}
                    </h3>
                    <div className="flex gap-3 mt-2">
                      <Instagram className="w-3.5 h-3.5 text-[var(--text-dim)] hover:text-[var(--pink-kpop)] cursor-pointer transition-colors" />
                      <Youtube className="w-3.5 h-3.5 text-[var(--text-dim)] hover:text-red-500 cursor-pointer transition-colors" />
                      <Music2 className="w-3.5 h-3.5 text-[var(--text-dim)] hover:text-[#00F2EA] cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Official poster */}
          <Reveal className="mt-20 flex justify-center">
            <div className="glass-gold p-5 sm:p-6 inline-block rounded-sm">
              <img
                src="/poster.png"
                alt="Cartaz Oficial"
                className="max-h-[400px] rounded-sm"
              />
              <p className="text-center text-[10px] tracking-[0.25em] text-[var(--text-dim)] mt-4 uppercase">
                Cartaz Oficial — Guerreiras do K-Pop 2026
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section className="py-24 sm:py-36 px-6 sm:px-10" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <p className="text-[11px] tracking-[0.3em] font-medium uppercase mb-3" style={{ color: "var(--gold)" }}>
              Experiência
            </p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[-0.03em] mb-16" style={{ color: "var(--text-primary)" }}>
              O Que Te Espera
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
            {[
              {
                title: "Palco Principal",
                desc: "Atuações ao vivo de tributo com coreografias e efeitos visuais que replicam a energia dos concertos K-Pop. As Guerreiras sobem ao palco para uma noite épica.",
                accent: "var(--gold)",
                num: "01",
              },
              {
                title: "Random Play Dance",
                desc: "O momento mais esperado por todos os fãs! DJ ao vivo, hits aleatórios, e toda a gente a dançar. Quem sabe a coreografia toda? Provem-no!",
                accent: "var(--pink-kpop)",
                num: "02",
              },
              {
                title: "K-Culture Zone",
                desc: "K-Beauty, moda coreana, snacks e merch exclusivo. Workshops de maquilhagem e provas de comida coreana. A cultura K-Pop para além da música.",
                accent: "var(--purple-vivid)",
                num: "03",
              },
              {
                title: "Meet & Greet",
                desc: "Sessões exclusivas de autógrafos e fotos com as artistas. Uma oportunidade única para criar memórias com as Guerreiras Demon Hunters.",
                accent: "#20B2AA",
                num: "04",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div
                  className="group p-8 sm:p-12 transition-all duration-500 hover:bg-[var(--bg-elevated)]"
                  style={{ background: "var(--bg-deep)" }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[10px] tracking-[0.2em] font-mono" style={{ color: "var(--text-dim)" }}>
                      {item.num}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.accent }} />
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-light tracking-[-0.01em] mb-4 transition-colors duration-300"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE 2 ═══ */}
      <Marquee text="HUNTRIX · RUMI · MIRAE · ZOE · DEMON HUNTERS · K-POP TRIBUTE · CASCAIS" />

      {/* ═══ TICKETS ═══ */}
      <section id="bilhetes" className="py-24 sm:py-36 px-6 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <Reveal>
              <p className="text-[11px] tracking-[0.3em] font-medium uppercase mb-3" style={{ color: "var(--gold)" }}>
                Bilhetes
              </p>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[-0.03em]" style={{ color: "var(--text-primary)" }}>
                Escolhe o Teu
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <a
                href={TL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[12px] tracking-[0.15em] text-[var(--text-dim)] hover:text-[var(--gold)] transition-colors"
              >
                ticketline.pt <ExternalLink className="w-3 h-3" />
              </a>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Geral",
                price: "25€",
                features: ["Acesso a todos os palcos", "Random Play Dance", "K-Culture Zone"],
                accent: "var(--text-secondary)",
                featured: false,
              },
              {
                name: "VIP",
                price: "45€",
                features: ["Tudo do Geral", "Zona VIP frente ao palco", "Meet & Greet inclusivo", "Merch exclusivo"],
                accent: "var(--gold)",
                featured: true,
              },
              {
                name: "Premium",
                price: "75€",
                features: ["Tudo do VIP", "Backstage Experience", "Jantar K-Food inclusivo", "Kit Premium completo"],
                accent: "var(--pink-kpop)",
                featured: false,
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div
                  className={`ticket-card p-8 sm:p-10 flex flex-col h-full ${
                    t.featured ? "glass-gold" : "glass"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {t.featured && (
                    <span
                      className="self-start text-[9px] tracking-[0.25em] font-bold px-2.5 py-1 mb-6 uppercase"
                      style={{ background: "var(--gold)", color: "var(--bg-void)" }}
                    >
                      Popular
                    </span>
                  )}

                  <h3
                    className="text-[11px] tracking-[0.25em] font-semibold uppercase mb-2"
                    style={{ color: t.accent }}
                  >
                    {t.name}
                  </h3>
                  <span className="text-5xl sm:text-6xl font-extralight tracking-[-0.03em] mb-8" style={{ color: "var(--text-primary)" }}>
                    {t.price}
                  </span>

                  <ul className="space-y-3 mb-10 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: t.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={TL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3.5 text-[11px] tracking-[0.2em] font-semibold uppercase transition-all duration-400 ${
                      t.featured
                        ? "hover:brightness-110"
                        : "border hover:bg-[var(--gold)] hover:text-[var(--bg-void)] hover:border-[var(--gold)]"
                    }`}
                    style={{
                      borderRadius: 0,
                      ...(t.featured
                        ? { background: "var(--gold)", color: "var(--bg-void)" }
                        : { borderColor: "rgba(201,168,76,0.2)", color: "var(--gold)" }),
                    }}
                  >
                    Comprar <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              Desconto de grupo: 4+ bilhetes com 10% desconto.{" "}
              <a href={TL} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--gold)" }}>
                Saber mais
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ VENUE ═══ */}
      <section id="local" className="py-24 sm:py-36 px-6 sm:px-10" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-[11px] tracking-[0.3em] font-medium uppercase mb-3" style={{ color: "var(--gold)" }}>
                  Local
                </p>
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[-0.03em] mb-8" style={{ color: "var(--text-primary)" }}>
                  Academia das<br />Artes do Estoril
                </h2>
              </Reveal>

              <Reveal delay={150}>
                <p className="text-[16px] leading-[1.7] mb-10 max-w-lg" style={{ color: "var(--text-secondary)" }}>
                  Um espaço icónico na costa de Cascais, onde a arte e a cultura se encontram.
                  A localização perfeita para receber as Guerreiras do K-Pop, com vista sobre
                  o Atlântico e infraestruturas de primeiro nível.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="space-y-5 mb-10">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--gold)" }} />
                    <div>
                      <p className="text-[11px] tracking-[0.15em] uppercase font-medium mb-1" style={{ color: "var(--text-dim)" }}>Morada</p>
                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                        Av. Marginal, 2765-282 Estoril, Cascais
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--gold)" }} />
                    <div>
                      <p className="text-[11px] tracking-[0.15em] uppercase font-medium mb-1" style={{ color: "var(--text-dim)" }}>Data & Hora</p>
                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                        18 Julho 2026 — Portas às 18:30h
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <a
                  href="https://maps.google.com/?q=Academia+das+Artes+do+Estoril"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold px-6 py-3 border transition-all duration-400 hover:bg-[var(--gold)] hover:text-[var(--bg-void)] hover:border-[var(--gold)]"
                  style={{ borderColor: "rgba(201,168,76,0.3)", color: "var(--gold)", borderRadius: 0 }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Google Maps
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={200}>
                <div className="overflow-hidden" style={{ borderRadius: "2px" }}>
                  <img
                    src="/venue-bg.png"
                    alt="Academia das Artes do Estoril"
                    className="w-full h-64 sm:h-80 object-cover cinematic-img"
                  />
                </div>
                <p className="text-[12px] leading-relaxed mt-4" style={{ color: "var(--text-dim)" }}>
                  Estação de comboios do Estoril a 5 min a pé. Estacionamento gratuito nas proximidades.
                  Acessível para pessoas com mobilidade reduzida.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24 sm:py-36 px-6 sm:px-10">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-[11px] tracking-[0.3em] font-medium uppercase mb-3" style={{ color: "var(--gold)" }}>
              FAQ
            </p>
            <h2 className="text-4xl sm:text-5xl font-extralight tracking-[-0.03em] mb-14" style={{ color: "var(--text-primary)" }}>
              Perguntas Frequentes
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <Accordion type="single" collapsible className="space-y-[2px]">
              {[
                {
                  q: "Qual a idade mínima para entrar no festival?",
                  a: "O festival é para todas as idades! Crianças até aos 5 anos não pagam entrada (desde que acompanhadas por um adulto). Menores de 12 anos devem estar sempre acompanhados por um responsável adulto.",
                },
                {
                  q: "Onde posso comprar bilhetes?",
                  a: "Os bilhetes estão disponíveis exclusivamente na Ticketline, o nosso parceiro oficial. Podes comprar online em ticketline.pt ou nos pontos de venda habituais.",
                },
                {
                  q: "Posso trazer a minha lightstick?",
                  a: "Claro que sim! As lightsticks são bem-vindas e encorajadas. Não são permitidos objetos perigosos como bastões com pontas metálicas ou lasers.",
                },
                {
                  q: "Há estacionamento no local?",
                  a: "Sim, existe estacionamento gratuito nas proximidades. A estação de comboios do Estoril fica a 5 minutos a pé do local.",
                },
                {
                  q: "O evento acontece com chuva?",
                  a: "Os palcos principais são cobertos. Aconselhamos impermeável leve. Em condições extremas, o evento poderá ser adiado e os bilhetes mantêm-se válidos.",
                },
                {
                  q: "Posso reembolsar o meu bilhete?",
                  a: "Bilhetes reembolsáveis até 7 dias após compra, com 48h de antecedência. Contacta a Ticketline diretamente.",
                },
              ].map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  style={{ background: "var(--bg-surface)", borderRadius: 0, border: "none" }}
                >
                  <AccordionTrigger
                    className="text-left text-[14px] font-normal px-6 py-5 faq-trigger hover:no-underline"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-24 sm:py-36 px-6 sm:px-10" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.3em] font-medium uppercase mb-3" style={{ color: "var(--gold)" }}>
              Newsletter
            </p>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-[-0.02em] mb-4" style={{ color: "var(--text-primary)" }}>
              Fica Ligado
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Subscreve e recebe novidades sobre lineup, bilhetes e surpresas exclusivas.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-10">
              <Input
                type="email"
                placeholder="O teu email"
                className="bg-[var(--bg-deep)] border-[rgba(201,168,76,0.15)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20 placeholder:text-[var(--text-dim)] text-sm rounded-none"
              />
              <button
                type="submit"
                className="shrink-0 px-5 py-2 text-[11px] tracking-[0.18em] font-semibold uppercase transition-all duration-300 hover:bg-[var(--gold-light)]"
                style={{ background: "var(--gold)", color: "var(--bg-void)" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex items-center justify-center gap-6">
              {[
                { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                { icon: <Youtube className="w-5 h-5" />, label: "YouTube" },
                { icon: <Music2 className="w-5 h-5" />, label: "TikTok" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="transition-colors duration-300"
                  style={{ color: "var(--text-dim)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"; }}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="py-12 px-6 sm:px-10 mt-auto border-t"
        style={{ background: "var(--bg-void)", borderColor: "rgba(201,168,76,0.06)" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-7 h-7 flex items-center justify-center"
                  style={{ background: "var(--gold)" }}
                >
                  <span className="text-[9px] font-black" style={{ color: "var(--bg-void)" }}>GK</span>
                </div>
                <span className="text-[12px] font-semibold tracking-[0.12em]" style={{ color: "var(--text-secondary)" }}>
                  GUERREIRAS DO K-POP
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--text-dim)" }}>
                Tributo musical em tour. Inspirado na série K-Pop Demon Hunters da Netflix.
              </p>
            </div>

            <div className="flex gap-12">
              <div>
                <p className="text-[9px] tracking-[0.25em] font-bold uppercase mb-3" style={{ color: "var(--text-dim)" }}>
                  Navegação
                </p>
                {["Lineup", "Bilhetes", "Local", "FAQ"].map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    className="block text-xs py-1 transition-colors"
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"; }}
                  >
                    {l}
                  </a>
                ))}
              </div>
              <div>
                <p className="text-[9px] tracking-[0.25em] font-bold uppercase mb-3" style={{ color: "var(--text-dim)" }}>
                  Bilheteira
                </p>
                <a
                  href={TL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs hover:underline"
                  style={{ color: "var(--gold)" }}
                >
                  ticketline.pt <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="gold-divider mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] tracking-[0.1em]" style={{ color: "var(--text-dim)" }}>
              &copy; 2026 Guerreiras do K-Pop. Todos os direitos reservados.
            </p>
            <p className="text-[10px] tracking-[0.1em]" style={{ color: "var(--text-dim)" }}>
              Bilheteira oficial:{" "}
              <a href={TL} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--gold)" }}>
                Ticketline
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ═══ MOBILE STICKY CTA ═══ */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 sm:hidden p-3 backdrop-blur-xl border-t"
        style={{ background: "rgba(5,2,8,0.9)", borderColor: "rgba(201,168,76,0.1)" }}
      >
        <a
          href={TL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] tracking-[0.18em] font-semibold uppercase"
          style={{ background: "var(--gold)", color: "var(--bg-void)" }}
        >
          <Ticket className="w-4 h-4" />
          Comprar Bilhete
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
