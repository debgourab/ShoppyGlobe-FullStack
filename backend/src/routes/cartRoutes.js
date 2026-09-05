import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem
} from "../controllers/cartController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function validate(req, res, next) {
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }
  next();
}

// All cart endpoints require a valid JWT token.
router.use(requireAuth);

router.get("/", getCart);
router.delete("/", clearCart);

router.post(
  "/",
  body("productId")
    .notEmpty()
    .withMessage("productId is required.")
    .bail()
    .custom((value) => /^[a-f\d]{24}$/i.test(String(value)) || /^\d+$/.test(String(value)))
    .withMessage("Use a MongoDB ObjectId or a numeric Fake Store product id."),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be a positive integer."),
  validate,
  addToCart
);

router.put(
  "/:productId",
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer."),
  validate,
  updateCartItem
);

router.delete("/:productId", removeFromCart);

export default router;
