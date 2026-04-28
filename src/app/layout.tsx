import type { Metadata } from "next";
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

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "App Support Hub";

export const metadata: Metadata = {
  title: siteName,
  description: "Support and privacy policy pages for iOS apps."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Box className="app-shell">
            <AppHeader siteName={siteName} />
            {children}
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
