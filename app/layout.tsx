import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Inter, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/providers";
import { site } from "@/data/site.config";
import "./globals.css";

// Округлый дисплейный гротеск с полной кириллицей — «анимешный» характер
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  // TODO: после покупки домена задай NEXT_PUBLIC_SITE_URL в Vercel
  metadataBase: new URL(site.url),
  title: {
    default: "Бурнашев Равшан — разработчик сайтов и приложений",
    template: "%s — Бурнашев Равшан",
  },
  description:
    "Портфолио программиста Бурнашева Равшана: сайты и приложения, проекты и стек технологий. Выпускник NamDTU, «Информационные системы и технологии».",
  keywords: [
    "Бурнашев Равшан",
    "разработчик",
    "программист",
    "Next.js",
    "React",
    "Namangan",
    "NamDTU",
    "веб-разработчик Узбекистан",
  ],
  authors: [{ name: site.nameRu }],
  creator: site.nameRu,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["uz_UZ"],
    url: site.url,
    siteName: site.nameRu,
    title: "Бурнашев Равшан — разработчик сайтов и приложений",
    description:
      "Сайты и приложения под ключ. Проекты, стек, контакты. NamDTU, информационные системы и технологии.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Бурнашев Равшан — разработчик сайтов и приложений",
    description: "Сайты и приложения под ключ. Проекты, стек, контакты. NamDTU.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0e1a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.nameRu,
  alternateName: site.nameLat,
  jobTitle: "Разработчик сайтов и приложений",
  url: site.url,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Наманганский государственный технический университет (NamDTU)",
  },
  knowsAbout: [
    "Веб-разработка",
    "Разработка приложений",
    "Информационные системы",
    ...site.skills,
  ],
  sameAs: site.socials.map((s) => s.url).filter((url) => url !== "#"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${display.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
        <body className="flex min-h-full flex-col">
          <Script
            id="rb-no-flash"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html:
                "(function(){try{var t=localStorage.getItem('rb-theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
            }}
          />
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-sakura focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
        >
          Перейти к содержимому
        </a>
        {/* Скрытая, но видимая в обеих темах кнопка-вход в админку */}
        <a
          href="/admin"
          aria-label="Админ-панель"
          title="Админ-панель"
          className="fixed bottom-3 left-3 z-[150] flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel/80 text-mist opacity-40 shadow-lg backdrop-blur transition-all duration-300 hover:scale-105 hover:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </a>
        <Providers>{children}</Providers>
        <Script
          id="rb-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
