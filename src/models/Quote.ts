import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  quoteId: string;
  quoteNumber: string;
  client: string;
  job: string;
  jobId?: string;
  amount: number;
  amountExGst: number;
  amountIncGst: number;
  gstAmount: number;
  sentDate: string;
  daysSince: number;
  status: 'pending' | 'followed-up' | 'urgent' | 'won' | 'lost';
  followups: number;
  category: string;
  lastReminderSent?: Date;
}

const QuoteSchema = new Schema({
  userEmail: { type: String, required: true, index: true },
  quoteId: { type: String, required: true, unique: true, index: true },
  quoteNumber: { type: String, default: '' },
  client: { type: String, required: true },
  job: { type: String, required: true },
  jobId: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  amountExGst: { type: Number, default: 0 },
  amountIncGst: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  sentDate: { type: String, default: '' },
  daysSince: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'followed-up', 'urgent', 'won', 'lost'],
    default: 'pending',
  },
  followups: { type: Number, default: 0 },
  category: { type: String, default: 'general' },
  lastReminderSent: { type: Date },
}, { timestamps: true });

export const Quote = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);
