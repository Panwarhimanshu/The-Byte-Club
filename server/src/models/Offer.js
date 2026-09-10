import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    code: { type: String, uppercase: true, trim: true },
    type: {
      type: String,
      enum: ['bogo', 'combo', 'percent', 'flat', 'freebie'],
      default: 'percent',
    },
    value: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 },
    image: { type: String, default: '' },
    accent: { type: String, enum: ['primary', 'secondary', 'accent'], default: 'primary' },
    badge: { type: String, default: 'DEAL' },
    isActive: { type: Boolean, default: true },
    startsAt: Date,
    endsAt: Date,
  },
  { timestamps: true },
);

offerSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Offer = mongoose.model('Offer', offerSchema);
