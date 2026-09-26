import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";

export function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      {...props}
    >
      {children}
    </Button>
  );
}