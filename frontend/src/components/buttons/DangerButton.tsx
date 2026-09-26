import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";

export function DangerButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="contained"
      color="error"
      {...props}
    >
      {children}
    </Button>
  );
}