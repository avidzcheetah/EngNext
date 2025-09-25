import { Router } from 'express';
const router = Router();
import multer from "multer";
import {
  createApplication,
  acceptApplication,
  rejectApplication,
  fetchByCompanyId,
  fetchByStudentId,
  fetchByInternshipId,
  fetchAllApplications,
  getCV
} from "../controllers/applicationController.js";


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/createApplication", upload.single("cv"), createApplication);
router.put("/acceptApplication/:id", acceptApplication);
router.put("/rejectApplication/:id", rejectApplication);
router.get("/fetchByCompanyId/:companyId", fetchByCompanyId);
router.get("/fetchByStudentId/:studentId", fetchByStudentId);
router.get("/fetchAllApplications", fetchAllApplications);
router.get("/fetchByInternshipId/:internshipId", fetchByInternshipId);
router.get("/getCV/:id", getCV);
export default router;
