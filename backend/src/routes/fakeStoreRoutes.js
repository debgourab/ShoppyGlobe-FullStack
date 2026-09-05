import { Router } from "express";
import { getFakeStoreProduct, getFakeStoreProducts } from "../controllers/fakeStoreController.js";

const router = Router();

router.get("/products", getFakeStoreProducts);
router.get("/products/:id", getFakeStoreProduct);

export default router;
