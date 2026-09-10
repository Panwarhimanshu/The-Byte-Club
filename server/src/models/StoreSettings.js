import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'singleton', unique: true },
    brandName: { type: String, default: 'The Byte Club' },
    tagline: { type: String, default: 'Big flavour. Zero buffering.' },
    logo: { type: String, default: '' },
    currency: { type: String, default: '₹' },
    phone: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'hello@thebyteclub.example' },
    address: { type: String, default: '12 Server Street, HSR Layout, Bengaluru 560102' },
    mapsUrl: { type: String, default: '' },
    deliveryApps: {
      type: [{ label: String, href: String, _id: false }],
      default: () => [
        { label: 'Swiggy', href: 'https://swiggy.com' },
        { label: 'Zomato', href: 'https://zomato.com' },
      ],
    },
    hours: [{ day: String, open: String, close: String, _id: false }],
    socials: [{ label: String, href: String, _id: false }],
  },
  { timestamps: true },
);

storeSettingsSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne({ key: 'singleton' });
  if (!doc) doc = await this.create({ key: 'singleton' });
  return doc;
};

storeSettingsSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.key;
    return ret;
  },
});

export const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);
