"use client";

import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Text,
  ThemeIcon,
  useComputedColorScheme,
  useMantineColorScheme
} from "@mantine/core";
import { IconApps, IconMail, IconMoon, IconShieldLock, IconSun } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export function AppHeader({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
  const isAppsActive = pathname === "/" || pathname.startsWith("/apps");
  const isContactActive = pathname.startsWith("/contact");
  const isDark = computedColorScheme === "dark";

  return (
    <Box component="header" className="topbar">
      <Container size="lg" py="sm">
        <Group justify="space-between" gap="md">
          <Anchor href="/" underline="never" c="var(--mantine-color-text)">
            <Group gap="sm">
              <ThemeIcon variant="light" color="teal" size={34}>
                <IconShieldLock size={20} stroke={1.8} />
              </ThemeIcon>
              <Text fw={800} size="lg">
                {siteName}
              </Text>
            </Group>
          </Anchor>
          <Group gap="xs" wrap="nowrap">
            <Group gap={6} component="nav" aria-label="Primary navigation">
              <Button
                component="a"
                href="/"
                variant={isAppsActive ? "light" : "subtle"}
                color={isAppsActive ? "teal" : "gray"}
                leftSection={<IconApps size={16} />}
              >
                Apps
              </Button>
              <Button
                component="a"
                href="/contact"
                variant={isContactActive ? "light" : "subtle"}
                color={isContactActive ? "teal" : "gray"}
                leftSection={<IconMail size={16} />}
              >
                Contact
              </Button>
            </Group>
            <ActionIcon
              aria-label="Toggle color scheme"
              variant="default"
              size="lg"
              onClick={() => setColorScheme(isDark ? "light" : "dark")}
            >
              {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
