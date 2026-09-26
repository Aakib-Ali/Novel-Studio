import { Box } from "@mui/material";

interface ProgressBarProps {
  value: number;
  color?: "primary" | "success" | "audio";
  height?: number;
}

export function ProgressBar({
  value,
  color = "primary",
  height = 5,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const background =
    color === "success"
      ? "#2F8F5B"
      : color === "audio"
        ? "#1687A7"
        : "#6D5BD0";

  return (
    <Box
      sx={{
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: "999px",
        backgroundColor: "#ECE8EF",
      }}
    >
      <Box
        sx={{
          width: `${clampedValue}%`,
          height: "100%",
          borderRadius: "inherit",
          background,
          transition: "width 320ms ease-out",
        }}
      />
    </Box>
  );
}
