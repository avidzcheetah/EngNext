// routes/internshipRoutes.js
import { Router } from 'express';
const router = Router();
import { createInternship, getAllInternships, getInternshipsByCompanyId, getInternshipById,deleteInternshipById,editInternshipById } from '../controllers/InternshipController.js';

// Create internship
router.post('/createInternship', createInternship);

// Fetch all internships
router.get('/getAllInternships', getAllInternships);
// delete internShip by Id
router.delete('/deleteInternshipById/:id', deleteInternshipById);

// Fetch internships by companyId
router.get('/getInternshipsByCompanyId/:companyId', getInternshipsByCompanyId);

// Fetch internship by ID
router.get('/getInternshipById/:id', getInternshipById);


// PUT /api/internships/:editId
router.put("/editInternshipById/:editId", editInternshipById);

export default router;
