import type { Metadata } from "next";
import { Alert, Box, Container, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { ContactForm } from "@/components/ContactForm";
import { listApps } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "お問い合わせ", description: "Gariton Labと公開アプリへのお問い合わせ。" };

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
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 44, md: 80 }}>
          <Stack gap="lg" justify="center">
            <div>
              <Text className="eyebrow" mb="md">
                Contact
              </Text>
              <Title order={1} size="clamp(2.8rem, 7vw, 4.8rem)" lh={1.04} className="hero-title">
                お問い合わせ
              </Title>
            </div>
            <Text size="lg" maw={620} className="muted-copy">
              公開アプリへのご質問、不具合のご報告、Gariton Labへのお問い合わせを受け付けています。受託開発のご依頼は承っていません。
            </Text>
            {sent === "1" && (
              <Alert color="gariton" variant="light" icon={<IconCheck size={18} />}>
                お問い合わせを受け付けました。
              </Alert>
            )}
            {error === "1" && (
              <Alert color="red" variant="light">
                入力内容を確認してください。
              </Alert>
            )}
            {error === "rate" && <Alert color="orange" variant="light">短時間に複数回送信されています。しばらくしてからお試しください。</Alert>}
            <Text size="sm" c="dimmed">メールでもお問い合わせいただけます：contact@gariton.site</Text>
          </Stack>

          <Paper p={{ base: "lg", sm: "xl" }} className="soft-card">
            <ContactForm apps={apps.map(({ id, name }) => ({ id, name }))} selectedAppId={selectedAppId} />
          </Paper>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
