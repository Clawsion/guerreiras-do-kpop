import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Guerreiras do K-Pop | Tributo Musical em Tour - Cascais",
  description:
    "O maior festival de tributo K-Pop em Cascais! Vem viver a experiência das Guerreiras do K-Pop. Atuações ao vivo, Random Play Dance, K-Culture Zone e muito mais!",
  keywords: [
    "K-Pop",
    "festival",
    "Cascais",
    "guerreiras do k-pop",
    "tributo",
    "HUNTRIX",
    "concert",
    "K-Pop Portugal",
  ],
  authors: [{ name: "Guerreiras do K-Pop" }],
  icons: {
    icon: "/poster.webp",
  },
  openGraph: {
    title: "Guerreiras do K-Pop | Tributo Musical em Tour",
    description:
      "O maior festival de tributo K-Pop em Cascais! As Guerreiras do K-Pop ao vivo.",
    type: "website",
    locale: "pt_PT",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
