"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import NeonLightbox from "@/components/NeonLightbox";
import {
  Ticket, MapPin, Clock, Instagram, Youtube, Music2,
  ExternalLink, Send, ChevronRight, ArrowUpRight, Phone, Mail, Facebook,
  Flame, Sparkles, Mic2, MonitorPlay, PartyPopper, Cherry, Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";

/* ════════════════════════════════════════ */
/* ═══ DATA ══════════════════════════════ */
/* ════════════════════════════════════════ */

const TL = "https://www.ticketline.pt";
const EVENT = new Date("2026-07-18T18:30:00");

/* ── Device detection for adaptive performance ── */
const IS_MOBILE = typeof window !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const SHIELD_PARTICLES = IS_MOBILE ? 6 : 12;
const CHARGER_PARTICLES = IS_MOBILE ? 4 : 8;

/* K-Pop gallery photos - hosted externally on PostImg */
const GALLERY_PHOTOS = [
  { src: "https://i.postimg.cc/x8S0prmN/kpop2.png", caption: "Saja Boys estão aqui" },
  { src: "https://i.postimg.cc/PxDXMfCP/kpop1.png", caption: "As Guerreiras do K-Pop à tua espera" },
  { src: "https://i.postimg.cc/KvfZfH8S/kpop6.png", caption: "Experiência Imersiva" },
  { src: "https://i.postimg.cc/2yFCPHd2/kpop3.png", caption: "Atmosfera do Concerto" },
  { src: "https://i.postimg.cc/mZQZzDxY/kpop4.png", caption: "Interação com o Público" },
  { src: "https://i.postimg.cc/Qxh8p3sq/kpop5.png", caption: "Derpy também está cá" },
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

/* ═══ HERO COUNTDOWN - Neon Boxes ═══ */

function HeroCountdown() {
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
  const units = [{v:t.d,l:"Dias"},{v:t.h,l:"Horas"},{v:t.m,l:"Min"},{v:t.s,l:"Seg"}];
  return (
    <div className="hero-countdown-seals">
      {units.map((u, i) => (
        <React.Fragment key={u.l}>
          <div className="hero-seal">
            <div className="hero-seal-ring">
              <div className="hero-seal-arc hero-seal-arc-1"/>
              <div className="hero-seal-arc hero-seal-arc-2"/>
            </div>
            <span className="hero-seal-num" suppressHydrationWarning>
              {mounted ? String(u.v).padStart(2, "0") : "\u2013\u2013"}
            </span>
            <span className="hero-seal-label">{u.l}</span>
          </div>
          {i < units.length - 1 && <span className="hero-seal-sep">&#x2726;</span>}
        </React.Fragment>
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

/* ═══ LED WALL - WebGL Shader (zero compression, max quality, infinite loop) ═══ */
/* Build: 2026-06-16-v11 */

/* ═══ QUIZ - K-Pop Demon Hunters Trivia ═══ */

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index of correct option (0-3)
  theme: "ZOEY" | "RUMI" | "MIRAE";
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  /* ── ZOEY - Coragem ── */
  { q: "Qual é a arma de Zoey?", options: ["Espada Saingeom", "Gok-do (l\u00e2mina curva)", "Adagas Shin-kal", "Arco celestial"], answer: 2, theme: "ZOEY" },
  { q: "Zoey \u00e9 a maknae do HUNTR/X. O que isso significa?", options: ["A l\u00edder do grupo", "A mais nova do grupo", "A dan\u00e7arina principal", "A vocalista principal"], answer: 1, theme: "ZOEY" },
  { q: "Quantos cadernos de insultos contra dem\u00f3nios Zoey tem?", options: ["5", "12", "23", "50"], answer: 2, theme: "ZOEY" },
  { q: "De onde \u00e9 Zoey antes de se juntar ao HUNTR/X?", options: ["Seul, Coreia", "T\u00f3quio, Jap\u00e3o", "Burbank, Calif\u00f3rnia", "Londres, Inglaterra"], answer: 2, theme: "ZOEY" },
  { q: "Quem faz a voz de canto de Zoey no filme?", options: ["EJAE", "Audrey Nuna", "Rei Ami", "Lea Salonga"], answer: 2, theme: "ZOEY" },
  { q: "Qual membro dos Saja Boys est\u00e1 emparelhado com Zoey no fan meetup?", options: ["Jinu", "Romance", "Mystery", "Abs"], answer: 2, theme: "ZOEY" },
  { q: "Zoey \u00e9 a primeira a cair sob o feiti\u00e7o de quem?", options: ["Gwi-Ma", "Saja Boys", "Jinu", "Healer Han"], answer: 1, theme: "ZOEY" },
  { q: "Qual \u00e9 o tipo de personalidade MBTI de Zoey?", options: ["INFJ", "ENFP", "ISTP", "ENTJ"], answer: 1, theme: "ZOEY" },
  { q: "Na abertura do filme, as Guerreiras lutam contra dem\u00f3nios onde?", options: ["Num comboio", "Num jato privado", "Num est\u00e1dio", "Namsan Tower"], answer: 1, theme: "ZOEY" },
  { q: "Quantos membros tem o grupo Saja Boys?", options: ["3", "4", "5", "6"], answer: 2, theme: "ZOEY" },

  /* ── RUMI - M\u00fasica ── */
  { q: "Qual \u00e9 o segredo de Rumi sobre a sua identidade?", options: ["\u00c9 uma princesa", "\u00c9 meio-dem\u00f3nio (cambion)", "\u00c9 uma espi\u00e3", "\u00c9 imortal"], answer: 1, theme: "RUMI" },
  { q: "Qual \u00e9 a arma de Rumi?", options: ["Adagas Shin-kal", "Gok-do", "Espada Saingeom", "Arco espiritual"], answer: 2, theme: "RUMI" },
  { q: "Quem criou Rumi ap\u00f3s a morte da sua m\u00e3e?", options: ["Bobby", "Healer Han", "Celine", "Gwi-Ma"], answer: 2, theme: "RUMI" },
  { q: "Que m\u00fasica Rumi n\u00e3o consegue cantar por causa da letra?", options: ["Golden", "Takedown", "Soda Pop", "Free"], answer: 1, theme: "RUMI" },
  { q: "Qual \u00e9 a m\u00fasica que Rumi improvisa na batalha final?", options: ["Golden", "Free", "What It Sounds Like", "How It\u2019s Done"], answer: 2, theme: "RUMI" },
  { q: "Quem faz a voz de canto de Rumi?", options: ["Rei Ami", "EJAE", "Audrey Nuna", "Lea Salonga"], answer: 1, theme: "RUMI" },
  { q: "Rumi e Jinu cantam um dueto. Qual \u00e9 o nome?", options: ["Golden", "Free", "Takedown", "What It Sounds Like"], answer: 1, theme: "RUMI" },
  { q: "A m\u00e3e de Rumi era membro de que grupo de ca\u00e7adoras?", options: ["HUNTR/X", "Sunshine Sisters", "Saja Girls", "Demon Slayers"], answer: 1, theme: "RUMI" },
  { q: "Quando Rumi perde a voz, o que a enfraquece?", options: ["Uma maldi\u00e7\u00e3o de Gwi-Ma", "A vergonha da sua identidade", "Uma doen\u00e7a", "O cansa\u00e7o"], answer: 1, theme: "RUMI" },
  { q: "O que acontece \u00e0 espada de Rumi depois de Jinu dar a sua alma?", options: ["Desaparece", "Fica mais forte com rosto de dokkaebi", "Transforma-se em adagas", "Fica dourada"], answer: 1, theme: "RUMI" },

  /* ── MIRAE - Dan\u00e7a ── */
  { q: "Qual \u00e9 a arma de Mira?", options: ["Adagas Shin-kal", "Espada Saingeom", "Gok-do (l\u00e2mina curva de haste)", "Arco espiritual"], answer: 2, theme: "MIRAE" },
  { q: "Mira \u00e9 conhecida como o qu\u00ea do grupo?", options: ["A l\u00edder", "A Dennis Rodman do grupo", "A mais calma", "A mais nova"], answer: 1, theme: "MIRAE" },
  { q: "Qual \u00e9 o signo do zod\u00edaco de Mira?", options: ["Peixes", "\u00c1ries", "Escorpi\u00e3o", "Le\u00e3o"], answer: 1, theme: "MIRAE" },
  { q: "Quem faz a voz de canto de Mira?", options: ["EJAE", "Rei Ami", "Audrey Nuna", "Arden Cho"], answer: 2, theme: "MIRAE" },
  { q: "Mira \u00e9 a primeira a fazer o qu\u00ea?", options: ["Derrotar Gwi-Ma", "Sentir que Rumi esconde um segredo", "Cantar solo", "Abandonar o grupo"], answer: 1, theme: "MIRAE" },
  { q: "Qual membro dos Saja Boys est\u00e1 emparelhado com Mira?", options: ["Jinu", "Romance", "Mystery", "Abs"], answer: 3, theme: "MIRAE" },
  { q: "Que cor \u00e9 o cabelo de Mira?", options: ["Roxo", "Azul", "Cor-de-rosa", "Loiro"], answer: 2, theme: "MIRAE" },
  { q: "Qual \u00e9 a fun\u00e7\u00e3o de Mira no HUNTR/X?", options: ["Rapper principal", "Vocalista principal", "Dan\u00e7arina principal e core\u00f3grafa", "Maknae"], answer: 2, theme: "MIRAE" },
  { q: "A arma gok-do de Mira pode fazer o qu\u00ea?", options: ["Voar", "Emitir ondas de choque", "Curar feridas", "Criar ilus\u00f5es"], answer: 1, theme: "MIRAE" },
  { q: "De que tipo de fam\u00edlia Mira vem?", options: ["Pobre", "Adotiva", "Rica", "De dem\u00f3nios"], answer: 2, theme: "MIRAE" },

  /* ── Geral - Misturado ── */
  { q: "Como se chama a barreira m\u00e1gica que protege o mundo?", options: ["Honmoon", "Soul Gate", "Gwi-Ma", "Demon Shield"], answer: 0, theme: "RUMI" },
  { q: "O que significa Honmoon em coreano?", options: ["Porta da Luz", "Porta da Alma", "Escudo Eterno", "Barreira Sagrada"], answer: 1, theme: "MIRAE" },
  { q: "Qual \u00e9 a m\u00fasica de estreia dos Saja Boys?", options: ["Your Idol", "Takedown", "Soda Pop", "How It\u2019s Done"], answer: 2, theme: "ZOEY" },
  { q: "O que acontece quando o Honmoon se enfraquece?", options: ["Nada", "Os dem\u00f3nios entram no mundo humano", "Chove", "A m\u00fasica para"], answer: 1, theme: "MIRAE" },
  { q: "Onde acontece a batalha final do filme?", options: ["Seoul Olympic Stadium", "Namsan Tower", "Banhos p\u00fablicos", "Myeongdong"], answer: 1, theme: "RUMI" },
  { q: "Quantas ca\u00e7adoras de dem\u00f3nios podem estar ativas de cada vez?", options: ["2", "3", "5", "Sem limite"], answer: 1, theme: "ZOEY" },
  { q: "Qual \u00e9 o nome do rei dos dem\u00f3nios?", options: ["Jinu", "Dokkaebi", "Gwi-Ma", "Ma-Gi"], answer: 2, theme: "RUMI" },
  { q: "O que os Saja Boys querem fazer ao Honmoon?", options: ["Proteg\u00ea-lo", "Destru\u00ed-lo", "Roub\u00e1-lo", "Escond\u00ea-lo"], answer: 1, theme: "ZOEY" },
  { q: "Qual m\u00fasica ganhou o Globo de Ouro e o \u00d3scar?", options: ["Soda Pop", "Takedown", "Golden", "How It\u2019s Done"], answer: 2, theme: "MIRAE" },
  { q: "Que tipo de Honmoon Rumi cria no final?", options: ["Dourado", "Arco-\u00edris", "Vermelho", "Prateado"], answer: 1, theme: "RUMI" },
];

const QUIZ_CHARACTERS = [
  { name: "Zoey", color: "var(--blue-accent)", img: "/real-zoe.webp", theme: "Coragem" },
  { name: "Rumi", color: "var(--neon-purple)", img: "/real-rumi.webp", theme: "Música" },
  { name: "Mira", color: "var(--pink-kpop)", img: "/real-mirae.webp", theme: "Dança" },
];

function QuizCard({ character, onScore }: { character: typeof QUIZ_CHARACTERS[number]; onScore: (correct: boolean) => void }) {
  const [flipped, setFlipped] = useState(false);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [usedQ, setUsedQ] = useState<Set<number>>(new Set());
  const [currentTheme, setCurrentTheme] = useState(character.name);

  const allThemes: Array<"ZOEY" | "RUMI" | "MIRAE"> = ["ZOEY", "RUMI", "MIRAE"];

  const pickQuestion = useCallback(() => {
    const themePool = QUIZ_QUESTIONS.filter((q, i) => q.theme === currentTheme && !usedQ.has(i));
    const anyPool = QUIZ_QUESTIONS.filter((_, i) => !usedQ.has(i));
    const available = themePool.length > 0 ? themePool : anyPool.length > 0 ? anyPool : QUIZ_QUESTIONS;
    const idx = Math.floor(Math.random() * available.length);
    const chosen = available[idx];
    const globalIdx = QUIZ_QUESTIONS.indexOf(chosen);
    setUsedQ(prev => new Set([...prev, globalIdx]));
    const nextThemeIdx = (allThemes.indexOf(currentTheme) + 1) % allThemes.length;
    setCurrentTheme(allThemes[nextThemeIdx]);
    return chosen;
  }, [currentTheme, usedQ]);

  const handleFlip = useCallback(() => {
    if (!flipped) {
      const q = pickQuestion();
      setQuestion(q);
      setSelected(null);
      setShowResult(false);
    }
    setFlipped(f => !f);
  }, [flipped, pickQuestion]);

  const handleAnswer = useCallback((idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (question) onScore(idx === question.answer);
  }, [showResult, question, onScore]);

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFlipped(false);
    setTimeout(() => {
      setQuestion(null);
      setSelected(null);
      setShowResult(false);
    }, 500);
  }, []);

  return (
    <div className="quiz-card" onClick={!flipped ? handleFlip : undefined} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' && !flipped) handleFlip(); }}>
      <div className={`quiz-card-inner${flipped ? " quiz-flipped" : ""}`}>
        {/* ═══ FRONT - Character Image + Theme Badge ═══ */}
        <div className="quiz-card-front">
          <div className="quiz-glow" style={{ background: `radial-gradient(circle, ${character.color}33 0%, transparent 70%)` }} />
          <img src={character.img} alt={character.name} className="quiz-char-img" loading="lazy" decoding="async" />
          <div className="quiz-theme-label" style={{ color: character.color }}>{character.theme}</div>
          <p className="quiz-char-name" style={{ color: character.color }}>{character.name}</p>
          <p className="quiz-hint">Clica para jogar</p>
        </div>
        {/* ═══ BACK - White background, question + 4 options, no mirror ═══ */}
        <div className="quiz-card-back">
          {question ? (
            <>
              <p className="quiz-back-theme" style={{ color: character.color }}>{character.name}</p>
              <p className="quiz-question">{question.q}</p>
              <div className="quiz-options">
                {question.options.map((opt, i) => {
                  let optClass = "quiz-option";
                  if (showResult) {
                    if (i === question.answer) optClass += " quiz-correct";
                    else if (i === selected) optClass += " quiz-wrong";
                  }
                  return (
                    <button key={i} className={optClass} onClick={(e) => { e.stopPropagation(); handleAnswer(i); }}
                      onTouchEnd={(e) => { e.stopPropagation(); }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <div className={`quiz-result ${selected === question.answer ? "quiz-result-correct" : "quiz-result-wrong"}`}>
                  {selected === question.answer ? "Correto!" : "Errado!"}
                </div>
              )}
              {showResult && (
                <button className="quiz-back-btn" onClick={handleBack}>
                  Voltar
                </button>
              )}
            </>
          ) : (
            <p className="quiz-question" style={{ opacity: 0.5 }}>A carregar...</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ CARREGA O HONMOON - Interactive Charging ═══ */

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
      {Array.from({length: CHARGER_PARTICLES}, (_, i) => (
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
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('honmoon-theme');
      if (saved === 'light') return 'light';
    }
    return 'dark';
  });
  const [burstKey, setBurstKey] = useState(0);
  const [ripple, setRipple] = useState<{active:boolean; x:number; y:number; toMode:'dark'|'light'}|null>(null);
  const [waveActive, setWaveActive] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const orbRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLElement[] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* Pause ALL CSS animations when tab is hidden - massive CPU/GPU savings */
  useEffect(() => {
    const onVis = () => {
      document.body.style.setProperty("--anim-state", document.hidden ? "paused" : "running");
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Sync light-mode class to <html> on mount (theme already read from localStorage via useState initializer)
  useEffect(() => {
    if (themeMode === 'light') {
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('honmoon-theme', themeMode);
    // Sync light-mode class to <html> so WebGL shaders can detect theme
    if (themeMode === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const navLinks = useMemo(() => [
    { l: "Espetáculo", h: "#espetaculo" },
    { l: "Quiz", h: "#identidade" },
    { l: "Mural", h: "#galeria" },
    { l: "Cartazes", h: "#cartazes" },
    { l: "Contacto", h: "#contacto" },
  ], []);

  return (
    <>
      {/* ═══ RIPPLE BG LAYER - new theme background spreads from orb via clip-path ═══ */}
      {ripple?.active && (
        <div className="hm-ripple-bg-layer">
          <div
            className={`hm-ripple-bg ${ripple.toMode === 'light' ? 'awaken' : 'dormant'}`}
            style={{'--rx': `${ripple.x}%`, '--ry': `${ripple.y}%`} as React.CSSProperties}
          />
        </div>
      )}

      {/* ═══ MAIN CONTENT - always visible, transparent bg during transition ═══ */}
      <div
        className={`min-h-screen flex flex-col relative z-10 ${themeMode === 'light' ? 'light-mode' : ''} ${waveActive ? 'wave-transition' : ''}`}
        style={{background: ripple?.active ? 'transparent' : 'var(--deep)'}}
      >

      {/* ═══ RIPPLE SHIMMER - subtle wave glow that passes over content ═══ */}
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

      {/* ═══ PRELOADER - Curtain Reveal ═══ */}
      {themeMode === 'dark' ? (
        <div className={`preloader-honmoon ${loaded?"preloader-done":""}`}>
          <div className="preloader-curtain-left"/>
          <div className="preloader-curtain-right"/>
        </div>
      ) : (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            transition: 'opacity 0.6s ease 2.3s',
            opacity: loaded ? 0 : 1,
            pointerEvents: loaded ? 'none' : 'auto',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '52%',
              background: '#E0CCF2',
              borderRight: '1px solid rgba(147,51,234,0.25)',
              boxShadow: 'inset -20px 0 40px rgba(147,51,234,0.06)',
              transform: loaded ? 'translateX(-105%)' : 'translateX(0)',
              transition: 'transform 2.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
              willChange: 'transform',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '52%',
              background: '#E0CCF2',
              borderLeft: '1px solid rgba(147,51,234,0.25)',
              boxShadow: 'inset 20px 0 40px rgba(147,51,234,0.06)',
              transform: loaded ? 'translateX(105%)' : 'translateX(0)',
              transition: 'transform 2.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
              willChange: 'transform',
            }}
          />
        </div>
      )}

      {/* ═══ SOUL PARTICLES - fixed overlay across entire site ═══ */}
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

      {/* ═══ HERO - FULL SCREEN ═══ */}
      <section className="hero-section" style={{background:"var(--void)"}}>
        {/* Background image - full bleed */}
        <img
          src="/hero-girls.webp"
          alt=""
          className="hero-bg-img"
          fetchPriority="high"
          decoding="async"
        />

        {/* Grid texture overlay */}
        <div className="hero-grid"/>

        {/* Depth overlay - fade at bottom */}
        <div className="hero-bg-overlay"/>

        {/* Vignette - darkens edges */}
        <div className="hero-vignette"/>

        {/* Glow orbs */}
        <div className="hero-glow-orb" style={{width:"40vw",height:"40vw",left:"25%",top:"30%",color:"rgba(200,80,255,0.15)"}}/>
        <div className="hero-glow-orb" style={{width:"25vw",height:"25vw",right:"10%",top:"55%",color:"rgba(74,144,226,0.10)",animationDelay:"3s"}}/>
        <div className="hero-glow-orb" style={{width:"20vw",height:"20vw",left:"5%",bottom:"20%",color:"rgba(255,45,120,0.08)",animationDelay:"6s"}}/>



        {/* ═══ HAMBURGER NAV - pinned at top of hero ═══ */}
        <nav className="absolute top-0 inset-x-0 z-[95] py-6" style={{background:"transparent"}}>
          <div className="hero-nav-panel max-w-[1400px] mx-auto px-5 sm:px-10 flex items-center justify-between">
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
            {/* RIGHT: Ticketline + Theme Toggle */}
            <div className="flex items-center gap-6 sm:gap-10">
              <a
                href={TL}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-nav-ticket group"
              >
                <Ticket className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300" style={{color:"#fff"}}/>
                <span className="hidden sm:inline text-[11px] tracking-[0.2em] uppercase font-bold" style={{color:"#fff"}}>Ticketline</span>
              </a>
              <button
                className="hero-nav-theme"
                onClick={toggleTheme}
                aria-label={themeMode === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                <span className={`hero-nav-orb ${themeMode}`}/>
                <span className="hidden sm:inline text-[10px] tracking-[0.18em] uppercase font-semibold" style={{color:"var(--neon-purple)", minWidth:"38px", textAlign:"center"}}>
                  {themeMode === 'dark' ? 'Noite' : 'Dia'}
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* ═══ FULLSCREEN MENU OVERLAY - cascade from LEFT ═══ */}
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
          {/* Menu Footer - social bottom right */}
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

        {/* ═══ HERO BOTTOM - Countdown + CTA ═══ */}
        <div className="hero-bottom-panel absolute bottom-0 inset-x-0 z-10 flex flex-col items-center pb-10 sm:pb-14">
          <div className="hero-countdown-wrap">
            <HeroCountdown />
          </div>
          <a
            href="#cartazes"
            className="hero-cta"
            onClick={e => { e.preventDefault(); document.getElementById('cartazes')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Garante o Teu Lugar <ChevronRight className="w-3.5 h-3.5"/>
          </a>
          <p className="hero-date-line">
            Pr&oacute;ximo: 18 JUL &middot; Estoril &middot; 18:30h
          </p>
        </div>
      </section>

      {/* ═══ HONMOON SHIELD - Theme Toggle (like the anime) ═══ */}
      <section className="honmoon-shield-section">
        {/* Background glow */}
        <div className={`hm-bg-glow ${themeMode}`}/>

        {/* Floating ambient particles */}
        {[...Array(SHIELD_PARTICLES)].map((_, i) => (
          <div key={i} className={`hm-particle hm-particle-${i} ${themeMode}`}/>
        ))}

        {/* Outer energy rings */}
        <div className={`hm-ring hm-ring-1 ${themeMode}`}/>
        <div className={`hm-ring hm-ring-2 ${themeMode}`}/>
        <div className={`hm-ring hm-ring-3 ${themeMode}`}/>

        {/* ═══ Neon rose circles - anime Honmoon aesthetic, dark mode only ═══ */}
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

        {/* Central shield orb - clickable */}
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
          title={themeMode === 'dark' ? 'Carrega para Ativar o modo Dia' : 'Carrega para Ativar o modo Noite'}
          aria-label={themeMode === 'dark' ? 'Ativar modo Dia' : 'Ativar modo Noite'}
        >
          {/* Inner energy strands */}
          <div className={`hm-strand hm-strand-1 ${themeMode}`}/>
          <div className={`hm-strand hm-strand-2 ${themeMode}`}/>
          <div className={`hm-strand hm-strand-3 ${themeMode}`}/>

          {/* Center text - ADORMECER E DESPERTAR */}
          <span className={`hm-label ${themeMode}`}>
            {themeMode === 'light' ? 'ADORMECER' : 'DESPERTAR'}
          </span>

          {/* Click hint - finger tap indicator */}
          <span className={`hm-tap-hint ${themeMode}`}/>

          {/* Soft hint for kids - always visible */}
          <span className={`hm-kid-hint ${themeMode}`}>
            {themeMode === 'light' ? 'Carrega para Ativar o modo Noite' : 'Carrega para Ativar o modo Dia'}
          </span>
        </div>

        {/* Click burst - expanding rings on click */}
        <div key={burstKey} className="hm-burst">
          <div className="hm-burst-ring hm-burst-ring-1"/>
          <div className="hm-burst-ring hm-burst-ring-2"/>
          <div className="hm-burst-ring hm-burst-ring-3"/>
        </div>

      </section>

      {/* ═══ ESPETÁCULO - Descrição + Galeria ═══ */}
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
            {/* LEFT - Description */}
            <div className="esp-left">
              <Rv>
                <p className="sec-num mb-4" style={{color:"var(--pink-light)"}}>Tributo Ao Vivo</p>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-3" style={{color:"var(--t1)"}}>
                  O Honmoon <span className="esp-title-accent">Ganha Vida</span>
                </h2>
                <p className="text-lg sm:text-xl font-light tracking-wide mb-8" style={{color:"var(--t2)"}}>
                  O universo K-Pop das Guerreiras sai do ecr&atilde; e invade o palco
                </p>
              </Rv>
              <Rv delay={200}>
                <p className="text-[16px] leading-[1.8] mb-6" style={{color:"var(--t2)"}}>
                  De dia, estrelas brilhantes do palco. De noite, Guerreiras do K-Pop que protegem o mundo
                  atrav&eacute;s do poder do Honmoon. Tr&ecirc;s idolas. Duas identidades. Um universo que milh&otilde;es levam
                  no cora&ccedil;&atilde;o &mdash; e que agora, finalmente, podes viver ao vivo.
                </p>
              </Rv>
              <Rv delay={350}>
                <p className="text-[16px] leading-[1.8] mb-6" style={{color:"var(--t2)"}}>
                  Este n&atilde;o &eacute; um concerto. &Eacute; um tributo que traz a magia do filme de anima&ccedil;&atilde;o para o palco &mdash; onde a fic&ccedil;&atilde;o
                  se torna realidade e cada nota carrega o poder de um universo inteiro. <span style={{color:"var(--neon-purple)"}}>Coreografias de</span> BLACKPINK, BTS e aespa
                  executadas por performers de elite que encarnam o esp&iacute;rito das Guerreiras com precis&atilde;o e intensidade.
                  N&uacute;meros de dan&ccedil;a, interl&uacute;dios teatrais e momentos visuais que recriam as cenas mais ic&oacute;nicas.
                  Luzes que cortam o escuro como l&acirc;minas de energia. <span style={{color:"var(--pink-kpop)"}}>Efeitos pirot&eacute;cnicos</span> que transformam o palco
                  num campo de batalha &mdash; exatamente como no filme. Os maiores hits K-Pop ressoam num espet&aacute;culo
                  que se sente, n&atilde;o se v&ecirc; apenas.
                </p>
              </Rv>
              <Rv delay={420}>
                <p className="text-[16px] leading-[1.8] mb-6" style={{color:"var(--t2)"}}>
                  Um espet&aacute;culo de variedades que transcende o concerto tradicional &mdash; com momentos de intera&ccedil;&atilde;o com o p&uacute;blico, onde cada instante &eacute; uma fatia
                  do universo das Guerreiras ao vivo, e cada cena se torna uma mem&oacute;ria que n&atilde;o vais querer deixar ir.
                </p>
              </Rv>
              <Rv delay={480}>
                <div className="esp-pitch">
                  <p className="esp-pitch-text">
                    Mais do que um tributo &mdash; uma noite que vai ficar.
                    Fam&iacute;lia, amigos e a energia que te define.
                    Quando o palco acender, a magia ganha vida.
                    Desta vez, tu fazes parte dela.
                  </p>
                </div>
              </Rv>
              <Rv delay={560}>
                <p className="text-[16px] leading-[1.8] mb-10 font-medium" style={{color:"var(--neon-purple)"}}>
                  Se aquele filme te marcou, esta noite foi feita para ti. Vem sentir o Honmoon.
                </p>
              </Rv>
              <Rv delay={500}>
                <a href={TL} target="_blank" rel="noopener noreferrer" className="esp-cta">
                  <Ticket className="w-3.5 h-3.5"/> Reservar Lugar <ArrowUpRight className="w-3 h-3"/>
                </a>
              </Rv>
            </div>

            {/* RIGHT - espaço reservado para armas */}
            <div className="esp-right" />
          </div>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ QUIZ - Perguntas sobre o Filme ═══ */}
      <section id="identidade" className="identidade-section px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Rv>
            <p className="sec-num mb-4">Quiz das Guerreiras</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-4" style={{color:"var(--t1)"}}>
              Quanto <span className="neon-shimmer">sabes</span><br/>sobre o Filme?
            </h2>
          </Rv>
          <Rv delay={120}>
            <p className="text-[16px] leading-[1.8] mb-12 max-w-lg" style={{color:"var(--t2)"}}>
              Vira cada carta para descobrir uma pergunta sobre as Guerreiras do K-Pop. Será que sabes tudo sobre o filme?
            </p>
          </Rv>
          <div className="dual-grid">
            {QUIZ_CHARACTERS.map((c, i) => (
              <QuizCard
                key={c.name}
                character={c}
                onScore={(correct) => setQuizScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))}
              />
            ))}
          </div>
          {quizScore.total > 0 && (
            <Rv delay={200}>
              <div className="quiz-score-bar">
                <span className="quiz-score-label">Respostas corretas</span>
                <span className="quiz-score-value">{quizScore.correct}/{quizScore.total}</span>
                <div className="quiz-score-progress">
                  <div className="quiz-score-fill" style={{ width: `${(quizScore.correct / quizScore.total) * 100}%` }} />
                </div>
              </div>
            </Rv>
          )}
        </div>
      </section>

      {/* ═══ GALERIA - Momentos ao Vivo com Legenda + Lightbox ═══ */}
      <section id="galeria" className="galeria-section px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Rv>
            <p className="sec-num mb-4">Mural</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-4" style={{color:"var(--t1)"}}>
              Momentos que <span className="neon-shimmer">Brilham</span>
            </h2>
          </Rv>
          <Rv delay={120}>
            <p className="text-[16px] leading-[1.8] mb-12 max-w-lg" style={{color:"var(--t2)"}}>
              Cada performance &eacute; um ritual de luz e som. Clica numa foto para reviver o momento.
            </p>
          </Rv>
          <div className="galeria-grid">
            {GALLERY_PHOTOS.map((photo, i) => (
              <Rv key={i} delay={i * 100}>
                <div
                  className="galeria-card"
                  onClick={() => setLightbox(i)}
                >
                  <div className="galeria-img-wrap">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="galeria-img"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="galeria-overlay"/>
                    <div className="galeria-zoom-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </div>
                  </div>
                  <div className="galeria-caption">
                    <span>{photo.caption}</span>
                  </div>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ CARTAZES - Posters + Ticketline CTA ═══ */}
      <section id="cartazes" className="cartazes-section px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Rv>
            <p className="sec-num mb-4">Pr&oacute;ximos Concertos em Tour</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-4" style={{color:"var(--t1)"}}>
              O Espet&aacute;culo <span className="neon-shimmer">Ao Vivo</span>
            </h2>
          </Rv>
          <Rv delay={120}>
            <p className="text-[16px] leading-[1.8] mb-12 max-w-lg" style={{color:"var(--t2)"}}>
              Cada cartaz &eacute; um portal para a noite do concerto.
            </p>
          </Rv>

          <div className="cartazes-grid">
            {/* ═══ CASCAIS - Destaque principal (maior) ═══ */}
            <Rv delay={200}>
              <article className="cartaz-card cartaz-featured">
                <div className="cartaz-img-wrap">
                  <img src="/poster.webp" alt="Cartaz Cascais - Guerreiras do K-Pop" className="cartaz-img" loading="lazy" decoding="async" />
                  <div className="cartaz-overlay"/>
                  <div className="cartaz-tag">Cascais</div>
                </div>
                <div className="cartaz-info">
                  <p className="cartaz-city" style={{color:"var(--pink-kpop)"}}>Cascais &middot; Estoril</p>
                  <p className="cartaz-date">18 JUL 2026 &middot; 18:30h</p>
                  <p className="cartaz-status cartaz-status-live">
                    <span className="cartaz-status-dot"/> Bilhetes j&aacute; &agrave; venda
                  </p>
                  <p className="cartaz-venue">Academia das Artes do Estoril</p>
                  <a href={TL} target="_blank" rel="noopener noreferrer" className="cartaz-buy-btn">
                    <Ticket className="w-4 h-4"/> Comprar Bilhete <ExternalLink className="w-3 h-3"/>
                  </a>
                </div>
              </article>
            </Rv>

            {/* ═══ SESIMBRA - Destaque secundário (mais pequeno) ═══ */}
            <Rv delay={350}>
              <article className="cartaz-card cartaz-secondary">
                <div className="cartaz-img-wrap">
                  <img src="/poster-sesimbra.webp" alt="Cartaz Sesimbra - Guerreiras do K-Pop" className="cartaz-img" loading="lazy" decoding="async" />
                  <div className="cartaz-overlay"/>
                  <div className="cartaz-tag cartaz-tag-soon">Em breve</div>
                </div>
                <div className="cartaz-info">
                  <p className="cartaz-city" style={{color:"var(--blue-accent)"}}>Sesimbra</p>
                  <p className="cartaz-date">15 AGO 2026 &middot; 18:30h</p>
                  <p className="cartaz-status cartaz-status-soon">
                    <span className="cartaz-status-dot cartaz-status-dot-soon"/> Bilhetes &agrave; venda a partir de 20 de Junho
                  </p>
                  <p className="cartaz-venue">Pavilh&atilde;o Desportivo de Sesimbra</p>
                  <button type="button" className="cartaz-buy-btn cartaz-buy-btn-soon" disabled>
                    <Bell className="w-4 h-4"/> Avisar-me quando abrir
                  </button>
                </div>
              </article>
            </Rv>
          </div>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      <Marquee text="GUERREIRAS DO K-POP · TRIBUTO MUSICAL · 18 JUL CASCAIS · 15 AGO SESIMBRA · ZOEY · RUMI · MIRA"/>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ CONTACTE-NOS - Reservas & Eventos ═══ */}
      <section id="contacto" className="contacto-section px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* ── Coluna esquerda: pitch + info ── */}
            <div className="lg:col-span-5">
              <Rv>
                <p className="sec-num mb-4">Contacte-nos</p>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-8" style={{color:"var(--t1)"}}>
                  Leve o <span className="neon-shimmer">Espet&aacute;culo</span> &agrave; sua Casa
                </h2>
              </Rv>
              <Rv delay={120}>
                <p className="text-[16px] leading-[1.8] mb-8 max-w-lg" style={{color:"var(--t2)"}}>
                  Este tributo musical foi pensado para viajar. Adapta-se a teatros, audit&oacute;rios,
                  pavilh&otilde;es multiusos e estruturas ef&eacute;meras - como tendas de Natal para
                  festas de empresas, escolas, associa&ccedil;&otilde;es e c&acirc;maras municipais.
                  Montamos a experi&ecirc;ncia completa onde for mais conveniente para o seu p&uacute;blico.
                </p>
              </Rv>
              <Rv delay={200}>
                <p className="text-[15px] leading-[1.7] mb-10 max-w-lg" style={{color:"var(--t3)"}}>
                  Reserve j&aacute; a sua data - estamos dispon&iacute;veis para orientar a produ&ccedil;&atilde;o
                  t&eacute;cnica, ajustar o formato &agrave; lota&ccedil;&atilde;o do espa&ccedil;o e personalizar
                  o repert&oacute;rio em fun&ccedil;&atilde;o do seu p&uacute;blico-alvo.
                </p>
              </Rv>
              <Rv delay={280}>
                <div className="space-y-4 mb-10">
                  <a href="tel:+351926828841" className="flex items-start gap-4 group" onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity="0.85"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1"}}>
                    <Phone className="w-4 h-4 mt-1 flex-shrink-0" style={{color:"var(--neon-purple)"}}/>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-1" style={{color:"var(--t3)"}}>Telefone direto</p>
                      <p className="text-[15px]" style={{color:"var(--t1)"}}>+351 926 828 841</p>
                    </div>
                  </a>
                  <a href="mailto:producao@guerreirasdokpop.pt" className="flex items-start gap-4 group" onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity="0.85"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1"}}>
                    <Mail className="w-4 h-4 mt-1 flex-shrink-0" style={{color:"var(--neon-purple)"}}/>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-1" style={{color:"var(--t3)"}}>E-mail de produ&ccedil;&atilde;o</p>
                      <p className="text-[15px]" style={{color:"var(--t1)"}}>producao@guerreirasdokpop.pt</p>
                    </div>
                  </a>
                </div>
              </Rv>
            </div>

            {/* ── Coluna direita: formulário ── */}
            <div className="lg:col-span-7">
              <Rv delay={150}>
                <form className="contacto-form" onSubmit={(e)=>{
                  e.preventDefault();
                  const f = e.currentTarget as HTMLFormElement;
                  const fd = new FormData(f);
                  const nome = encodeURIComponent(fd.get("nome") as string || "");
                  const tipo = encodeURIComponent(fd.get("tipo") as string || "");
                  const local = encodeURIComponent(fd.get("local") as string || "");
                  const data_ev = encodeURIComponent(fd.get("data") as string || "");
                  const publico = encodeURIComponent(fd.get("publico") as string || "");
                  const email = encodeURIComponent(fd.get("email") as string || "");
                  const tel = encodeURIComponent(fd.get("tel") as string || "");
                  const msg = encodeURIComponent(fd.get("msg") as string || "");
                  const subject = encodeURIComponent(`Reserva - Guerreiras do K-Pop · ${fd.get("tipo") || "Tributo musical"}`);
                  const body = encodeURIComponent(
`Nome: ${fd.get("nome") || ""}
Tipo de evento: ${fd.get("tipo") || ""}
Local pretendido: ${fd.get("local") || ""}
Data prevista: ${fd.get("data") || ""}
Público estimado: ${fd.get("publico") || ""}
E-mail: ${fd.get("email") || ""}
Telefone: ${fd.get("tel") || ""}

Mensagem:
${fd.get("msg") || ""}`
                  );
                  window.location.href = `mailto:producao@guerreirasdokpop.pt?subject=${subject}&body=${body}`;
                  f.reset();
                  const ok = document.getElementById("contacto-ok");
                  if (ok) { ok.style.display = "block"; setTimeout(()=>{ if(ok) ok.style.display = "none"; }, 5000); }
                }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <label className="contacto-field">
                      <span>Nome *</span>
                      <input type="text" name="nome" required placeholder="O seu nome ou entidade"/>
                    </label>
                    <label className="contacto-field">
                      <span>Tipo de evento</span>
                      <select name="tipo" defaultValue="">
                        <option value="" disabled>Selecione…</option>
                        <option value="Teatro / Auditório">Teatro / Auditório</option>
                        <option value="Pavilhão multiusos">Pavilhão multiusos</option>
                        <option value="Tenda de Natal (empresa)">Tenda de Natal (empresa)</option>
                        <option value="Tenda de Natal (escola/associação)">Tenda de Natal (escola/associação)</option>
                        <option value="Tenda de Natal (autarquia)">Tenda de Natal (autarquia)</option>
                        <option value="Festival / Evento cultural">Festival / Evento cultural</option>
                        <option value="Evento privado">Evento privado</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <label className="contacto-field">
                      <span>Local pretendido</span>
                      <input type="text" name="local" placeholder="Cidade ou sala"/>
                    </label>
                    <label className="contacto-field">
                      <span>Data prevista</span>
                      <input type="text" name="data" placeholder="Ex.: 12 Dez 2026"/>
                    </label>
                    <label className="contacto-field">
                      <span>P&uacute;blico estimado</span>
                      <input type="text" name="publico" placeholder="Ex.: 400 pessoas"/>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <label className="contacto-field">
                      <span>E-mail *</span>
                      <input type="email" name="email" required placeholder="email@exemplo.pt"/>
                    </label>
                    <label className="contacto-field">
                      <span>Telefone</span>
                      <input type="tel" name="tel" placeholder="+351 …"/>
                    </label>
                  </div>

                  <label className="contacto-field mb-6">
                    <span>Mensagem</span>
                    <textarea name="msg" rows={4} placeholder="Diga-nos o que precisa - formato, duração, orçamento aproximado, perguntas…"/>
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <button type="submit" className="contacto-submit">
                      <Mail className="w-4 h-4"/> Enviar pedido de reserva
                    </button>
                    <p id="contacto-ok" className="text-[12px]" style={{color:"var(--neon-purple)", display:"none"}}>
                      Pedido preparado - abrimos o seu cliente de e-mail. Estamos em contacto brevemente.
                    </p>
                  </div>
                  <p className="text-[11px] mt-5" style={{color:"var(--t3)"}}>
                    Resposta t&iacute;pica em 24-48h em dias &uacute;teis. Para reservas urgentes, ligue diretamente.
                  </p>
                </form>
              </Rv>
            </div>
          </div>
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
                <span className="text-[14px]" style={{color:"var(--t2)"}}>Viva - Artes &amp; Produções</span>
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

      {/* ═══ NEON LIGHTBOX ═══ */}
      {lightbox !== null && (
        <NeonLightbox
          images={GALLERY_PHOTOS}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox(Math.max(0, lightbox - 1))}
          onNext={() => setLightbox(Math.min(GALLERY_PHOTOS.length - 1, lightbox + 1))}
        />
      )}
    </div>
    </>
  );
}
