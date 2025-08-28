import { Router } from 'express';
import { requestOtp, verifyOtp, googleCallback } from '../controllers/auth.controller';

const router = Router();
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);
router.post('/google', googleCallback); // frontend sends id_token
export default router;
