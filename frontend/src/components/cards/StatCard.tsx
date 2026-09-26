import type { ReactNode } from "react";

import { Box, Stack, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  accent?: "violet" | "pink" | "cyan" | "green";
}

const accentMap = {
  violet: {
    color: "#6D5BD0",
    background: "#F0EDFC",
  },
  pink: {
    color: "#B95382",
    background: "#FAEDF3",
  },
  cyan: {
    color: "#1687A7",
    background: "#ECF7FA",
  },
  green: {
    color: "#2F8F5B",
    background: "#EDF8F1",
  },
};

export function StatCard({
  label,
  value,
  icon,
  description,
  accent = "violet",
}: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <Box
      sx={{
        width: "100%",
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {label}
          </Typography>

          {icon && (
            <Box
              sx={{
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                color: colors.color,
                backgroundColor: colors.background,
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>

        <Typography
          sx={{
            fontSize: {
              xs: 28,
              md: 32,
            },
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>

        {description && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {description}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}