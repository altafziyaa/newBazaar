
import Deal from "../model/Deal.js";
import HomeCategory from "../model/HomeCategory.js";
import AppError from "../utils/AppError.js";

class DealService {
    async getDeals() {
        return await Deal.find().populate("category");
    }

    async createDeal(dealData) {
        const category = await HomeCategory.findById(dealData.category_id);
        if (!category) throw new AppError("Category not found", 404);

        const deal = new Deal({
            discount: dealData.discount,
            category: category._id,
        });

        return await deal.save();
    }

    async updateDeal(id, updateData) {
        const deal = await Deal.findById(id);
        if (!deal) throw new AppError("Deal not found", 404);

        if (updateData.discount < 0 || updateData.discount > 100) {
            throw new AppError("Discount must be 0-100%", 400);
        }

        return await Deal.findByIdAndUpdate(
            id,
            { discount: updateData.discount },
            { new: true }
        ).populate("category");
    }

    async deleteDeal(id) {
        const deal = await Deal.findById(id);
        if (!deal) throw new AppError("Deal not found", 404);

        await Deal.findByIdAndDelete(id);
        return { message: "Deal deleted successfully" };
    }
}

export default new DealService();
