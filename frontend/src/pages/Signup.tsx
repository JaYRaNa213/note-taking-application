import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async () => {
    setError(null);
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email");
    setLoading(true);
    try {
      // backend expects { email }
      await api.post("/auth/otp/request", { email });
      // navigate to OTP verify and pass email
      navigate("/otp-verify", { state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Sign up / Login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={requestOtp} disabled={loading}>
          {loading ? "Requesting..." : "Request OTP"}
        </Button>

        <Typography align="center" sx={{ mt: 1 }}>
          Or
        </Typography>

        <GoogleSignInButton onSuccess={() => navigate("/dashboard")} />
      </Box>
    </Container>
  );
}
