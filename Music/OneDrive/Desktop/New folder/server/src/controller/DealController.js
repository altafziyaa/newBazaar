import DealService from "../service/DealService.js";

class DealController {
    async getAlldeals(req, res) {
        try {
            const deals = await DealService.getDeals();
            return res.status(200).json({ success: true, data: deals });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, error: error.message });
        }
    }

    async createDeals(req, res) {
        try {
            const { discount, category_id } = req.body;

            if (discount === undefined || category_id === undefined) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        error: "Discount and category_id required",
                    });
            }

            const deal = await DealService.createDeal({ discount, category_id });

            return res.status(201).json({ success: true, data: deal });
        } catch (error) {
            return res
                .status(error.statusCode || 500)
                .json({
                    success: false,
                    status: error.status || "error",
                    error: error.message,
                });
        }
    }

    async updateDeal(req, res) {
        try {
            const { id } = req.params;
            const { discount } = req.body;

            const deal = await DealService.updateDeal(id, { discount });

            return res.status(200).json({ success: true, data: deal });
        } catch (error) {
            return res
                .status(error.statusCode || 404)
                .json({
                    success: false,
                    status: error.status || "error",
                    error: error.message,
                });
        }
    }

    async deleteDeal(req, res) {
        try {
            const { id } = req.params;
            const result = await DealService.deleteDeal(id);

            return res
                .status(200)
                .json({ success: true, message: result.message });
        } catch (error) {
            return res
                .status(error.statusCode || 404) 
                .json({
                    success: false,
                    status: error.status || "error",
                    error: error.message,
                });
        }
    }
}

export default new DealController();
