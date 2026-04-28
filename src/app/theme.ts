import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "teal",
  defaultRadius: "md",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontWeight: "760"
  },
  components: {
    Button: {
      defaultProps: {
        radius: "md"
      }
    },
    Paper: {
      defaultProps: {
        radius: "md"
      }
    },
    TextInput: {
      defaultProps: {
        radius: "md"
      }
    },
    PasswordInput: {
      defaultProps: {
        radius: "md"
      }
    },
    Textarea: {
      defaultProps: {
        radius: "md"
      }
    },
    NativeSelect: {
      defaultProps: {
        radius: "md"
      }
    }
  }
});
