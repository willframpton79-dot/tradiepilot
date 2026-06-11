import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  userEmail: string;
  name: string;
  role: string;
  hourlyRate: number;
}

const StaffSchema = new Schema({
  userEmail: { type: String, required: true, index: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
}, {
  timestamps: true,
});

export const Staff = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);
