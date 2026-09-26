import type { ReactNode } from "react";

import { Box,  Stack, Typography } from "@mui/material";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 3, md: 5 },
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
        textAlign: "center",
      }}
    >
      <Stack
        spacing={1.5}
        alignItems="center"
        sx={{
          maxWidth: 500,
        }}
      >
        {icon && (
          <Box
            sx={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              backgroundColor: "rgba(139, 92, 246, 0.09)",
              color: "primary.main",
              mb: 1,
            }}
          >
            {icon}
          </Box>
        )}

        <Typography variant="h4">
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 440,
          }}
        >
          {description}
        </Typography>

        {action && (
          <Box sx={{ pt: 1 }}>
            {action}
          </Box>
        )}
      </Stack>
    </Box>
  );
}