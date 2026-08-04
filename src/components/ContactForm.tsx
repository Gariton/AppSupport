"use client";

import { Button, Group, NativeSelect, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { IconMail, IconSend } from "@tabler/icons-react";
import { useState } from "react";

type AppOption = { id: string; name: string };

export function ContactForm({ apps, selectedAppId = "" }: { apps: AppOption[]; selectedAppId?: string }) {
  const [category, setCategory] = useState(selectedAppId ? "app-support" : "general");
  const needsApp = category === "app-support" || category === "bug-report";

  return (
    <form action="/contact/submit" method="post">
      <Stack gap="md">
      <NativeSelect
        name="category"
        label="お問い合わせ種別"
        required
        value={category}
        onChange={(event) => setCategory(event.currentTarget.value)}
        data={[
          { label: "アプリについて", value: "app-support" },
          { label: "不具合報告", value: "bug-report" },
          { label: "その他", value: "general" }
        ]}
      />
      {needsApp && (
        <NativeSelect
          name="appId"
          label="対象アプリ"
          required
          defaultValue={selectedAppId}
          data={[
            { label: "選択してください", value: "", disabled: true },
            ...apps.map((item) => ({ label: item.name, value: item.id }))
          ]}
        />
      )}
      <TextInput name="name" label="お名前" autoComplete="name" maxLength={100} required />
      <TextInput
        name="email"
        label="メールアドレス"
        type="email"
        autoComplete="email"
        maxLength={254}
        required
        leftSection={<IconMail size={16} />}
      />
      <Textarea name="message" label="お問い合わせ内容" minRows={7} maxLength={5000} autosize required />
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="website">Webサイト</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <Text size="xs" c="dimmed" lh={1.7}>
        送信された情報は、お問い合わせへの対応にのみ使用します。内容を確認のうえ、必要に応じて返信します。
      </Text>
      <Group justify="flex-end">
        <Button type="submit" color="dark" className="gar-button" rightSection={<IconSend size={17} />}>
          送信する
        </Button>
      </Group>
      </Stack>
    </form>
  );
}
