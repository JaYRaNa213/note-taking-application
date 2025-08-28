import { Schema, model } from 'mongoose';

export interface IUser {
  email: string;
  name?: string;
  googleId?: string;
  createdAt?: Date;
  otp?: { codeHash: string; expiresAt: Date } | null;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  googleId: { type: String },
  otp: {
    type: { codeHash: String, expiresAt: Date },
    default: null
  },
  createdAt: { type: Date, default: Date.now }
});

export default model<IUser>('User', userSchema);
