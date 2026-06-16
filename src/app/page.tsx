"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import LedWallShader from "@/components/LedWallShader";
import NeonLightbox from "@/components/NeonLightbox";
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

/* ── Device detection for adaptive performance ── */
const IS_MOBILE = typeof window !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const SHIELD_PARTICLES = IS_MOBILE ? 6 : 12;
const CHARGER_PARTICLES = IS_MOBILE ? 4 : 8;

const CONCERTS = [
  { day: "18", month: "JUL 2026", venue: "Academia das Artes do Estoril", city: "Cascais", time: "Portas 18:30h", url: TL, next: true },
  { day: "25", month: "JUL 2026", venue: "Coliseu dos Recreios", city: "Lisboa", time: "Portas 20:00h", url: TL, next: false },
  { day: "02", month: "AGO 2026", venue: "Theatro Circo", city: "Braga", time: "Portas 19:00h", url: TL, next: false },
  { day: "09", month: "AGO 2026", venue: "Centro de Artes e Espetáculos", city: "Porto", time: "Portas 20:00h", url: TL, next: false },
];

/* K-Pop gallery photos — hosted externally on PostImg */
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

/* ═══ HERO COUNTDOWN — Neon Boxes ═══ */

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

/* ═══ LED WALL — WebGL Shader (zero compression, max quality, infinite loop) ═══ */
/* Build: 2026-06-16-v11 */

/* ═══ QUIZ — K-Pop Demon Hunters Trivia ═══ */

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index of correct option (0-3)
  theme: "ZOEY" | "RUMI" | "MIRAE";
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  /* ── ZOEY — Coragem ── */
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

  /* ── RUMI — M\u00fasica ── */
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

  /* ── MIRAE — Dan\u00e7a ── */
  { q: "Qual \u00e9 a arma de Mirae?", options: ["Adagas Shin-kal", "Espada Saingeom", "Gok-do (l\u00e2mina curva de haste)", "Arco espiritual"], answer: 2, theme: "MIRAE" },
  { q: "Mirae \u00e9 conhecida como o qu\u00ea do grupo?", options: ["A l\u00edder", "A Dennis Rodman do grupo", "A mais calma", "A mais nova"], answer: 1, theme: "MIRAE" },
  { q: "Qual \u00e9 o signo do zod\u00edaco de Mirae?", options: ["Peixes", "\u00c1ries", "Escorpi\u00e3o", "Le\u00e3o"], answer: 1, theme: "MIRAE" },
  { q: "Quem faz a voz de canto de Mirae?", options: ["EJAE", "Rei Ami", "Audrey Nuna", "Arden Cho"], answer: 2, theme: "MIRAE" },
  { q: "Mirae \u00e9 a primeira a fazer o qu\u00ea?", options: ["Derrotar Gwi-Ma", "Sentir que Rumi esconde um segredo", "Cantar solo", "Abandonar o grupo"], answer: 1, theme: "MIRAE" },
  { q: "Qual membro dos Saja Boys est\u00e1 emparelhado com Mirae?", options: ["Jinu", "Romance", "Mystery", "Abs"], answer: 3, theme: "MIRAE" },
  { q: "Que cor \u00e9 o cabelo de Mirae?", options: ["Roxo", "Azul", "Cor-de-rosa", "Loiro"], answer: 2, theme: "MIRAE" },
  { q: "Qual \u00e9 a fun\u00e7\u00e3o de Mirae no HUNTR/X?", options: ["Rapper principal", "Vocalista principal", "Dan\u00e7arina principal e core\u00f3grafa", "Maknae"], answer: 2, theme: "MIRAE" },
  { q: "A arma gok-do de Mirae pode fazer o qu\u00ea?", options: ["Voar", "Emitir ondas de choque", "Curar feridas", "Criar ilus\u00f5es"], answer: 1, theme: "MIRAE" },
  { q: "De que tipo de fam\u00edlia Mirae vem?", options: ["Pobre", "Adotiva", "Rica", "De dem\u00f3nios"], answer: 2, theme: "MIRAE" },

  /* ── Geral — Misturado ── */
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
  { name: "ZOEY", color: "var(--blue-accent)", img: "/real-zoe.webp", weapon: "/weapon-zoey-nobg.png", theme: "Coragem", weaponPos: "top" },
  { name: "RUMI", color: "var(--neon-purple)", img: "/real-rumi.webp", weapon: "/weapon-rumi-nobg.png", theme: "Música", weaponPos: "center" },
  { name: "MIRAE", color: "var(--pink-kpop)", img: "/real-mirae.webp", weapon: "/weapon-mira-nobg.png", theme: "Dança", weaponPos: "bottom" },
];

function QuizCard({ character, onScore }: { character: typeof QUIZ_CHARACTERS[number]; onScore: (correct: boolean) => void }) {
  const [flipped, setFlipped] = useState(false);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [usedQ, setUsedQ] = useState<Set<number>>(new Set());
  const [currentTheme, setCurrentTheme] = useState(character.name);

  /* Alternar temas — cicla entre ZOEY, RUMI, MIRAE para variedade */
  const allThemes: Array<"ZOEY" | "RUMI" | "MIRAE"> = ["ZOEY", "RUMI", "MIRAE"];

  const pickQuestion = useCallback(() => {
    /* Primeiro tenta o tema atual, depois outros temas para alternar */
    const themePool = QUIZ_QUESTIONS.filter((q, i) => q.theme === currentTheme && !usedQ.has(i));
    const anyPool = QUIZ_QUESTIONS.filter((_, i) => !usedQ.has(i));
    const available = themePool.length > 0 ? themePool : anyPool.length > 0 ? anyPool : QUIZ_QUESTIONS;
    const idx = Math.floor(Math.random() * available.length);
    const chosen = available[idx];
    const globalIdx = QUIZ_QUESTIONS.indexOf(chosen);
    setUsedQ(prev => new Set([...prev, globalIdx]));
    /* Alternar o tema para a próxima pergunta */
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

  /* Posição da arma: cada carta tem a arma num sítio diferente */
  const weaponPositionClass = `quiz-weapon-${character.weaponPos}`;

  return (
    <div className="quiz-card" onClick={!flipped ? handleFlip : undefined} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' && !flipped) handleFlip(); }}>
      <div className={`quiz-card-inner${flipped ? " quiz-flipped" : ""}`}>
        {/* ═══ FRONT — Character Image + Weapon + Neon Theme Badge ═══ */}
        <div className="quiz-card-front">
          <div className="quiz-glow" style={{ background: `radial-gradient(circle, ${character.color}33 0%, transparent 70%)` }} />
          <img src={character.img} alt={character.name} className="quiz-char-img" loading="lazy" decoding="async" />
          {/* Weapon overlay — sem fundo, adaptável ao claro/escuro */}
          <div className={`quiz-weapon-overlay ${weaponPositionClass}`}>
            <img src={character.weapon} alt={`Arma de ${character.name}`} className="quiz-weapon-img" loading="lazy" decoding="async" />
          </div>
          {/* Neon theme badge */}
          <div className="quiz-theme-badge" style={{ '--badge-color': character.color } as React.CSSProperties}>
            <span className="quiz-theme-icon">⚔</span>
            <span className="quiz-theme-text">{character.theme}</span>
          </div>
          <p className="quiz-char-name" style={{ color: character.color }}>{character.name}</p>
          <p className="quiz-hint">Clica para jogar</p>
        </div>
        {/* ═══ BACK — Quiz Question (fundo branco/adaptável, sem espelho) ═══ */}
        <div className="quiz-card-back">
          {question ? (
            <>
              <p className="quiz-back-theme" style={{ color: character.color }}>{question.theme}</p>
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
  const { ref: manifestoRef, visible: manifestoVisible } = useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
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

      {/* ═══ PRELOADER — Curtain Reveal ═══ */}
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
          src="/hero-girls.webp"
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



        {/* ═══ HAMBURGER NAV — pinned at top of hero ═══ */}
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

        {/* ═══ HERO BOTTOM — Countdown + CTA ═══ */}
        <div className="hero-bottom-panel absolute bottom-0 inset-x-0 z-10 flex flex-col items-center pb-10 sm:pb-14">
          <div className="hero-countdown-wrap">
            <HeroCountdown />
          </div>
          <a
            href="#concertos"
            className="hero-cta"
            onClick={e => { e.preventDefault(); document.getElementById('concertos')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Garante o Teu Lugar <ChevronRight className="w-3.5 h-3.5"/>
          </a>
          <p className="hero-date-line">
            Pr&oacute;ximo: 18 JUL &middot; Estoril &middot; 18:30h
          </p>
        </div>
      </section>

      {/* ═══ HONMOON SHIELD — Theme Toggle (like the anime) ═══ */}
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

      {/* ═══ MANIFESTO — LED WALL TUNNEL ═══ */}
      <section
        ref={manifestoRef}
        className={`manifesto-section ${manifestoVisible ? "manifesto-in" : ""}`}
      >
        {/* Ambient glow behind LED wall */}
        <div className="manifesto-glow"/>

        {/* Dynamic LED ambient — synced with shader color */}
        <div className="led-ambient-sync"/>

        {/* Monitor glow — light spill from LED wall onto page sides */}
        <div className="monitor-glow monitor-glow-left"/>
        <div className="monitor-glow monitor-glow-right"/>

        {/* ═══ HONMOON SHIELD — iridescent soul barrier ═══ */}
        <div className="honmoon-shield">
          <div className="honmoon-arc honmoon-arc-top"/>
          <div className="honmoon-arc honmoon-arc-bottom"/>
          <div className="honmoon-strand honmoon-strand-left"/>
          <div className="honmoon-strand honmoon-strand-right"/>
          <div className="honmoon-node honmoon-node-1"/>
          <div className="honmoon-node honmoon-node-2"/>
          <div className="honmoon-node honmoon-node-3"/>
          <div className="honmoon-node honmoon-node-4"/>
          <div className="honmoon-node honmoon-node-5"/>
          <div className="honmoon-node honmoon-node-6"/>
        </div>

        {/* ═══ DEMON MARKINGS — Gwi-Ma vines on pillars ═══ */}
        <div className="demon-markings demon-markings-left">
          <svg viewBox="0 0 60 400" className="demon-vine-svg" preserveAspectRatio="none">
            <path className="demon-vine demon-vine-1" d="M30,0 C10,50 50,80 20,140 C-5,190 55,220 25,280 C5,330 40,360 30,400" fill="none"/>
            <path className="demon-vine demon-vine-2" d="M15,0 C45,60 5,100 35,160 C55,210 10,250 30,300 C45,340 20,370 15,400" fill="none"/>
            <path className="demon-vine-eye demon-vine-eye-1" d="M18,120 C22,110 32,110 32,120 C32,130 22,130 18,120Z" fill="none"/>
            <path className="demon-vine-eye demon-vine-eye-2" d="M28,260 C32,250 42,250 42,260 C42,270 32,270 28,260Z" fill="none"/>
          </svg>
        </div>
        <div className="demon-markings demon-markings-right">
          <svg viewBox="0 0 60 400" className="demon-vine-svg" preserveAspectRatio="none">
            <path className="demon-vine demon-vine-1" d="M30,0 C50,50 10,80 40,140 C65,190 5,220 35,280 C55,330 20,360 30,400" fill="none"/>
            <path className="demon-vine demon-vine-2" d="M45,0 C15,60 55,100 25,160 C5,210 50,250 30,300 C15,340 40,370 45,400" fill="none"/>
            <path className="demon-vine-eye demon-vine-eye-1" d="M28,120 C32,110 42,110 42,120 C42,130 32,130 28,120Z" fill="none"/>
            <path className="demon-vine-eye demon-vine-eye-2" d="M18,260 C22,250 32,250 32,260 C32,270 22,270 18,260Z" fill="none"/>
          </svg>
        </div>

        {/* ═══ TEMPLE FRAME ═══ */}
        <div className="temple-frame">
          {/* Temple roof — curved multi-tier top */}
          <div className="temple-roof">
            <div className="temple-roof-peak"/>
            <div className="temple-roof-tier-1"/>
            <div className="temple-roof-tier-2"/>
            <div className="temple-roof-cornice"/>
            {/* Decorative end caps */}
            <div className="temple-cap temple-cap-left"/>
            <div className="temple-cap temple-cap-right"/>
          </div>

          {/* Temple body — pillars + LED wall */}
          <div className="temple-body">
            {/* Left pillar */}
            <div className="temple-pillar temple-pillar-left">
              <div className="pillar-base"/>
              <div className="pillar-shaft"/>
              <div className="pillar-capital"/>
              <div className="pillar-ornament pillar-ornament-1"/>
              <div className="pillar-ornament pillar-ornament-2"/>
              <div className="pillar-ornament pillar-ornament-3"/>
            </div>

            {/* Center: LED Wall */}
            <div className="led-wall-frame">
              {/* Power-on flash effect */}
              <div className="led-power-flash"/>

              {/* LED Wall screen */}
              <div className="led-wall-screen">
                <LedWallShader active={manifestoVisible}/>
              </div>

              <div className="led-frame-top"/>
              <div className="led-frame-bottom"/>
            </div>

            {/* Right pillar */}
            <div className="temple-pillar temple-pillar-right">
              <div className="pillar-base"/>
              <div className="pillar-shaft"/>
              <div className="pillar-capital"/>
              <div className="pillar-ornament pillar-ornament-1"/>
              <div className="pillar-ornament pillar-ornament-2"/>
              <div className="pillar-ornament pillar-ornament-3"/>
            </div>
          </div>

          {/* Temple base platform */}
          <div className="temple-base">
            <div className="temple-base-step temple-base-step-1"/>
            <div className="temple-base-step temple-base-step-2"/>
            <div className="temple-base-step temple-base-step-3"/>
          </div>
        </div>
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

            {/* RIGHT — Weapons Artwork */}
            <div className="esp-right">
              <div className="esp-weapons-stack">
                {[
                  { src: "/weapon-zoey.webp", alt: "Adagas da Zoey", color: "var(--blue-accent)" },
                  { src: "/weapon-rumi.webp", alt: "Espada da Rumi", color: "var(--neon-purple)" },
                  { src: "/weapon-mira.webp", alt: "Guilhotina da Mirae", color: "var(--pink-kpop)" },
                ].map((w, i) => (
                  <Rv key={w.alt} delay={150 + i * 120}>
                    <div className="esp-weapon-item" style={{ '--weapon-color': w.color } as React.CSSProperties}>
                      <img src={w.src} alt={w.alt} className="esp-weapon-img" loading="lazy" decoding="async" />
                    </div>
                  </Rv>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="neon-div max-w-[1400px] mx-auto"/>

      {/* ═══ QUIZ — Perguntas sobre o Filme ═══ */}
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

      {/* ═══ GALERIA — Momentos ao Vivo com Legenda + Lightbox ═══ */}
      <section id="galeria" className="galeria-section px-5 sm:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Rv>
            <p className="sec-num mb-4">Galeria</p>
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
              {name:"HUNTRIX",sub:"Headliner - Guerreiras do K-Pop",c:"var(--gold)"},
              {name:"RUMI",sub:"Vocal Principal",c:"var(--pink-kpop)"},
              {name:"MIRAE",sub:"Dança & Rap",c:"var(--blue-accent)"},
              {name:"ZOEY",sub:"Performance Especial",c:"var(--neon-purple)"},
            ].map((a,i)=>(
              <Rv key={a.name} delay={i*100}>
                <div className="group relative overflow-hidden cursor-pointer" style={{background:"var(--surface)"}}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src="/poster.webp" alt={a.name} className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105" style={{filter:"grayscale(75%) brightness(0.5)"}} loading="lazy" decoding="async"
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

      <Marquee text="HUNTRIX · RUMI · MIRAE · ZOEY · GUERREIRAS DO K-POP · TRIBUTO MUSICAL"/>

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
                  <img src="/venue-bg.webp" alt="Academia das Artes do Estoril" className="w-full h-64 sm:h-80 object-cover cin" loading="lazy" decoding="async"/>
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
