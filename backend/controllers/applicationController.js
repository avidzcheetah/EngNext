
import Application from "../models/applicationSchema.js";

// ✅ Create new application
export const createApplication = async (req, res) => {
  try {
    
    const application = new Application(req.body);
    
    const savedApplication = await application.save();
    
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Accept an application
export const acceptApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );
    if (!updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Reject an application
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    if (!updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Fetch applications by companyId
export const fetchByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const apps = await Application.find({ companyId });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ Fetch all  applications
export const fetchAllApplications = async (req, res) => {
  try {
    const apps = await Application.find(); // fetch all documents
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Fetch applications by studentId
export const fetchByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const apps = await Application.find({ studentId });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to fetch applications by internshipId
export const fetchByInternshipId = async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Find all applications that have this internshipId
    const apps = await Application.find({ internshipId });

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

