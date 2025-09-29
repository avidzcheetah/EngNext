import InternshipSchema from "../models/InternshipSchema.js";

// ✅ Create new internship
export const createInternship = async (req, res) => {
  try {
    const { companyId, title, companyName, description, requirements, duration, location, industry } = req.body;

    // Basic validation to ensure required fields are present
    if (!companyId || !title) {
      return res.status(400).json({ message: "companyId and title are required" });
    }

    const internship = new InternshipSchema({
      companyId,
      title,
      companyName: companyName || "",
      description: description || "",
      requirements: requirements || [],
      duration: duration || "",
      location: location || "",
      industry: industry || "",
      isActive: true, // Default to true for new internships
    });

    const savedInternship = await internship.save();
    console.log("Internship created successfully:", savedInternship);
    res.status(201).json(savedInternship);
  } catch (error) {
    console.error("Error creating internship:", error);
    res.status(400).json({ message: error.message || "Failed to create internship" });
  }
};

// ✅ Get all internships
export const getAllInternships = async (req, res) => {
  try {
    const internships = await InternshipSchema.find();
    res.status(200).json(internships);
  } catch (error) {
    console.error("Error fetching all internships:", error);
    res.status(500).json({ message: error.message || "Failed to fetch internships" });
  }
};

// ✅ Get internships by CompanyId
export const getInternshipsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }
    const internships = await InternshipSchema.find({ companyId });
    res.status(200).json(internships);
  } catch (error) {
    console.error("Error fetching internships by companyId:", error);
    res.status(500).json({ message: error.message || "Failed to fetch internships" });
  }
};

// ✅ Delete internship by ID
export const deleteInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Internship ID is required" });
    }

    const deleted = await InternshipSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Internship not found" });
    }

    console.log("Internship deleted successfully:", id);
    res.status(200).json({ message: "Internship deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting internship:", error);
    res.status(500).json({ message: error.message || "Failed to delete internship" });
  }
};

// ✅ Get internship by ID
export const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Internship ID is required" });
    }

    const internship = await InternshipSchema.findById(id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json(internship);
  } catch (error) {
    console.error("Error fetching internship by ID:", error);
    res.status(500).json({ message: error.message || "Failed to fetch internship" });
  }
};

// ✅ Edit internship by ID
export const editInternshipById = async (req, res) => {
  try {
    const { id } = req.params; // Changed from editId to id for consistency
    const { companyId, title, companyName, description, requirements, duration, location, industry } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Internship ID is required" });
    }
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updateData = {
      companyId,
      title,
      companyName: companyName || "",
      description: description || "",
      requirements: requirements || [],
      duration: duration || "",
      location: location || "",
      industry: industry || "",
    };

    console.log("Updating internship with data:", updateData);

    const updatedInternship = await InternshipSchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedInternship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    console.log("Internship updated successfully:", updatedInternship);
    res.status(200).json(updatedInternship);
  } catch (error) {
    console.error("Error updating internship:", error);
    res.status(400).json({ message: error.message || "Failed to update internship" });
  }
};