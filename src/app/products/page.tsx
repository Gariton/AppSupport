import type { Metadata } from "next";
import { Box, Container, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { AppIcon } from "@/components/AppIcon";
import { getDict, getLocale } from "@/lib/i18n";
import { listApps } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "プロダクト", description: "Gariton Labが企画・開発・運営するアプリの一覧。" };

export default async function ProductsPage() {
  const [locale, apps] = await Promise.all([getLocale(), listApps()]);
  const t = getDict(locale);

  return (
    <Box component="main">
      <Container size="lg" py={{ base: 72, sm: 96 }}>
        <Text className="eyebrow" mb={26}>
          {t.prodPageEyebrow}
        </Text>
        <Title order={1} size="clamp(3rem, 7vw, 5rem)" lh={1.06} className="hero-title" maw={720}>
          {t.prodPageTitle}
        </Title>
        <Text size="lg" className="muted-copy" mt={26} maw={720}>
          {t.prodPageLead}
        </Text>
      </Container>

      <Container size="lg" pb={{ base: 72, sm: 96 }}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          {apps.map((app) => (
            <Paper component="a" href={`/apps/${app.slug}`} className="product-card product-card-large" key={app.id}>
              <Stack h="100%" justify="space-between" gap="xl">
                <Group justify="space-between">
                  <AppIcon name={app.name} src={app.iconImageUrl} size={64} />
                  <span className="status-pill status-live">{t.liveLabel}</span>
                </Group>
                <div>
                  <Title order={2} size="h3" mb={8}>{app.name}</Title>
                  <Text size="sm" className="muted-copy">詳細、サポート、プライバシーポリシー</Text>
                </div>
                <Text ff="var(--gar-mono)" size="xs" c="dimmed">iOS · {app.supportedLanguages.join(" / ") || t.notSet}</Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
        {apps.length === 0 && <Paper className="soft-card" p="xl"><Text c="dimmed">公開中のプロダクトはまだありません。</Text></Paper>}
      </Container>
    </Box>
  );
}
