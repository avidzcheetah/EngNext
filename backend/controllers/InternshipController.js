import InternshipSchema from "../models/InternshipSchema.js";

// ✅ Create new internship
export const createInternship = async (req, res) => {
  try {
    
    const internship = new InternshipSchema(req.body);
    console.log("done")
    const savedInternship = await internship.save();
    
    res.status(201).json(savedInternship);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Not done")
  }
};

// ✅ Get all internships
export const getAllInternships = async (req, res) => {
  try {
    const internships = await InternshipSchema.find();
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get internships by CompanyId
export const getInternshipsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const internships = await InternshipSchema.find({ companyId });
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: delete internship by ID
export const deleteInternshipById = async (req, res) => {
  try {
    const { id } = req.params; // get the internship id from URL

    const deleted = await InternshipSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json({ message: "Internship deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get internship by ID
export const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await InternshipSchema.findById(id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Edit internship by ID
export const editInternshipById = async (req, res) => {
  try {
    const {editId}  = req.params; // ID of the internship to edit
    const updateData = req.body; // Fields to update
    console.log(editId)
    // Find the internship and update it
    const updatedInternship = await InternshipSchema.findByIdAndUpdate(
      editId,
      updateData,
      { new: true, runValidators: true } // return updated document
    );

    if (!updatedInternship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json(updatedInternship);
  } catch (error) {
    console.error("Error updating internship:", error);
    res.status(400).json({ message: error.message });
  }
};
