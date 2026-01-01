import * as service from "../services/userService.js";

export async function registerUser(req, res, next) {
  try {
    const user = await service.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req, res, next) {
  try {
    const token = await service.loginUser(req.body);
    res.json(token);
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await userService.getUserById(req.user.userId);
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
}