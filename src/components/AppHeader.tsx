"use client";

import { Anchor, Box, Container, Group, Text } from "@mantine/core";
import { usePathname } from "next/navigation";

export type HeaderLabels = {
  products: string;
  about: string;
  studio: string;
  contact: string;
  admin: string;
};

export function AppHeader({
  siteName,
  labels
}: {
  siteName: string;
  locale: "ja" | "en";
  labels: HeaderLabels;
}) {
  const pathname = usePathname();
  const isProductsActive = pathname === "/products" || pathname.startsWith("/apps");
  const isAboutActive = pathname.startsWith("/about");
  const isContactActive = pathname.startsWith("/contact");

  return (
    <Box component="header" className="topbar">
      <Container size="lg" className="topbar-inner">
        <Anchor href="/" underline="never" c="var(--gar-ink)" className="brand-link" aria-label={siteName}>
          <Group gap={11} wrap="nowrap">
            <Text className="brand-wordmark">
              Gariton <span>Lab</span>
            </Text>
          </Group>
        </Anchor>

        <Group gap={34} component="nav" aria-label="Primary navigation" className="desktop-nav">
          <Anchor href="/products" underline="never" className={isProductsActive ? "topnav-link is-active" : "topnav-link"}>
            {labels.products}
          </Anchor>
          <Anchor href="/about" underline="never" className={isAboutActive ? "topnav-link is-active" : "topnav-link"}>
            {labels.about}
          </Anchor>
          <Anchor href="/contact" underline="never" className={isContactActive ? "topnav-link is-active" : "topnav-link"}>
            {labels.contact}
          </Anchor>
        </Group>

        <Text component="span" className="header-note">INDEPENDENT SOFTWARE STUDIO</Text>
      </Container>
    </Box>
  );
}
