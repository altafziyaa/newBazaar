import HomeCategoryService from "../service/HomeCategoryService.js";
import HomeService from "../service/HomeService.js";

class HomeCategoryController {

    async createHomeCategories(req, res) {
        try {
            const categories = await HomeCategoryService.createCategory(req.body);

            const homeCategories = await HomeService.createHomePageData(categories);

            return res.status(201).json({
                success: true,
                data: homeCategories,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    async getHomeCategories(req, res) {
        try {
            const categories = await HomeCategoryService.getAllCategories();
            return res.status(200).json({
                success: true,
                data: categories,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    async updateHomeCategory(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedCategory = await HomeCategoryService.updateCategory(
                id,
                updateData
            );

            return res.status(200).json({
                success: true,
                data: updatedCategory,
            });
        } catch (error) {
            if (error.message === "Category not found") {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
}

export default new HomeCategoryController();
