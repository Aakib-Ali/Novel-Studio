import type { ReactNode } from "react";

import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete this request. Please try again.",
  action,
}: ErrorStateProps) {
  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 3, md: 4 },
        border: "1px solid",
        borderColor: "rgba(239, 68, 68, 0.22)",
        borderRadius: 2,
        backgroundColor: "rgba(239, 68, 68, 0.035)",
      }}
    >
      <Stack
        spacing={1.5}
        alignItems="flex-start"
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.09)",
            color: "#EF4444",
            fontWeight: 700,
          }}
        >
          !
        </Box>

        <Typography variant="h4">
          {title}
        </Typography>

        <Typography color="text.secondary">
          {description}
        </Typography>

        {action && (
          <Box sx={{ pt: 0.5 }}>
            {action}
          </Box>
        )}
      </Stack>
    </Box>
  );
}