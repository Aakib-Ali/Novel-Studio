import type { ReactNode } from "react";

import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

interface SuccessStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SuccessState({
  title,
  description,
  action,
}: SuccessStateProps) {
  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 3, md: 4 },
        border: "1px solid",
        borderColor: "rgba(34, 197, 94, 0.20)",
        borderRadius: 2,
        backgroundColor: "rgba(34, 197, 94, 0.035)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            backgroundColor: "rgba(34, 197, 94, 0.09)",
            color: "#22C55E",
            fontWeight: 700,
          }}
        >
          ✓
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">
            {title}
          </Typography>

          {description && (
            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {action && (
          <Box>
            {action}
          </Box>
        )}
      </Stack>
    </Box>
  );
}