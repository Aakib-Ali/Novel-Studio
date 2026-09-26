import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";

export function AIButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        color: "#FFFFFF",
        background:
          "linear-gradient(110deg, #8B5CF6 0%, #EC4899 100%)",
        "&:hover": {
          background:
            "linear-gradient(110deg, #9B6BFF 0%, #F05AA4 100%)",
          transform: "translateY(-1px)",
          boxShadow: "0 8px 24px rgba(139, 92, 246, 0.18)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}