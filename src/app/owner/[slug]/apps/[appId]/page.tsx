import { notFound, redirect } from "next/navigation";
import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  Image,
  InputWrapper,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCamera,
  IconCheck,
  IconDeviceFloppy,
  IconExternalLink,
  IconFileText,
  IconFileUpload,
  IconPhoto
} from "@tabler/icons-react";
import { AppFormFields } from "@/components/AppFormFields";
import { AppIcon } from "@/components/AppIcon";
import { adminPath, isAdminSlug } from "@/lib/admin-path";
import { isAdmin } from "@/lib/auth";
import { getAppById, listPolicies } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminAppEditPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string; appId: string }>;
  searchParams: Promise<{ appError?: string; policyError?: string; screenshotError?: string; saved?: string }>;
}) {
  const { slug, appId } = await params;
  if (!isAdminSlug(slug)) {
    notFound();
  }

  const basePath = adminPath(slug);
  if (!(await isAdmin())) {
    redirect(`${basePath}/login`);
  }

  const app = await getAppById(appId);
  if (!app) {
    notFound();
  }

  const [{ appError, policyError, screenshotError, saved }, policies] = await Promise.all([
    searchParams,
    listPolicies(app.id)
  ]);
  const editPath = `${basePath}/apps/${app.id}`;

  return (
    <Box component="main" className="page-section">
      <Container size="lg">
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start" gap="md">
            <Group gap="md" align="center" wrap="nowrap">
              <AppIcon name={app.name} src={app.iconImageUrl} size={64} />
              <div>
                <Badge color="teal" variant="light" leftSection={<IconDeviceFloppy size={14} />}>
                  App Edit
                </Badge>
                <Title order={1} mt="xs" size="clamp(2rem, 4vw, 3.4rem)" lh={1}>
                  {app.name}
                </Title>
                <Text c="dimmed" mt={4}>
                  アプリ情報、プライバシーポリシー、スクリーンショットをまとめて管理します。
                </Text>
              </div>
            </Group>
            <Button component="a" href={basePath} variant="default" leftSection={<IconArrowLeft size={17} />}>
              管理ページへ戻る
            </Button>
          </Group>

          {saved === "app" && (
            <Alert color="teal" variant="light" icon={<IconCheck size={18} />}>
              アプリ情報を更新しました。
            </Alert>
          )}
          {saved === "policy" && (
            <Alert color="teal" variant="light" icon={<IconCheck size={18} />}>
              プライバシーポリシーをアップロードしました。
            </Alert>
          )}
          {saved === "screenshots" && (
            <Alert color="teal" variant="light" icon={<IconCheck size={18} />}>
              スクリーンショットを登録しました。
            </Alert>
          )}
          {appError === "1" && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              アプリ情報を更新できませんでした。スラッグの重複、またはアイコン画像の形式とサイズを確認してください。
            </Alert>
          )}
          {policyError === "1" && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              Markdown ファイルとロケールを確認してください。
            </Alert>
          )}
          {screenshotError === "1" && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              スクリーンショットは PNG、JPEG、WebP、GIF のいずれかを 1〜10 枚、各 8MB 以下で選択してください。
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
                    <IconDeviceFloppy size={18} />
                  </ThemeIcon>
                  <Title order={2} size="h3">
                    基本情報
                  </Title>
                </Group>
                <input type="hidden" name="id" value={app.id} />
                <input type="hidden" name="returnTo" value={editPath} />
                <AppFormFields app={app} />
                <Group justify="flex-end">
                  <Button type="submit" leftSection={<IconDeviceFloppy size={17} />}>
                    更新
                  </Button>
                </Group>
              </Stack>
            </Paper>

            <Stack gap="md">
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
                  <input type="hidden" name="appId" value={app.id} />
                  <input type="hidden" name="returnTo" value={editPath} />
                  <TextInput name="locale" label="ロケール" required placeholder="ja, en, zh-cn" />
                  <InputWrapper label="Markdown ファイル" required>
                    <input
                      name="policyFile"
                      type="file"
                      accept=".md,text/markdown,text/plain"
                      required
                      className="file-input"
                    />
                  </InputWrapper>
                  <Group gap={6}>
                    {policies.length === 0 ? (
                      <Badge color="gray" variant="light">
                        未登録
                      </Badge>
                    ) : (
                      policies.map((policy) => (
                        <Badge key={policy.id} color="teal" variant="light" leftSection={<IconFileText size={12} />}>
                          {policy.locale.toUpperCase()}
                        </Badge>
                      ))
                    )}
                  </Group>
                  <Group justify="flex-end">
                    <Button type="submit" leftSection={<IconFileUpload size={17} />}>
                      アップロード
                    </Button>
                  </Group>
                </Stack>
              </Paper>

              <Paper
                component="form"
                action={`${basePath}/screenshots`}
                method="post"
                encType="multipart/form-data"
                p="xl"
                className="soft-card"
              >
                <Stack gap="md">
                  <Group gap="sm">
                    <ThemeIcon color="teal" variant="light">
                      <IconCamera size={18} />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      スクリーンショット
                    </Title>
                  </Group>
                  <input type="hidden" name="appId" value={app.id} />
                  <input type="hidden" name="returnTo" value={editPath} />
                  <InputWrapper label="画像ファイル" required>
                    <input
                      name="screenshotFiles"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      multiple
                      required
                      className="file-input"
                    />
                  </InputWrapper>
                  <Text size="sm" c="dimmed">
                    最大 10 枚まで同時に追加できます。公開ページでは横スクロールで表示されます。
                  </Text>
                  <Checkbox name="replace" value="1" label="現在のスクリーンショットを置き換える" />
                  <Group justify="flex-end">
                    <Button type="submit" leftSection={<IconCamera size={17} />}>
                      登録
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </SimpleGrid>

          <Paper p="xl" className="soft-card">
            <Group justify="space-between" align="flex-start" mb="md">
              <div>
                <Title order={2} size="h3">
                  公開状態
                </Title>
                <Text c="dimmed" size="sm">
                  公開ページで表示されるスクリーンショットと主要リンクを確認できます。
                </Text>
              </div>
              <Group gap="xs">
                <Button
                  component="a"
                  href={`/apps/${app.slug}`}
                  variant="default"
                  rightSection={<IconExternalLink size={16} />}
                >
                  サポートページ
                </Button>
                {policies[0] && (
                  <Button
                    component="a"
                    href={`/apps/${app.slug}/privacy?lang=${policies[0].locale}`}
                    variant="default"
                    rightSection={<IconExternalLink size={16} />}
                  >
                    ポリシー
                  </Button>
                )}
              </Group>
            </Group>

            {app.screenshots.length === 0 ? (
              <Group gap="md" align="flex-start">
                <ThemeIcon color="gray" variant="light" size={42}>
                  <IconPhoto size={22} />
                </ThemeIcon>
                <div>
                  <Text fw={800}>スクリーンショットは未登録です</Text>
                  <Text c="dimmed" size="sm" mt={4}>
                    画像を登録すると、アプリ詳細ページに横スクロールのギャラリーが表示されます。
                  </Text>
                </div>
              </Group>
            ) : (
              <Box className="screenshot-carousel admin-screenshot-carousel" aria-label={`${app.name} screenshots`}>
                {app.screenshots.map((screenshot, index) => (
                  <Box className="screenshot-frame admin-screenshot-frame" key={screenshot}>
                    <Image src={screenshot} alt={`${app.name} screenshot ${index + 1}`} className="screenshot-image" />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
