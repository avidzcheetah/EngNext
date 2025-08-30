import express from "express";
import StudentController from "../controllers/StudentController.js";

import multer from "multer";
const router = express.Router();

// Multer setup: store files in memory (for MongoDB Buffer storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/createStudent", StudentController.createStudent);
router.put(
  "/updatestudents/:id",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  StudentController.updateStudent
);

// Fetch all students
router.get("/getAllStudents", StudentController.getAllStudents);

// Fetch single student by ID
router.get("/getStudentById/:id", StudentController.getStudentById);

// Fetch CV file
router.get("/getCV/:id", StudentController.getCV);

// Fetch profile picture
router.get("/getProfilePicture/:id", StudentController.getProfilePicture);

//verifies student
router.post("/loginStudent",StudentController.loginStudent);
export default router;
