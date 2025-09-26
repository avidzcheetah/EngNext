
import Application from "../models/applicationSchema.js";

// ✅ Create new application
export const createApplication = async (req, res) => {
  try {
    const applicationData = {
      ...req.body,
    };

    if (req.file) {
      applicationData.cv = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      };
    }

    const application = new Application(applicationData);
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

// ✅ Get CV by application ID
export const getCV = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const application = await Application.findById(id);
    console.log(id);
    if (!application || !application.cv || !application.cv.data) {
      
      return res.status(404).json({ message: "CV not found" });
    }
    
    res.set("Content-Type", application.cv.contentType);
    res.set("Content-Disposition", `inline; filename="${application.cv.filename}"`);
    res.send(application.cv.data);
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
    const apps = await Application.find({ companyId }).select("-cv"); // exclude cv
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Fetch all applications
export const fetchAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().select("-cv"); // exclude cv
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Fetch applications by studentId
export const fetchByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const apps = await Application.find({ studentId }).select("-cv"); // exclude cv
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Fetch applications by internshipId
export const fetchByInternshipId = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const apps = await Application.find({ internshipId }).select("-cv"); // exclude cv
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
