import HomeCategory from "../model/HomeCategory.js";

class HomeCategoryService {

    async getAllCategories() {
        return await HomeCategory.find();
    }

    async createHomeCategory(categoryData) {
        return await HomeCategory.create(categoryData);
    }

    async createCategory(categoriesData) {
        const existingCategories = await HomeCategory.find();

        if (existingCategories.length === 0) {
            return await HomeCategory.insertMany(categoriesData);
        }

        return existingCategories;
    }

    async updateCategory(id, updateData) {
        const updatedCategory = await HomeCategory.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedCategory) {
            throw new Error("Category not found");
        }

        return updatedCategory;
    }
}

export default new HomeCategoryService();
