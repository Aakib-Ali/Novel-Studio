import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";

export function GhostButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="text"
      color="inherit"
      {...props}
      sx={{
        color: "text.secondary",
        "&:hover": {
          color: "text.primary",
          backgroundColor: "rgba(37, 34, 43, 0.045)",
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
