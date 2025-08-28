import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import OTPVerify from './pages/OTPVerify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { setAuthToken } from './api/api';
import { getToken } from './utils/auth';

const token = getToken();
setAuthToken(token || undefined);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
