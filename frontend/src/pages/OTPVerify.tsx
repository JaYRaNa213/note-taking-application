import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import { api } from '../api/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';
import { setAuthToken } from '../api/api';

export default function OTPVerify() {
  const loc = useLocation();
  const emailFromState = (loc.state as any)?.email || '';
  const [email] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const verify = async () => {
    setError(null);
    if (!otp) return setError('Enter OTP');
    try {
      const res = await api.post('/auth/otp/verify', { email, otp });
      const { token } = res.data;
      saveToken(token);
      setAuthToken(token);
      nav('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'OTP verify failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 6 }}>
      <Typography variant="h5">Verify OTP</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography sx={{ mt: 2 }}>OTP sent to {email}</Typography>
      <TextField label="OTP" value={otp} onChange={e => setOtp(e.target.value)} sx={{ mt: 2 }} />
      <Button variant="contained" onClick={verify} sx={{ mt: 2 }}>Verify</Button>
    </Container>
  );
}
