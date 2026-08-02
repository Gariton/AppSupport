"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  InputWrapper,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { AppIcon } from "@/components/AppIcon";
import type { AppRecord } from "@/lib/types";

type AppEditorProps = {
  app: AppRecord;
  action: string;
  editPath: string;
  policiesReady: boolean;
  alerts?: ReactNode;
  formPanels?: ReactNode;
  previewPanels?: ReactNode;
};

export function AppEditor({ app, action, editPath, policiesReady, alerts, formPanels, previewPanels }: AppEditorProps) {
  const [name, setName] = useState(app.name);
  const [slug, setSlug] = useState(app.slug);
  const [appStoreUrl, setAppStoreUrl] = useState(app.appStoreUrl);
  const [supportEmail, setSupportEmail] = useState(app.supportEmail);
  const [languages, setLanguages] = useState(app.supportedLanguages.join(", "));
  const [hasInAppPurchases, setHasInAppPurchases] = useState(app.hasInAppPurchases);
  const [description, setDescription] = useState(app.description);

  const keywordChips = useMemo(
    () =>
      languages
        .split(/[,、]/)
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 6),
    [languages]
  );

  return (
    <div className="editor-grid">
      <div className="editor-form-pane">
        <Stack gap="lg">
          {alerts}

          <Paper
            id="app-edit-form"
            component="form"
            action={action}
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
                <Title order={1} size="h3">
                  基本情報
                </Title>
                <Text c="dimmed" size="sm" mt={4}>
                  App Store / Google Play に提出する説明文、サポート情報、メタ情報を管理します。右側にリアルタイムで反映されます。
                </Text>
              </div>

              <input type="hidden" name="id" value={app.id} />
              <input type="hidden" name="returnTo" value={editPath} />

              <TextInput
                name="name"
                label="アプリ名"
                required
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />
              <TextInput
                name="slug"
                label="URL スラッグ"
                required
                value={slug}
                onChange={(event) => setSlug(event.currentTarget.value)}
              />
              <TextInput
                name="appStoreUrl"
                label="App Store URL"
                type="url"
                placeholder="https://apps.apple.com/..."
                value={appStoreUrl}
                onChange={(event) => setAppStoreUrl(event.currentTarget.value)}
              />
              <Checkbox
                name="hasInAppPurchases"
                value="1"
                label="アプリ内課金あり"
                checked={hasInAppPurchases}
                onChange={(event) => setHasInAppPurchases(event.currentTarget.checked)}
              />
              <TextInput
                name="supportedLanguages"
                label="対応言語"
                description="カンマまたは読点区切りで入力してください。"
                placeholder="日本語, English"
                value={languages}
                onChange={(event) => setLanguages(event.currentTarget.value)}
              />
              <InputWrapper label={app.iconImageUrl ? "アイコン画像を変更" : "アイコン画像"}>
                <input name="iconFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="file-input" />
              </InputWrapper>
              <Text size="sm" c="dimmed">
                PNG、JPEG、WebP、GIF に対応しています。ファイルサイズは 2MB 以下にしてください。
                {app.iconImageUrl ? " 新しい画像を選択しない場合、現在のアイコンを維持します。" : ""}
              </Text>
              <TextInput
                name="supportEmail"
                label="サポートメール"
                type="email"
                required
                value={supportEmail}
                onChange={(event) => setSupportEmail(event.currentTarget.value)}
              />
              <Textarea
                name="description"
                label="説明（Markdown）"
                minRows={5}
                autosize
                required
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />

              <Group justify="flex-end">
                <Button type="submit" color="dark" leftSection={<IconDeviceFloppy size={17} />}>
                  更新
                </Button>
              </Group>
            </Stack>
          </Paper>

          {formPanels}
        </Stack>
      </div>

      <div className="editor-preview-pane">
        <Group justify="space-between" mb="lg">
          <Text className="eyebrow">Live preview</Text>
          <Group gap={7} align="center">
            <Box w={6} h={6} bg="var(--gar-accent)" style={{ borderRadius: "50%" }} />
            <Text size="xs" c="dimmed">
              入力内容はリアルタイムで反映されます
            </Text>
          </Group>
        </Group>

        <div className="store-preview">
          <Group p={26} gap="lg" wrap="nowrap">
            <AppIcon name={name || "G"} src={app.iconImageUrl} size={84} />
            <div style={{ minWidth: 0 }}>
              <Text fz={21} fw={750} truncate>
                {name || "（アプリ名）"}
              </Text>
              <Text size="sm" c="dimmed" mt={3} lineClamp={2}>
                {keywordChips.length > 0 ? keywordChips.join(" · ") : "対応言語を入力"}
              </Text>
              <Text ff="var(--gar-mono)" size="xs" c="dimmed" mt={8}>
                Finance · Gariton Lab
              </Text>
            </div>
          </Group>
          <Group px={26} pb={22} gap="sm">
            <Button color="dark" radius="md" style={{ flex: 1 }}>
              App Store
            </Button>
            <Button variant="default" radius="md" style={{ flex: 1 }}>
              Google Play
            </Button>
          </Group>
          <SimpleGrid cols={3} spacing={0} style={{ borderTop: "1px solid #efeee9", borderBottom: "1px solid #efeee9" }}>
            <PreviewMeta label="PRICE" value={hasInAppPurchases ? "IAP" : "Free"} />
            <PreviewMeta label="CATEGORY" value="Finance" />
            <PreviewMeta label="POLICY" value={policiesReady ? "Ready" : "None"} />
          </SimpleGrid>
          <Box p={26}>
            <Text size="sm" lh={1.75} style={{ whiteSpace: "pre-line" }}>
              {description || "説明文がここに表示されます。"}
            </Text>
            <Group gap={7} mt="md">
              {keywordChips.map((keyword) => (
                <Badge key={keyword} color="gray" variant="light" radius="xl">
                  {keyword}
                </Badge>
              ))}
            </Group>
          </Box>
        </div>

        {previewPanels}
      </div>
    </div>
  );
}

function PreviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <Box p="md" ta="center" style={{ borderRight: "1px solid #efeee9" }}>
      <Text ff="var(--gar-mono)" size="10px" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={650} mt={5}>
        {value}
      </Text>
    </Box>
  );
}
