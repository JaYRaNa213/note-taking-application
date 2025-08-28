"use client";
import React from "react";
import Button from "@mui/material/Button";

interface AppButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "success" | "warning" | "info";
  fullWidth?: boolean;
  disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "contained",
  color = "primary",
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{ borderRadius: 2, textTransform: "none", fontSize: "1rem" }}
    >
      {children}
    </Button>
  );
};

export default AppButton;
