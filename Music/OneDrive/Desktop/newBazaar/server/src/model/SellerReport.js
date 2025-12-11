import mongoose from 'mongoose';

const sellerReportSchema = new mongoose.Schema({
  seller: {type: mongoose.Schema.Types.ObjectId,ref: 'Seller',required: true},
  totalEarning: {type: Number,default: 0},
  totalSales: {type: Number,default: 0},
  totalRefounds: {type: Number,default: 0},
  totaltax: {type: Number,default: 0},
  netEarnings: {type: Number,default: 0},
  totalorders: {type: Number,default: 0},
  canceledOrders: {type: Number,default: 0},
  totalTransactions: {type: Number,default: 0},
}, {timestamps: true});

const SellerReport = mongoose.model('SellerReport', sellerReportSchema);

export default SellerReport;