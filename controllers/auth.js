import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { validationResult } from "express-validator";

// Register a User => /auth/register
export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  const {
    firstName,
    lastName,
    location,
    occupation,
    email,
    password,
    confirmPassword,
    picturePath,
    friends,
  } = req.body;
  try {
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      const error = new Error("Email already exists.");
      error.statusCode = 409;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match.");
      error.statusCode = 403;
      throw error;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      location,
      occupation,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const response = await newUser.save();
    res
      .status(201)
      .json({ message: "Registered successfully.", user: response });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Login a user => /auth/login
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email: email });
    if (!userDoc) {
      const error = new Error("No user found for this email/password.");
      error.statusCode = 404;
      throw error;
    }
    const doPasswordsMatch = await bcrypt.compare(password, userDoc.password);
    if (!doPasswordsMatch) {
      const error = new Error("No user found for this email/password.");
      error.statusCode = 404;
      throw error;
    }
    const token = jwt.sign(
      { id: userDoc._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    delete userDoc.password; // Deletes the password field so that we don't send it to the frontend.
    res.status(200).json({
      message: "Logged in successfully.",
      token: token,
      user: userDoc,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
