import type { ReactNode } from "react";

import { Box, Stack, Typography } from "@mui/material";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="flex-end"
      sx={{
        mb: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: {
              xs: 20,
              md: 24,
            },
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {action && (
        <Box sx={{ flexShrink: 0 }}>
          {action}
        </Box>
      )}
    </Stack>
  );
}