"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Ticket,
  MapPin,
  Clock,
  Star,
  ChevronDown,
  Menu,
  X,
  Instagram,
  Youtube,
  Music2,
  Sparkles,
  Shield,
  Flame,
  Mic2,
  Heart,
  ArrowRight,
  ExternalLink,
  Send,
  ChevronUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ──────────── DATA ──────────── */

const TICKETLINE_URL = "https://www.ticketline.pt";
const EVENT_DATE = new Date("2026-07-18T18:30:00");

const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Lineup", href: "#lineup" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Bilhetes", href: "#bilhetes" },
  { label: "Local", href: "#local" },
  { label: "FAQ", href: "#faq" },
];

const ARTISTS = [
  {
    name: "HUNTRIX",
    role: "Headliner — Demon Hunters",
    image: "/artists.png",
    gradient: "from-yellow-500/20 to-purple-500/20",
    accent: "#FFD700",
  },
  {
    name: "RUMI",
    role: "Vocal Principal",
    image: "/poster.png",
    gradient: "from-pink-500/20 to-purple-500/20",
    accent: "#FF69B4",
  },
  {
    name: "MIRAE",
    role: "Dança & Rap",
    image: "/poster.png",
    gradient: "from-cyan-500/20 to-purple-500/20",
    accent: "#20B2AA",
  },
  {
    name: "ZOE",
    role: "Performance Especial",
    image: "/poster.png",
    gradient: "from-blue-500/20 to-purple-500/20",
    accent: "#4A90E2",
  },
];

const EXPERIENCES = [
  {
    icon: <Mic2 className="w-8 h-8" />,
    title: "Palcos K-Pop ao Vivo",
    description:
      "Performances épicas de tributo aos maiores hits do K-Pop, com coreografias incríveis e luzes neon que transformam a noite numa experiência inesquecível. Sente a energia do palco como nunca antes!",
    accent: "#FFD700",
  },
  {
    icon: <Music2 className="w-8 h-8" />,
    title: "Random Play Dance",
    description:
      "O momento mais esperado! O RPD onde todos dançam ao som dos seus bias. Quem sabe a coreografia toda? Provem-no no nosso Random Play Dance gigante com DJs exclusivos!",
    accent: "#FF69B4",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "K-Culture Zone",
    description:
      "Mercado de K-Beauty, moda coreana, snacks e merch oficial. Descobre produtos exclusivos, participa em workshops de maquilhagem K-Beauty e prova as melhores delícias coreanas!",
    accent: "#7B2F9A",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Fan Meet & Greet",
    description:
      "Conhece as tuas artistas favoritas em sessões exclusivas de autógrafos e fotos. Uma oportunidade única para criar memórias que duram para sempre com as Guerreiras!",
    accent: "#20B2AA",
  },
];

const TICKETS = [
  {
    name: "Geral",
    price: "25€",
    features: [
      "Acesso a todos os palcos",
      "Random Play Dance",
      "K-Culture Zone",
      "1 bebida de oferta",
    ],
    popular: false,
    accent: "#7B2F9A",
  },
  {
    name: "VIP",
    price: "45€",
    features: [
      "Tudo do bilhete Geral",
      "Zona VIP frente ao palco",
      "Meet & Greet inclusivo",
      "Merch exclusivo",
      "2 bebidas de oferta",
    ],
    popular: true,
    accent: "#FFD700",
  },
  {
    name: "Premium",
    price: "75€",
    features: [
      "Tudo do bilhete VIP",
      "Backstage Experience",
      "Jantar K-Food inclusivo",
      "Photocall exclusivo",
      "Kit Premium completo",
    ],
    popular: false,
    accent: "#FF69B4",
  },
];

const FAQS = [
  {
    q: "Qual a idade mínima para entrar no festival?",
    a: "O festival é para todas as idades! Crianças até aos 5 anos não pagam entrada (desde que acompanhadas por um adulto). Menores de 12 anos devem estar sempre acompanhados por um responsável adulto. O ambiente é familiar e seguro para todos os fãs de K-Pop!",
  },
  {
    q: "Onde posso comprar bilhetes?",
    a: "Os bilhetes estão disponíveis exclusivamente na Ticketline, o nosso parceiro oficial de bilheteira. Podes comprar online em ticketline.pt ou nos pontos de venda habituais. Recomendamos a compra antecipada pois os bilhetes são limitados!",
  },
  {
    q: "Posso trazer a minha lightstick?",
    a: "Claro que sim! As lightsticks são bem-vindas e encorajadas! Quanto mais brilho, melhor a atmosfera. No entanto, não são permitidos objetos perigosos como bastões com pontas metálicas ou lasers. A segurança de todos é prioridade.",
  },
  {
    q: "Há estacionamento no local?",
    a: "Sim, existe estacionamento gratuito nas proximidades da Academia das Artes do Estoril. Também recomendamos a utilização de transportes públicos — a estação de comboios do Estoril fica a 5 minutos a pé do local. Consulta o nosso mapa na secção 'Local' para mais detalhes.",
  },
  {
    q: "O evento acontece com chuva?",
    a: "O festival tem zonas cobertas e ao ar livre. Em caso de chuva, as atuações nos palcos principais continuam pois são cobertos. Aconselhamos a trazer um impermeável leve. Em caso de condições meteorológicas extremas, o evento poderá ser adiado e os bilhetes mantêm-se válidos.",
  },
  {
    q: "Posso reembolsar o meu bilhete?",
    a: "De acordo com a legislação portuguesa, os bilhetes podem ser reembolsados até 7 dias após a compra, desde que o pedido seja feito com pelo menos 48h de antecedência ao evento. Para pedidos de reembolso, contacta a Ticketline diretamente.",
  },
];

/* ──────────── COMPONENTS ──────────── */

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = EVENT_DATE.getTime() - now.getTime();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-4 justify-center">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="glass-card rounded-xl px-3 py-2 sm:px-5 sm:py-3 min-w-[60px] sm:min-w-[80px] text-center">
            <span className="text-2xl sm:text-4xl font-bold text-yellow-400 neon-text-gold font-mono">
              {String(u.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground mt-1.5 uppercase tracking-wider">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SparkleEffect() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-yellow-400/60"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────── MAIN PAGE ──────────── */

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ─── NAVIGATION ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-lg shadow-purple-900/20 border-b border-purple-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
              </div>
              <span className="text-sm sm:text-lg font-bold gradient-text hidden sm:inline">
                GUERREIRAS DO K-POP
              </span>
              <span className="text-sm font-bold gradient-text sm:hidden">
                GDKP
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-yellow-400 transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href={TICKETLINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-background font-bold text-sm hover:from-yellow-300 hover:to-yellow-400 transition-all animate-pulse-glow"
              >
                <Ticket className="w-4 h-4" />
                Comprar Bilhete
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-purple-500/10"
            >
              <div className="px-4 py-4 space-y-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-muted-foreground hover:text-yellow-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={TICKETLINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-4 py-3 mt-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-background font-bold animate-pulse-glow"
                >
                  <Ticket className="w-4 h-4 inline mr-2" />
                  Comprar Bilhete
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero-bg.png"
            alt="Guerreiras do K-Pop Festival"
            className="w-full h-full object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>

        <SparkleEffect />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 sm:mb-8"
          >
            <Flame className="w-4 h-4 text-yellow-400" />
            <span className="text-xs sm:text-sm font-medium text-yellow-400">
              TRIBUTO MUSICAL EM TOUR
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mb-4 sm:mb-6"
          >
            <span className="neon-text text-blue-400">GUERREIRAS</span>
            <br />
            <span className="neon-text-gold text-yellow-400">DO K-POP</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto"
          >
            Baseado na série{" "}
            <span className="text-pink-400 font-semibold">
              K-Pop Demon Hunters
            </span>{" "}
            da Netflix. Um espetáculo épico ao vivo em Cascais!
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-8 sm:mb-10"
          >
            <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-3">
              Contagem Decrescente
            </p>
            <CountdownTimer />
          </motion.div>

          {/* Event Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-10 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span>18 Julho 2026</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span>18:30h</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span>Cascais, Estoril</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={TICKETLINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-background font-bold text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all animate-pulse-glow shadow-2xl"
            >
              <Ticket className="w-5 h-5" />
              Comprar Bilhete
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="#lineup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card glass-card-hover text-foreground font-semibold text-lg transition-all"
            >
              Ver Lineup
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </a>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── ABOUT / SOBRE ─── */}
      <section id="sobre" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-yellow-400 font-medium">
              Sobre o Evento
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-6">
              A Caçada Começa{" "}
              <span className="gradient-text">Ao Vivo</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              As Guerreiras do K-Pop chegam a Cascais para um espetáculo épico de
              tributo musical inspirado na série{" "}
              <span className="text-pink-400 font-semibold">
                K-Pop Demon Hunters
              </span>{" "}
              da Netflix. Atuações ao vivo, coreografias incríveis, efeitos
              visuais de outro mundo e uma experiência imersiva que vai fazer-te
              sentir parte da caçada! Prepara a tua lightstick e junta-te a nós!
            </p>
          </AnimatedSection>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: "4+", label: "Artistas ao Vivo", icon: <Mic2 className="w-5 h-5" /> },
              { value: "3h", label: "Espetáculo", icon: <Clock className="w-5 h-5" /> },
              { value: "5", label: "Zonas de Experiência", icon: <Star className="w-5 h-5" /> },
              { value: "1", label: "Noite Épica", icon: <Flame className="w-5 h-5" /> },
            ].map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="glass-card glass-card-hover rounded-2xl p-6 text-center transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/10 text-yellow-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LINEUP ─── */}
      <section id="lineup" className="py-20 sm:py-28 section-gradient relative">
        <SparkleEffect />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-pink-400 font-medium">
              Lineup
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-4">
              As Nossas <span className="neon-text-pink text-pink-400">Guerreiras</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              As artistas mais ferozes do universo K-Pop Demon Hunters, prontas para incendiar o palco em Cascais!
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARTISTS.map((artist, i) => (
              <AnimatedSection key={artist.name} delay={i * 0.15}>
                <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
                    />
                    {/* Glow border on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        boxShadow: `inset 0 0 30px ${artist.accent}40`,
                      }}
                    />
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <h3
                      className="text-xl font-black mb-1"
                      style={{ color: artist.accent }}
                    >
                      {artist.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {artist.role}
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-pink-400 transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-red-400 transition-colors"
                        aria-label="YouTube"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-blue-400 transition-colors"
                        aria-label="TikTok"
                      >
                        <Music2 className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Full lineup poster */}
          <AnimatedSection className="mt-16 text-center">
            <div className="glass-card rounded-2xl p-6 sm:p-8 inline-block">
              <img
                src="/poster.png"
                alt="Cartaz Oficial - Guerreiras do K-Pop"
                className="max-h-[500px] mx-auto rounded-lg shadow-2xl shadow-purple-500/20"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── EXPERIENCE PILLARS ─── */}
      <section id="experiencia" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-yellow-400 font-medium">
              Experiência
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-4">
              Mais Que Um <span className="gradient-text">Concerto</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma experiência imersiva que vai além da música. Descubre tudo o que te espera nas Guerreiras do K-Pop!
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPERIENCES.map((exp, i) => (
              <AnimatedSection key={exp.title} delay={i * 0.15}>
                <div className="glass-card glass-card-hover rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden">
                  {/* Accent glow */}
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: exp.accent }}
                  />
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${exp.accent}15`, color: exp.accent }}
                  >
                    {exp.icon}
                  </div>
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-3"
                    style={{ color: exp.accent }}
                  >
                    {exp.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TICKETS ─── */}
      <section id="bilhetes" className="py-20 sm:py-28 section-gradient relative">
        <SparkleEffect />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-yellow-400 font-medium">
              Bilhetes
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-4">
              Escolhe o Teu <span className="neon-text-gold text-yellow-400">Poder</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada bilhete dá-te acesso a uma experiência diferente. Qual é o nível de guerreira que queres ser?
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {TICKETS.map((ticket, i) => (
              <AnimatedSection key={ticket.name} delay={i * 0.15}>
                <div
                  className={`relative glass-card rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                    ticket.popular
                      ? "ring-2 ring-yellow-400/50 shadow-xl shadow-yellow-400/10"
                      : ""
                  }`}
                >
                  {/* Popular badge */}
                  {ticket.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-background text-xs font-bold uppercase tracking-wider">
                      Mais Popular
                    </div>
                  )}

                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: ticket.accent }}
                  >
                    {ticket.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl sm:text-5xl font-black text-foreground">
                      {ticket.price}
                    </span>
                    <span className="text-muted-foreground text-sm">/pessoa</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {ticket.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-muted-foreground text-sm"
                      >
                        <Star
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: ticket.accent }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={TICKETLINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3.5 rounded-full font-bold text-sm transition-all ${
                      ticket.popular
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-background hover:from-yellow-300 hover:to-yellow-400 animate-pulse-glow"
                        : "border-2 hover:bg-white/5"
                    }`}
                    style={
                      !ticket.popular
                        ? { borderColor: `${ticket.accent}60`, color: ticket.accent }
                        : {}
                    }
                  >
                    <Ticket className="w-4 h-4 inline mr-2" />
                    Comprar na Ticketline
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Group discount callout */}
          <AnimatedSection className="mt-10 text-center">
            <div className="glass-card rounded-2xl p-6 inline-flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-400/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">Desconto de Grupo!</p>
                <p className="text-sm text-muted-foreground">
                  Compra 4 bilhetes e recebe 10% de desconto. Contacta-nos para saber mais.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── VENUE ─── */}
      <section id="local" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-yellow-400 font-medium">
              Local
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-4">
              Onde a <span className="gradient-text">Magia</span> Acontece
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Map / Image */}
            <AnimatedSection>
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="relative">
                  <img
                    src="/venue-bg.png"
                    alt="Academia das Artes do Estoril"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              </div>
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                    Academia das Artes do Estoril
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Um espaço icónico na costa de Cascais, onde a arte e a cultura se encontram.
                    A localização perfeita para receber as Guerreiras do K-Pop, com uma vista
                    deslumbrante sobre o Atlântico e infraestruturas de primeiro nível.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Morada</p>
                      <p className="text-sm text-muted-foreground">
                        Av. Marginal, 2765-282 Estoril, Cascais
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Horário</p>
                      <p className="text-sm text-muted-foreground">
                        18 de Julho 2026 — Portas às 18:30h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Acessibilidade</p>
                      <p className="text-sm text-muted-foreground">
                        Estação de comboios do Estoril a 5 min a pé. Estacionamento gratuito nas proximidades.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Academia+das+Artes+do+Estoril"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card glass-card-hover text-yellow-400 font-semibold text-sm transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Ver no Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 sm:py-28 section-gradient relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs sm:text-sm uppercase tracking-widest text-yellow-400 font-medium">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-4">
              Perguntas <span className="gradient-text">Frequentes</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="glass-card rounded-xl px-6 border-0 overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:text-yellow-400 transition-colors py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── NEWSLETTER + SOCIAL ─── */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <AnimatedSection>
                <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl sm:text-4xl font-black mb-3">
                  Fica Ligad<span className="text-yellow-400">o</span>!
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                  Subscreve a nossa newsletter e recebe em primeira mão novidades sobre lineup,
                  bilhetes e surpresas exclusivas. Não percas nada!
                </p>

                {/* Email form */}
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10"
                >
                  <Input
                    type="email"
                    placeholder="O teu email..."
                    className="bg-white/5 border-purple-500/30 focus:border-yellow-400 focus:ring-yellow-400/20 placeholder:text-muted-foreground/50"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-background font-bold hover:from-yellow-300 hover:to-yellow-400 px-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Subscrever
                  </Button>
                </form>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4">
                  {[
                    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
                    { icon: <Youtube className="w-5 h-5" />, href: "#", label: "YouTube" },
                    { icon: <Music2 className="w-5 h-5" />, href: "#", label: "TikTok" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-12 h-12 rounded-full glass-card glass-card-hover flex items-center justify-center text-muted-foreground hover:text-yellow-400 transition-all"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 border-t border-purple-500/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-background" />
                </div>
                <span className="font-bold gradient-text">
                  GUERREIRAS DO K-POP
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tributo musical oficial em tour. Inspirado na série K-Pop Demon
                Hunters da Netflix. Um evento para todos os fãs!
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Links Rápidos</h4>
              <div className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Ticket + Legal */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Bilhetes</h4>
              <a
                href={TICKETLINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors mb-4"
              >
                <Ticket className="w-4 h-4" />
                Comprar na Ticketline
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Termos e Condições</p>
                <p>Política de Privacidade</p>
                <p>Acessibilidade</p>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-500/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 Guerreiras do K-Pop. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Bilheteira oficial:{" "}
              <a
                href={TICKETLINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                Ticketline
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ─── STICKY MOBILE CTA ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden p-3 bg-background/90 backdrop-blur-xl border-t border-purple-500/10">
        <a
          href={TICKETLINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-background font-bold text-sm animate-pulse-glow"
        >
          <Ticket className="w-4 h-4" />
          Comprar Bilhete na Ticketline
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* ─── SCROLL TO TOP ─── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40 w-12 h-12 rounded-full glass-card flex items-center justify-center text-yellow-400 hover:bg-yellow-400/10 transition-all"
            aria-label="Voltar ao topo"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Calendar Icon (inline to avoid import issues) ─── */
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
