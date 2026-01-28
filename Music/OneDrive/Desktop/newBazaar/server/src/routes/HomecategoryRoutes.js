import { Router } from "express";
import HomeCategoryController from "../controller/HomeCategoryController.js";

const router = Router();

router.get("/categories", HomeCategoryController.getHomeCategories);

router.post("/category", HomeCategoryController.createHomeCategories);

router.put("/category/:id", HomeCategoryController.updateHomeCategory);

export default router;
