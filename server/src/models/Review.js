import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    productName: String,
    name: { type: String, required: true },
    handle: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    body: { type: String, required: true },
    avatarColor: { type: String, default: '#E2FF3C' },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true },
);

reviewSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.date = ret.createdAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Review = mongoose.model('Review', reviewSchema);
