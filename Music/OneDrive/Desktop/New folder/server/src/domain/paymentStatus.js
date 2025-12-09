export const PaymentStatus = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  SUCCESS: 'success',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELED: 'canceled',
  REFUNDED: 'refunded'
});

export const VALUES = Object.values(PaymentStatus);
export default PaymentStatus;