import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { siteConfig } from "./site.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  manifest: "/site.webmanifest",
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/media/people/casal-doutores.jpg" }],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#9b3858",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'if("scrollRestoration" in history){history.scrollRestoration="manual"}if(!location.hash){scrollTo(0,0)}',
          }}
        />
        <link
          rel="preload"
          as="image"
          href="/media/hero-hq-desktop/frame-001.webp"
          media="(min-width: 721px)"
        />
        <link
          rel="preload"
          as="image"
          href="/media/hero-hq-mobile/frame-001.webp"
          media="(max-width: 720px)"
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
