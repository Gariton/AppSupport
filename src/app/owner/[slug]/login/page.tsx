import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title
} from "@mantine/core";
import { IconLock, IconLogin2, IconShieldLock, IconUser } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import { adminPath, isAdminSlug } from "@/lib/admin-path";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  if (!isAdminSlug(slug)) {
    notFound();
  }
  const basePath = adminPath(slug);

  return (
    <Box component="main" className="page-section">
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Stack gap="lg" justify="center">
            <ThemeIcon size={58} color="teal" variant="light">
              <IconShieldLock size={32} stroke={1.8} />
            </ThemeIcon>
            <div>
              <Text c="teal" fw={800} size="sm">
                Admin
              </Text>
              <Title order={1} size="clamp(2.4rem, 6vw, 4.5rem)" lh={1}>
                管理ログイン
              </Title>
            </div>
            <Text size="lg" c="dimmed" maw={600}>
              登録アプリ、プライバシーポリシー、問い合わせを管理します。
            </Text>
          </Stack>
          <LoginForm action={`${basePath}/login/submit`} searchParams={searchParams} />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

async function LoginForm({ action, searchParams }: { action: string; searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <Paper component="form" action={action} method="post" p="xl" className="soft-card">
      <Stack gap="md">
        {error && (
          <Alert color="red" variant="light">
            ユーザー名またはパスワードが違います。
          </Alert>
        )}
        <TextInput name="username" label="ユーザー名" autoComplete="username" required leftSection={<IconUser size={16} />} />
        <PasswordInput
          name="password"
          label="パスワード"
          autoComplete="current-password"
          required
          leftSection={<IconLock size={16} />}
        />
        <Group justify="flex-end" mt="sm">
          <Button type="submit" rightSection={<IconLogin2 size={17} />}>
            ログイン
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
