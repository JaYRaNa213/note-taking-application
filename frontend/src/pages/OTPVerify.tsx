import { useState } from "react";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTPVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/auth/otp/verify", { otp });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/auth/otp/request");

      if (!res.data.success) {
        setError(res.data.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          OTP Verification
        </h2>

        <Input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          
          className="text-center text-lg tracking-widest"
        />

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        <Button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-4"
        >
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
