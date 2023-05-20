import express from "express";
import { loginUser, registerUser } from "../controllers/auth.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("email", "Please enter a valid email.").isEmail().normalizeEmail(),
    body("password", "Minimum password length is 5 characters.")
      .trim()
      .isLength({ min: 5 }),
    body("firstName", "First name field cannot be empty.")
      .trim()
      .not()
      .isEmpty(),
    body("lastName", "Last name field cannot be empty.").trim().not().isEmpty(),
  ],

  registerUser
);
router.post("/login", loginUser);

export default router;
