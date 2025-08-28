import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { sendOTPEmail } from '../utils/mailer';
import { signToken } from '../utils/jwt';
import env from '../config/env';
import { OAuth2Client } from 'google-auth-library';

const otpExpiryMinutes = 10;

export async function requestOtp(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  // generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const codeHash = await bcrypt.hash(otp, salt);
  const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);

  // upsert user
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { otp: { codeHash, expiresAt } } },
    { upsert: true, new: true }
  );
  try {
    await sendOTPEmail(email, otp);
  } catch (e) {
    console.error('email send err', e);
    return res.status(500).json({ message: 'Failed to send OTP email' });
  }
  return res.json({ message: 'OTP sent' });
}

export async function verifyOtp(req: Request, res: Response) {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
  const user = await User.findOne({ email });
  if (!user || !user.otp) return res.status(400).json({ message: 'No OTP requested' });
  if (user.otp.expiresAt < new Date()) {
    user.otp = null;
    await user.save();
    return res.status(400).json({ message: 'OTP expired. Request a new one.' });
  }
  const match = await bcrypt.compare(otp, user.otp.codeHash);
  if (!match) return res.status(400).json({ message: 'Invalid OTP' });

  user.otp = null;
  await user.save();

  // issue JWT
  const token = signToken({ id: user._id, email: user.email });
  return res.json({ token, user: { email: user.email, name: user.name, id: user._id } });
}

export async function googleCallback(req: Request, res: Response) {
  // expects id_token from frontend
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ message: 'id_token required' });

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload?.email;
    const googleId = payload?.sub;
    const name = payload?.name;
    if (!email) return res.status(400).json({ message: 'Google account missing email' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, googleId });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.name) user.name = name;
      await user.save();
    }
    const token = signToken({ id: user._id, email: user.email });
    return res.json({ token, user: { email: user.email, name: user.name, id: user._id } });
  } catch (err) {
    console.error('google verify error', err);
    return res.status(400).json({ message: 'Google token verification failed' });
  }
}
