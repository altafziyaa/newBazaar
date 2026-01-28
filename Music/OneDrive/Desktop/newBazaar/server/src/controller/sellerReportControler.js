import sellerReportService from "../service/SellerReportService.js";

class SellerReportController {
    async getSellerReport(req, res, next) {
        try {
            const seller = req.seller; // no await

            const report = await sellerReportService.getSellerReport(seller);

            return res.status(200).json({
                success: true,
                report,
            });

        } catch (error) {
            next(error);
        }
    }
}

export default  SellerReportController;
