import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AccountStatus from "../domain/AccountStatus.js";
import UserRole from "../domain/UserRole.js";

const { Schema } = mongoose;

const businessDetailsSchema = new Schema(
  {
    businessName: { type: String, trim: true },
    businessEmail: { type: String, lowercase: true },
    businessMobile: { type: String },
    businessAddress: { type: String },
  },
  { _id: false },
);

const bankDetailsSchema = new Schema(
  {
    accountNumber: { type: String },
    accountHolderName: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
  },
  { _id: false },
);

const sellerSchema = new Schema(
  {
    sellerName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    businessDetails: businessDetailsSchema,

    bankDetails: bankDetailsSchema,

    pickupAddress: { type: Schema.Types.ObjectId, ref: "Address" },

    GSTIN: {
      type: String,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GSTIN",
      ],
      index: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SELLER,
      immutable: true,
    },

    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING,
      index: true,
    },
  },
  { timestamps: true },
);

sellerSchema.index({ email: 1 });
sellerSchema.index({ mobile: 1 });
sellerSchema.index({ GSTIN: 1 });
sellerSchema.index({ accountStatus: 1 });

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

sellerSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
