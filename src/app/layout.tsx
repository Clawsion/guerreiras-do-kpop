import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://www.guerreirasdokpop.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0410" },
    { media: "(prefers-color-scheme: light)", color: "#f5f0fa" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Guerreiras do K-Pop | Tributo Musical Ao Vivo em Tour 2026",
    template: "%s | Guerreiras do K-Pop",
  },
  description:
    "Guerreiras do K-Pop — o espetáculo de tributo K-Pop ao vivo em Portugal! Concerto em Costa da Caparica 2026. Bilhetes disponíveis. Vem viver a experiência K-Pop: dança, música e energia do filme de animação mais visto, agora no palco!",
  keywords: [
    "K-Pop",
    "K-Pop Portugal",
    "guerreiras do k-pop",
    "tributo K-Pop",
    "concerto K-Pop",
    "festival K-Pop",
    "Costa da Caparica",
    "HUNTRIX",
    "K-Pop ao vivo",
    "espetáculo musical",
    "bilhetes K-Pop",
    "Ticketline",
    "K-Pop 2026",
    "dança K-Pop",
    "Random Play Dance",
  ],
  authors: [{ name: "Guerreiras do K-Pop" }],
  creator: "Guerreiras do K-Pop",
  publisher: "Francisco Cardinali Produções",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-icon", url: "/android-chrome-192.png", sizes: "192x192" },
      { rel: "android-chrome-icon", url: "/android-chrome-512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    title: "Guerreiras do K-Pop | Tributo Musical Ao Vivo em Tour 2026",
    description:
      "O espetáculo de tributo K-Pop ao vivo em Portugal! Concerto em Costa da Caparica. Bilhetes disponíveis via Ticketline.",
    type: "website",
    locale: "pt_PT",
    url: SITE_URL,
    siteName: "Guerreiras do K-Pop",
    images: [
      {
        url: "/poster.webp",
        width: 900,
        height: 1200,
        alt: "Cartaz Guerreiras do K-Pop — Tributo Musical Ao Vivo",
      },
      {
        url: "/hero-bg-light.webp",
        width: 3840,
        height: 2160,
        alt: "Guerreiras do K-Pop — Espetáculo Ao Vivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guerreiras do K-Pop | Tributo Musical Ao Vivo 2026",
    description:
      "O espetáculo de tributo K-Pop ao vivo em Portugal! Costa da Caparica 2026.",
    images: ["/poster.webp"],
  },
  category: "entreertainment",
  other: {
    "geo.region": "PT",
    "geo.placename": "Costa da Caparica, Portugal",
    "geo.position": "38.6453;-9.2347",
    "ICBM": "38.6453, -9.2347",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        {/* Preconnect to PostImg (galeria) — acelera carregamento das fotos em mobile */}
        <link rel="preconnect" href="https://i.postimg.cc" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.postimg.cc" />
        {/* ═══ PRELOAD: hero image (LCP element) — carrega com prioridade alta ═══ */}
        <link rel="preload" as="image" href="/hero-bg.webp?v=93" fetchPriority="high" />

        {/* ═══ SEO: Structured Data (JSON-LD) para Google Rich Snippets ═══ */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicEvent",
            "name": "Guerreiras do K-Pop — Tributo Musical Ao Vivo",
            "description": "O espetáculo de tributo K-Pop ao vivo em Portugal! Concerto em Costa da Caparica 2026.",
            "image": "https://www.guerreirasdokpop.com/poster.webp",
            "url": "https://www.guerreirasdokpop.com",
            "organizer": {
              "@type": "Organization",
              "name": "Francisco Cardinali Produções",
              "url": "https://www.guerreirasdokpop.com"
            },
            "performer": {
              "@type": "PerformingGroup",
              "name": "Guerreiras do K-Pop",
              "url": "https://www.guerreirasdokpop.com"
            },
            "location": [
              {
                "@type": "Place",
                "name": "Pavilhão Municipal da Costa da Caparica",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Costa da Caparica",
                  "addressRegion": "Setúbal",
                  "addressCountry": "PT"
                }
              }
            ],
            "startDate": "2026-11-07",
            "endDate": "2026-11-07",
            "offers": [
              {
                "@type": "Offer",
                "url": "https://www.ticketline.pt/pt/evento/guerreiras-do-k-pop-em-concerto-tributo-105855",
                "price": "15",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-01-01"
              }
            ]
          })
        }} />

        {/* Structured Data — Organização */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Guerreiras do K-Pop",
            "url": "https://www.guerreirasdokpop.com",
            "logo": "https://www.guerreirasdokpop.com/poster.webp",
            "description": "Tributo musical K-Pop ao vivo em Portugal. Concerto em Costa da Caparica 2026.",
            "sameAs": [
              "https://www.instagram.com/guerreirasdokpop_tributo",
              "https://www.facebook.com/guerreirasdokpop",
              "https://www.youtube.com/@guerreirasdokpop"
            ]
          })
        }} />

        {/* Structured Data — Website */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Guerreiras do K-Pop",
            "url": "https://www.guerreirasdokpop.com",
            "inLanguage": "pt-PT",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.guerreirasdokpop.com/?s={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }} />

        {/* ═══ DETECÇÃO DE DISPOSITIVO — executa ANTES do CSS carregar ═══
            Adiciona classe específica ao <html> para CSS dirigido:
            - device-iphone → só iPhones (sem afetar Android)
            - device-ipad   → só iPads (retrato + landscape + Stage Manager)
            - device-android → smartphones Android (intencionalmente vazio — só marcação)
            - device-desktop → desktop/laptop (intencionalmente vazio)

            Isto permite aplicar fixes SÓ a iPhones sem mexer em Android
            nem desktop, evitando os problemas anteriores. */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var ua=navigator.userAgent||'';var p=navigator.platform||'';var t=navigator.maxTouchPoints||0;var isIOS=/iPad|iPhone|iPod/.test(ua);var isIPad=/iPad/.test(ua)||(isIOS&&p==='MacIntel'&&t>1);var isIPhone=/iPhone|iPod/.test(ua)||(isIOS&&!isIPad);var isAndroid=/Android/.test(ua);var d=document.documentElement;if(isIPad){d.classList.add('device-ipad','device-ios')}else if(isIPhone){d.classList.add('device-iphone','device-ios')}else if(isAndroid){d.classList.add('device-android')}else{d.classList.add('device-desktop')}}catch(e){}})();`
        }} />
        {/* Opera GX / Comet ONLY — does not affect other browsers */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var ua=navigator.userAgent;var isOpera=ua.indexOf('OPR')!==-1||ua.indexOf('Opera')!==-1;var isComet=ua.indexOf('Comet')!==-1;if(!('IntersectionObserver' in window)){window.IntersectionObserver=function(cb,opt){var th=(opt&&opt.threshold)?(Array.isArray(opt.threshold)?opt.threshold[0]:opt.threshold):0;this.observe=function(el){var chk=function(){var r=el.getBoundingClientRect();var vh=window.innerHeight||document.documentElement.clientHeight;var ratio=Math.min(1,Math.max(0,(Math.min(r.bottom,vh)-Math.max(r.top,0))/Math.max(1,r.height)));if(r.top<vh&&r.bottom>0&&ratio>=th){cb([{isIntersecting:true,intersectionRatio:ratio,target:el,boundingClientRect:r,intersectionRect:r,rootBounds:null,time:performance.now()}],this)}};chk();window.addEventListener('scroll',chk,{passive:true});window.addEventListener('resize',chk);this._c=chk};this.unobserve=function(){};this.disconnect=function(){window.removeEventListener('scroll',this._c);window.removeEventListener('resize',this._c)};this.takeRecords=function(){return[]}};window.IntersectionObserverEntry=function(){}}if(isOpera||isComet){document.documentElement.classList.add('browser-opera');window.addEventListener('load',function(){setTimeout(function(){window.dispatchEvent(new Event('scroll'))},200)})}})();`
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">Saltar para o conteúdo</a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
