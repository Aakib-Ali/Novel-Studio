import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

import { ProgressBar } from "../progress/ProgressBar";
import {
  StatusBadge,
  type StatusType,
} from "../status/StatusBadge";

interface JobCardProps {
  title: string;
  type: string;
  status: StatusType;
  progress?: number;
  current?: number;
  total?: number;
  description?: string;
  onClick?: () => void;
}

const statusIcons = {
  processing: PlayCircleOutlineRoundedIcon,
  translating: PlayCircleOutlineRoundedIcon,
  queued: HourglassEmptyRoundedIcon,
  approved: CheckCircleOutlineRoundedIcon,
  "audio-ready": CheckCircleOutlineRoundedIcon,
  failed: ErrorOutlineRoundedIcon,
};

export function JobCard({
  title,
  type,
  status,
  progress = 0,
  current,
  total,
  description,
  onClick,
}: JobCardProps) {
  const Icon =
    statusIcons[status as keyof typeof statusIcons] ??
    HourglassEmptyRoundedIcon;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: "100%",
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
        cursor: onClick ? "pointer" : "default",
        transition:
          "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",

        ...(onClick && {
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor:
              "rgba(109, 91, 208, 0.24)",
            boxShadow:
              "0 10px 28px rgba(37, 34, 43, 0.07)",
          },
        }),
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              color:
                status === "failed"
                  ? "#C94A4A"
                  : "#6D5BD0",
              backgroundColor:
                status === "failed"
                  ? "#FDF0F0"
                  : "#F0EDFC",
            }}
          >
            <Icon fontSize="small" />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {type}
            </Typography>
          </Box>

          <StatusBadge status={status} />
        </Stack>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        )}

        {progress > 0 && (
          <Stack spacing={0.75}>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Progress
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {current !== undefined &&
                total !== undefined
                  ? `${current}/${total}`
                  : `${progress}%`}
              </Typography>
            </Stack>

            <ProgressBar value={progress} />
          </Stack>
        )}
      </Stack>
    </Box>
  );
}