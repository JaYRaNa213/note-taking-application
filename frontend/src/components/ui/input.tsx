"use client";
import React from "react";
import TextField from "@mui/material/TextField";

interface AppInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  fullWidth = true,
  error = false,
  helperText,
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      fullWidth={fullWidth}
      error={error}
      helperText={helperText}
      margin="normal"
      variant="outlined"
    />
  );
};

export default AppInput;
