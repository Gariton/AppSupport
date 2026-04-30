import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import { IconArrowRight, IconBrandApple, IconFileText, IconMail, IconShieldCheck } from "@tabler/icons-react";
import { AppIcon } from "@/components/AppIcon";
import { markdownToHtml } from "@/lib/markdown";
import { listApps, listPolicies } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const apps = await listApps();
  const policies = await listPolicies();

  return (
    <>
      <Box component="section" className="hero-band">
        <Container size="lg" py={{ base: 44, sm: 64 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" verticalSpacing="xl">
            <Stack justify="center" gap="lg">
              <Badge color="teal" variant="light" w="fit-content" leftSection={<IconBrandApple size={14} />}>
                iOS App Support
              </Badge>
              <Title order={1} size="clamp(2.5rem, 6vw, 4.8rem)" lh={0.98} className="hero-title">
                Support and privacy for our apps.
              </Title>
              <Text size="lg" c="dimmed" maw={680}>
                アプリに関するお問い合わせ、サポート情報、プライバシーポリシーを確認できます。
              </Text>
              <Group gap="sm">
                <Button component="a" href="/contact" size="md" rightSection={<IconArrowRight size={18} />}>
                  お問い合わせ
                </Button>
              </Group>
            </Stack>
            <Paper p="xl" className="soft-card">
              <Stack gap="lg">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text c="dimmed" size="sm" fw={700}>
                      Supported apps
                    </Text>
                    <Title order={2}>{apps.length}</Title>
                  </div>
                  <ThemeIcon size={48} variant="light" color="teal">
                    <IconFileText size={26} stroke={1.8} />
                  </ThemeIcon>
                </Group>
                <Text c="dimmed">
                  アプリごとのサポートページと、言語別のプライバシーポリシーを掲載しています。
                </Text>
                <SimpleGrid cols={2}>
                  <Paper withBorder p="md">
                    <Text size="xs" c="dimmed" fw={700}>
                      Policies
                    </Text>
                    <Text size="xl" fw={800}>
                      {policies.length}
                    </Text>
                  </Paper>
                  <Paper withBorder p="md">
                    <Text size="xs" c="dimmed" fw={700}>
                      Contact
                    </Text>
                    <Group gap={6}>
                      <IconMail size={18} />
                      <Text size="xl" fw={800}>
                        Ready
                      </Text>
                    </Group>
                  </Paper>
                </SimpleGrid>
              </Stack>
            </Paper>
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="main" className="page-section">
        <Container size="lg">
          <Group justify="space-between" mb="lg" align="flex-end">
            <div>
              <Text c="teal" fw={800} size="sm">
                Apps
              </Text>
              <Title order={2}>Supported Apps</Title>
            </div>
          </Group>
          {apps.length === 0 ? (
            <Paper p="xl" withBorder>
              <Group align="flex-start" gap="md">
                <ThemeIcon variant="light" color="teal" size={42}>
                  <IconShieldCheck size={22} />
                </ThemeIcon>
                <div>
                  <Text fw={800}>アプリ情報の準備中です</Text>
                  <Text c="dimmed" mt={4}>
                    公開可能なサポート情報が整い次第、こちらに掲載します。
                  </Text>
                </div>
              </Group>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {apps.map((app) => {
                const appPolicies = policies.filter((policy) => policy.appId === app.id);
                return (
                  <Card withBorder shadow="sm" p="lg" key={app.id} className="soft-card">
                    <Stack justify="space-between" mih={230} gap="lg">
                      <Stack gap="sm">
                        <Group justify="space-between" gap="xs">
                          <Group gap={6}>
                            <Badge color="gray" variant="light" leftSection={<IconBrandApple size={13} />}>
                              iOS
                            </Badge>
                            <Badge color={app.hasInAppPurchases ? "teal" : "gray"} variant="light">
                              IAP {app.hasInAppPurchases ? "あり" : "なし"}
                            </Badge>
                          </Group>
                          <Text size="xs" c="dimmed">
                            {appPolicies.length} policies
                          </Text>
                        </Group>
                        <Group gap="sm" align="center" wrap="nowrap">
                          <AppIcon name={app.name} src={app.iconImageUrl} size={52} />
                          <Title order={3} size="h4" style={{ minWidth: 0 }}>
                            {app.name}
                          </Title>
                        </Group>
                        {app.supportedLanguages.length > 0 && (
                          <Text size="xs" c="dimmed">
                            対応言語: {app.supportedLanguages.join(" / ")}
                          </Text>
                        )}
                        <Spoiler maxHeight={86} showLabel="続きを読む" hideLabel="閉じる" className="app-description-spoiler">
                          <Box
                            className="app-description app-card-description"
                            dangerouslySetInnerHTML={{ __html: markdownToHtml(app.description) }}
                          />
                        </Spoiler>
                      </Stack>
                      <Stack gap="sm">
                        <Text size="sm" c="dimmed">
                          {appPolicies.map((policy) => policy.locale.toUpperCase()).join(" / ") || "Policy not uploaded"}
                        </Text>
                        <Group gap="xs">
                          <Button component="a" href={`/apps/${app.slug}`} rightSection={<IconArrowRight size={16} />}>
                            Support
                          </Button>
                          {appPolicies[0] && (
                            <Button
                              component="a"
                              href={`/apps/${app.slug}/privacy?lang=${appPolicies[0].locale}`}
                              variant="default"
                              leftSection={<IconFileText size={16} />}
                            >
                              Privacy
                            </Button>
                          )}
                        </Group>
                      </Stack>
                    </Stack>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </>
  );
}
