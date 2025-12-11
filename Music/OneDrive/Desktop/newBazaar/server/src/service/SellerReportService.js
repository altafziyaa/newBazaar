import SellerReport from "../model/SellerReport.js";
import AppError from "../utils/AppError.js";

class SellerReportService {
    async getSellerReport(seller) {
        try {
            let sellerReport = await SellerReport.findOne({ seller: seller._id });

            if (!sellerReport) {
                sellerReport = new SellerReport({
                    seller: seller._id,
                    totalorders: 0,
                    totalEarning: 0,
                    totalSales: 0,
                });
                sellerReport = await sellerReport.save();
            }
            return sellerReport;
        } catch (error) {
            throw new AppError(`Error fetching seller report: ${error.message}`, 400);
        }
    }

    async updateSellerReport(sellerReport) {
        try {
            return await SellerReport.findByIdAndUpdate(
                sellerReport._id,
                sellerReport,
                { new: true }
            );
        } catch (error) {
            throw new AppError(`Error updating seller report: ${error.message}`, 400);
        }
    }
}

export default new SellerReportService();
