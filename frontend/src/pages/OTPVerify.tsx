import { useState } from "react";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import { setToken, setUser } from "../utils/auth";

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
      // success message
      setError("OTP resent (check your email)");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">OTP Verification</h2>

        <Input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <Button onClick={handleVerify} disabled={loading} className="w-full mt-4">
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
