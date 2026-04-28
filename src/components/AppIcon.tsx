import { Avatar, ThemeIcon } from "@mantine/core";
import { IconBrandApple } from "@tabler/icons-react";

type AppIconProps = {
  name: string;
  src?: string;
  size?: number;
};

export function AppIcon({ name, src, size = 56 }: AppIconProps) {
  const radius = Math.max(8, Math.round(size * 0.22));

  if (src) {
    return <Avatar src={src} alt={`${name} icon`} size={size} radius={radius} className="app-icon-image" />;
  }

  return (
    <ThemeIcon size={size} radius={radius} color="teal" variant="light">
      <IconBrandApple size={Math.round(size * 0.55)} stroke={1.8} />
    </ThemeIcon>
  );
}
