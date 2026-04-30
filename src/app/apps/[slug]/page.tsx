import { notFound } from "next/navigation";
import {
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Image,
  Paper,
  Spoiler,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import { IconBrandApple, IconCamera, IconExternalLink, IconFileText, IconMail, IconShieldCheck } from "@tabler/icons-react";
import { AppIcon } from "@/components/AppIcon";
import { markdownToHtml } from "@/lib/markdown";
import { getAppBySlug, listPolicies } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AppSupportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);
  if (!app) notFound();
  const policies = await listPolicies(app.id);

  return (
    <Box component="main" className="page-section">
      <Container size="lg">
        <Stack gap="xl">
          <Stack gap="lg">
            <Badge color="teal" variant="light" w="fit-content" leftSection={<IconBrandApple size={14} />}>
              Support
            </Badge>
            <Group gap="md" align="center" wrap="nowrap">
              <AppIcon name={app.name} src={app.iconImageUrl} size={76} />
              <Title order={1} size="clamp(2.6rem, 6vw, 4.6rem)" lh={0.98} style={{ minWidth: 0 }}>
                {app.name}
              </Title>
            </Group>
            <Group gap="xs">
              <Badge color="gray" variant="light" leftSection={<IconBrandApple size={13} />}>
                iOS
              </Badge>
              <Badge color={app.hasInAppPurchases ? "teal" : "gray"} variant="light">
                アプリ内課金{app.hasInAppPurchases ? "あり" : "なし"}
              </Badge>
              {app.supportedLanguages.map((language) => (
                <Badge key={language} color="blue" variant="light">
                  {language}
                </Badge>
              ))}
            </Group>
            <Group gap="sm">
              <Button component="a" href={`/contact?app=${app.id}`} leftSection={<IconMail size={18} />}>
                お問い合わせ
              </Button>
              {app.appStoreUrl && (
                <Button
                  component="a"
                  href={app.appStoreUrl}
                  rel="noreferrer"
                  variant="default"
                  rightSection={<IconExternalLink size={17} />}
                >
                  App Store
                </Button>
              )}
            </Group>
          </Stack>

          {app.screenshots.length > 0 && (
            <Stack gap="md">
              <Group gap="sm">
                <ThemeIcon color="teal" variant="light">
                  <IconCamera size={18} />
                </ThemeIcon>
                <Title order={2} size="h3">
                  Screenshots
                </Title>
              </Group>
              <Box className="screenshot-carousel" aria-label={`${app.name} screenshots`}>
                {app.screenshots.map((screenshot, index) => (
                  <Box className="screenshot-frame" key={screenshot}>
                    <Image src={screenshot} alt={`${app.name} screenshot ${index + 1}`} className="screenshot-image" />
                  </Box>
                ))}
              </Box>
            </Stack>
          )}

          <Paper p="xl" className="soft-card">
            <Stack gap="md">
              <Title order={2} size="h3">
                説明
              </Title>
              <Spoiler maxHeight={260} showLabel="続きを読む" hideLabel="閉じる" className="app-description-spoiler">
                <Box
                  maw={760}
                  className="app-description app-detail-description"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(app.description) }}
                />
              </Spoiler>
            </Stack>
          </Paper>

          <Paper p="xl" className="soft-card">
            <Stack gap="lg">
              <Group gap="md" align="flex-start">
                <ThemeIcon size={48} color="teal" variant="light">
                  <IconShieldCheck size={27} stroke={1.8} />
                </ThemeIcon>
                <div>
                  <Title order={2} size="h3">
                    Privacy Policy
                  </Title>
                  <Text c="dimmed">言語ごとのプライバシーポリシーを確認できます。</Text>
                </div>
              </Group>
              {policies.length === 0 ? (
                <Text c="dimmed">プライバシーポリシーはまだ公開されていません。</Text>
              ) : (
                <Group gap="xs">
                  {policies.map((policy) => (
                    <Button
                      component="a"
                      href={`/apps/${app.slug}/privacy?lang=${policy.locale}`}
                      variant="light"
                      leftSection={<IconFileText size={16} />}
                      key={policy.id}
                    >
                      {policy.locale.toUpperCase()}
                    </Button>
                  ))}
                </Group>
              )}
              <Paper withBorder p="md">
                <Text size="xs" c="dimmed" fw={700}>
                  Support email
                </Text>
                <Anchor href={`mailto:${app.supportEmail}`} c="teal" fw={700}>
                  {app.supportEmail}
                </Anchor>
              </Paper>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
