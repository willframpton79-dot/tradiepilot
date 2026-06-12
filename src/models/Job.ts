import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  jobId: string;
  title: string;
  description: string;
  client: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  status: string;
  suburb: string;
  postcode?: string;
  quotedTotal: number;
  quotedTotalExGst: number;
  actualTotal: number;
  margin: number;
  marginPct: number;
  quotedLabour: number;
  actualLabour: number;
  quotedMaterials: number;
  actualMaterials: number;
  quotedSubcontractors: number;
  actualSubcontractors: number;
  tradeType: string;
  targetMarginPct: number;
  gstCollected: number;
  gstPaid: number;
  startDate: string;
  dueDate: string;
  overrunNotes?: string;
  timeLog: {
    id: string;
    date: string;
    staff: string;
    hours: number;
    rate: number;
    cost: number;
    description: string;
  }[];
  receiptLog: {
    id: string;
    date: string;
    item: string;
    supplier: string;
    cost: number;
    category: string;
  }[];
}

const TimeEntrySchema = new Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  staff: { type: String, required: true },
  hours: { type: Number, required: true },
  rate: { type: Number, required: true },
  cost: { type: Number, required: true },
  description: { type: String, required: true },
}, { _id: false });

const ReceiptEntrySchema = new Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  item: { type: String, required: true },
  supplier: { type: String, required: true },
  cost: { type: Number, required: true },
  category: { type: String, required: true },
}, { _id: false });

const JobSchema = new Schema({
  userEmail: { type: String, required: true, index: true },
  jobId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  client: {
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  status: { type: String, default: 'active' },
  suburb: { type: String, default: '' },
  postcode: { type: String, default: '' },
  quotedTotal: { type: Number, default: 0 },
  quotedTotalExGst: { type: Number, default: 0 },
  actualTotal: { type: Number, default: 0 },
  margin: { type: Number, default: 0 },
  marginPct: { type: Number, default: 0 },
  quotedLabour: { type: Number, default: 0 },
  actualLabour: { type: Number, default: 0 },
  quotedMaterials: { type: Number, default: 0 },
  actualMaterials: { type: Number, default: 0 },
  quotedSubcontractors: { type: Number, default: 0 },
  actualSubcontractors: { type: Number, default: 0 },
  tradeType: { type: String, default: '' },
  targetMarginPct: { type: Number, default: 30 },
  gstCollected: { type: Number, default: 0 },
  gstPaid: { type: Number, default: 0 },
  startDate: { type: String, default: '' },
  dueDate: { type: String, default: '' },
  overrunNotes: { type: String, default: '' },
  timeLog: [TimeEntrySchema],
  receiptLog: [ReceiptEntrySchema],
}, {
  timestamps: true,
});

JobSchema.index({ userEmail: 1, jobId: 1 }, { unique: true });

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
