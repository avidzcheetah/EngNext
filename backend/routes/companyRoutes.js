// routes/companyRoutes.js
import express from "express";
import multer from "multer";
import CompanyController from "../controllers/companyController.js";

const router = express.Router();

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/companies
router.post("/createCompany", upload.single("logo"), CompanyController.createCompany);
// Update company by ID
router.put("/updateCompany/:id", upload.single("logo"), CompanyController.updateCompany);

// Get all companies
router.get("/getAll", CompanyController.getAllCompanies);

// Get company by ID
router.get("/getById/:id", CompanyController.getCompanyById);
// verifies
router.post("/verifyCompany",CompanyController.verifyCompany)
//Delete company by ID
router.delete("/deleteCompanyById/:id",CompanyController.deleteCompanyById)

export default router;
