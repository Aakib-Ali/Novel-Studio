import type { ReactNode } from "react";

import { Box, Stack, Typography } from "@mui/material";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 2, md: 3 }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "flex-end" }}
      sx={{
        width: "100%",
        mb: { xs: 2.5, md: 3.5 },
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        {eyebrow && (
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              color: "primary.main",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 0.75,

              "&::before": {
                content: '\"\"',
                width: 16,
                height: 1,
                backgroundColor: "primary.main",
                opacity: 0.55,
              },
            }}
          >
            {eyebrow}
          </Typography>
        )}

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 30, sm: 33, md: 36 },
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
              maxWidth: 680,
              fontSize: { xs: 14, md: 15 },
              lineHeight: 1.55,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {actions && (
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "auto" },
          }}
        >
          {actions}
        </Box>
      )}
    </Stack>
  );
}
