"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import NeonLightbox from "@/components/NeonLightbox";
import {
  Ticket, MapPin, Clock, Instagram, Youtube, Music2,
  Send, ChevronRight, Phone, Mail, Facebook,
  Flame, Sparkles, Mic2, MonitorPlay, PartyPopper, Cherry, Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";

/* ════════════════════════════════════════ */
/* ═══ DATA ══════════════════════════════ */
/* ════════════════════════════════════════ */

// Ticketline: link removido a pedido do utilizador — botões são apenas visuais (não funcionais)
const EVENT = new Date("2026-08-08T18:30:00");

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

/* ═══ HONMOON DIVIDER - divisória visual com símbolo + brilho ═══ */
const HonmoonDivider = React.memo(function HonmoonDivider() {
  return (
    <div className="honmoon-divider hero-aligned-container" aria-hidden="true">
      <span className="honmoon-divider-symbol"/>
    </div>
  );
});

/* ═══ MEMORIES - Slideshow crossfade + Ken Burns zoom ═══ */
const MEMORIES_IMAGES = [
  { src: "/memories/memory-3.webp", alt: "Lembrança do espetáculo ao vivo" },
  { src: "/memories/memory-4.webp", alt: "Lembrança do universo K-Pop" },
  { src: "/memories/memory-5.webp", alt: "Lembrança das Guerreiras em palco" },
];

const MemoriesSlideshow = React.memo(function MemoriesSlideshow() {
  const slidesRef = React.useRef<HTMLElement[] | null>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Respeita prefers-reduced-motion: se sim, não anima
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const slides = Array.from(document.querySelectorAll<HTMLElement>('.memories-slide'));
    if (slides.length < 2) return;
    slidesRef.current = slides;

    let currentIdx = 0;
    let cycleTimer: ReturnType<typeof setTimeout>;
    const INTERVAL = 6000;       // tempo visível de cada slide
    const FADE_OUT = 1200;       // duração do fade-out
    const PAUSE = 500;           // pausa preta entre slides
    const FADE_IN = 1200;        // duração do fade-in

    // ═══ Função para controlar o brilho sincronizado com a foto ═══
    // Fases:
    //   - 'visible': foto totalmente visível → brilho activo (opacity 1)
    //   - 'fading-out': foto a desaparecer → brilho também desaparece (opacity 0)
    //   - 'pause': ecrã preto total → brilho invisível (opacity 0)
    //   - 'fading-in': foto a surgir → brilho reactiva sincronizado (opacity 1)
    function setGlow(phase: 'visible' | 'fading-out' | 'pause' | 'fading-in', duration: number) {
      const glow = glowRef.current;
      if (!glow) return;
      glow.style.transition = `opacity ${duration}ms ease-in-out`;
      if (phase === 'visible' || phase === 'fading-in') {
        glow.style.opacity = '1';
      } else {
        // fading-out ou pause → brilho desaparece
        glow.style.opacity = '0';
      }
    }

    function nextSlide() {
      const slidesArr = slidesRef.current;
      if (!slidesArr || slidesArr.length === 0) return;
      const current = slidesArr[currentIdx];
      const nextIdx = (currentIdx + 1) % slidesArr.length;
      const next = slidesArr[nextIdx];

      // 1) Fade-out do slide actual + brilho também desaparece (sincronizado)
      current.style.transition = `opacity ${FADE_OUT}ms ease-in-out, filter ${FADE_OUT}ms ease-in-out`;
      current.style.opacity = '0';
      current.style.filter = 'brightness(0.6) blur(6px)';
      setGlow('fading-out', FADE_OUT);

      cycleTimer = setTimeout(() => {
        // 2) Pausa preta (slide actual já invisível, próximo ainda invisível)
        // Ecrã totalmente preto — brilho também invisível
        current.classList.remove('active');
        setGlow('pause', PAUSE);

        cycleTimer = setTimeout(() => {
          // 3) Fade-in do próximo slide + brilho reactiva (sincronizado)
          next.style.transition = `opacity ${FADE_IN}ms ease-in-out, filter ${FADE_IN}ms ease-in-out, transform ${FADE_IN}ms ease-out`;
          next.style.opacity = '1';
          next.style.filter = 'brightness(1) blur(0px)';
          next.classList.add('active');
          setGlow('fading-in', FADE_IN);
          currentIdx = nextIdx;

          // 4) Agendar próximo ciclo
          cycleTimer = setTimeout(nextSlide, INTERVAL);
        }, PAUSE);
      }, FADE_OUT);
    }

    // Inicializar brilho visível (primeira foto)
    setGlow('visible', 0);

    cycleTimer = setTimeout(nextSlide, INTERVAL);
    return () => clearTimeout(cycleTimer);
  }, []);

  return (
    <div className="memories-stage">
      {MEMORIES_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className={`memories-slide ${i === 0 ? "active" : ""}`}
          style={{ backgroundImage: `url(${img.src})` }}
          aria-hidden={i !== 0}
        />
      ))}
      {/* ═══ Camada de brilho sincronizada com o slideshow ═══
          - Visível quando a foto está visível
          - Desaparece durante o fade-out (até preto total)
          - Reactiva durante o fade-in (sincronizado com a foto) */}
      <div ref={glowRef} className="memories-glow" aria-hidden="true"/>
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
  // ═══ REF para rastrear themeMode SEMPRE actualizado ═══
  // Isto evita race conditions no startThemeTransition: o closure do useCallback
  // pode ter themeMode desactualizado quando há cliques rápidos, causando
  // bugs onde o flash "vai para light" mas o tema acaba em dark (ou vice-versa).
  const themeModeRef = useRef<'dark' | 'light'>(themeMode);
  useEffect(() => { themeModeRef.current = themeMode; }, [themeMode]);
  const [burstKey, setBurstKey] = useState(0);
  const [ripple, setRipple] = useState<{active:boolean; x:number; y:number; toMode:'dark'|'light'}|null>(null);
  const [waveActive, setWaveActive] = useState(false);
  const [heroFlash, setHeroFlash] = useState<{type: 'none' | 'to-light' | 'to-dark', x: number, y: number}>({type: 'none', x: 50, y: 50});
  const [lightbox, setLightbox] = useState<number | null>(null);
    const [privacyOpen, setPrivacyOpen] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLElement[] | null>(null);
  // ═══ PARALLAX — agora usa background-attachment: fixed (nativo do browser) ═══
  // Não precisa de JavaScript nem scroll listener. Mais robusto em todos os sistemas.

  useEffect(() => {
    // Em mobile, reduzir o delay do preloader para o scroll desbloquear mais cedo.
    // Antes: 1200ms em todos os dispositivos.
    // Agora: 400ms em mobile (< 768px), 1200ms em desktop/tablet.
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const t = setTimeout(() => setLoaded(true), isMobile ? 400 : 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Garantir que o body NUNCA fica com overflow:hidden quando o menu fecha.
    // Em mobile, este era um dos motivos do scroll "preso": se o menu abrisse
    // e fechasse rapidamente, o overflow podia não ser limpo corretamente.
    document.body.style.overflow = menuOpen ? "hidden" : "";
    // Forçar reflow para garantir que o browser aplica o overflow imediatamente
    if (!menuOpen) {
      // Pequeno hack: forçar o browser a reprocessar o estilo do body
      // Isto resolve o bug do scroll preso em iOS Safari após fechar o menu
      void document.body.offsetHeight;
    }
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

  // (Parallax agora é CSS-only com background-attachment: fixed — sem JavaScript)

  // Sync light-mode class to <html> on mount (theme already read from localStorage via useState initializer)
  useEffect(() => {
    if (themeMode === 'light') {
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  // Cleanup todas as transições pendentes quando o componente desmonta
  // (evita memory leaks e setStates em componentes desmontados)
  useEffect(() => {
    return () => {
      transitionRef.current.forEach(t => clearTimeout(t));
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
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

  // ═══ Ref que marca QUAL modo queremos no final da transição ═══
  // Previne bug em cliques rápidos: mesmo que toggleTheme seja chamado 2x,
  // o segundo é no-op porque pendingToModeRef já está definido.
  const pendingToModeRef = useRef<'dark' | 'light' | null>(null);

  const toggleTheme = useCallback(() => {
    // ═══ Versão BULLETPROOF — sempre usa themeModeRef.current ═══
    // Nunca usa o fallback com prev => toggle (que pode falhar em race conditions).
    // Se pendingToModeRef estiver definido, usa esse valor (decidido no startThemeTransition).
    // Caso contrário, calcula o oposto do valor actual do ref.
    const target = pendingToModeRef.current
      ? (pendingToModeRef.current as 'dark' | 'light')
      : (themeModeRef.current === 'dark' ? 'light' : 'dark');
    pendingToModeRef.current = null;

    // ═══ Aplicar a class light-mode IMEDIATAMENTE (síncrono) ═══
    // Isto garante que o resto da página muda AO MESMO TEMPO que o hero.
    // Antes, a class era aplicada via useEffect (depois do render), o que causava
    // um gap onde o hero já mostrava a nova imagem mas o resto ainda estava no modo antigo.
    if (target === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    // Actualizar o ref IMEDIATAMENTE (antes do setThemeMode) para que
    // chamadas subsequentes a toggleTheme vejam o valor correcto.
    themeModeRef.current = target;
    // Finalmente, actualizar o estado React (para o hero <img src> mudar)
    setThemeMode(target);
  }, []);

  // ═══ SISTEMA DE TROCA DE TEMA — REFEITO 2026-06 ═══
  // Bug antigo: timeouts dispersos + stale closures causavam trocas falhadas
  // em mobile. Solução: ref centralizado que rastreia todos os timeouts,
  // cancelamento limpo ao iniciar nova transição, e durações adaptativas.
  //
  // Arquitetura:
  //   - transitionRef: guarda TODOS os timeouts da transição atual
  //   - isTransitioningRef: flag sincronizada (sem stale closures)
  //   - cleanupTransition(): cancela tudo e reseta estado
  //   - startThemeTransition(): ponto único de entrada
  const transitionRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isTransitioningRef = useRef(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupTransition = useCallback(() => {
    // Cancela todos os timeouts pendentes
    transitionRef.current.forEach(t => clearTimeout(t));
    transitionRef.current = [];
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = null;
    }
    isTransitioningRef.current = false;
    // ═══ Resetar pendingToModeRef para evitar stale values ═══
    // Se uma transição foi cancelada antes do toggleTheme correr,
    // o pendingToModeRef podia ter um valor stale da transição anterior.
    pendingToModeRef.current = null;
    setHeroFlash('none');
    setRipple(null);
    setWaveActive(false);
    // Limpa --wave-delay das secções
    if (sectionRefs.current) {
      sectionRefs.current.forEach(el => {
        (el as HTMLElement).style.removeProperty('--wave-delay');
      });
    }
  }, []);

  const triggerHeroFlash = useCallback((toMode: 'light' | 'dark', x = 50, y = 50) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    const flashClass = toMode === 'light' ? 'to-light' : 'to-dark';
    setHeroFlash({type: flashClass as 'to-light' | 'to-dark', x, y});

    const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;
    // Mobile: 400ms (sincronizado com a nova animação heroFlashMobileLight/Dark de 400ms)
    // Desktop: 1000ms
    const flashDuration = isMobileViewport ? 400 : 1000;
    flashTimeoutRef.current = setTimeout(() => {
      setHeroFlash({type: 'none', x: 50, y: 50});
      flashTimeoutRef.current = null;
    }, flashDuration);
  }, []);

  // Ponto único de entrada para trocar de tema.
  // Origin: 'button' (botão do topo) ou 'orb' (orb central)
  const startThemeTransition = useCallback((origin: 'button' | 'orb', clickX?: number, clickY?: number) => {
    // Se já em transição, CANCELA a anterior e começa nova
    // (bug antigo: cliques rápidos falhavam porque o guard retornava)
    cleanupTransition();

    // ═══ Usar themeModeRef.current (SEMPRE actualizado) em vez de themeMode do closure ═══
    // Isto previne o bug onde cliques rápidos causavam trocas erradas:
    //   - Clique 1: themeMode=dark -> toMode=light, agenda toggleTheme
    //   - Clique 2 antes do toggle: closure antigo ainda tem themeMode=dark -> toMode=light outra vez
    //   - Resultado: flash vai para light mas tema acaba em dark
    // Com themeModeRef.current, lemos sempre o valor MAIS RECENTE.
    const currentMode = themeModeRef.current;
    const toMode = currentMode === 'dark' ? 'light' as const : 'dark' as const;
    // ═══ Marca o modo destino ANTES de agendar toggleTheme ═══
    // Quando toggleTheme for executado (300-500ms depois), ele lê pendingToModeRef
    // e usa ESSE valor (em vez de toggle baseado em prev state, que pode falhar
    // se houver múltiplas chamadas acumuladas).
    pendingToModeRef.current = toMode;
    const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;

    if (origin === 'orb' && !isMobileViewport) {
      // ═══ DESKTOP/TABLET via ORB — expande/suga luz do Honmoon (sem ripple) ═══
      const orb = orbRef.current;
      if (!orb) return;
      const rect = orb.getBoundingClientRect();
      const orbCX = rect.left + rect.width / 2;
      const orbCY = rect.top + rect.height / 2;
      const x = (orbCX / window.innerWidth) * 100;
      const y = (orbCY / window.innerHeight) * 100;

      // Sem ripple — só o flash expande/suga do orb
      setBurstKey(k => k + 1);
      setWaveActive(true);
      triggerHeroFlash(toMode, x, y);

      // Wave delay: secções mais próximas do orb mudam primeiro
      const maxDist = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
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
        const delay = Math.round(normalized * 700);
        (el as HTMLElement).style.setProperty('--wave-delay', `${delay}ms`);
      });

      // Toggle theme no pico do flash (50% de 1s)
      transitionRef.current.push(setTimeout(() => { toggleTheme(); }, toMode === 'light' ? 500 : 50));
      // Cleanup final
      transitionRef.current.push(setTimeout(() => {
        setRipple(null);
        setWaveActive(false);
        allSections.forEach(el => {
          (el as HTMLElement).style.removeProperty('--wave-delay');
        });
        isTransitioningRef.current = false;
      }, 2200));
    } else {
      // ═══ SMARTPHONE (qualquer origem) ou DESKTOP via BOTÃO — animação premium leve ═══
      // Em mobile usamos um radial-wipe premium (600ms) em vez do ripple pesado.
      // Em desktop via botão do topo, comportamento original simplificado.
      const cx = clickX ?? 50;
      const cy = clickY ?? 50;

      if (isMobileViewport) {
        // Mobile: flash expande/suga do ponto de clique (sem ripple)
        triggerHeroFlash(toMode, cx, cy);
        // to-light: toggle aos 200ms (50% de 400ms — novo flash mobile é mais rápido)
        // to-dark: toggle aos 50ms (quase imediato)
        transitionRef.current.push(setTimeout(() => { toggleTheme(); }, toMode === 'light' ? 200 : 50));
        // Cleanup mais cedo em mobile (350ms em vez de 500ms) — quanto antes
        // o isTransitioningRef passar a false, menos camadas extras o browser tem
        // de compor, e o scroll volta a ser fluído imediatamente.
        transitionRef.current.push(setTimeout(() => {
          setRipple(null);
          isTransitioningRef.current = false;
        }, 350));
      } else {
        // Desktop via botão do topo: ripple do Honmoon + toggle
        triggerHeroFlash(toMode, cx, cy);
        // toggleTheme aos 300ms (quando o ripple cobre o ecrã)
        transitionRef.current.push(setTimeout(() => { toggleTheme(); }, 300));
        transitionRef.current.push(setTimeout(() => {
          isTransitioningRef.current = false;
        }, 2200));
      }
    }
  }, [cleanupTransition, triggerHeroFlash, toggleTheme]);

  const navLinks = useMemo(() => [
    { l: "Espetáculo", h: "#espetaculo" },
    { l: "Mural", h: "#galeria" },
    { l: "Cartazes", h: "#cartazes" },
    { l: "Contacto", h: "#contacto" },
  ], []);

  return (
    <>
      {/* ═══ FLASH LAYER — expande/suga luz do Honmoon (position fixed, cobre tudo) ═══ */}
      {heroFlash.type !== 'none' && (
        <>
          <div
            className={`hero-img-flash ${heroFlash.type}`}
            style={{'--tx': `${heroFlash.x}%`, '--ty': `${heroFlash.y}%`} as React.CSSProperties}
            aria-hidden="true"
          />
          <div
            className={`hero-orb-burst ${heroFlash.type}`}
            style={{'--tx': `${heroFlash.x}%`, '--ty': `${heroFlash.y}%`} as React.CSSProperties}
            aria-hidden="true"
          />
        </>
      )}

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
        {/* Background image - full bleed (imagem clara em modo dia, escura em modo noite)
            Usa <picture> para servir imagens diferentes conforme o dispositivo:
            - Smartphone (<768px): imagens retrato (hero-bg-mobile*.webp) — novas imagens do user
            - Tablet+ (≥768px): imagens paisagem originais (hero-bg*.webp)
            Query parameter ?v=7 para cache-busting (força reload das imagens novas). */}
        <picture>
          {/* Smartphone (<768px) — imagens retrato ORIGINAIS do user (substituídas v7) */}
          <source
            media="(max-width: 767px)"
            srcSet={themeMode === 'light' ? "/hero-bg-mobile-light.webp?v=7" : "/hero-bg-mobile.webp?v=7"}
            type="image/webp"
          />
          {/* Tablet+ (≥768px) — imagens paisagem originais (hero-bg*.webp) */}
          <source
            media="(min-width: 768px)"
            srcSet={themeMode === 'light' ? "/hero-bg-light.webp?v=7" : "/hero-bg.webp?v=7"}
            type="image/webp"
          />
          {/* Fallback para browsers sem suporte <picture> */}
          <img
            src={themeMode === 'light' ? "/hero-bg-light.webp?v=7" : "/hero-bg.webp?v=7"}
            alt=""
            className={`hero-bg-img ${heroFlash.type !== 'none' ? 'flashing' : ''}`}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {/* Flash layer desativado — efeito visual fica no ripple do Honmoon Shield */}

        {/* Grid texture overlay */}
        <div className="hero-grid"/>

        {/* Depth overlay - fade at bottom */}
        <div className="hero-bg-overlay"/>

        {/* Vignette - darkens edges */}
        <div className="hero-vignette"/>

        {/* Glow orbs - apenas 1 (rosa, longe da personagem) para não competir com o glow dourado da HERO.png */}
        <div className="hero-glow-orb" style={{width:"20vw",height:"20vw",left:"5%",bottom:"20%",color:"rgba(255,45,120,0.08)",animationDelay:"6s"}}/>



        {/* ═══ HAMBURGER NAV - pinned at top of hero ═══ */}
        <nav className="absolute top-0 inset-x-0 z-[95] py-4" style={{background:"transparent"}}>
          <div className="hero-nav-panel w-full px-5 sm:px-8 flex items-center justify-end gap-5 sm:gap-8">
            {/* Ticketline - direciona para a zona dos cartazes (#cartazes) */}
            <a
              href="#cartazes"
              onClick={e => { e.preventDefault(); setMenuOpen(false); document.getElementById('cartazes')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="hero-nav-ticket group"
              style={{cursor: "pointer", textDecoration: "none"}}
              aria-label="Ir para a zona dos cartazes"
            >
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300" style={{color:"#fff"}}/>
              <span className="hidden sm:inline text-[11px] tracking-[0.2em] uppercase font-bold" style={{color:"#fff"}}>Ticketline</span>
            </a>
            {/* Theme toggle - ao lado do Ticketline */}
            <button
              className="hero-nav-theme"
              onClick={(e) => {
                // Nova arquitetura: ponto único de entrada, cancela transições anteriores
                const rect = e.currentTarget.getBoundingClientRect();
                const cx = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
                const cy = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
                startThemeTransition('button', cx, cy);
              }}
              aria-label={themeMode === 'dark' ? 'Ativar modo claro (dia)' : 'Ativar modo escuro (noite)'}
              title={themeMode === 'dark' ? 'Atual: Noite (escuro). Clique para Dia (claro)' : 'Atual: Dia (claro). Clique para Noite (escuro)'}
            >
              <span className={`hero-nav-orb ${themeMode}`}/>
              <span className="hidden sm:inline text-[10px] tracking-[0.18em] uppercase font-semibold" style={{color:"var(--neon-purple)", minWidth:"62px", textAlign:"center"}}>
                {themeMode === 'dark' ? 'Tema: Noite' : 'Tema: Dia'}
              </span>
            </button>
            {/* Hamburger - encostado à direita (último elemento do flex) */}
            <button
              onClick={()=>setMenuOpen(!menuOpen)}
              className={`hamburger ${menuOpen?"open":""}`}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>

        {/* ═══ FULLSCREEN MENU OVERLAY - cascade from LEFT ═══ */}
        <div className={`menu-overlay ${menuOpen?"open":""}`}>
          <div className="flex flex-col items-end gap-1 sm:gap-2 mb-16">
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
          <div style={{ transitionDelay: menuOpen ? `${navLinks.length * 80 + 200}ms` : "0ms", transform: menuOpen ? "translateX(0)" : "translateX(40px)", opacity: menuOpen ? 1 : 0, transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
            <button type="button" disabled aria-disabled="true" className="inline-flex items-center gap-2 px-10 py-4 text-[11px] tracking-[0.22em] uppercase font-semibold cursor-not-allowed" style={{background:"var(--neon-purple)",color:"#fff",opacity:0.85}}>
              <Ticket className="w-4 h-4"/> Ticketline
            </button>
          </div>
          {/* ═══ FORMATO ORIGINAL DAS REDES SOCIAIS (desativado a pedido — guardar para reativar) ═══
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
          ═══ FIM DO FORMATO ORIGINAL DAS REDES SOCIAIS ═══ */}
          {/* Decorative circle */}
          <div className="hero-circle hidden sm:block" style={{width:"500px",height:"500px",right:"-150px",top:"50%",transform:"translateY(-50%)",borderColor:"rgba(200,80,255,0.06)"}}/>
        </div>

        {/* ═══ HERO CTA - em baixo de 'Épico' (alinhado a ~19% X da imagem) ═══ */}
        <div className="hero-bottom-panel absolute z-10 flex flex-col items-start" style={{left: "19%", bottom: "22%", transform: "translateX(-25%)"}}>
          <a
            href="#cartazes"
            className="hero-cta"
            onClick={e => { e.preventDefault(); document.getElementById('cartazes')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Garante o Teu Lugar <ChevronRight className="w-3 h-3"/>
          </a>
        </div>
      </section>

      {/* ═══ HONMOON SHIELD - Theme Toggle (like the anime) ═══ */}
      <section className="honmoon-shield-section">
        {/* Marca de água */}
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
            // Nova arquitetura: ponto único de entrada, cancela transições anteriores
            // (bug antigo: cliques rápidos falhavam porque guards impediam nova troca)
            const orb = orbRef.current;
            if (!orb) return;
            const rect = orb.getBoundingClientRect();
            const cx = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
            const cy = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
            startThemeTransition('orb', cx, cy);
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

      {/* ═══ MEMÓRIAS - Slideshow cénico (sem molduras ondas) + transição cinematográfica ═══ */}
      <section id="memorias" className="memories-section">
        {/* Moldura cénica - pilares + vinheta + spotlight */}
        <div className="memories-stage-frame" aria-hidden="true">
          <div className="memories-pillar memories-pillar-left"/>
          <div className="memories-pillar memories-pillar-right"/>
          <div className="memories-spotlight"/>
          <div className="memories-curtain-top"/>
          <div className="memories-curtain-bottom"/>
        </div>
        <MemoriesSlideshow/>
      </section>

      {/* ═══ ESPETÁCULO - Descrição + Galeria ═══ */}
      <section id="espetaculo" className="espetaculo-section">
        {/* Atmospheric overlays - spotlights, glow orbs, vignette */}
        <div className="esp-spotlight esp-spotlight-left" aria-hidden="true"/>
        <div className="esp-spotlight esp-spotlight-center" aria-hidden="true"/>
        <div className="esp-spotlight esp-spotlight-right" aria-hidden="true"/>
        <div className="esp-glow-orb esp-glow-pink" aria-hidden="true"/>
        <div className="esp-glow-orb esp-glow-purple" aria-hidden="true"/>
        <div className="esp-readability-overlay" aria-hidden="true"/>
        <div className="esp-readability-light" aria-hidden="true"/>
        <div className="esp-vignette" aria-hidden="true"/>
        <div className="hero-aligned-container relative z-10">
          <div className="esp-layout">
            {/* LEFT - Description */}
            <div className="esp-left">
              <Rv>
                <p className="sec-num mb-4"><span style={{color:"var(--pink-light)"}}>+</span> TRIBUTO AO VIVO</p>
                <h2 className="text-2xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-1 sm:whitespace-nowrap" style={{color:"var(--t1)"}}>
                  O Honmoon <span style={{color:"var(--neon-purple)"}}>Ganha Vida</span>
                </h2>
                <p className="text-base sm:text-xl font-light tracking-wide mb-8 sm:whitespace-nowrap" style={{color:"var(--t2)"}}>
                  O universo das Guerreiras do K-Pop sai do ecr&atilde; e invade o palco
                </p>
              </Rv>
              <Rv delay={150}>
                <p className="text-xl sm:text-2xl font-light tracking-wide mb-8 max-w-xl" style={{color:"var(--t1)"}}>
                  &iexcl;Um Espet&aacute;culo Musical Imperd&iacute;vel!
                </p>
              </Rv>
              <Rv delay={250}>
                <p className="text-[16px] leading-[1.8] mb-6" style={{color:"var(--t2)", maxWidth: "760px"}}>
                  Prepare-se para uma explos&atilde;o de m&uacute;sica, dan&ccedil;a e cor! <strong style={{color:"var(--t1)"}}>Guerreiras do K-Pop</strong> &eacute; um tributo musical &uacute;nico ao fen&oacute;meno global que rompe as barreiras entre a anima&ccedil;&atilde;o e o palco. Com uma encena&ccedil;&atilde;o espetacular e uma fus&atilde;o distinta de ritmos, este espet&aacute;culo promete fazer o p&uacute;blico vibrar do primeiro ao &uacute;ltimo minuto.
                </p>
              </Rv>
              <Rv delay={350}>
                <p className="text-[16px] leading-[1.8] mb-6" style={{color:"var(--t2)", maxWidth: "760px"}}>
                  <span style={{color:"var(--neon-purple)"}}>Coreografias</span> envolventes, momentos teatrais e efeitos visuais impactantes transformam o palco num universo de emo&ccedil;&otilde;es. A ilumina&ccedil;&atilde;o din&acirc;mica amplifica a experi&ecirc;ncia, transportando o p&uacute;blico para as cenas mais ic&oacute;nicas atrav&eacute;s de imagens memor&aacute;veis e envolventes.
                </p>
              </Rv>
              <Rv delay={450}>
                <div className="esp-pitch esp-pitch-compact">
                  <p className="esp-pitch-text esp-pitch-text-compact esp-pitch-neon">
                    Traga a fam&iacute;lia e os amigos e embarquem juntos numa viagem emocionante,<br/>
                    guiada pela m&uacute;sica, pela magia do palco e por uma energia verdadeiramente envolvente.
                  </p>
                </div>
              </Rv>
              <Rv delay={500}>
                <button type="button" disabled aria-disabled="true" className="esp-cta cursor-not-allowed" style={{opacity:0.85}}>
                  <Ticket className="w-3.5 h-3.5"/> Ticketline
                </button>
              </Rv>
            </div>

            {/* RIGHT - espaço reservado para armas */}
            <div className="esp-right" />
          </div>
        </div>
      </section>

      <HonmoonDivider/>

      {/* ═══ PARALLAX 1 — ANTES do Mural (background-attachment: fixed, CSS-only) ═══ */}
      <div className="parallax-wrapper parallax-before-mural">
        <div className="parallax-bg" aria-hidden="true"/>
        <div className="parallax-overlay" aria-hidden="true"/>
        <section className="parallax-solo-section" aria-hidden="true"></section>
      </div>

      {/* ═══ GALERIA - Momentos ao Vivo com Legenda + Lightbox ═══ */}
      <section id="galeria" className="galeria-section">
        <div className="hero-aligned-container">
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

      {/* ═══ PARALLAX 2 — DEPOIS do Mural (background-attachment: fixed, CSS-only) ═══ */}
      <div className="parallax-wrapper parallax-after-mural">
        <div className="parallax-bg" aria-hidden="true"/>
        <div className="parallax-overlay" aria-hidden="true"/>
        <section id="showcase" className="showcase-section">
          <div className="showcase-overlay" aria-hidden="true"></div>
        </section>
      </div>

      {/* ═══ CARTAZES - Posters + Ticketline CTA ═══ */}
      <section id="cartazes" className="cartazes-section">
        {/* Shape divider TOPO - montanhas (igual ao site de referência) */}
        <div className="cartazes-shape cartazes-shape-top" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path className="cartazes-shape-fill" opacity="0.33" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"/>
            <path className="cartazes-shape-fill" opacity="0.66" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"/>
            <path className="cartazes-shape-fill" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"/>
          </svg>
        </div>

        {/* Marca de água */}
        <div className="hero-aligned-container">
          <Rv>
            <p className="sec-num mb-4">Pr&oacute;ximos Concertos em Tour</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-16" style={{color:"var(--t1)"}}>
              O Espet&aacute;culo <span className="neon-shimmer">Ao Vivo</span>
            </h2>
          </Rv>

          <div className="cartazes-grid">
          {/* ═══ CASCAIS - mesmo tamanho que os outros ═══ */}
            <Rv delay={200}>
              <article className="cartaz-card cartaz-secondary">
                <div className="cartaz-img-wrap">
                  <img src="/poster.webp" alt="Cartaz Cascais - Guerreiras do K-Pop" className="cartaz-img" loading="lazy" decoding="async" />
                  <div className="cartaz-overlay"/>
                  <div className="cartaz-tag">Cascais</div>
                </div>
                <div className="cartaz-info">
                  <p className="cartaz-city" style={{color:"var(--pink-kpop)"}}>Cascais &middot; Estoril</p>
                  <p className="cartaz-date">08 AGO 2026 &middot; 18:30h</p>
                  <p className="cartaz-status cartaz-status-soon">
                    <span className="cartaz-status-dot cartaz-status-dot-soon"/> Bilhetes &agrave; venda a partir de 20 de Junho
                  </p>
                  <p className="cartaz-venue">Academia das Artes do Estoril</p>
                  <button type="button" disabled aria-disabled="true" className="cartaz-buy-btn cursor-not-allowed" style={{opacity:0.85}}>
                    <Ticket className="w-4 h-4"/> Ticketline
                  </button>
                </div>
              </article>
            </Rv>

              {/* ═══ CAPARICA - Costa da Caparica ═══ */}
              <Rv delay={275}>
                <article className="cartaz-card cartaz-secondary">
                  <div className="cartaz-img-wrap">
                    <img src="/poster-caparica.webp" alt="Cartaz Costa da Caparica - Guerreiras do K-Pop" className="cartaz-img" loading="lazy" decoding="async" />
                    <div className="cartaz-overlay"/>
                    <div className="cartaz-tag cartaz-tag-soon">Em breve</div>
                  </div>
                  <div className="cartaz-info">
                    <p className="cartaz-city" style={{color:"var(--gold)"}}>Costa da Caparica</p>
                    <p className="cartaz-date">09 AGO 2026 &middot; 18:00h</p>
                    <p className="cartaz-status cartaz-status-soon">
                      <span className="cartaz-status-dot cartaz-status-dot-soon"/> Bilhetes &agrave; venda a partir de 20 de Junho
                    </p>
                    <p className="cartaz-venue">Pavilhão Municipal da Costa da Caparica</p>
                  </div>
                </article>
              </Rv>

            {/* ═══ SESIMBRA - mesmo tamanho que os outros ═══ */}
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
                </div>
              </article>
            </Rv>
          </div>
        </div>

        {/* Shape divider FUNDO - montanhas (igual ao site de referência) */}
        <div className="cartazes-shape cartazes-shape-bottom" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path className="cartazes-shape-fill" opacity="0.33" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"/>
            <path className="cartazes-shape-fill" opacity="0.66" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"/>
            <path className="cartazes-shape-fill" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"/>
          </svg>
        </div>
      </section>

      <HonmoonDivider/>

      <Marquee text="GUERREIRAS DO K-POP · TRIBUTO MUSICAL · 08 AGO CASCAIS · 09 AGO COSTA DA CAPARICA · 15 AGO SESIMBRA · ZOEY · RUMI · MIRA · HUNTRIX · SAJA BOYS"/>

      <HonmoonDivider/>

      {/* ═══ CONTACTE-NOS - Reservas & Eventos ═══ */}
      <section id="contacto" className="contacto-section">
        {/* Marca de água */}
        <div className="hero-aligned-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* ── Coluna esquerda: pitch + info ── */}
            <div className="lg:col-span-5">
              <Rv>
                <p className="sec-num mb-4">Contacte-nos</p>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] leading-[1.05] mb-8" style={{color:"var(--t1)"}}>
                  Um Espet&aacute;culo Inesquec&iacute;vel <span className="neon-shimmer">Onde Quiser</span>
                </h2>
              </Rv>
              <Rv delay={120}>
                <p className="text-[16px] leading-[1.8] mb-8 max-w-lg" style={{color:"var(--t2)"}}>
                  Vers&aacute;til e pensado para diferentes contextos, este espet&aacute;culo pode ser apresentado em espa&ccedil;os culturais, escolas, associa&ccedil;&otilde;es, autarquias, centros comerciais e Festas de Natal de empresas, garantindo sempre um momento &uacute;nico de entretenimento.
                </p>
              </Rv>
              <Rv delay={200}>
                <p className="text-[16px] leading-[1.7] mb-10 max-w-lg" style={{color:"var(--neon-purple)", fontWeight: 500}}>
                  Contacte-nos e n&atilde;o perca a oportunidade de oferecer um espet&aacute;culo &uacute;nico. Reserve j&aacute; a sua data.
                </p>
              </Rv>
              <Rv delay={280}>
                <div className="space-y-4 mb-10">
                  <a href="tel:+351960191005" className="flex items-start gap-4 group" onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity="0.85"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1"}}>
                    <Phone className="w-4 h-4 mt-1 flex-shrink-0" style={{color:"var(--neon-purple)"}}/>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-1" style={{color:"var(--t3)"}}>Telefone direto</p>
                      <p className="text-[15px]" style={{color:"var(--t1)"}}>+351 960 191 005</p>
                    </div>
                  </a>
                  <a href="mailto:geral@guerreirasdokpop.com" className="flex items-start gap-4 group" onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity="0.85"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1"}}>
                    <Mail className="w-4 h-4 mt-1 flex-shrink-0" style={{color:"var(--neon-purple)"}}/>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase font-medium mb-1" style={{color:"var(--t3)"}}>E-mail de produ&ccedil;&atilde;o</p>
                      <p className="text-[15px]" style={{color:"var(--t1)"}}>geral@guerreirasdokpop.com</p>
                    </div>
                  </a>
                </div>
              </Rv>
            </div>

            {/* ── Coluna direita: formulário ── */}
            <div className="lg:col-span-7">
              <Rv delay={150}>
                <form className="contacto-form" onSubmit={async (e)=>{
                  e.preventDefault();
                  const f = e.currentTarget as HTMLFormElement;
                  const fd = new FormData(f);
                  const submitBtn = f.querySelector('button[type="submit"]') as HTMLButtonElement;
                  const okMsg = document.getElementById("contacto-ok");
                  const errMsg = document.getElementById("contacto-err");
                  // Esconde mensagens anteriores
                  if (okMsg) okMsg.style.display = "none";
                  if (errMsg) errMsg.style.display = "none";
                  // Estado loading no botão
                  const originalText = submitBtn.innerHTML;
                  submitBtn.innerHTML = '<span class="contacto-spinner"></span> A enviar...';
                  submitBtn.disabled = true;
                  try {
                    // Adiciona campos especiais do Formspree
                    fd.append("_subject", `Reserva - Guerreiras do K-Pop · ${fd.get("tipo") || "Tributo musical"}`);
                    fd.append("_captcha", "false");
                    fd.append("_template", "table");
                    const res = await fetch("https://formspree.io/f/xeewdbar", {
                      method: "POST",
                      body: fd,
                      headers: { Accept: "application/json" }
                    });
                    if (res.ok) {
                      f.reset();
                      if (okMsg) {
                        okMsg.style.display = "block";
                        okMsg.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    } else {
                      throw new Error("Formspree error");
                    }
                  } catch (err) {
                    if (errMsg) errMsg.style.display = "block";
                  } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                  }
                }}>
                  {/* Campos especiais Formspree (escondidos) */}
                  <input type="hidden" name="_subject" value="Nova reserva - Guerreiras do K-Pop"/>
                  <input type="hidden" name="_captcha" value="false"/>
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
                    <p id="contacto-ok" className="text-[13px] font-medium contacto-msg-success" style={{color:"var(--neon-purple)", display:"none"}}>
                      ✓ Pedido enviado com sucesso! Recebemos a sua mensagem e respondemos em breve.
                    </p>
                    <p id="contacto-err" className="text-[13px] font-medium" style={{color:"#ef4444", display:"none"}}>
                      ✗ Erro ao enviar. Tente novamente ou contacte-nos diretamente por email.
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

      <div className="neon-div hero-aligned-container"/>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 mt-auto border-t" style={{background:"var(--void)",borderColor:"rgba(200,80,255,0.04)"}}>
        <div className="hero-aligned-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.1em]" style={{color:"var(--t3)"}}>Francisco Cardinali Produções</span>
            <span className="text-[10px] tracking-[0.1em]" style={{color:"var(--t3)"}}>&copy; 2026 Guerreiras do K-Pop</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <button type="button" disabled aria-disabled="true" className="text-[10px] tracking-[0.1em] cursor-not-allowed bg-transparent border-0 p-0" style={{color:"var(--neon-purple)",opacity:0.85}}>Ticketline</button>
            <a href="https://guerreirasdokpop.pt" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.1em] hover:underline" style={{color:"var(--t3)"}}>guerreirasdokpop.pt</a>
            <button onClick={()=>setPrivacyOpen(true)} className="text-[10px] tracking-[0.1em] hover:underline cursor-pointer bg-transparent border-0 p-0" style={{color:"var(--t3)"}}>Política de Privacidade</button>
            <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.1em] hover:underline" style={{color:"var(--t3)"}}>Livro de Reclamações</a>
          </div>
        </div>
      </footer>

      {/* ═══ MOBILE STICKY CTA ═══ */}
      <div className={`fixed bottom-0 inset-x-0 z-40 sm:hidden p-3 backdrop-blur-2xl border-t transition-opacity duration-300 ${loaded?"":"opacity-0 pointer-events-none"}`} style={{background:"rgba(11,8,19,0.92)",borderColor:"rgba(200,80,255,0.08)"}}>
        <button type="button" disabled aria-disabled="true" className="flex items-center justify-center gap-2 w-full py-3.5 text-[10px] tracking-[0.22em] font-semibold uppercase cursor-not-allowed" style={{background:"var(--neon-purple)",color:"#fff",opacity:0.85}}>
          <Ticket className="w-4 h-4"/> Ticketline
        </button>
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

      {/* ═══ POLÍTICA DE PRIVACIDADE - Modal RGPD ═══ */}
      {privacyOpen && (
        <div className="privacy-overlay" onClick={()=>setPrivacyOpen(false)} role="dialog" aria-modal="true" aria-label="Política de Privacidade">
          <div className="privacy-modal" onClick={e=>e.stopPropagation()}>
            <button className="privacy-close" onClick={()=>setPrivacyOpen(false)} aria-label="Fechar">✕</button>
            <h2 className="privacy-title">Política de Privacidade</h2>
            <p className="privacy-updated">Última atualização: Junho de 2026</p>
            <div className="privacy-body">
              <h3>1. Responsável pelo Tratamento</h3>
              <p>Viva &mdash; Artes &amp; Produções, responsável pela organização do espetáculo Guerreiras do K-Pop. Contacto: <a href="mailto:geral@guerreirasdokpop.com">geral@guerreirasdokpop.com</a></p>
              <h3>2. Dados Recolhidos</h3>
              <p>Através do formulário de contacto, recolhemos: nome, e-mail, telefone e mensagem, fornecidos voluntariamente pelo utilizador.</p>
              <h3>3. Finalidade do Tratamento</h3>
              <p>Os dados são utilizados exclusivamente para responder a pedidos de informação, reservas e colaborações. Não são usados para marketing sem consentimento expresso.</p>
              <h3>4. Base Legal</h3>
              <p>Consentimento do titular (art.º 6.º, n.º 1, al. a) do RGPD), dado ao submeter o formulário.</p>
              <h3>5. Prazo de Conservação</h3>
              <p>Os dados são conservados pelo período necessário para responder ao pedido e, no máximo, 12 meses após a última comunicação.</p>
              <h3>6. Partilha de Dados</h3>
              <p>Os seus dados não são partilhados, vendidos ou cedidos a terceiros, exceto quando exigido por lei.</p>
              <h3>7. Direitos do Titular</h3>
              <p>Tem direito a aceder, retificar ou eliminar os seus dados, opor-se ao tratamento e apresentar reclamação à <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">CNPD</a>.</p>
              <p>Para exercer estes direitos: <a href="mailto:geral@guerreirasdokpop.com">geral@guerreirasdokpop.com</a></p>
              <h3>8. Alterações</h3>
              <p>Esta política pode ser atualizada. A data da última revisão consta no topo deste documento.</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
