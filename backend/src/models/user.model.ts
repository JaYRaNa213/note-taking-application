import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  otp?: {
    codeHash: string;
    expiresAt: Date;
  } | null;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    otp: {
      codeHash: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
