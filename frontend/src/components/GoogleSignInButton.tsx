import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import api from "../api/api";
import { setToken, setUser } from "../utils/auth";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

interface Props {
  onSuccess?: () => void;
}

const GoogleSignInButton: React.FC<Props> = ({ onSuccess }) => {
  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        console.error("No credential received from Google");
        return;
      }

      // Send Google token (id_token) to backend
      const res = await api.post("/auth/google", {
        id_token: credentialResponse.credential,
      });

      setToken(res.data.token);
      setUser(res.data.user);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleLoginError = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignInButton;
