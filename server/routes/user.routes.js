import express from "express";
import authValidation from "../middlewares/authValidation.middleware.js";
import {
  changePassword,
  checkUserExists,
  checkUserNameExists,
  deleteUser,
  getAllConnectionRequests,
  getAllConnections,
  getAllUsers,
  getFeed,
  getUser,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { updateUserSchema } from "../utils/validation.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";

const router = express.Router();

router.get("/profile", authValidation, getUser);
router.get("/get/:userId", getUserById);
router.get("/getall", getAllUsers);
router.patch(
  "/update",
  authValidation,
  validateSchema(updateUserSchema),
  updateUser
);
router.delete("/delete", authValidation, deleteUser);
router.post("/username-exists", authValidation, checkUserNameExists);
router.post("/user-exists", authValidation, checkUserExists);
router.patch("/change-password", authValidation, changePassword);
router.get(
  "/all-connection-requests",
  authValidation,
  getAllConnectionRequests
);
router.get("/all-connections", authValidation, getAllConnections);
router.get("/feed", authValidation, getFeed);

export default router;
