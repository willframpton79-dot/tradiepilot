import mongoose, { Schema, Document } from 'mongoose';

export interface IInsight extends Document {
  section: string; // 'profit_alerts', 'quote_hot_leads', 'customer_ltv', etc.
  data: any;
}

const InsightSchema = new Schema({
  section: { type: String, required: true, unique: true, index: true },
  data: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const Insight = mongoose.models.Insight || mongoose.model<IInsight>('Insight', InsightSchema);