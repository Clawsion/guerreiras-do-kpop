"use client";

export default function FontPreview() {
  return (
    <div style={{ background: "#0B0813", color: "#fff", padding: "40px 20px", minHeight: "100vh" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Geist:wght@100;200;300;400;500;600;700&family=Geist+Mono:wght@200;300;400&display=swap" rel="stylesheet" />
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ═══ PACK 1 ═══ */}
        <h1 style={{ fontFamily: "Geist, sans-serif", fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", padding: "12px 24px", border: "1px solid rgba(200,80,255,0.3)", borderRadius: 4, marginBottom: 48, textAlign: "center", background: "rgba(200,80,255,0.06)", color: "#C850FF" }}>
          Pack 1 — Honmoon Blade (Geist Sans + Plus Jakarta Sans)
        </h1>

        {/* Dark */}
        <div style={{ padding: 48, border: "1px solid rgba(200,80,255,0.1)", borderRadius: 8, background: "rgba(28,18,64,0.3)", marginBottom: 80 }}>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginBottom: 8, fontWeight: 600 }}>Tributo Musical</div>
          <div style={{ fontFamily: "Geist, sans-serif", fontSize: 48, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 8 }}>O Honmoon<br/>Ganha Vida</div>
          <div style={{ fontFamily: "Geist, sans-serif", fontSize: 20, fontWeight: 300, letterSpacing: "0.04em", marginBottom: 24, color: "#d4c4f0" }}>As Guerreiras Demon Hunters chegam a Portugal</div>
          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 16, lineHeight: 1.8, marginBottom: 16, color: "#d4c4f0" }}>Quando as luzes se apagam e o primeiro acorde ecoa pelo coliseu, algo muda no ar. Não é apenas um concerto — é o momento em que o Honmoon se ativa e a magia das Demon Hunters se torna real.</div>
          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 16, lineHeight: 1.8, fontWeight: 500, color: "#C850FF", marginBottom: 32 }}>O Honmoon brilha quando todos se unem.</div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            {[
              { n: "32", l: "Dias" }, { n: "14", l: "Horas" }, { n: "07", l: "Min" }, { n: "42", l: "Seg" }
            ].map((u, i) => (
              <span key={u.l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80 }}>
                  <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 32, fontWeight: 200, letterSpacing: "-0.03em", color: "#fff", textShadow: "0 0 20px rgba(200,80,255,0.3)" }}>{u.n}</span>
                  <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginTop: 6, fontWeight: 600 }}>{u.l}</span>
                </span>
                {i < 3 && <span style={{ fontSize: 18, color: "#C850FF", opacity: 0.6, marginTop: -8 }}>✦</span>}
              </span>
            ))}
          </div>

          <button style={{ fontFamily: "Plus Jakarta Sans, sans-serif", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, background: "#C850FF", color: "#fff", border: "none", borderRadius: 4, marginBottom: 16, cursor: "pointer" }}>Garante o Teu Lugar →</button>
          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#C850FF", textShadow: "0 0 16px rgba(200,80,255,0.3)" }}>Próximo: 18 JUL · Estoril · 18:30h</div>

          <div style={{ height: 1, background: "rgba(200,80,255,0.15)", margin: "32px 0" }} />

          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginBottom: 8, fontWeight: 600 }}>Bilhetes</div>
          <div style={{ fontFamily: "Geist, sans-serif", fontSize: 48, fontWeight: 200, letterSpacing: "-0.03em", marginBottom: 8 }}>€25</div>
          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 16, lineHeight: 1.8, color: "#d4c4f0" }}>Bilhete geral com acesso a todas as zonas do evento.</div>

          <div style={{ height: 1, background: "rgba(200,80,255,0.15)", margin: "24px 0" }} />

          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginBottom: 12, fontWeight: 600 }}>FAQ</div>
          <div style={{ fontFamily: "Geist, sans-serif", fontSize: 14, marginBottom: 4 }}>O evento é adequado para menores?</div>
          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14, lineHeight: 1.7, color: "#d4c4f0", marginBottom: 20 }}>Sim! O espetáculo é recomendado para todas as idades. Menores de 12 anos devem ser acompanhados por um adulto.</div>

          {/* Light */}
          <div style={{ background: "#F8F2FC", padding: 48, borderRadius: 8, marginTop: 32 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 20, opacity: 0.5, color: "#9470C4" }}>☀️ MODO CLARO</div>

            <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#9333EA", marginBottom: 8, fontWeight: 600 }}>Tributo Musical</div>
            <div style={{ fontFamily: "Geist, sans-serif", fontSize: 48, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 8, color: "#1E1040" }}>O Honmoon<br/>Ganha Vida</div>
            <div style={{ fontFamily: "Geist, sans-serif", fontSize: 20, fontWeight: 300, letterSpacing: "0.04em", marginBottom: 24, color: "#5B3E8A" }}>As Guerreiras Demon Hunters chegam a Portugal</div>
            <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 16, lineHeight: 1.8, marginBottom: 16, color: "#5B3E8A" }}>Quando as luzes se apagam e o primeiro acorde ecoa pelo coliseu, algo muda no ar. Não é apenas um concerto — é o momento em que o Honmoon se ativa e a magia das Demon Hunters se torna real.</div>
            <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 16, lineHeight: 1.8, fontWeight: 500, color: "#9333EA", marginBottom: 32 }}>O Honmoon brilha quando todos se unem.</div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              {[
                { n: "32", l: "Dias" }, { n: "14", l: "Horas" }, { n: "07", l: "Min" }, { n: "42", l: "Seg" }
              ].map((u, i) => (
                <span key={u.l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80 }}>
                    <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 32, fontWeight: 200, letterSpacing: "-0.03em", color: "#1E1040" }}>{u.n}</span>
                    <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: "#9333EA", marginTop: 6, fontWeight: 600 }}>{u.l}</span>
                  </span>
                  {i < 3 && <span style={{ fontSize: 18, color: "#9333EA", opacity: 0.6, marginTop: -8 }}>✦</span>}
                </span>
              ))}
            </div>

            <button style={{ fontFamily: "Plus Jakarta Sans, sans-serif", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, background: "#9333EA", color: "#fff", border: "none", borderRadius: 4, marginBottom: 16, cursor: "pointer" }}>Garante o Teu Lugar →</button>
            <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#9333EA" }}>Próximo: 18 JUL · Estoril · 18:30h</div>
          </div>
        </div>

        {/* ═══ PACK 5 ═══ */}
        <h1 style={{ fontFamily: "Geist, sans-serif", fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", padding: "12px 24px", border: "1px solid rgba(200,80,255,0.3)", borderRadius: 4, marginBottom: 48, textAlign: "center", background: "rgba(200,80,255,0.06)", color: "#C850FF", marginTop: 80 }}>
          Pack 5 — Demon Core (Clash Display + Satoshi)
        </h1>

        {/* Dark */}
        <div style={{ padding: 48, border: "1px solid rgba(200,80,255,0.1)", borderRadius: 8, background: "rgba(28,18,64,0.3)", marginBottom: 80 }}>
          <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginBottom: 8, fontWeight: 600 }}>Tributo Musical</div>
          <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 48, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 8 }}>O Honmoon<br/>Ganha Vida</div>
          <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 20, fontWeight: 300, letterSpacing: "0.04em", marginBottom: 24, color: "#d4c4f0" }}>As Guerreiras Demon Hunters chegam a Portugal</div>
          <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 16, lineHeight: 1.8, marginBottom: 16, color: "#d4c4f0" }}>Quando as luzes se apagam e o primeiro acorde ecoa pelo coliseu, algo muda no ar. Não é apenas um concerto — é o momento em que o Honmoon se ativa e a magia das Demon Hunters se torna real.</div>
          <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 16, lineHeight: 1.8, fontWeight: 500, color: "#C850FF", marginBottom: 32 }}>O Honmoon brilha quando todos se unem.</div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            {[
              { n: "32", l: "Dias" }, { n: "14", l: "Horas" }, { n: "07", l: "Min" }, { n: "42", l: "Seg" }
            ].map((u, i) => (
              <span key={u.l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80 }}>
                  <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 32, fontWeight: 200, letterSpacing: "-0.03em", color: "#fff", textShadow: "0 0 20px rgba(200,80,255,0.3)" }}>{u.n}</span>
                  <span style={{ fontFamily: "Satoshi, sans-serif", fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginTop: 6, fontWeight: 600 }}>{u.l}</span>
                </span>
                {i < 3 && <span style={{ fontSize: 18, color: "#C850FF", opacity: 0.6, marginTop: -8 }}>✦</span>}
              </span>
            ))}
          </div>

          <button style={{ fontFamily: "Satoshi, sans-serif", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, background: "#C850FF", color: "#fff", border: "none", borderRadius: 4, marginBottom: 16, cursor: "pointer" }}>Garante o Teu Lugar →</button>
          <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#C850FF", textShadow: "0 0 16px rgba(200,80,255,0.3)" }}>Próximo: 18 JUL · Estoril · 18:30h</div>

          <div style={{ height: 1, background: "rgba(200,80,255,0.15)", margin: "32px 0" }} />

          <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginBottom: 8, fontWeight: 600 }}>Bilhetes</div>
          <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 48, fontWeight: 200, letterSpacing: "-0.03em", marginBottom: 8 }}>€25</div>
          <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 16, lineHeight: 1.8, color: "#d4c4f0" }}>Bilhete geral com acesso a todas as zonas do evento.</div>

          <div style={{ height: 1, background: "rgba(200,80,255,0.15)", margin: "24px 0" }} />

          <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C850FF", marginBottom: 12, fontWeight: 600 }}>FAQ</div>
          <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 14, marginBottom: 4 }}>O evento é adequado para menores?</div>
          <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 14, lineHeight: 1.7, color: "#d4c4f0", marginBottom: 20 }}>Sim! O espetáculo é recomendado para todas as idades. Menores de 12 anos devem ser acompanhados por um adulto.</div>

          {/* Light */}
          <div style={{ background: "#F8F2FC", padding: 48, borderRadius: 8, marginTop: 32 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 20, opacity: 0.5, color: "#9470C4" }}>☀️ MODO CLARO</div>

            <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#9333EA", marginBottom: 8, fontWeight: 600 }}>Tributo Musical</div>
            <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 48, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 8, color: "#1E1040" }}>O Honmoon<br/>Ganha Vida</div>
            <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 20, fontWeight: 300, letterSpacing: "0.04em", marginBottom: 24, color: "#5B3E8A" }}>As Guerreiras Demon Hunters chegam a Portugal</div>
            <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 16, lineHeight: 1.8, marginBottom: 16, color: "#5B3E8A" }}>Quando as luzes se apagam e o primeiro acorde ecoa pelo coliseu, algo muda no ar. Não é apenas um concerto — é o momento em que o Honmoon se ativa e a magia das Demon Hunters se torna real.</div>
            <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 16, lineHeight: 1.8, fontWeight: 500, color: "#9333EA", marginBottom: 32 }}>O Honmoon brilha quando todos se unem.</div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              {[
                { n: "32", l: "Dias" }, { n: "14", l: "Horas" }, { n: "07", l: "Min" }, { n: "42", l: "Seg" }
              ].map((u, i) => (
                <span key={u.l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80 }}>
                    <span style={{ fontFamily: "Geist Mono, monospace", fontSize: 32, fontWeight: 200, letterSpacing: "-0.03em", color: "#1E1040" }}>{u.n}</span>
                    <span style={{ fontFamily: "Satoshi, sans-serif", fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: "#9333EA", marginTop: 6, fontWeight: 600 }}>{u.l}</span>
                  </span>
                  {i < 3 && <span style={{ fontSize: 18, color: "#9333EA", opacity: 0.6, marginTop: -8 }}>✦</span>}
                </span>
              ))}
            </div>

            <button style={{ fontFamily: "Satoshi, sans-serif", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, background: "#9333EA", color: "#fff", border: "none", borderRadius: 4, marginBottom: 16, cursor: "pointer" }}>Garante o Teu Lugar →</button>
            <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#9333EA" }}>Próximo: 18 JUL · Estoril · 18:30h</div>
          </div>
        </div>

      </div>
    </div>
  );
}
