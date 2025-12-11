import HomeCategorySection from "../domain/HomeCategorySection.js";
import DealService from "./DealService.js";
class HomeService{
    async createHomePageData(allCategories){

        const gridcategories=allCategories.filter(cat=>cat.type===HomeCategorySection.GRID);

        const shopByCategories=allCategories.filter(cat=>cat.type===HomeCategorySection.SHOP_BY_CATEGORIES);

        const electricCategories=allCategories.filter(cat=>cat.type===HomeCategorySection.ELECTRIC_CATEGORIES);
        
        const dealCategories=allCategories.filter(cat=>cat.type===HomeCategorySection.DEAL);

        const deals = await DealService.getDeals();

        const home={
            grid:gridcategories,
            shopByCategories:shopByCategories,
            electricCategories:electricCategories,
            deals:deals,
            dealCategories:dealCategories

        }
        return home;
    }
}
export default new HomeService();