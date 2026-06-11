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
  gstRegistered: boolean;
  basPeriod: 'monthly' | 'quarterly';
  taxRate: number;
  notifications: {
    quoteReminders: boolean;
    invoiceChasers: boolean;
    marginAlerts: boolean;
  };
  emailPreferences: {
    marketing: boolean;
    productUpdates: boolean;
  };
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
  gstRegistered: { type: Boolean, default: false },
  basPeriod: { type: String, enum: ['monthly', 'quarterly'], default: 'quarterly' },
  taxRate: { type: Number, default: 10 },
  notifications: {
    quoteReminders: { type: Boolean, default: true },
    invoiceChasers: { type: Boolean, default: true },
    marginAlerts: { type: Boolean, default: true },
  },
  emailPreferences: {
    marketing: { type: Boolean, default: false },
    productUpdates: { type: Boolean, default: true },
  },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
