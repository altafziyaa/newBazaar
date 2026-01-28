import TransactionService from "../service/TransactionService.js";

class TransactionController {
  async getTransactionBySeller(req, res, next) {
    try {
      const seller = req.seller;

      if (!seller) {
        return res.status(401).json({ message: "Unauthorized seller" });
      }

      const transaction = await TransactionService.getTransactionBySellerId(seller._id);

      return res.status(200).json({
        success: true,
        count: transaction.length,
        data: transaction
      });

    } catch (error) {
      next(error);
    }
  }
}

export default TransactionController;
