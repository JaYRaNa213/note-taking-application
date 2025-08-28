import { Router } from 'express';
import { requestOtp, verifyOtp, googleCallback } from '../controllers/auth.controller';
import { register, login } from "../controllers/auth.controller"; // add



const router = Router();

// New Register & Login
router.post("/register", register);
router.post("/login", login);


router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);

router.post('/google', googleCallback); // frontend sends id_token
export default router;
