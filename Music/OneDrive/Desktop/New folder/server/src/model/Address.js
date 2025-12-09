import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  locality: { type: String, required: true },
  pincode: { 
    type: String, 
    required: true, 
    match: [/^\d{6}$/, 'Invalid pincode'] 
  },
  state: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { 
    type: String, 
    required: true,
    match: [/^[6-9]\d{9}$/, 'Invalid mobile']
  }
}, { timestamps: true });

addressSchema.index({ mobile: 1 });
export default mongoose.model('Address', addressSchema);
