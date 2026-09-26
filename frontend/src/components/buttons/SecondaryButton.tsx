import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";

export function SecondaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="outlined"
      color="inherit"
      {...props}
      sx={{
        borderColor: "divider",
        color: "text.primary",
        backgroundColor: "background.paper",
        "&:hover": {
          borderColor: "#BEB6C8",
          backgroundColor: "#FAF9FB",
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
