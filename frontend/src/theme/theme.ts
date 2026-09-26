import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    muted: string;
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",

    background: {
      default: "#F7F6F3",
      paper: "#FFFFFF",
    },

    primary: {
      main: "#6D5BD0",
      light: "#8B7BE0",
      dark: "#5847BD",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#C95F8F",
      contrastText: "#FFFFFF",
    },

    info: {
      main: "#1687A7",
    },

    success: {
      main: "#2F8F5B",
    },

    warning: {
      main: "#B7791F",
    },

    error: {
      main: "#C94A4A",
    },

    text: {
      primary: "#25222B",
      secondary: "#6E6877",
      muted: "#948E9B",
      disabled: "#B8B2BC",
    },

    divider: "#E6E2E8",

    action: {
      hover: "rgba(37, 34, 43, 0.045)",
      selected: "rgba(109, 91, 208, 0.09)",
      disabledBackground: "#EFEDF0",
    },
  },

  typography: {
    fontFamily:
      'Inter, "Noto Sans Devanagari", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: {
      fontSize: "36px",
      lineHeight: 1.18,
      fontWeight: 700,
      letterSpacing: "-0.035em",
    },

    h2: {
      fontSize: "30px",
      lineHeight: 1.25,
      fontWeight: 650,
      letterSpacing: "-0.03em",
    },

    h3: {
      fontSize: "23px",
      lineHeight: 1.33,
      fontWeight: 650,
      letterSpacing: "-0.025em",
    },

    h4: {
      fontSize: "19px",
      lineHeight: 1.4,
      fontWeight: 650,
    },

    body1: {
      fontSize: "16px",
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "14px",
      lineHeight: 1.55,
    },

    caption: {
      fontSize: "12px",
      lineHeight: 1.5,
    },

    button: {
      fontSize: "14px",
      fontWeight: 600,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },

  spacing: 8,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F7F6F3",
          color: "#25222B",
        },

        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "#CFC9D3 #F7F6F3",
        },

        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },

        "*::-webkit-scrollbar-track": {
          background: "#F7F6F3",
        },

        "*::-webkit-scrollbar-thumb": {
          background: "#CFC9D3",
          borderRadius: "999px",
        },

        "*::-webkit-scrollbar-thumb:hover": {
          background: "#B7B0BC",
        },

        "::selection": {
          backgroundColor: "rgba(109, 91, 208, 0.18)",
          color: "#25222B",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 10,
          paddingLeft: 16,
          paddingRight: 16,
          transition:
            "background-color 160ms ease, border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease",
        },

        containedPrimary: {
          backgroundColor: "#6D5BD0",
          boxShadow: "0 4px 12px rgba(78, 61, 166, 0.14)",

          "&:hover": {
            backgroundColor: "#5847BD",
            transform: "translateY(-1px)",
            boxShadow: "0 7px 18px rgba(78, 61, 166, 0.18)",
          },

          "&:active": {
            transform: "translateY(0)",
          },
        },

        outlined: {
          borderColor: "#DCD7E0",
          color: "#3A3542",

          "&:hover": {
            borderColor: "#BEB6C8",
            backgroundColor: "#FAF9FB",
          },
        },

        text: {
          "&:hover": {
            backgroundColor: "rgba(37, 34, 43, 0.045)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6E2E8",
          borderRadius: 14,
          backgroundImage: "none",
          boxShadow: "0 1px 2px rgba(37, 34, 43, 0.02)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },

        rounded: {
          borderRadius: 14,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "medium",
      },

      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            minHeight: 46,
            backgroundColor: "#FFFFFF",
            borderRadius: 10,

            "& fieldset": {
              borderColor: "#DCD7E0",
            },

            "&:hover fieldset": {
              borderColor: "#BEB6C8",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#6D5BD0",
              boxShadow: "0 0 0 3px rgba(109, 91, 208, 0.10)",
            },
          },

          "& .MuiInputLabel-root": {
            color: "#7D7685",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6D5BD0",
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#6E6877",
          "&:hover": {
            backgroundColor: "rgba(37, 34, 43, 0.045)",
            color: "#25222B",
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#2F2A35",
          color: "#FFFFFF",
          fontSize: "12px",
          boxShadow: "0 8px 24px rgba(37, 34, 43, 0.14)",
        },
      },
    },
  },
});
