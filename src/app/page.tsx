import { Badge, Box, Button, Container, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight, IconMail } from "@tabler/icons-react";
import { AppIcon } from "@/components/AppIcon";
import { getDict, getLocale } from "@/lib/i18n";
import { markdownToHtml } from "@/lib/markdown";
import { listApps, listPolicies } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [locale, apps, policies] = await Promise.all([getLocale(), listApps(), listPolicies()]);
  const t = getDict(locale);
  const featuredApp = apps.find((app) => app.name.includes("サラレコ")) || apps[0];

  return (
    <>
      <Box component="section" className="hero-band">
        <Container size="lg" py={{ base: 72, sm: 110 }}>
          <Stack gap="xl">
            <Text className="eyebrow">{t.heroEyebrow}</Text>
            <Title order={1} size="clamp(3.1rem, 8vw, 5.9rem)" lh={1.04} className="hero-title">
              {t.heroTitle1}
              <br />
              {t.heroTitle2}
            </Title>
            <Text size="lg" maw={760} className="muted-copy">
              {t.heroLead}
            </Text>
            <Group gap="sm">
              <Button component="a" href="/products" size="md" color="dark" className="gar-button" rightSection={<IconArrowRight size={17} />}>
                {t.heroPrimary}
              </Button>
              <Button component="a" href="/contact" size="md" variant="default" className="gar-button outline-button" leftSection={<IconMail size={17} />}>
                {t.heroSecondary}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Box component="section" className="capability-strip">
        <Container size="lg">
          <div className="capability-grid">
            {t.caps.map((item) => (
              <div className="capability-item" key={item.n}>
                <Text className="eyebrow" mb="md">
                  {item.n}
                </Text>
                <Text fw={650} mb={8}>
                  {item.title}
                </Text>
                <Text size="sm" className="muted-copy">
                  {item.body}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Box>

      <Box component="section" className="feature-section">
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 48, md: 80 }} verticalSpacing="xl">
            <Stack justify="center" gap="lg">
              <Text className="eyebrow">{t.featuredEyebrow}</Text>
              {featuredApp ? (
                <>
                  <Group gap="md" wrap="nowrap">
                    <AppIcon name={featuredApp.name} src={featuredApp.iconImageUrl} size={72} />
                    <div>
                      <Title order={2} size="h2">{featuredApp.name}</Title>
                      <Text size="sm" c="dimmed" ff="var(--gar-mono)">iOS · Gariton Lab</Text>
                    </div>
                  </Group>
                  <Box
                    className="app-description app-detail-description"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(featuredApp.description) }}
                  />
                  <Button
                    component="a"
                    href={`/apps/${featuredApp.slug}`}
                    variant="subtle"
                    color="dark"
                    px={0}
                    rightSection={<IconArrowRight size={17} color="var(--gar-accent)" />}
                    w="fit-content"
                  >
                    プロダクト詳細とサポート
                  </Button>
                </>
              ) : (
                <Text className="muted-copy">現在、最初のプロダクトを準備しています。</Text>
              )}
            </Stack>
            <div className="lab-index" aria-hidden="true">
              <span>GARITON / 001</span>
              <strong>Small tools,<br />carefully made.</strong>
              <span>DESIGNED &amp; BUILT IN JAPAN</span>
            </div>
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" className="product-band" id="products-preview">
        <Container size="lg" py={{ base: 64, sm: 84 }}>
          <Group justify="space-between" align="flex-end" mb={44}>
            <div>
              <Text className="eyebrow" mb="md">
                {t.productsEyebrow}
              </Text>
              <Title order={2} size="clamp(2rem, 4vw, 2.6rem)">
                {t.productsTitle}
              </Title>
            </div>
            <Text c="dimmed" ff="var(--gar-mono)" size="sm">
              {apps.length} {t.liveItems}
            </Text>
          </Group>

          {apps.length === 0 ? (
            <Paper className="soft-card" p="xl">
              <Text className="muted-copy">公開中のプロダクトはまだありません。</Text>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              {apps.map((app) => {
                const appPolicies = policies.filter((policy) => policy.appId === app.id);
                return (
                  <Paper component="a" href={`/apps/${app.slug}`} className="product-card" key={app.id}>
                    <Stack h="100%" justify="space-between" gap="lg">
                      <Group justify="space-between" align="flex-start">
                        <AppIcon name={app.name} src={app.iconImageUrl} size={48} />
                        <Badge className={appPolicies.length > 0 ? "status-pill status-live" : "status-pill status-muted"}>
                          {appPolicies.length > 0 ? t.liveLabel : t.notRegistered}
                        </Badge>
                      </Group>
                      <div>
                        <Title order={3} size="h4" mb={6}>
                          {app.name}
                        </Title>
                        <Box
                          className="app-description app-card-description app-card-clamp"
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(app.description) }}
                        />
                      </div>
                      <Text ff="var(--gar-mono)" size="xs" c="dimmed">
                        iOS - {app.supportedLanguages.join(" / ") || "Language pending"}
                      </Text>
                    </Stack>
                  </Paper>
                );
              })}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      <Box component="section" id="studio">
        <Container size="lg" py={{ base: 72, sm: 110 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 36, md: 80 }}>
            <div>
              <Text className="eyebrow" mb="md">
                {t.studioEyebrow}
              </Text>
              <Title order={2} size="clamp(2rem, 4vw, 2.6rem)" lh={1.18}>
                {t.studioTitle}
              </Title>
            </div>
            <Stack gap="xl">
              <Text size="lg" className="muted-copy">
                {t.studioBody}
              </Text>
              <Group gap={48}>
                <div>
                  <Text size="xs" c="dimmed" mb={6}>スタジオについて</Text>
                  <Text component="a" href="/about" fw={700} td="underline" style={{ textDecorationColor: "var(--gar-accent)" }}>
                    About Gariton Lab
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={6}>
                    {t.baseLabel}
                  </Text>
                  <Text fw={700}>{t.baseValue}</Text>
                </div>
              </Group>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="footer" className="site-footer">
        <Container size="lg">
          <Group justify="space-between" gap="md">
            <Text fw={650}>Gariton Lab</Text>
            <Text size="xs" c="dimmed" ff="var(--gar-mono)">© {new Date().getFullYear()} GARITON LAB · JAPAN</Text>
          </Group>
        </Container>
      </Box>
    </>
  );
}
