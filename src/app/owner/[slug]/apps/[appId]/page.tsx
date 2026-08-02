import { notFound, redirect } from "next/navigation";
import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Image,
  InputWrapper,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
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
import { AppEditor } from "@/components/AppEditor";
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
  if (!isAdminSlug(slug)) notFound();

  const basePath = adminPath(slug);
  if (!(await isAdmin())) redirect(`${basePath}/login`);

  const app = await getAppById(appId);
  if (!app) notFound();

  const [{ appError, policyError, screenshotError, saved }, policies] = await Promise.all([
    searchParams,
    listPolicies(app.id)
  ]);
  const editPath = `${basePath}/apps/${app.id}`;

  const alerts = (
    <>
      {saved === "app" && (
        <Alert color="gariton" variant="light" icon={<IconCheck size={18} />}>
          アプリ情報を更新しました。
        </Alert>
      )}
      {saved === "policy" && (
        <Alert color="gariton" variant="light" icon={<IconCheck size={18} />}>
          プライバシーポリシーをアップロードしました。
        </Alert>
      )}
      {saved === "screenshots" && (
        <Alert color="gariton" variant="light" icon={<IconCheck size={18} />}>
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
    </>
  );

  const formPanels = (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      <PolicyPanel basePath={basePath} editPath={editPath} appId={app.id} policies={policies} />
      <ScreenshotPanel basePath={basePath} editPath={editPath} appId={app.id} />
    </SimpleGrid>
  );

  const previewPanels = (
    <Paper p="xl" className="admin-panel" mt="lg">
      <Group justify="space-between" align="flex-start" mb="md">
        <div>
          <Title order={2} size="h4">
            スクリーンショット
          </Title>
          <Text c="dimmed" size="sm">
            公開ページで表示される画像です。
          </Text>
        </div>
        <Button component="a" href={`/apps/${app.slug}`} variant="default" rightSection={<IconExternalLink size={16} />}>
          確認
        </Button>
      </Group>
      {app.screenshots.length === 0 ? (
        <Group gap="md" align="flex-start">
          <IconPhoto size={22} color="var(--gar-soft)" />
          <div>
            <Text fw={600}>スクリーンショットは未登録です</Text>
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
  );

  return (
    <Box component="main" className="editor-shell">
      <div className="editor-topbar">
        <Group gap="md">
          <Button component="a" href={basePath} variant="subtle" color="gray" leftSection={<IconArrowLeft size={17} />}>
            一覧へ戻る
          </Button>
          <Box w={1} h={22} bg="#e7e6e1" />
          <Group gap="sm">
            <Text fw={600}>アプリを編集</Text>
            <span className="status-pill status-live">公開中</span>
          </Group>
        </Group>
        <Group gap="sm">
          <Button component="a" href={`/apps/${app.slug}`} variant="default" rightSection={<IconExternalLink size={16} />}>
            公開ページ
          </Button>
          <Button form="app-edit-form" type="submit" color="dark" leftSection={<IconDeviceFloppy size={17} />}>
            更新
          </Button>
        </Group>
      </div>

      <AppEditor
        app={app}
        action={`${basePath}/apps`}
        editPath={editPath}
        policiesReady={policies.length > 0}
        alerts={alerts}
        formPanels={formPanels}
        previewPanels={previewPanels}
      />
    </Box>
  );
}

function PolicyPanel({
  basePath,
  editPath,
  appId,
  policies
}: {
  basePath: string;
  editPath: string;
  appId: string;
  policies: { id: string; locale: string }[];
}) {
  return (
    <Paper component="form" action={`${basePath}/policies`} method="post" encType="multipart/form-data" p="lg" className="admin-panel">
      <Stack gap="md">
        <Group gap="sm">
          <IconFileUpload size={18} />
          <Title order={2} size="h4">
            プライバシーポリシー
          </Title>
        </Group>
        <input type="hidden" name="appId" value={appId} />
        <input type="hidden" name="returnTo" value={editPath} />
        <TextInput name="locale" label="ロケール" required placeholder="ja, en, zh-cn" />
        <InputWrapper label="Markdown ファイル" required>
          <input name="policyFile" type="file" accept=".md,text/markdown,text/plain" required className="file-input" />
        </InputWrapper>
        <Group gap={6}>
          {policies.length === 0 ? (
            <Badge color="gray" variant="light">
              未登録
            </Badge>
          ) : (
            policies.map((policy) => (
              <Badge key={policy.id} color="gariton" variant="light" leftSection={<IconFileText size={12} />}>
                {policy.locale.toUpperCase()}
              </Badge>
            ))
          )}
        </Group>
        <Button type="submit" variant="default" leftSection={<IconFileUpload size={17} />}>
          アップロード
        </Button>
      </Stack>
    </Paper>
  );
}

function ScreenshotPanel({ basePath, editPath, appId }: { basePath: string; editPath: string; appId: string }) {
  return (
    <Paper component="form" action={`${basePath}/screenshots`} method="post" encType="multipart/form-data" p="lg" className="admin-panel">
      <Stack gap="md">
        <Group gap="sm">
          <IconCamera size={18} />
          <Title order={2} size="h4">
            スクリーンショット
          </Title>
        </Group>
        <input type="hidden" name="appId" value={appId} />
        <input type="hidden" name="returnTo" value={editPath} />
        <InputWrapper label="画像ファイル" required>
          <input name="screenshotFiles" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple required className="file-input" />
        </InputWrapper>
        <Text size="sm" c="dimmed">
          最大 10 枚まで同時に追加できます。
        </Text>
        <Checkbox name="replace" value="1" label="現在のスクリーンショットを置き換える" />
        <Button type="submit" variant="default" leftSection={<IconCamera size={17} />}>
          登録
        </Button>
      </Stack>
    </Paper>
  );
}
