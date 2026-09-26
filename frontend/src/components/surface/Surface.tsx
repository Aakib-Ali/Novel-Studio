import type { ReactNode } from "react";

import { Box, type SxProps, type Theme } from "@mui/material";

interface SurfaceProps {
  children: ReactNode;
  padding?: number;
  hover?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export function Surface({
  children,
  padding = 3,
  hover = false,
  onClick,
  sx,
}: SurfaceProps) {
  return (
    <Box
      onClick={onClick}
      sx={[
        {
          width: "100%",
          p: padding,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "background.paper",
          boxShadow: "0 1px 2px rgba(37, 34, 43, 0.02)",
          transition:
            "transform 160ms ease, border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
          ...(hover && {
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-2px)",
              borderColor: "rgba(109, 91, 208, 0.24)",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 10px 28px rgba(37, 34, 43, 0.07)",
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
