import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import { setToken, setUser } from "../utils/auth";
import AppButton from "../components/ui/button";
import AppInput from "../components/ui/input";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Link,
} from "@mui/material";

const OTPVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from Signup via navigate state
  const state: any = location.state;
  const email: string | undefined = state?.email;

  const handleVerify = async () => {
    if (!otp || !email) {
      setError("Please enter OTP and make sure email is provided");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/otp/verify", { email, otp });
      if (res.data?.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        navigate("/dashboard");
      } else {
        setError(res.data?.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email missing, go back and request OTP again");
      return;
    }
    setResendLoading(true);
    setError("");

    try {
      await api.post("/auth/otp/request", { email });
      setError("✅ OTP resent (check your email)");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 10,
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          OTP Verification
        </Typography>

        <AppInput
          label="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          type="text"
          placeholder="123456"
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 3 }}>
          <AppButton onClick={handleVerify} disabled={loading} fullWidth>
            {loading ? <CircularProgress size={22} /> : "Verify OTP"}
          </AppButton>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Link
            component="button"
            onClick={handleResend}
            disabled={resendLoading}
            sx={{ fontSize: "0.9rem" }}
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default OTPVerify;
