import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
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

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Guerreiras do K-Pop | Tributo Musical em Tour - Cascais",
  description:
    "O maior festival de tributo K-Pop em Cascais! Vem viver a experiência das Guerreiras Demon Hunters. Atuações ao vivo, Random Play Dance, K-Culture Zone e muito mais!",
  keywords: [
    "K-Pop",
    "festival",
    "Cascais",
    "demon hunters",
    "tributo",
    "HUNTRIX",
    "concert",
    "K-Pop Portugal",
  ],
  authors: [{ name: "Guerreiras do K-Pop" }],
  icons: {
    icon: "/poster.png",
  },
  openGraph: {
    title: "Guerreiras do K-Pop | Tributo Musical em Tour",
    description:
      "O maior festival de tributo K-Pop em Cascais! Demon Hunters ao vivo.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
