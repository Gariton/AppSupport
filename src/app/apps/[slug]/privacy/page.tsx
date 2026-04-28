import { notFound } from "next/navigation";
import { Badge, Box, Button, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import { getAppBySlug, getPolicy, listPolicies, readPolicyMarkdown } from "@/lib/store";
import { markdownToHtml } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export default async function PrivacyPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const app = await getAppBySlug(slug);
  if (!app) notFound();

  const policies = await listPolicies(app.id);
  const selectedLocale = lang || policies[0]?.locale || "ja";
  const policy = await getPolicy(app.id, selectedLocale);
  if (!policy) notFound();

  const markdown = await readPolicyMarkdown(policy);

  return (
    <Box component="main" className="page-section">
      <Container size="md">
        <Stack gap="lg">
          <Group justify="space-between" align="flex-end" gap="md">
            <div>
              <Badge color="teal" variant="light" leftSection={<IconFileText size={14} />}>
                {app.name}
              </Badge>
              <Title order={1} mt="sm" size="clamp(2.2rem, 5vw, 4rem)" lh={1}>
                Privacy Policy
              </Title>
              <Text c="dimmed" mt="xs">
                Last updated: {new Date(policy.updatedAt).toLocaleDateString("ja-JP")}
              </Text>
            </div>
            <Group gap="xs">
              {policies.map((item) => (
                <Button
                  component="a"
                  href={`/apps/${app.slug}/privacy?lang=${item.locale}`}
                  key={item.id}
                  variant={item.locale === selectedLocale ? "filled" : "default"}
                >
                  {item.locale.toUpperCase()}
                </Button>
              ))}
            </Group>
          </Group>
          <Paper p={{ base: "lg", sm: "xl" }} className="soft-card policy-content">
            <article dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }} />
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
