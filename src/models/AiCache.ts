import mongoose, { Schema } from 'mongoose';

const AiCacheSchema = new Schema({
  userEmail: { type: String, required: true },
  key: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
}, { timestamps: false });

AiCacheSchema.index({ userEmail: 1, key: 1 }, { unique: true });
AiCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AiCache = mongoose.models.AiCache || mongoose.model('AiCache', AiCacheSchema);
