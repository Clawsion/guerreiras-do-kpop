"use client";

const PACKS = [
  {
    name: "Honmoon Blade",
    title: "Geist Sans + Plus Jakarta Sans",
    titleFont: "'Geist', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    note: "⭐ Recomendado — K-Pop + alma, máximo equilíbrio",
    grade: "9.5/10",
  },
  {
    name: "Neon District",
    title: "Geist Sans + Space Grotesk",
    titleFont: "'Geist', sans-serif",
    bodyFont: "'Space Grotesk', sans-serif",
    note: "Dark sci-fi, futurista",
    grade: "8.5/10",
  },
  {
    name: "Seoul Night",
    title: "Geist Sans + Outfit",
    titleFont: "'Geist', sans-serif",
    bodyFont: "'Outfit', sans-serif",
    note: "Pop, festivo, K-Pop puro",
    grade: "8/10",
  },
  {
    name: "Void Protocol",
    title: "Geist Sans + Inter",
    titleFont: "'Geist', sans-serif",
    bodyFont: "'Inter', sans-serif",
    note: "Profissional, clean, seguro",
    grade: "8/10",
  },
  {
    name: "Demon Core",
    title: "Clash Display + Satoshi",
    titleFont: "'Clash Display', sans-serif",
    bodyFont: "'Satoshi', sans-serif",
    note: "🔥 Mais ousado — lâminas, demónios",
    grade: "9/10",
  },
  {
    name: "K-Pop Royale",
    title: "Geist Sans + Nunito",
    titleFont: "'Geist', sans-serif",
    bodyFont: "'Nunito', sans-serif",
    note: "Arredondada, doce, amigável",
    grade: "7.5/10",
  },
  {
    name: "Shadow Hunter",
    title: "Geist Sans + IBM Plex Sans",
    titleFont: "'Geist', sans-serif",
    bodyFont: "'IBM Plex Sans', sans-serif",
    note: "Técnica, precisa, clean",
    grade: "7.5/10",
  },
  {
    name: "Neon Temple",
    title: "Geist Sans + Urbanist",
    titleFont: "'Geist', sans-serif",
    bodyFont: "'Urbanist', sans-serif",
    note: "Moderna, geométrica, elegante",
    grade: "8/10",
  },
  {
    name: "Demon Scroll",
    title: "Clash Display + Plus Jakarta Sans",
    titleFont: "'Clash Display', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    note: "Títulos ousados + corpo quente",
    grade: "9/10",
  },
  {
    name: "Midnight Arena",
    title: "Geist Sans + Figtree",
    titleFont: "'Geist', sans-serif",
    bodyFont: "'Figtree', sans-serif",
    note: "Nova, fresca, simples",
    grade: "7.5/10",
  },
];

export default function FontTop10() {
  return (
    <div style={{ background: "#0B0813", color: "#fff", padding: "40px 20px", minHeight: "100vh" }}>
      {/* Font imports */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Geist:wght@100;200;300;400;500;600;700&family=Geist+Mono:wght@200;300;400&family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Urbanist:wght@300;400;500;600;700&family=Figtree:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "Geist, sans-serif", fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", textAlign: "center", marginBottom: 8, color: "#C850FF" }}>
          Top 10 Font Packs
        </h1>
        <p style={{ fontFamily: "Geist, sans-serif", fontSize: 13, textAlign: "center", marginBottom: 60, color: "#8a6fb5" }}>
          Guerreiras do K-Pop — Preview com texto real do site
        </p>

        {PACKS.map((pack, idx) => (
          <div key={pack.name} style={{ marginBottom: 64 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 10, color: "#C850FF", letterSpacing: "0.3em", marginRight: 12 }}>#{idx + 1}</span>
                <span style={{ fontFamily: "Geist, sans-serif", fontSize: 18, fontWeight: 200, letterSpacing: "-0.02em" }}>{pack.name}</span>
              </div>
              <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 11, color: "#C850FF", background: "rgba(200,80,255,0.1)", padding: "4px 12px", borderRadius: 4 }}>{pack.grade}</span>
            </div>
            <div style={{ fontFamily: "Geist, sans-serif", fontSize: 11, color: "#8a6fb5", marginBottom: 4, letterSpacing: "0.1em" }}>{pack.title}</div>
            <div style={{ fontFamily: "Geist, sans-serif", fontSize: 11, color: "#C850FF", marginBottom: 16 }}>{pack.note}</div>

            {/* Dark preview */}
            <div style={{ padding: "36px 40px", border: "1px solid rgba(200,80,255,0.12)", borderRadius: 8, background: "rgba(28,18,64,0.25)", marginBottom: 8 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color: "#8a6fb5", marginBottom: 20 }}>🌑 Escuro</div>

              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginBottom: 8, fontWeight: 600 }}>Tributo Musical</div>
              <div style={{ fontFamily: pack.titleFont, fontSize: 40, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 6 }}>O Honmoon Ganha Vida</div>
              <div style={{ fontFamily: pack.titleFont, fontSize: 17, fontWeight: 300, letterSpacing: "0.04em", marginBottom: 20, color: "#d4c4f0" }}>As Guerreiras do K-Pop chegam a Portugal</div>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 15, lineHeight: 1.8, marginBottom: 12, color: "#d4c4f0" }}>Quando as luzes se apagam e o primeiro acorde ecoa pelo coliseu, algo muda no ar. Não é apenas um concerto — é o momento em que o Honmoon se ativa.</div>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 15, lineHeight: 1.8, fontWeight: 500, color: "#C850FF", marginBottom: 24 }}>O Honmoon brilha quando todos se unem.</div>

              {/* Countdown row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                {[{n:"32",l:"Dias"},{n:"14",l:"Horas"},{n:"07",l:"Min"},{n:"42",l:"Seg"}].map((u, i) => (
                  <span key={u.l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 26, fontWeight: 200, letterSpacing: "-0.03em", color: "#fff", textShadow: "0 0 16px rgba(200,80,255,0.3)" }}>{u.n}</span>
                      <span style={{ fontFamily: pack.bodyFont, fontSize: 7, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginTop: 4, fontWeight: 600 }}>{u.l}</span>
                    </span>
                    {i < 3 && <span style={{ fontSize: 14, color: "#C850FF", opacity: 0.5, marginTop: -6 }}>✦</span>}
                  </span>
                ))}
              </div>

              <button style={{ fontFamily: pack.bodyFont, display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, background: "#C850FF", color: "#fff", border: "none", borderRadius: 4, marginBottom: 10, cursor: "pointer" }}>Garante o Teu Lugar →</button>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#C850FF" }}>Próximo: 18 JUL · Estoril · 18:30h</div>

              <div style={{ height: 1, background: "rgba(200,80,255,0.1)", margin: "20px 0" }} />

              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C850FF", marginBottom: 6, fontWeight: 600 }}>Bilhetes</div>
              <div style={{ fontFamily: pack.titleFont, fontSize: 40, fontWeight: 200, letterSpacing: "-0.03em", marginBottom: 6 }}>€25</div>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 14, lineHeight: 1.7, color: "#d4c4f0", marginBottom: 16 }}>Bilhete geral com acesso a todas as zonas do evento.</div>

              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C850FF", marginBottom: 8, fontWeight: 600 }}>FAQ</div>
              <div style={{ fontFamily: pack.titleFont, fontSize: 13, marginBottom: 3 }}>O evento é adequado para menores?</div>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 13, lineHeight: 1.7, color: "#d4c4f0" }}>Sim! O espetáculo é recomendado para todas as idades. Menores de 12 anos devem ser acompanhados por um adulto.</div>
            </div>

            {/* Light preview */}
            <div style={{ padding: "36px 40px", borderRadius: 8, background: "#F8F2FC" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color: "#9470C4", marginBottom: 20 }}>☀️ Claro</div>

              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "#9333EA", marginBottom: 8, fontWeight: 600 }}>Tributo Musical</div>
              <div style={{ fontFamily: pack.titleFont, fontSize: 40, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 6, color: "#1E1040" }}>O Honmoon Ganha Vida</div>
              <div style={{ fontFamily: pack.titleFont, fontSize: 17, fontWeight: 300, letterSpacing: "0.04em", marginBottom: 20, color: "#5B3E8A" }}>As Guerreiras do K-Pop chegam a Portugal</div>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 15, lineHeight: 1.8, marginBottom: 12, color: "#5B3E8A" }}>Quando as luzes se apagam e o primeiro acorde ecoa pelo coliseu, algo muda no ar. Não é apenas um concerto — é o momento em que o Honmoon se ativa.</div>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 15, lineHeight: 1.8, fontWeight: 500, color: "#9333EA", marginBottom: 24 }}>O Honmoon brilha quando todos se unem.</div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                {[{n:"32",l:"Dias"},{n:"14",l:"Horas"},{n:"07",l:"Min"},{n:"42",l:"Seg"}].map((u, i) => (
                  <span key={u.l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 26, fontWeight: 200, letterSpacing: "-0.03em", color: "#1E1040" }}>{u.n}</span>
                      <span style={{ fontFamily: pack.bodyFont, fontSize: 7, letterSpacing: "0.35em", textTransform: "uppercase", color: "#9333EA", marginTop: 4, fontWeight: 600 }}>{u.l}</span>
                    </span>
                    {i < 3 && <span style={{ fontSize: 14, color: "#9333EA", opacity: 0.5, marginTop: -6 }}>✦</span>}
                  </span>
                ))}
              </div>

              <button style={{ fontFamily: pack.bodyFont, display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, background: "#9333EA", color: "#fff", border: "none", borderRadius: 4, marginBottom: 10, cursor: "pointer" }}>Garante o Teu Lugar →</button>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#9333EA" }}>Próximo: 18 JUL · Estoril · 18:30h</div>

              <div style={{ height: 1, background: "rgba(147,51,234,0.1)", margin: "20px 0" }} />

              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9333EA", marginBottom: 6, fontWeight: 600 }}>Bilhetes</div>
              <div style={{ fontFamily: pack.titleFont, fontSize: 40, fontWeight: 200, letterSpacing: "-0.03em", marginBottom: 6, color: "#1E1040" }}>€25</div>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 14, lineHeight: 1.7, color: "#5B3E8A", marginBottom: 16 }}>Bilhete geral com acesso a todas as zonas do evento.</div>

              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9333EA", marginBottom: 8, fontWeight: 600 }}>FAQ</div>
              <div style={{ fontFamily: pack.titleFont, fontSize: 13, marginBottom: 3, color: "#1E1040" }}>O evento é adequado para menores?</div>
              <div style={{ fontFamily: pack.bodyFont, fontSize: 13, lineHeight: 1.7, color: "#5B3E8A" }}>Sim! O espetáculo é recomendado para todas as idades. Menores de 12 anos devem ser acompanhados por um adulto.</div>
            </div>
          </div>
        ))}

        <p style={{ fontFamily: "Geist, sans-serif", fontSize: 11, textAlign: "center", color: "#8a6fb5", marginTop: 40, marginBottom: 60, letterSpacing: "0.1em" }}>
          Todos os packs usam Geist Mono para os números do countdown
        </p>
      </div>
    </div>
  );
}
