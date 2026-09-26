import { Box, Typography } from "@mui/material";

export type StatusType =
  | "draft"
  | "queued"
  | "processing"
  | "translating"
  | "review"
  | "approved"
  | "audio-ready"
  | "failed"
  | "cancelled"
  | "restricted"
  | "blocked";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<
  StatusType,
  { label: string; color: string; background: string; border: string; icon: string }
> = {
  draft: {
    label: "Draft",
    color: "#625C69",
    background: "#F3F1F4",
    border: "#E1DDE4",
    icon: "○",
  },
  queued: {
    label: "Queued",
    color: "#625C69",
    background: "#F3F1F4",
    border: "#E1DDE4",
    icon: "◷",
  },
  processing: {
    label: "Processing",
    color: "#5947B7",
    background: "#F0EDFC",
    border: "#DCD5F7",
    icon: "◌",
  },
  translating: {
    label: "Translating",
    color: "#5947B7",
    background: "#F0EDFC",
    border: "#DCD5F7",
    icon: "✦",
  },
  review: {
    label: "Review Required",
    color: "#8A5B14",
    background: "#FFF7E8",
    border: "#F0D9AA",
    icon: "!",
  },
  approved: {
    label: "Approved",
    color: "#267448",
    background: "#EDF8F1",
    border: "#CDE8D7",
    icon: "✓",
  },
  "audio-ready": {
    label: "Audio Ready",
    color: "#146E87",
    background: "#ECF7FA",
    border: "#C9E5EC",
    icon: "▶",
  },
  failed: {
    label: "Failed",
    color: "#A43D3D",
    background: "#FDF0F0",
    border: "#F2CCCC",
    icon: "!",
  },
  cancelled: {
    label: "Cancelled",
    color: "#625C69",
    background: "#F3F1F4",
    border: "#E1DDE4",
    icon: "×",
  },
  restricted: {
    label: "Restricted",
    color: "#8A5B14",
    background: "#FFF7E8",
    border: "#F0D9AA",
    icon: "🔒",
  },
  blocked: {
    label: "Blocked",
    color: "#A43D3D",
    background: "#FDF0F0",
    border: "#F2CCCC",
    icon: "!",
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Box
      component="span"
      sx={{
        minHeight: 25,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.55,
        px: 0.9,
        borderRadius: "999px",
        backgroundColor: config.background,
        border: `1px solid ${config.border}`,
        color: config.color,
      }}
    >
      <Typography
        component="span"
        sx={{ fontSize: 10, lineHeight: 1, fontWeight: 700 }}
      >
        {config.icon}
      </Typography>

      <Typography
        component="span"
        sx={{ fontSize: 11, lineHeight: 1, fontWeight: 600 }}
      >
        {label ?? config.label}
      </Typography>
    </Box>
  );
}
