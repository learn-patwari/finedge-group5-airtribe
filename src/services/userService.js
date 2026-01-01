import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Register user
 */
export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    const err = new Error("Name, email and password are required");
    err.status = 400;
    throw err;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email
  };
}

/**
 * Login user
 */
export async function loginUser({ email, password }) {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token };
}

/**
 * Get user by ID (for profile)
 */
export async function getUserById(userId) {
  if (!userId) {
    const err = new Error("User ID is required");
    err.status = 400;
    throw err;
  }

  const user = await User.findById(userId).select("name email createdAt");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}