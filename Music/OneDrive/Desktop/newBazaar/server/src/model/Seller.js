// src/model/Seller.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AccountStatus from '../domain/AccountStatus.js';
import UserRole from '../domain/UserRole.js';

const sellerSchema = new mongoose.Schema({
  sellerName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Invalid mobile number']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  businessDetails: {
    businessName: { type: String },
    businessEmail: { type: String },
    businessMobile: { type: String },
    businessAddress: { type: String },
  },
  bankDetails: {
    accountNumber: { type: String },
    accountHolderName: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
  },
  pickupAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  GSTIN: {
    type: String,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN'],
    index: true // <--- Added indexing
  },
  role: {
    type: String,
    enum: [UserRole.SELLER],
    default: UserRole.SELLER
  },
  accountStatus: {
    type: String,
    enum: [
      AccountStatus.ACTIVE,
      AccountStatus.INACTIVE,
      AccountStatus.SUSPENDED,
      AccountStatus.PENDING,
      AccountStatus.BANNED,
      AccountStatus.CLOSED
    ],
    default: AccountStatus.PENDING,
    index: true // <--- Added indexing
  }
}, { timestamps: true });

// Hash password before save
sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;