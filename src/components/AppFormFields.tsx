import { Checkbox, InputWrapper, Text, TextInput, Textarea } from "@mantine/core";
import type { AppRecord } from "@/lib/types";

export function AppFormFields({ app }: { app?: AppRecord }) {
  return (
    <>
      <TextInput name="name" label="アプリ名" required placeholder="My iOS App" defaultValue={app?.name} />
      <TextInput name="slug" label="URL スラッグ" required placeholder="my-ios-app" defaultValue={app?.slug} />
      <TextInput
        name="appStoreUrl"
        label="App Store URL"
        type="url"
        placeholder="https://apps.apple.com/..."
        defaultValue={app?.appStoreUrl}
      />
      <Checkbox
        name="hasInAppPurchases"
        value="1"
        label="アプリ内課金あり"
        defaultChecked={app?.hasInAppPurchases}
      />
      <TextInput
        name="supportedLanguages"
        label="対応言語"
        description="カンマまたは読点区切りで入力してください。"
        placeholder="日本語, English"
        defaultValue={app?.supportedLanguages.join(", ")}
      />
      <InputWrapper label={app?.iconImageUrl ? "アイコン画像を変更" : "アイコン画像"}>
        <input name="iconFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="file-input" />
      </InputWrapper>
      <Text size="sm" c="dimmed">
        PNG、JPEG、WebP、GIF に対応しています。ファイルサイズは 2MB 以下にしてください。
        {app?.iconImageUrl ? " 新しい画像を選択しない場合、現在のアイコンを維持します。" : ""}
      </Text>
      <TextInput
        name="supportEmail"
        label="サポートメール"
        type="email"
        required
        placeholder="support@example.com"
        defaultValue={app?.supportEmail}
      />
      <Textarea
        name="description"
        label="説明（Markdown）"
        minRows={5}
        autosize
        required
        placeholder="**太字**、箇条書き、リンクなどを利用できます。"
        defaultValue={app?.description}
      />
    </>
  );
}
