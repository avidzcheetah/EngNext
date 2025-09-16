// routes/adminRoutes.js
import express from "express";
import AdminController from "../controllers/adminController.js";

const router = express.Router();

// ✅ Create a new admin
router.post("/createAdmin", AdminController.createAdmin);

// ✅ Verify admin login
router.post("/verifyAdmin", AdminController.verifyAdmin);

export default router;
