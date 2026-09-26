import type { ReactNode } from "react";

import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

interface PartialStateProps {
  title: string;
  description: string;
  successCount?: number;
  warningCount?: number;
  action?: ReactNode;
}

export function PartialState({
  title,
  description,
  successCount,
  warningCount,
  action,
}: PartialStateProps) {
  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 3, md: 4 },
        border: "1px solid",
        borderColor: "rgba(245, 158, 11, 0.20)",
        borderRadius: 2,
        backgroundColor: "rgba(245, 158, 11, 0.035)",
      }}
    >
      <Stack spacing={2}>
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
              backgroundColor: "rgba(245, 158, 11, 0.09)",
              color: "#F59E0B",
              fontWeight: 700,
            }}
          >
            !
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">
              {title}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {description}
            </Typography>
          </Box>

          {action && (
            <Box>
              {action}
            </Box>
          )}
        </Stack>

        {(successCount !== undefined ||
          warningCount !== undefined) && (
          <Stack
            direction="row"
            spacing={3}
            flexWrap="wrap"
            useFlexGap
          >
            {successCount !== undefined && (
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
              >
                <Box
                  component="span"
                  sx={{
                    color: "#22C55E",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {successCount} completed
                </Typography>
              </Stack>
            )}

            {warningCount !== undefined && (
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
              >
                <Box
                  component="span"
                  sx={{
                    color: "#F59E0B",
                    fontWeight: 700,
                  }}
                >
                  !
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {warningCount} need attention
                </Typography>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}