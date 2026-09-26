import { Box, Skeleton, Stack, Typography } from "@mui/material";

interface LoadingStateProps {
  title?: string;
  description?: string;
  rows?: number;
}

export function LoadingState({
  title = "Loading",
  description = "We're getting everything ready.",
  rows = 3,
}: LoadingStateProps) {
  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 3 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Skeleton
            variant="text"
            width={160}
            height={28}
          />

          <Typography
            sx={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={56}
              animation="wave"
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}