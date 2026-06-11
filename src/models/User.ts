import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  tier: 'free' | 'starter' | 'pro' | 'enterprise';
  onboardingComplete: boolean;
  targetMargin: number;
  tradeType: string;
  businessName: string;
  state: string;
  staffCount: string;
  xeroAccessToken?: string;
  xeroRefreshToken?: string;
  xeroTenantId?: string;
  xeroTokenExpiresAt?: number;
  xeroConnectedAt?: string;
  xeroLastSyncedAt?: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  tier: { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
  onboardingComplete: { type: Boolean, default: false },
  targetMargin: { type: Number, default: 0 },
  tradeType: { type: String, default: '' },
  businessName: { type: String, default: '' },
  state: { type: String, default: '' },
  staffCount: { type: String, default: '' },
  xeroAccessToken: { type: String, default: '' },
  xeroRefreshToken: { type: String, default: '' },
  xeroTenantId: { type: String, default: '' },
  xeroTokenExpiresAt: { type: Number, default: 0 },
  xeroConnectedAt: { type: String, default: '' },
  xeroLastSyncedAt: { type: String, default: '' },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
