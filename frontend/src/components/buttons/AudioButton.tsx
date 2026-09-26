import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";

export function AudioButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="outlined"
      {...props}
      sx={{
        color: "#146E87",
        borderColor: "#BBDDE5",
        backgroundColor: "#F3FAFB",
        "&:hover": {
          color: "#105D72",
          borderColor: "#91CAD6",
          backgroundColor: "#EAF6F8",
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
