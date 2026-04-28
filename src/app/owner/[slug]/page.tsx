import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  Group,
  InputWrapper,
  NativeSelect,
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
  TextInput,
  Textarea,
  ThemeIcon,
  Title
} from "@mantine/core";
import {
  IconApps,
  IconDeviceFloppy,
  IconEdit,
  IconExternalLink,
  IconFileUpload,
  IconInbox,
  IconLogout,
  IconPlus,
  IconShieldLock
} from "@tabler/icons-react";
import { isAdmin } from "@/lib/auth";
import { adminPath, isAdminSlug } from "@/lib/admin-path";
import { listApps, listContacts, listPolicies } from "@/lib/store";
import type { AppRecord } from "@/lib/types";
import { AppIcon } from "@/components/AppIcon";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ appError?: string; policyError?: string }>;
}) {
  const { slug } = await params;
  if (!isAdminSlug(slug)) {
    notFound();
  }

  const basePath = adminPath(slug);

  if (!(await isAdmin())) {
    redirect(`${basePath}/login`);
  }

  const [{ appError, policyError }, apps, policies, contacts] = await Promise.all([
    searchParams,
    listApps(),
    listPolicies(),
    listContacts()
  ]);
  const appById = new Map(apps.map((app) => [app.id, app]));
  const appOptions = [
    { label: "選択してください", value: "", disabled: true },
    ...apps.map((app) => ({ label: app.name, value: app.id }))
  ];

  return (
    <Box component="main" className="page-section">
      <Container size="xl">
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start" gap="md">
            <div>
              <Badge color="teal" variant="light" leftSection={<IconShieldLock size={14} />}>
                Admin
              </Badge>
              <Title order={1} mt="sm" size="clamp(2.4rem, 5vw, 4.4rem)" lh={1}>
                管理ページ
              </Title>
              <Text c="dimmed" mt="xs">
                アプリ、Markdown ポリシー、問い合わせをここで管理します。
              </Text>
            </div>
            <Box component="form" action={`${basePath}/logout`} method="post">
              <Button type="submit" variant="default" leftSection={<IconLogout size={17} />}>
                ログアウト
              </Button>
            </Box>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <MetricCard label="Apps" value={apps.length} icon={<IconApps size={24} />} />
            <MetricCard label="Policies" value={policies.length} icon={<IconFileUpload size={24} />} />
            <MetricCard label="Contacts" value={contacts.length} icon={<IconInbox size={24} />} />
          </SimpleGrid>

          {policyError === "1" && (
            <Alert color="red" variant="light">
              Markdown ファイルを選択してください。
            </Alert>
          )}

          {appError === "1" && (
            <Alert color="red" variant="light">
              アプリを登録できませんでした。スラッグの重複、またはアイコン画像の形式とサイズを確認してください。
            </Alert>
          )}

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
            <Paper
              component="form"
              action={`${basePath}/apps`}
              method="post"
              encType="multipart/form-data"
              p="xl"
              className="soft-card"
            >
              <Stack gap="md">
                <Group gap="sm">
                  <ThemeIcon color="teal" variant="light">
                    <IconPlus size={18} />
                  </ThemeIcon>
                  <Title order={2} size="h3">
                    アプリ登録
                  </Title>
                </Group>
                <AppFormFields />
                <Group justify="flex-end">
                  <Button type="submit" leftSection={<IconPlus size={17} />}>
                    登録
                  </Button>
                </Group>
              </Stack>
            </Paper>

            <Paper
              component="form"
              action={`${basePath}/policies`}
              method="post"
              encType="multipart/form-data"
              p="xl"
              className="soft-card"
            >
              <Stack gap="md">
                <Group gap="sm">
                  <ThemeIcon color="teal" variant="light">
                    <IconFileUpload size={18} />
                  </ThemeIcon>
                  <Title order={2} size="h3">
                    プライバシーポリシー
                  </Title>
                </Group>
                <NativeSelect name="appId" label="アプリ" required defaultValue="" data={appOptions} />
                <TextInput name="locale" label="ロケール" required placeholder="ja, en, zh-cn" />
                <InputWrapper label="Markdown ファイル" required>
                  <input name="policyFile" type="file" accept=".md,text/markdown,text/plain" required className="file-input" />
                </InputWrapper>
                <Text size="sm" c="dimmed">
                  ロケールごとに md ファイルをアップロードすると、公開ページで言語切替できます。
                </Text>
                <Group justify="flex-end">
                  <Button type="submit" leftSection={<IconFileUpload size={17} />}>
                    アップロード
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </SimpleGrid>

          <Paper p="xl" className="soft-card">
            <Group justify="space-between" mb="md">
              <div>
                <Title order={2} size="h3">
                  登録済みアプリ
                </Title>
                <Text c="dimmed" size="sm">
                  App Store Connect に設定するサポート URL とポリシー URL を確認できます。
                </Text>
              </div>
            </Group>
            <TableScrollContainer minWidth={760}>
              <Table striped highlightOnHover verticalSpacing="md">
                <TableThead>
                  <TableTr>
                    <TableTh>アプリ</TableTh>
                    <TableTh>Support URL</TableTh>
                    <TableTh>ポリシー</TableTh>
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
                              <Text fw={800}>{app.name}</Text>
                              <Text c="dimmed" size="sm">
                                {app.supportEmail}
                              </Text>
                            </div>
                          </Group>
                        </TableTd>
                        <TableTd>
                          <Anchor href={`/apps/${app.slug}`} c="teal" fw={700}>
                            /apps/{app.slug}
                          </Anchor>
                        </TableTd>
                        <TableTd>
                          <Group gap={6}>
                            {appPolicies.length === 0 ? (
                              <Badge color="gray" variant="light">
                                未登録
                              </Badge>
                            ) : (
                              appPolicies.map((policy) => (
                                <Badge
                                  key={policy.id}
                                  color="teal"
                                  variant="light"
                                  rightSection={<IconExternalLink size={12} />}
                                >
                                  {policy.locale.toUpperCase()}
                                </Badge>
                              ))
                            )}
                          </Group>
                        </TableTd>
                      </TableTr>
                    );
                  })}
                  {apps.length === 0 && (
                    <TableTr>
                      <TableTd colSpan={3}>
                        <Text c="dimmed">まだアプリは登録されていません。</Text>
                      </TableTd>
                    </TableTr>
                  )}
                </TableTbody>
              </Table>
            </TableScrollContainer>
            {apps.length > 0 && (
              <Stack mt="xl" gap="md">
                <Group gap="sm">
                  <ThemeIcon color="teal" variant="light">
                    <IconEdit size={18} />
                  </ThemeIcon>
                  <div>
                    <Title order={3} size="h4">
                      アプリ情報の編集
                    </Title>
                    <Text c="dimmed" size="sm">
                      変更したいアプリを開いて、内容を更新できます。
                    </Text>
                  </div>
                </Group>
                <Accordion variant="separated">
                  {apps.map((app) => (
                    <AccordionItem value={app.id} key={app.id}>
                      <AccordionControl>
                        <Group gap="sm" wrap="nowrap">
                          <AppIcon name={app.name} src={app.iconImageUrl} size={34} />
                          <div>
                            <Text fw={800}>{app.name}</Text>
                            <Text c="dimmed" size="xs">
                              /apps/{app.slug}
                            </Text>
                          </div>
                        </Group>
                      </AccordionControl>
                      <AccordionPanel>
                        <Box
                          component="form"
                          action={`${basePath}/apps`}
                          method="post"
                          encType="multipart/form-data"
                        >
                          <Stack gap="md">
                            <input type="hidden" name="id" value={app.id} />
                            <AppFormFields app={app} />
                            <Group justify="flex-end">
                              <Button type="submit" leftSection={<IconDeviceFloppy size={17} />}>
                                更新
                              </Button>
                            </Group>
                          </Stack>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Stack>
            )}
          </Paper>

          <Paper p="xl" className="soft-card">
            <Title order={2} size="h3" mb="md">
              お問い合わせ
            </Title>
            <TableScrollContainer minWidth={860}>
              <Table striped highlightOnHover verticalSpacing="md">
                <TableThead>
                  <TableTr>
                    <TableTh>日時</TableTh>
                    <TableTh>アプリ</TableTh>
                    <TableTh>送信者</TableTh>
                    <TableTh>内容</TableTh>
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {contacts.map((contact) => (
                    <TableTr key={contact.id}>
                      <TableTd>
                        <Text size="sm">{new Date(contact.createdAt).toLocaleString("ja-JP")}</Text>
                      </TableTd>
                      <TableTd>
                        <Badge color="gray" variant="light">
                          {appById.get(contact.appId)?.name || "Unknown"}
                        </Badge>
                      </TableTd>
                      <TableTd>
                        <Text fw={700}>{contact.name}</Text>
                        <Anchor href={`mailto:${contact.email}`} c="teal" size="sm">
                          {contact.email}
                        </Anchor>
                      </TableTd>
                      <TableTd>
                        <Text size="sm" lineClamp={4}>
                          {contact.message}
                        </Text>
                      </TableTd>
                    </TableTr>
                  ))}
                  {contacts.length === 0 && (
                    <TableTr>
                      <TableTd colSpan={4}>
                        <Text c="dimmed">まだお問い合わせはありません。</Text>
                      </TableTd>
                    </TableTr>
                  )}
                </TableTbody>
              </Table>
            </TableScrollContainer>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

function AppFormFields({ app }: { app?: AppRecord }) {
  return (
    <>
      <TextInput name="name" label="アプリ名" required placeholder="My iOS App" defaultValue={app?.name} />
      <TextInput name="slug" label="URL スラッグ" required placeholder="my-ios-app" defaultValue={app?.slug} />
      <TextInput
        name="appStoreUrl"
        label="App Store URL"
        type="url"
        placeholder="https://apps.apple.com/..."
        defaultValue={app?.appStoreUrl}
      />
      <InputWrapper label={app?.iconImageUrl ? "アイコン画像を変更" : "アイコン画像"}>
        <input name="iconFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="file-input" />
      </InputWrapper>
      <Text size="sm" c="dimmed">
        PNG、JPEG、WebP、GIF に対応しています。ファイルサイズは 2MB 以下にしてください。
        {app?.iconImageUrl ? " 新しい画像を選択しない場合、現在のアイコンを維持します。" : ""}
      </Text>
      <TextInput
        name="supportEmail"
        label="サポートメール"
        type="email"
        required
        placeholder="support@example.com"
        defaultValue={app?.supportEmail}
      />
      <Textarea
        name="description"
        label="説明（Markdown）"
        minRows={5}
        autosize
        required
        placeholder="**太字**、箇条書き、リンクなどを利用できます。"
        defaultValue={app?.description}
      />
    </>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <Paper p="lg" className="soft-card">
      <Group justify="space-between">
        <div>
          <Text size="xs" c="dimmed" fw={800}>
            {label}
          </Text>
          <Text size="2rem" fw={850} lh={1.1}>
            {value}
          </Text>
        </div>
        <ThemeIcon size={46} color="teal" variant="light">
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}
