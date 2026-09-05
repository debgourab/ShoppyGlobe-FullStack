import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

// Required fields for creating a product. Thumbnail and stock are optional because
// the controller can safely derive sensible defaults from the image and schema.
const createProductRules = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a non-negative number."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("image").isURL().withMessage("Image must be a valid URL."),
  body("thumbnail").optional().isURL().withMessage("Thumbnail must be a valid URL."),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer.")
];

// PUT accepts only the fields that are supplied, which makes Thunder Client testing easier
// while still validating every value that is present.
const updateProductRules = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty."),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a non-negative number."),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty."),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty."),
  body("image").optional().isURL().withMessage("Image must be a valid URL."),
  body("thumbnail").optional().isURL().withMessage("Thumbnail must be a valid URL."),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer.")
];

function validate(req, res, next) {
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }
  next();
}

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", requireAuth, requireAdmin, createProductRules, validate, createProduct);
router.put("/:id", requireAuth, requireAdmin, updateProductRules, validate, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;
