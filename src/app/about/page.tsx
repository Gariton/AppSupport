import type { Metadata } from "next";
import { Box, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";

export const metadata: Metadata = {
  title: "Gariton Labについて",
  description: "スマホアプリとWebアプリをつくる個人スタジオ、Gariton Labについて。"
};

export default function AboutPage() {
  return (
    <Box component="main">
      <Container size="lg" py={{ base: 72, sm: 104 }}>
        <Text className="eyebrow" mb={26}>ABOUT GARITON LAB</Text>
        <Title order={1} size="clamp(3rem, 8vw, 5.8rem)" lh={1.03} className="hero-title">
          小さく、確かに、<br />長く使えるものを。
        </Title>
      </Container>

      <Box className="product-band">
        <Container size="lg" py={{ base: 64, sm: 88 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 40, md: 88 }}>
            <div>
              <Text className="eyebrow" mb="md">STUDIO</Text>
              <Title order={2} size="clamp(2rem, 4vw, 2.8rem)" lh={1.2}>日常の不便から、<br />プロダクトをつくる。</Title>
            </div>
            <Stack gap="lg">
              <Text size="lg" className="muted-copy">
                Gariton Labは、日常の小さな不便を解決するスマホアプリとWebアプリを、企画から設計、開発、運営まで一貫して手がける個人スタジオです。
              </Text>
              <Text className="muted-copy">
                機能を増やすことよりも、必要な操作をわかりやすくすること。公開して終わりにせず、使う人の声を受け取りながら、長く役立つプロダクトへ育てることを大切にしています。
              </Text>
              <Text className="muted-copy">受託開発は行っていません。</Text>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      <Container size="lg" py={{ base: 72, sm: 104 }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 40, md: 88 }}>
          <div>
            <Text className="eyebrow" mb="md">OPERATOR</Text>
            <Title order={2} size="clamp(2rem, 4vw, 2.8rem)">Jumpei Oyama</Title>
          </div>
          <Stack gap={0} className="profile-list">
            <ProfileRow label="Studio" value="Gariton Lab" />
            <ProfileRow label="Based in" value="Japan" />
            <ProfileRow label="Focus" value="Mobile apps / Web apps" />
            <ProfileRow label="Contact" value="contact@gariton.site" href="mailto:contact@gariton.site" />
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function ProfileRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <Group justify="space-between" gap="lg" className="profile-row">
      <Text size="sm" c="dimmed">{label}</Text>
      <Text component={href ? "a" : "span"} href={href} fw={650}>{value}</Text>
    </Group>
  );
}
