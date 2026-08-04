import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "gariton",
  defaultRadius: "md",
  fontFamily:
    "var(--font-gariton), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: {
    fontFamily:
      "var(--font-gariton), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontWeight: "600"
  },
  colors: {
    gariton: [
      "#fff0eb",
      "#ffdcd2",
      "#f5b7a8",
      "#ec907c",
      "#e36d54",
      "#dc4b2a",
      "#c84225",
      "#aa361e",
      "#8c2b18",
      "#692012"
    ]
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
