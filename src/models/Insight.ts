import mongoose, { Schema, Document } from 'mongoose';

export interface IInsight extends Document {
  userEmail: string;
  section: string;
  data: any;
}

const InsightSchema = new Schema({
  userEmail: { type: String, required: true, index: true },
  section: { type: String, required: true },
  data: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

InsightSchema.index({ userEmail: 1, section: 1 }, { unique: true });

export const Insight = mongoose.models.Insight || mongoose.model<IInsight>('Insight', InsightSchema);