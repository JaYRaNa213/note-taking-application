import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import jwt_decode from 'jwt-decode';
import { api } from '../api/api';
import { saveToken } from '../utils/auth';
import { setAuthToken } from '../api/api';

export default function GoogleSignInButton() {
  // This uses the newer Google Identity Services approach.
  const onGoogleSuccess = async (id_token: string) => {
    try {
      const res = await api.post('/auth/google', { id_token });
      const token = res.data.token;
      saveToken(token);
      setAuthToken(token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Google login failed');
    }
  };

  const startGoogleFlow = async () => {
    // Open Google popup using new Google Identity Services library
    // For simplicity, we will open a window to get id_token via popup
    // NOTE: In production integrate with Google's client library properly.
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    // A simple approach: open a new tab with Google's OAuth endpoint and ask backend to finish flow
    // But here frontend-based id_token retrieval is recommended - use gsi client in production.
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=token%20id_token&scope=openid%20email%20profile&redirect_uri=${window.location.origin}/oauth-callback`;
    window.location.href = url;
  };

  return (
    <Button variant="outlined" startIcon={<GoogleIcon />} onClick={startGoogleFlow}>
      Sign in with Google
    </Button>
  );
}
