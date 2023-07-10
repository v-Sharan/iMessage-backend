import { Router } from "express";
import { check } from "express-validator";
import { createUser, getAllUsers } from "../controllers/user.js";

const router = Router();

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("name").notEmpty(),
    check("userPhoto").notEmpty(),
  ],
  createUser
);

router.get("/", getAllUsers);

export default router;
