import { notFound } from "next/navigation";
import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Image,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  Title
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBrandApple,
  IconExternalLink,
  IconFileText,
  IconMail
} from "@tabler/icons-react";
import { AppIcon } from "@/components/AppIcon";
import { getDict, getLocale } from "@/lib/i18n";
import { markdownToHtml } from "@/lib/markdown";
import { getAppBySlug, listPolicies } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AppSupportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [locale, app] = await Promise.all([getLocale(), getAppBySlug(slug)]);
  if (!app) notFound();
  const t = getDict(locale);
  const policies = await listPolicies(app.id);

  const infoRows = [
    [t.infoCategory, "アプリ"],
    [t.infoPrice, app.hasInAppPurchases ? t.priceIAP : t.priceFree],
    [t.infoLanguages, app.supportedLanguages.join(" / ") || t.notSet],
    [t.infoOS, "iOS"],
    [t.infoDeveloper, "Gariton Lab"],
    [t.infoPolicy, policies.length > 0 ? policies.map((policy) => policy.locale.toUpperCase()).join(" / ") : t.notRegistered]
  ];

  return (
    <Box component="main">
      <Container size="lg" pt={28}>
        <Button component="a" href="/products" variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} px={0}>
          {t.backToProducts}
        </Button>
      </Container>

      <Container size="lg" py={{ base: 40, sm: 64 }}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" verticalSpacing="xl">
          <Group gap="xl" align="center" wrap="nowrap" style={{ gridColumn: "span 2" }}>
            <AppIcon name={app.name} src={app.iconImageUrl} size={120} />
            <div>
              <Title order={1} size="clamp(2.7rem, 6vw, 4.4rem)" lh={1.02} className="hero-title">
                {app.name}
              </Title>
              <Text size="lg" className="muted-copy" mt={8}>
                Gariton Labが開発・運営するiOSアプリ
              </Text>
              <Group gap="md" mt="md">
                <Text ff="var(--gar-mono)" size="xs" c="var(--gar-ink)" fw={600}>
                  iOS
                </Text>
                <Text c="dimmed">Gariton Lab</Text>
              </Group>
            </div>
          </Group>

          <Stack gap="sm" justify="center">
            {app.appStoreUrl && (
              <Button
                component="a"
                href={app.appStoreUrl}
                rel="noreferrer"
                color="dark"
                radius="md"
                size="lg"
                leftSection={<IconBrandApple size={22} />}
                rightSection={<IconExternalLink size={16} />}
              >
                App Store
              </Button>
            )}
            <Button component="a" href={`/contact?app=${app.id}`} variant="default" radius="md" leftSection={<IconMail size={17} />}>
              {t.contactLabel}
            </Button>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box className="product-band">
        <Container size="lg" py={64}>
          <Text className="eyebrow" mb={30}>
            {t.screensLabel}
          </Text>
          <Box className="screenshot-carousel" aria-label={`${app.name} screenshots`}>
            {app.screenshots.length > 0 ? (
              app.screenshots.map((screenshot, index) => (
                  <Box className="screenshot-frame" key={screenshot}>
                    <Image src={screenshot} alt={`${app.name} screenshot ${index + 1}`} className="screenshot-image" />
                  </Box>
                ))
            ) : (
              <Text c="dimmed">スクリーンショットは準備中です。</Text>
            )}
          </Box>
        </Container>
      </Box>

      <Container size="lg" py={{ base: 72, sm: 96 }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 44, md: 72 }}>
          <Stack gap="xl">
            <div>
              <Text className="eyebrow" mb="lg">
                {t.aboutLabel}
              </Text>
              <Spoiler maxHeight={360} showLabel={t.readMore} hideLabel={t.readClose} className="app-description-spoiler">
                <Box
                  className="app-description app-detail-description"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(app.description) }}
                />
              </Spoiler>
            </div>
          </Stack>

          <div className="info-panel">
            <Text className="eyebrow" mb="lg">
              {t.infoLabel}
            </Text>
            {infoRows.map(([key, value]) => (
              <div className="info-row" key={key}>
                <Text size="sm" c="dimmed">
                  {key}
                </Text>
                <Text size="sm" fw={600} ta="right">
                  {value}
                </Text>
              </div>
            ))}
            <Group gap="xs" mt="lg">
              <span className="status-pill status-live">{t.liveLabel}</span>
              <span className="status-pill status-muted">iOS</span>
            </Group>
            <Stack gap="xs" mt="xl">
              {policies.map((policy) => (
                <Button
                  component="a"
                  href={`/apps/${app.slug}/privacy?lang=${policy.locale}`}
                  variant="default"
                  leftSection={<IconFileText size={16} />}
                  key={policy.id}
                >
                  {t.privacyPolicy} ({policy.locale.toUpperCase()})
                </Button>
              ))}
              <Anchor href={`mailto:${app.supportEmail}`} c="var(--gar-accent)" fw={700}>
                {app.supportEmail}
              </Anchor>
            </Stack>
          </div>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
