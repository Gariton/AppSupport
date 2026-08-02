import { Avatar, Box, ThemeIcon } from "@mantine/core";

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
    <ThemeIcon size={size} radius={radius} className="app-icon-fallback" variant="filled">
      <Box component="span" fz={Math.round(size * 0.36)} fw={800}>
        {name.trim().charAt(0) || "G"}
      </Box>
    </ThemeIcon>
  );
}
