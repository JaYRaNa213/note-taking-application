import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/api";
import { setToken, setUser } from "../utils/auth";

interface Props {
  onSuccess?: () => void;
}

const GoogleSignInButton: React.FC<Props> = ({ onSuccess }) => {
  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) {
        console.error("No Google credential received");
        return;
      }
      const res = await api.post("/auth/google", { id_token });
      if (res?.data?.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        if (onSuccess) onSuccess();
      } else {
        console.error("Unexpected response from /auth/google", res.data);
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed");
    }
  };

  const handleLoginError = () => {
    console.error("Google login failed (client)");
    alert("Google login failed");
  };

  return <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />;
};

export default GoogleSignInButton;
