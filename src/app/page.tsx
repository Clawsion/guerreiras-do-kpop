"use client";

import { useEffect, useState, useRef } from "react";
import {
  Ticket, MapPin, Clock, Instagram, Youtube, Music2,
  ExternalLink, Send, ChevronRight, ArrowUpRight, Phone, Mail, Facebook,
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

function Rv({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`rv ${visible ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ═══ COUNTDOWN ═══ */

function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = EVENT.getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff/864e5), h: Math.floor((diff/36e5)%24), m: Math.floor((diff/6e4)%60), s: Math.floor((diff/1e3)%60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex gap-5 sm:gap-8 justify-center">
      {[{v:t.d,l:"Dias"},{v:t.h,l:"Horas"},{v:t.m,l:"Min"},{v:t.s,l:"Seg"}].map(u=>(
        <div key={u.l} className="flex flex-col items-center">
          <span className="text-3xl sm:text-5xl font-extralight tabular-nums tracking-tight" style={{color:"var(--t1)"}}>
            {String(u.v).padStart(2,"0")}
          </span>
          <span className="sec-num mt-1.5">{u.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══ MARQUEE ═══ */

function Marquee({ text }: { text: string }) {
  const r = Array(10).fill(text).join("  ✦  ");
  return (
    <div className="overflow-hidden border-y py-5" style={{borderColor:"rgba(200,80,255,0.08)"}}>
      <div className="marquee-track whitespace-nowrap">
        <span className="text-xl sm:text-3xl font-extralight tracking-widest mx-4" style={{color:"var(--t3)"}}>{r}</span>
        <span className="text-xl sm:text-3xl font-extralight tracking-widest mx-4" style={{color:"var(--t3)"}}>{r}</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════ */
/* ═══ MAIN PAGE ══════════════════════════ */
/* ════════════════════════════════════════ */

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { l: "Espetáculo", h: "#espetaculo" },
    { l: "Lineup", h: "#lineup" },
    { l: "Bilhetes", h: "#bilhetes" },
    { l: "Local", h: "#local" },
    { l: "FAQ", h: "#faq" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{background:"var(--deep)"}}>

      {/* ═══ PRELOADER ═══ */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${loaded?"opacity-0 pointer-events-none":"opacity-100"}`} style={{background:"var(--void)"}}>
        <div className="w-28 h-px relative overflow-hidden" style={{background:"var(--subtle)"}}>
          <div className="absolute inset-y-0 left-0 h-full" style={{background:"var(--neon-purple)",animation:"load 1.6s cubic-bezier(0.16,1,0.3,1) forwards"}}/>
        </div>
      </div>

      {/* ═══ HAMBURGER NAV — fixed, transparent on hero, glass on scroll ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-[95] transition-all duration-500 ${scrolled?"py-4 backdrop-blur-2xl border-b":"py-6"}`} style={{background:scrolled?"rgba(26,10,46,0.92)":"transparent",borderColor:scrolled?"rgba(200,80,255,0.08)":"transparent"}}>
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
          {/* RIGHT: empty space to balance */}
          <div className="w-9"/>
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
              style={{ transitionDelay: menuOpen ? `${i * 80 + 100}ms` : "0ms" }}
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
        <div className="absolute bottom-8 right-8 sm:right-12 flex gap-6" style={{ transitionDelay: menuOpen ? `${navLinks.length * 80 + 350}ms` : "0ms", transform: menuOpen ? "translateX(0)" : "translateX(20px)", opacity: menuOpen ? 1 : 0, transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
            <Instagram className="w-5 h-5"/>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
            <Facebook className="w-5 h-5"/>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
            <Youtube className="w-5 h-5"/>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" style={{color:"var(--t3)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--t3)"}}>
            <Music2 className="w-5 h-5"/>
          </a>
        </div>
        {/* Decorative circle */}
        <div className="hero-circle hidden sm:block" style={{width:"500px",height:"500px",right:"-150px",top:"50%",transform:"translateY(-50%)",borderColor:"rgba(200,80,255,0.06)"}}/>
      </div>

      {/* ═══ HERO — FULL SCREEN ═══ */}
      <section className="hero-section" style={{background:"var(--void)"}}>
        {/* Background image — full bleed */}
        <img
          src="/hero-girls.png"
          alt=""
          className="hero-bg-img"
        />

        {/* Depth overlay — fade at bottom */}
        <div className="hero-bg-overlay"/>

        {/* Vignette — darkens edges */}
        <div className="hero-vignette"/>

        {/* Glow orbs */}
        <div className="hero-glow-orb" style={{width:"40vw",height:"40vw",left:"25%",top:"30%",background:"rgba(200,80,255,0.15)"}}/>
        <div className="hero-glow-orb" style={{width:"30vw",height:"30vw",right:"15%",top:"50%",background:"rgba(74,144,226,0.1)",animationDelay:"3s"}}/>

        {/* Ticketline CTA — bottom center, hero star */}
        <a
          href={TL}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta"
        >
          <Ticket className="w-4 h-4"/> Comprar Bilhete <ExternalLink className="w-3 h-3"/>
        </a>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="scroll-line"/>
        </div>
      </section>

      {/* ═══ INFO STRIP ═══ */}
      <Rv>
        <div className="py-4 px-5 flex flex-wrap items-center justify-center gap-6 sm:gap-14 border-b" style={{borderColor:"rgba(200,80,255,0.08)",background:"var(--surface)"}}>
          {[{i:<Clock className="w-3.5 h-3.5"/>,t:"18 JUL 2026 · 18:30H"},{i:<MapPin className="w-3.5 h-3.5"/>,t:"ACADEMIA DAS ARTES, ESTORIL"},{i:<Ticket className="w-3.5 h-3.5"/>,t:"BILHETES DESDE 25€"}].map(x=>(
            <div key={x.t} className="flex items-center gap-2">
              <span style={{color:"var(--neon-purple)"}}>{x.i}</span>
              <span className="text-[10px] tracking-[0.2em] font-medium" style={{color:"var(--t2)"}}>{x.t}</span>
            </div>
          ))}
        </div>
      </Rv>

      <Marquee text="GUERREIRAS DO K-POP · DEMON HUNTERS · TRIBUTO AO VIVO · CASCAIS 2026"/>

      {/* ═══ ESPETÁCULO ═══ */}
      <section id="espetaculo" className="py-24 sm:py-40 px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-6">
              <Rv>
                <p className="sec-num mb-4">01 — O Espetáculo</p>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-8" style={{color:"var(--t1)"}}>
                  Prepare-se para<br/>se <span className="neon-shimmer">maravilhar</span>
                </h2>
              </Rv>
              <Rv delay={120}>
                <p className="text-[15px] leading-[1.8] mb-6" style={{color:"var(--t2)"}}>
                  As Guerreiras do K-POP é um espetáculo de tributo musical que celebra a energia,
                  a estética e a cultura do K-POP, inspirado na série <span style={{color:"var(--pink-kpop)"}}>K-Pop Demon Hunters</span> da Netflix.
                </p>
              </Rv>
              <Rv delay={200}>
                <p className="text-[15px] leading-[1.8] mb-6" style={{color:"var(--t2)"}}>
                  Com cenografia de luxo, performers de elite e uma fusão electrificante de música e dança,
                  este concerto leva o público numa viagem imersiva pelo universo K-POP — com coreografias
                  icónicas, luzes deslumbrantes e a energia contagiante dos maiores hits.
                </p>
              </Rv>
              <Rv delay={280}>
                <p className="text-[15px] leading-[1.8] mb-8" style={{color:"var(--t2)"}}>
                  Um espetáculo de variedades que transcende o concerto tradicional — onde o palco se transforma
                  num mundo mágico e cada momento se torna uma memória inesquecível.
                </p>
              </Rv>
              <Rv delay={350}>
                <a href={TL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 text-[10px] tracking-[0.22em] uppercase font-semibold border transition-all duration-400" style={{borderColor:"var(--neon-purple)",color:"var(--neon-purple)"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--neon-purple)";(e.currentTarget as HTMLElement).style.color="#fff"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="var(--neon-purple)"}}>
                  <Ticket className="w-3.5 h-3.5"/> Reservar Lugar <ArrowUpRight className="w-3 h-3"/>
                </a>
              </Rv>
            </div>
            <div className="lg:col-span-6 flex items-center">
              <Rv delay={200}>
                <div className="glass-neon p-5 sm:p-7 w-full">
                  <img src="/poster.png" alt="Cartaz Oficial — Guerreiras do K-Pop" className="w-full rounded-sm cin"/>
                  <p className="text-center sec-num mt-4 uppercase">Cartaz Oficial 2026</p>
                </div>
              </Rv>
            </div>
          </div>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ LINEUP ═══ */}
      <section id="lineup" className="py-24 sm:py-40 px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Rv>
            <p className="sec-num mb-4">02 — Lineup</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-16" style={{color:"var(--t1)"}}>
              As Nossas Guerreiras
            </h2>
          </Rv>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2px]">
            {[
              {name:"HUNTRIX",sub:"Headliner — Demon Hunters",c:"var(--gold)"},
              {name:"RUMI",sub:"Vocal Principal",c:"var(--pink-kpop)"},
              {name:"MIRAE",sub:"Dança & Rap",c:"var(--blue-accent)"},
              {name:"ZOE",sub:"Performance Especial",c:"var(--neon-purple)"},
            ].map((a,i)=>(
              <Rv key={a.name} delay={i*100}>
                <div className="group relative overflow-hidden cursor-pointer" style={{background:"var(--surface)"}}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src="/poster.png" alt={a.name} className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105" style={{filter:"grayscale(75%) brightness(0.5)"}}
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

      {/* ═══ BILHETES ═══ */}
      <section id="bilhetes" className="py-24 sm:py-40 px-5 sm:px-10" style={{background:"var(--surface)"}}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <Rv>
              <p className="sec-num mb-4">03 — Bilhetes</p>
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
                <p className="sec-num mb-4">04 — Local</p>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-8" style={{color:"var(--t1)"}}>
                  Academia das Artes<br/>do Estoril
                </h2>
              </Rv>
              <Rv delay={120}>
                <p className="text-[15px] leading-[1.8] mb-8 max-w-lg" style={{color:"var(--t2)"}}>
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
                      <p className="text-[14px]" style={{color:"var(--t1)"}}>18 Julho 2026 — Portas às 18:30h</p>
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
                  <img src="/venue-bg.png" alt="Academia das Artes do Estoril" className="w-full h-64 sm:h-80 object-cover cin"/>
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
            <p className="sec-num mb-4">05 — FAQ</p>
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
      <div className={`fixed bottom-0 inset-x-0 z-40 sm:hidden p-3 backdrop-blur-2xl border-t transition-opacity duration-300 ${scrolled?"":"opacity-0 pointer-events-none"}`} style={{background:"rgba(26,10,46,0.92)",borderColor:"rgba(200,80,255,0.08)"}}>
        <a href={TL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 text-[10px] tracking-[0.22em] font-semibold uppercase" style={{background:"var(--neon-purple)",color:"#fff"}}>
          <Ticket className="w-4 h-4"/> Comprar Bilhete <ExternalLink className="w-3 h-3"/>
        </a>
      </div>
    </div>
  );
}
