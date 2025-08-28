import { Router, Response } from "express";
import { requestOtp, verifyOtp, googleCallback, register, login } from "../controllers/auth.controller";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import { IUser } from "../models/user.model"; // ✅ import IUser from user model

const router = Router();

// GET /auth/me
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user as IUser | undefined;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove sensitive fields
    const { password, otp, googleId, ...userWithoutSensitive } = user;

    res.json({ user: userWithoutSensitive });
  } catch (error) {
    console.error("Error in /auth/me:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// New Register & Login
router.post("/register", register);
router.post("/login", login);

router.post("/otp/request", requestOtp);
router.post("/otp/verify", verifyOtp);
router.post("/google", googleCallback);

export default router;
