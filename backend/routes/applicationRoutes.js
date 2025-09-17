import { Router } from 'express';
const router = Router();
import {
  createApplication,
  acceptApplication,
  rejectApplication,
  fetchByCompanyId,
  fetchByStudentId,
  fetchByInternshipId,
  fetchAllPendingApplications
} from "../controllers/applicationController.js";



router.post("/createApplication", createApplication);
router.put("/acceptApplication/:id", acceptApplication);
router.put("/rejectApplication/:id", rejectApplication);
router.get("/fetchByCompanyId/:companyId", fetchByCompanyId);
router.get("/fetchByStudentId/:studentId", fetchByStudentId);
router.get("/fetchAllPendingApplications", fetchAllPendingApplications);
router.get("/fetchByInternshipId/:internshipId", fetchByInternshipId);
export default router;
