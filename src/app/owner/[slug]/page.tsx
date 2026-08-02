import { notFound, redirect } from "next/navigation";
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Title
} from "@mantine/core";
import { IconEdit, IconExternalLink, IconLogout, IconPlus } from "@tabler/icons-react";
import { AppFormFields } from "@/components/AppFormFields";
import { AppIcon } from "@/components/AppIcon";
import { adminPath, isAdminSlug } from "@/lib/admin-path";
import { isAdmin } from "@/lib/auth";
import { listApps, listContacts, listPolicies } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ appError?: string; policyError?: string }>;
}) {
  const { slug } = await params;
  if (!isAdminSlug(slug)) notFound();

  const basePath = adminPath(slug);
  if (!(await isAdmin())) redirect(`${basePath}/login`);

  const [{ appError, policyError }, apps, policies, contacts] = await Promise.all([
    searchParams,
    listApps(),
    listPolicies(),
    listContacts()
  ]);
  const appById = new Map(apps.map((app) => [app.id, app]));

  return (
    <Box component="main" className="admin-shell">
      <AdminSidebar basePath={basePath} />
      <div className="admin-main">
        <div className="admin-topline">
          <div>
            <Text fw={650}>ダッシュボード</Text>
            <Text size="xs" c="dimmed" ff="var(--gar-mono)">
              GARITON LAB CONSOLE
            </Text>
          </div>
          <Group gap="sm">
            <Button component="a" href="#new-app" color="dark" leftSection={<IconPlus size={17} />}>
              新規アプリ
            </Button>
            <Box component="form" action={`${basePath}/logout`} method="post">
              <Button type="submit" variant="default" leftSection={<IconLogout size={17} />}>
                ログアウト
              </Button>
            </Box>
          </Group>
        </div>

        <div className="admin-content">
          <Stack gap="xl">
            <div>
              <Text className="eyebrow" mb="sm">
                Overview
              </Text>
              <Title order={1} size="clamp(2.4rem, 5vw, 4rem)" lh={1.04}>
                管理ページ
              </Title>
              <Text className="muted-copy" mt="sm">
                アプリ紹介ページ、ストア提出用の情報、ポリシー、問い合わせをここで管理します。
              </Text>
            </div>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <MetricCard label="Total apps" value={apps.length} tag="" />
              <MetricCard label="Published" value={apps.length} tag="PUBLISHED" />
              <MetricCard label="Draft / Hidden" value={Math.max(0, 3 - apps.length)} tag="IN PROGRESS" />
            </SimpleGrid>

            {policyError === "1" && <Alert color="red">Markdown ファイルを選択してください。</Alert>}
            {appError === "1" && (
              <Alert color="red">
                アプリを登録できませんでした。スラッグの重複、またはアイコン画像の形式とサイズを確認してください。
              </Alert>
            )}

            <Paper className="admin-panel">
              <Box p="lg" style={{ borderBottom: "1px solid #efeee9" }}>
                <Group justify="space-between">
                  <div>
                    <Title order={2} size="h3">
                      登録済みアプリ
                    </Title>
                    <Text c="dimmed" size="sm">
                      公開ページ、ポリシー、スクリーンショットの状態を確認できます。
                    </Text>
                  </div>
                  <span className="status-pill status-muted">{apps.length} ITEMS</span>
                </Group>
              </Box>
              <TableScrollContainer minWidth={980}>
                <Table verticalSpacing="md">
                  <TableThead>
                    <TableTr>
                      <TableTh>NAME</TableTh>
                      <TableTh>STATUS</TableTh>
                      <TableTh>PLATFORM</TableTh>
                      <TableTh>POLICY</TableTh>
                      <TableTh>UPDATED</TableTh>
                      <TableTh />
                    </TableTr>
                  </TableThead>
                  <TableTbody>
                    {apps.map((app) => {
                      const appPolicies = policies.filter((policy) => policy.appId === app.id);
                      return (
                        <TableTr key={app.id}>
                          <TableTd>
                            <Group gap="sm" wrap="nowrap">
                              <AppIcon name={app.name} src={app.iconImageUrl} size={42} />
                              <div>
                                <Text fw={700}>{app.name}</Text>
                                <Anchor href={`/apps/${app.slug}`} c="var(--gar-accent)" size="sm">
                                  /apps/{app.slug}
                                </Anchor>
                              </div>
                            </Group>
                          </TableTd>
                          <TableTd>
                            <span className="status-pill status-live">公開中</span>
                          </TableTd>
                          <TableTd>
                            <Text ff="var(--gar-mono)" size="xs" c="dimmed">
                              iOS
                            </Text>
                          </TableTd>
                          <TableTd>
                            <Group gap={6}>
                              {appPolicies.length === 0 ? (
                                <Badge color="gray" variant="light">
                                  未登録
                                </Badge>
                              ) : (
                                appPolicies.map((policy) => (
                                  <Badge key={policy.id} color="gariton" variant="light">
                                    {policy.locale.toUpperCase()}
                                  </Badge>
                                ))
                              )}
                            </Group>
                          </TableTd>
                          <TableTd>
                            <Text size="sm" c="dimmed">
                              {new Date(app.updatedAt).toLocaleDateString("ja-JP")}
                            </Text>
                          </TableTd>
                          <TableTd>
                            <Button component="a" href={`${basePath}/apps/${app.id}`} variant="default" leftSection={<IconEdit size={16} />}>
                              編集
                            </Button>
                          </TableTd>
                        </TableTr>
                      );
                    })}
                    {apps.length === 0 && (
                      <TableTr>
                        <TableTd colSpan={6}>
                          <Text c="dimmed">まだアプリは登録されていません。</Text>
                        </TableTd>
                      </TableTr>
                    )}
                  </TableTbody>
                </Table>
              </TableScrollContainer>
            </Paper>

            <Paper
              id="new-app"
              component="form"
              action={`${basePath}/apps`}
              method="post"
              encType="multipart/form-data"
              p="xl"
              className="admin-panel"
            >
              <Stack gap="md">
                <div>
                  <Text className="eyebrow" mb="sm">
                    Store listing
                  </Text>
                  <Title order={2} size="h3">
                    アプリ登録
                  </Title>
                  <Text c="dimmed" size="sm" mt={4}>
                    登録後、編集画面からプライバシーポリシーとスクリーンショットを追加できます。
                  </Text>
                </div>
                <input type="hidden" name="returnTo" value={basePath} />
                <AppFormFields />
                <Group justify="flex-end">
                  <Button type="submit" color="dark" leftSection={<IconPlus size={17} />}>
                    登録
                  </Button>
                </Group>
              </Stack>
            </Paper>

            <Paper p="xl" className="admin-panel">
              <Group justify="space-between" mb="md">
                <div>
                  <Title order={2} size="h3">
                    お問い合わせ
                  </Title>
                  <Text c="dimmed" size="sm">
                    アプリごとの問い合わせを確認します。
                  </Text>
                </div>
                <span className="status-pill status-muted">{contacts.length} MESSAGES</span>
              </Group>
              <TableScrollContainer minWidth={820}>
                <Table verticalSpacing="md">
                  <TableThead>
                    <TableTr>
                      <TableTh>日時</TableTh>
                      <TableTh>種別</TableTh>
                      <TableTh>送信者</TableTh>
                      <TableTh>内容</TableTh>
                      <TableTh>通知</TableTh>
                    </TableTr>
                  </TableThead>
                  <TableTbody>
                    {contacts.map((contact) => (
                      <TableTr key={contact.id}>
                        <TableTd>
                          <Text size="sm">{new Date(contact.createdAt).toLocaleString("ja-JP")}</Text>
                        </TableTd>
                        <TableTd>
                          <Stack gap={5}>
                            <Badge color="gray" variant="light">{contactCategoryLabel(contact.category)}</Badge>
                            {contact.appId && <Text size="xs" c="dimmed">{appById.get(contact.appId)?.name || "Unknown"}</Text>}
                          </Stack>
                        </TableTd>
                        <TableTd>
                          <Text fw={700}>{contact.name}</Text>
                          <Anchor href={`mailto:${contact.email}`} c="var(--gar-accent)" size="sm">
                            {contact.email}
                          </Anchor>
                        </TableTd>
                        <TableTd>
                          <Text size="sm" lineClamp={4}>
                            {contact.message}
                          </Text>
                        </TableTd>
                        <TableTd>
                          <Badge color={contact.emailStatus === "sent" ? "green" : contact.emailStatus === "failed" ? "red" : "gray"} variant="light">
                            {contactEmailStatusLabel(contact.emailStatus)}
                          </Badge>
                        </TableTd>
                      </TableTr>
                    ))}
                    {contacts.length === 0 && (
                      <TableTr>
                        <TableTd colSpan={5}>
                          <Text c="dimmed">まだお問い合わせはありません。</Text>
                        </TableTd>
                      </TableTr>
                    )}
                  </TableTbody>
                </Table>
              </TableScrollContainer>
            </Paper>
          </Stack>
        </div>
      </div>
    </Box>
  );
}

function AdminSidebar({ basePath }: { basePath: string }) {
  return (
    <aside className="admin-sidebar">
      <Group gap={11} px={10} pb={28}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="24" height="24" rx="7.5" fill="var(--gar-paper)" />
          <circle cx="13" cy="13.4" r="6.1" fill="none" stroke="var(--gar-ink)" strokeWidth="1.5" />
          <circle cx="13" cy="7.3" r="1.7" fill="var(--gar-accent)" />
        </svg>
        <div>
          <Text fw={650} size="sm" c="var(--gar-paper)">
            Gariton Lab
          </Text>
          <Text ff="var(--gar-mono)" size="10px" c="#6e6e72">
            CONSOLE
          </Text>
        </div>
      </Group>
      <Stack gap={3}>
        <div className="admin-nav-item is-active">
          <span className="admin-nav-dot" />
          ダッシュボード
        </div>
        <Anchor className="admin-nav-item" href={`${basePath}#new-app`} underline="never">
          <span className="admin-nav-dot" />
          新規作成
        </Anchor>
        <Anchor className="admin-nav-item" href="/" underline="never">
          <span className="admin-nav-dot" />
          サイトを表示
        </Anchor>
      </Stack>
      <Box mt="auto" pt="lg" style={{ borderTop: "1px solid #1c1e22" }}>
        <Anchor className="admin-nav-item" href="/products" underline="never">
          <span>↗</span>
          プロダクト一覧
        </Anchor>
      </Box>
    </aside>
  );
}

function MetricCard({ label, value, tag }: { label: string; value: number; tag: string }) {
  return (
    <div className="admin-metric">
      <Text size="sm" c="dimmed" mb="sm">
        {label}
      </Text>
      <Group align="baseline" gap="sm">
        <Text fz={38} fw={750} lh={1}>
          {value}
        </Text>
        {tag && (
          <Text ff="var(--gar-mono)" size="xs" c={tag === "PUBLISHED" ? "var(--gar-green)" : "#c08a2e"}>
            {tag}
          </Text>
        )}
      </Group>
    </div>
  );
}

function contactCategoryLabel(category: "app-support" | "bug-report" | "general") {
  return { "app-support": "アプリについて", "bug-report": "不具合報告", general: "その他" }[category];
}

function contactEmailStatusLabel(status: "pending" | "sent" | "failed" | "not-configured") {
  return { pending: "送信中", sent: "送信済み", failed: "送信失敗", "not-configured": "未設定" }[status];
}
