import companySchema from "../models/companySchema.js"

class CompanyController {
  // Create a new company
  static async createCompany(req, res) {
    try {
      const companyData = req.body;

      // Required fields validation
      const { email, companyName } = companyData;
      if (!email || !companyName) {
        return res.status(400).json({ message: "Email and Company Name are required" });
      }

      // Check if email already exists
      const existingCompany = await companySchema.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ message: "Company with this email already exists" });
      }

      // If a logo file is uploaded
      if (req.file) {
        companyData.logo = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        };
      }

      // Create company document
      const company = new companySchema(companyData);
      await company.save();

      res.status(201).json({
        message: "Company created successfully",
        company
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Update company by ID
static async updateCompany(req, res) {
  try {
    const companyId = req.params.id;
    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    const company = await companySchema.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update text fields
    Object.keys(req.body).forEach(key => {
      company[key] = req.body[key];
    });

    // Update logo if uploaded
    if (req.file) {
      company.logo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
      console.log("Logo updated");
    } else {
      console.log("No logo uploaded, keeping existing logo");
    }

    await company.save();
    res.status(200).json({ message: "Company updated successfully", company });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}


  static async getAllCompanies(req, res) {
  try {
    const companies = await companySchema.find();

    // Convert logos from Buffer → Base64
    const formattedCompanies = companies.map(c => ({
      id: c._id,
      name: c.name,
      description: c.description,
      website: c.website,
      email: c.email,
      role: c.role,
      logo: c.logo ? c.logo.toString("base64") : null
    }));

    res.status(200).json({ companies: formattedCompanies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}

  
// Fetch a company by ID
  static async getCompanyById(req, res) {
    try {
      const companyId = req.params.id;
      const company = await companySchema.findById(companyId);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Convert logo buffer → Base64 if it exists
      const formattedCompany = {
        id: company._id,
        email: company.email,
        companyName: company.companyName,
        role: company.role,
        website: company.website,
        description: company.description,
        logo: company.logo?.data ? company.logo.data.toString("base64") : null,
        logoType: company.logo?.contentType || "image/png",
        logoFilename: company.logo?.filename || null,
        isApproved: company.isApproved,
        location: company.location,
        employees: company.employees,
        industry: company.industry,
        internships: company.internships || [],
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      };

      res.status(200).json({ company: formattedCompany });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Optional: Serve the logo directly as an image
  static async getCompanyLogo(req, res) {
    try {
      const company = await companySchema.findById(req.params.id);
      if (!company || !company.logo?.data) {
        return res.status(404).json({ message: "Logo not found" });
      }

      res.set("Content-Type", company.logo.contentType);
      res.send(company.logo.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

// Check company login / verification
static async verifyCompany(req, res) {
  try {
    const { email, companyName } = req.body;

    if (!email && !companyName) {
      return res.status(400).json({ message: "Provide email or companyName" });
    }

    // Find company by email or companyName
    const company = await companySchema.findOne({
      $or: [
        { email: email || null },
        { companyName: companyName || null }
      ]
    });

    if (!company) {
      return res.status(200).json({ exists: false });
    }

    // Company exists → return true with ID
    return res.status(200).json({
      exists: true,
      id: company._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}












}

export default CompanyController;