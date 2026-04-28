import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  NativeSelect,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title
} from "@mantine/core";
import { IconCheck, IconMail, IconMessageCircle, IconSend } from "@tabler/icons-react";
import { listApps } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  searchParams
}: {
  searchParams: Promise<{ app?: string; sent?: string; error?: string }>;
}) {
  const apps = await listApps();
  const { app: selectedAppId, sent, error } = await searchParams;

  return (
    <Box component="main" className="page-section">
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Stack gap="lg" justify="center">
            <ThemeIcon size={54} color="teal" variant="light">
              <IconMessageCircle size={30} stroke={1.8} />
            </ThemeIcon>
            <div>
              <Text c="teal" fw={800} size="sm">
                Contact
              </Text>
              <Title order={1} size="clamp(2.4rem, 6vw, 4.4rem)" lh={1}>
                お問い合わせ
              </Title>
            </div>
            <Text size="lg" c="dimmed" maw={620}>
              対象アプリを選択して内容を送信してください。確認後、必要に応じて返信します。
            </Text>
            {sent === "1" && (
              <Alert color="teal" variant="light" icon={<IconCheck size={18} />}>
                お問い合わせを受け付けました。
              </Alert>
            )}
            {error === "1" && (
              <Alert color="red" variant="light">
                入力内容を確認してください。
              </Alert>
            )}
          </Stack>

          <Paper component="form" action="/contact/submit" method="post" p="xl" className="soft-card">
            <Stack gap="md">
              <NativeSelect
                name="appId"
                label="対象アプリ"
                required
                defaultValue={selectedAppId || ""}
                data={[
                  { label: "選択してください", value: "", disabled: true },
                  ...apps.map((item) => ({ label: item.name, value: item.id }))
                ]}
              />
              <TextInput name="name" label="お名前" autoComplete="name" required />
              <TextInput
                name="email"
                label="メールアドレス"
                type="email"
                autoComplete="email"
                required
                leftSection={<IconMail size={16} />}
              />
              <Textarea name="message" label="内容" minRows={7} autosize required />
              <Group justify="flex-end">
                <Button type="submit" rightSection={<IconSend size={17} />}>
                  送信
                </Button>
              </Group>
            </Stack>
          </Paper>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
