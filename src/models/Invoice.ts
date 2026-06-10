import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceId: string;
  invoiceNumber: string;
  job: string;
  client: string;
  amount: number;
  sentDate: string;
  dueDate: string;
  daysOverdue: number;
  status: 'pending' | 'overdue' | 'paid';
  lastReminderSent?: Date;
}

const InvoiceSchema = new Schema({
  userEmail: { type: String, required: true, index: true },
  invoiceId: { type: String, required: true, unique: true, index: true },
  invoiceNumber: { type: String, default: '' },
  job: { type: String, required: true },
  client: { type: String, required: true },
  amount: { type: Number, default: 0 },
  sentDate: { type: String, default: '' },
  dueDate: { type: String, default: '' },
  daysOverdue: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'overdue', 'paid'],
    default: 'pending',
  },
  lastReminderSent: { type: Date },
}, { timestamps: true });

export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
