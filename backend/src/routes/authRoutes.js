import { Router } from "express";
import { body, validationResult } from "express-validator";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const registrationRules = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters."),
  body("email").isEmail().withMessage("Enter a valid email address."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
];

const loginRules = [
  body("email").isEmail().withMessage("Enter a valid email address."),
  body("password").notEmpty().withMessage("Password is required.")
];

function validate(req, res, next) {
  const errors = validationResult(req).array();
  if (errors.length) return res.status(400).json({ message: "Validation failed.", errors });
  next();
}

router.post("/register", registrationRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/me", requireAuth, me);

export default router;
