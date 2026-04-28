import { Box, Button, Container, Paper, Stack, Text, Title } from "@mantine/core";

export default function NotFound() {
  return (
    <Box component="main" className="page-section">
      <Container size="sm">
        <Paper p="xl" className="soft-card">
          <Stack gap="md">
            <Text c="teal" fw={800} size="sm">
              404
            </Text>
            <Title order={1}>ページが見つかりません</Title>
            <Text c="dimmed">URL を確認してください。</Text>
            <Button component="a" href="/" w="fit-content">
              トップへ戻る
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
