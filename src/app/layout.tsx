import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import {
  Box,
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps
} from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import { theme } from "./theme";
import { AppHeader } from "@/components/AppHeader";
import { getDict, getLocale } from "@/lib/i18n";

const siteName = "Gariton Lab";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-gariton",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gariton.site"),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: "日常の小さな不便を解決するスマホアプリとWebアプリを開発・運営する個人スタジオ。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName,
    title: siteName,
    description: "小さな不便を、小さなプロダクトで。Gariton LabはスマホアプリとWebアプリをつくる個人スタジオです。",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Gariton Lab" }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "小さな不便を、小さなプロダクトで。",
    images: ["/og.png"]
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const t = getDict(locale);

  return (
    <html lang={locale} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={notoSans.variable}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Box className="app-shell">
            <AppHeader
              siteName={siteName}
              locale={locale}
              labels={{ products: t.navProducts, about: t.navAbout, studio: t.navStudio, contact: t.navContact, admin: t.navAdmin }}
            />
            {children}
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
