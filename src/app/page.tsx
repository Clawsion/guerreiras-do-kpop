"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ─── CONSTANTS ─── */

const TICKETLINE_URL = "https://www.ticketline.pt";
const EVENT_DATE = new Date("2026-07-18T18:30:00");

/* ─── COUNTDOWN ─── */

function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE.getTime() - Date.now();
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

  const units = [
    { v: t.d, l: "DIAS" },
    { v: t.h, l: "HRS" },
    { v: t.m, l: "MIN" },
    { v: t.s, l: "SEG" },
  ];

  return (
    <div className="flex gap-3 sm:gap-5 justify-center">
      {units.map((u) => (
        <div key={u.l} className="flex flex-col items-center">
          <div className="bg-[#140822] border border-[#3D1764] rounded-lg px-4 py-3 sm:px-6 sm:py-4 min-w-[56px] sm:min-w-[72px] text-center">
            <span className="text-2xl sm:text-4xl font-black text-[#FFD700] tabular-nums tracking-tight">
              {String(u.v).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs tracking-[0.2em] text-[#9B8AAD] mt-2 font-medium">
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN PAGE ─── */

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══════ NAV ═══════ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1A0A2E]/95 backdrop-blur-md border-b border-[#3D1764]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#FFD700] flex items-center justify-center">
              <span className="text-[#1A0A2E] font-black text-xs">GK</span>
            </div>
            <span className="font-black text-sm tracking-wide text-[#F0ECF4] hidden sm:block">
              GUERREIRAS DO K-POP
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {["Lineup", "Bilhetes", "Local", "FAQ"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-[13px] tracking-wide text-[#9B8AAD] hover:text-[#FFD700] transition-colors font-medium"
              >
                {l}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href={TICKETLINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#FFD700] text-[#1A0A2E] font-bold text-sm px-5 py-2 rounded hover:bg-[#FFE44D] transition-colors"
            >
              <Ticket className="w-3.5 h-3.5" />
              Bilhetes
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[#F0ECF4] p-1"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#140822] border-t border-[#3D1764] px-4 py-4 space-y-1">
            {["Lineup", "Bilhetes", "Local", "FAQ"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-[#9B8AAD] hover:text-[#FFD700] text-sm font-medium rounded hover:bg-[#2E1050] transition-colors"
              >
                {l}
              </a>
            ))}
            <a
              href={TICKETLINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-[#FFD700] text-[#1A0A2E] font-bold text-sm px-4 py-3 rounded mt-2"
            >
              <Ticket className="w-3.5 h-3.5 inline mr-1.5" />
              Comprar Bilhetes
            </a>
          </div>
        )}
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-end pb-12 sm:pb-20 overflow-hidden">
        {/* Poster as hero background */}
        <div className="absolute inset-0">
          <img
            src="/poster.png"
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
          {/* Date & Location tag */}
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-[#FFD700] text-[#1A0A2E] text-[11px] font-bold tracking-[0.15em] px-3 py-1.5 rounded">
              18 JUL 2026
            </span>
            <span className="text-[#9B8AAD] text-sm font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              CASCAIS — ESTORIL
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-4">
            <span className="text-[#4A90E2]">GUERREIRAS</span>
            <br />
            <span className="text-[#FFD700]">DO K-POP</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#9B8AAD] text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Tributo musical ao vivo inspirado em{" "}
            <span className="text-[#FF2D78] font-semibold">K-Pop Demon Hunters</span> da Netflix.
            Um espetáculo épico em Cascais.
          </p>

          {/* Countdown */}
          <div className="mb-8">
            <Countdown />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a
              href={TICKETLINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFD700] text-[#1A0A2E] font-bold text-base px-8 py-4 rounded hover:bg-[#FFE44D] transition-colors"
            >
              <Ticket className="w-4 h-4" />
              Comprar Bilhete
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="#lineup"
              className="inline-flex items-center gap-2 border border-[#3D1764] text-[#F0ECF4] font-semibold text-sm px-6 py-4 rounded hover:bg-[#2E1050] transition-colors"
            >
              Ver Lineup
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ LINEUP ═══════ */}
      <section id="lineup" className="section-dark py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] tracking-[0.25em] text-[#FFD700] font-bold mb-2 uppercase">
                Lineup
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                As Guerreiras
              </h2>
            </div>
            <a
              href={TICKETLINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#FFD700] text-sm font-semibold hover:underline"
            >
              Bilhetes <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Artist Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                name: "HUNTRIX",
                sub: "Headliner",
                color: "#FFD700",
              },
              {
                name: "RUMI",
                sub: "Vocal Principal",
                color: "#FF2D78",
              },
              {
                name: "MIRAE",
                sub: "Dança & Rap",
                color: "#20B2AA",
              },
              {
                name: "ZOE",
                sub: "Performance Especial",
                color: "#4A90E2",
              },
            ].map((artist) => (
              <div
                key={artist.name}
                className="group relative bg-[#241240] border border-[#3D1764] rounded-lg overflow-hidden hover:border-[#5A2D87] transition-colors"
              >
                {/* Artist poster image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="/poster.png"
                    alt={artist.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Info overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A0A2E] via-[#1A0A2E]/80 to-transparent pt-16 pb-4 px-4">
                  <p
                    className="text-[10px] tracking-[0.2em] font-bold mb-1"
                    style={{ color: artist.color }}
                  >
                    {artist.sub.toUpperCase()}
                  </p>
                  <h3 className="text-lg sm:text-xl font-black text-[#F0ECF4] leading-tight">
                    {artist.name}
                  </h3>
                  {/* Social icons */}
                  <div className="flex gap-3 mt-2.5">
                    <Instagram className="w-3.5 h-3.5 text-[#9B8AAD] hover:text-[#FF2D78] cursor-pointer transition-colors" />
                    <Youtube className="w-3.5 h-3.5 text-[#9B8AAD] hover:text-[#FF0000] cursor-pointer transition-colors" />
                    <Music2 className="w-3.5 h-3.5 text-[#9B8AAD] hover:text-[#00F2EA] cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Official poster */}
          <div className="mt-14 flex justify-center">
            <div className="bg-[#241240] border border-[#3D1764] rounded-lg p-4 sm:p-6 inline-block">
              <img
                src="/poster.png"
                alt="Cartaz Oficial — Guerreiras do K-Pop"
                className="max-h-[420px] rounded"
              />
              <p className="text-center text-[#9B8AAD] text-xs mt-3 tracking-wide">
                CARTAZ OFICIAL — GUERREIRAS DO K-POP 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ EXPERIENCE ═══════ */}
      <section id="experiencia" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-[11px] tracking-[0.25em] text-[#FFD700] font-bold mb-2 uppercase">
            Experiência
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">
            O Que Te Espera
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#3D1764] rounded-lg overflow-hidden">
            {[
              {
                title: "Palco Principal",
                desc: "Atuações ao vivo de tributo com coreografias e efeitos visuais que replicam a energia dos concertos K-Pop. As Guerreiras sobem ao palco para uma noite épica.",
                icon: "🎤",
                accent: "#FFD700",
              },
              {
                title: "Random Play Dance",
                desc: "O momento mais esperado por todos os fãs! DJ ao vivo, hits aleatórios, e toda a gente a dançar. Quem sabe a coreografia toda? Provem-no!",
                icon: "💃",
                accent: "#FF2D78",
              },
              {
                title: "K-Culture Zone",
                desc: "K-Beauty, moda coreana, snacks e merch exclusivo. Workshops de maquilhagem e provas de comida coreana. A cultura K-Pop para além da música.",
                icon: "✨",
                accent: "#7B2F9A",
              },
              {
                title: "Meet & Greet",
                desc: "Sessões exclusivas de autógrafos e fotos com as artistas. Uma oportunidade única para criar memórias com as Guerreiras Demon Hunters.",
                icon: "🖤",
                accent: "#20B2AA",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#1A0A2E] p-7 sm:p-9 group hover:bg-[#241240] transition-colors"
              >
                <span className="text-2xl mb-4 block">{item.icon}</span>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: item.accent }}
                >
                  {item.title}
                </h3>
                <p className="text-[#9B8AAD] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TICKETS ═══════ */}
      <section id="bilhetes" className="section-dark py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] tracking-[0.25em] text-[#FFD700] font-bold mb-2 uppercase">
                Bilhetes
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Escolhe o Teu
              </h2>
            </div>
            <a
              href={TICKETLINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9B8AAD] text-xs hover:text-[#FFD700] transition-colors flex items-center gap-1"
            >
              ticketline.pt <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                name: "GERAL",
                price: "25€",
                features: [
                  "Acesso a todos os palcos",
                  "Random Play Dance",
                  "K-Culture Zone",
                ],
                highlight: false,
                accent: "#9B8AAD",
              },
              {
                name: "VIP",
                price: "45€",
                features: [
                  "Tudo do Geral",
                  "Zona VIP frente ao palco",
                  "Meet & Greet inclusivo",
                  "Merch exclusivo",
                ],
                highlight: true,
                accent: "#FFD700",
              },
              {
                name: "PREMIUM",
                price: "75€",
                features: [
                  "Tudo do VIP",
                  "Backstage Experience",
                  "Jantar K-Food inclusivo",
                  "Kit Premium completo",
                ],
                highlight: false,
                accent: "#FF2D78",
              },
            ].map((t) => (
              <div
                key={t.name}
                className={`ticket-card bg-[#241240] rounded-lg p-7 sm:p-8 flex flex-col ${
                  t.highlight
                    ? "ring-2 ring-[#FFD700]/40 ring-offset-2 ring-offset-[#140822]"
                    : "border border-[#3D1764]"
                }`}
              >
                {/* Popular tag */}
                {t.highlight && (
                  <span className="self-start bg-[#FFD700] text-[#1A0A2E] text-[10px] font-bold tracking-[0.15em] px-2.5 py-1 rounded mb-5">
                    POPULAR
                  </span>
                )}

                <h3
                  className="text-sm font-bold tracking-[0.2em] mb-1"
                  style={{ color: t.accent }}
                >
                  {t.name}
                </h3>
                <div className="flex items-baseline gap-0.5 mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-[#F0ECF4]">
                    {t.price}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#9B8AAD]">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: t.accent }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={TICKETLINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 rounded font-bold text-sm transition-colors ${
                    t.highlight
                      ? "bg-[#FFD700] text-[#1A0A2E] hover:bg-[#FFE44D]"
                      : "bg-[#3D1764] text-[#F0ECF4] hover:bg-[#5A2D87]"
                  }`}
                >
                  Comprar <ExternalLink className="w-3 h-3 inline ml-1" />
                </a>
              </div>
            ))}
          </div>

          {/* Group discount */}
          <p className="text-center text-[#9B8AAD] text-sm mt-8">
            Desconto de grupo: compra 4 bilhetes e recebe 10% de desconto.{" "}
            <a href={TICKETLINE_URL} target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline">
              Saber mais
            </a>
          </p>
        </div>
      </section>

      {/* ═══════ VENUE ═══════ */}
      <section id="local" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Info - left */}
            <div className="lg:col-span-3">
              <p className="text-[11px] tracking-[0.25em] text-[#FFD700] font-bold mb-2 uppercase">
                Local
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
                Academia das Artes<br />do Estoril
              </h2>

              <p className="text-[#9B8AAD] leading-relaxed mb-8">
                Um espaço icónico na costa de Cascais, onde a arte e a cultura se encontram.
                A localização perfeita para receber as Guerreiras do K-Pop, com vista sobre
                o Atlântico e infraestruturas de primeiro nível para um evento deste formato.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#F0ECF4]">Morada</p>
                    <p className="text-sm text-[#9B8AAD]">
                      Av. Marginal, 2765-282 Estoril, Cascais
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#F0ECF4]">Data & Hora</p>
                    <p className="text-sm text-[#9B8AAD]">
                      18 Julho 2026 — Portas às 18:30h
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Academia+das+Artes+do+Estoril"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#3D1764] text-[#F0ECF4] font-semibold text-sm px-5 py-2.5 rounded hover:bg-[#2E1050] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Google Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Map - right */}
            <div className="lg:col-span-2">
              <div className="bg-[#241240] border border-[#3D1764] rounded-lg overflow-hidden">
                <img
                  src="/venue-bg.png"
                  alt="Academia das Artes do Estoril"
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-[#9B8AAD] leading-relaxed">
                    Estação de comboios do Estoril a 5 min a pé. Estacionamento gratuito nas proximidades.
                    Acessível para pessoas com mobilidade reduzida.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="section-dark py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-[11px] tracking-[0.25em] text-[#FFD700] font-bold mb-2 uppercase">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">
            Perguntas Frequentes
          </h2>

          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                q: "Qual a idade mínima para entrar no festival?",
                a: "O festival é para todas as idades! Crianças até aos 5 anos não pagam entrada (desde que acompanhadas por um adulto). Menores de 12 anos devem estar sempre acompanhados por um responsável adulto. O ambiente é familiar e seguro para todos os fãs de K-Pop.",
              },
              {
                q: "Onde posso comprar bilhetes?",
                a: "Os bilhetes estão disponíveis exclusivamente na Ticketline, o nosso parceiro oficial de bilheteira. Podes comprar online em ticketline.pt ou nos pontos de venda habituais. Recomendamos a compra antecipada pois os bilhetes são limitados.",
              },
              {
                q: "Posso trazer a minha lightstick?",
                a: "Claro que sim! As lightsticks são bem-vindas e encorajadas. No entanto, não são permitidos objetos perigosos como bastões com pontas metálicas ou lasers.",
              },
              {
                q: "Há estacionamento no local?",
                a: "Sim, existe estacionamento gratuito nas proximidades da Academia das Artes do Estoril. A estação de comboios do Estoril fica a 5 minutos a pé do local.",
              },
              {
                q: "O evento acontece com chuva?",
                a: "Os palcos principais são cobertos. Aconselhamos a trazer um impermeável leve. Em caso de condições meteorológicas extremas, o evento poderá ser adiado e os bilhetes mantêm-se válidos.",
              },
              {
                q: "Posso reembolsar o meu bilhete?",
                a: "Os bilhetes podem ser reembolsados até 7 dias após a compra, desde que o pedido seja feito com pelo menos 48h de antecedência ao evento. Para pedidos de reembolso, contacta a Ticketline diretamente.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-[#241240] border border-[#3D1764] rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-[#F0ECF4] hover:text-[#FFD700] hover:no-underline px-5 py-4 transition-colors faq-trigger">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#9B8AAD] text-sm leading-relaxed px-5 pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-[#241240] border border-[#3D1764] rounded-lg p-8 sm:p-12">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                Fica Ligado
              </h2>
              <p className="text-[#9B8AAD] text-sm mb-6">
                Subscreve e recebe novidades sobre lineup, bilhetes e surpresas exclusivas.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2 mb-8"
              >
                <Input
                  type="email"
                  placeholder="O teu email"
                  className="bg-[#1A0A2E] border-[#3D1764] focus:border-[#FFD700] focus:ring-[#FFD700]/20 placeholder:text-[#9B8AAD]/50 text-sm"
                />
                <Button
                  type="submit"
                  className="bg-[#FFD700] text-[#1A0A2E] font-bold hover:bg-[#FFE44D] px-5 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>

              {/* Social */}
              <div className="flex items-center justify-center gap-5">
                {[
                  { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                  { icon: <Youtube className="w-5 h-5" />, label: "YouTube" },
                  { icon: <Music2 className="w-5 h-5" />, label: "TikTok" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="text-[#9B8AAD] hover:text-[#FFD700] transition-colors"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="section-dark border-t border-[#3D1764] py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded bg-[#FFD700] flex items-center justify-center">
                  <span className="text-[#1A0A2E] font-black text-[10px]">GK</span>
                </div>
                <span className="font-bold text-sm text-[#F0ECF4]">
                  GUERREIRAS DO K-POP
                </span>
              </div>
              <p className="text-[#9B8AAD] text-xs leading-relaxed max-w-xs">
                Tributo musical em tour. Inspirado na série K-Pop Demon Hunters da Netflix.
              </p>
            </div>

            {/* Quick links */}
            <div className="flex gap-10">
              <div>
                <p className="text-[11px] tracking-[0.15em] text-[#9B8AAD] font-bold mb-3">NAVEGAÇÃO</p>
                <div className="space-y-1.5">
                  {["Lineup", "Bilhetes", "Local", "FAQ"].map((l) => (
                    <a
                      key={l}
                      href={`#${l.toLowerCase()}`}
                      className="block text-xs text-[#9B8AAD] hover:text-[#FFD700] transition-colors"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.15em] text-[#9B8AAD] font-bold mb-3">BILHETEIRA</p>
                <a
                  href={TICKETLINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#FFD700] hover:underline"
                >
                  ticketline.pt <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#3D1764] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[#9B8AAD]">
              &copy; 2026 Guerreiras do K-Pop. Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-[#9B8AAD]">
              Bilheteira oficial:{" "}
              <a
                href={TICKETLINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFD700] hover:underline"
              >
                Ticketline
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════ MOBILE STICKY CTA ═══════ */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden p-3 bg-[#1A0A2E]/95 backdrop-blur-md border-t border-[#3D1764]">
        <a
          href={TICKETLINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded bg-[#FFD700] text-[#1A0A2E] font-bold text-sm"
        >
          <Ticket className="w-4 h-4" />
          Comprar Bilhete
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
