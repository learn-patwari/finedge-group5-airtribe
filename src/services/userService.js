import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readJSON, writeJSON } from "../utils/fileHelper";

const FILE = "src/data/users.json";

/**
 * Register user
 */
export async function registerUser({ email, password }) {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.status = 400;
    throw err;
  }

  const users = await readJSON(FILE);

  const exists = users.find(u => u.email === email);
  if (exists) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: uuid(),
    email,
    password: hashedPassword,
    createdAt: new Date()
  };

  users.push(user);
  await writeJSON(FILE, users);

  // Never return password
  return {
    id: user.id,
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

  const users = await readJSON(FILE);
  const user = users.find(u => u.email === email);

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
    {
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token };
}

/**
 * Get user by ID (for profile)
 */
export async function getUserById(userId) {
  const users = await readJSON(FILE);
  const user = users.find(u => u.id === userId);

  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };
}