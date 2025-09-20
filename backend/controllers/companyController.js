import companySchema from "../models/companySchema.js"

class CompanyController {
  // Create a new company
  static async createCompany(req, res) {
    try {
      const companyData = req.body;

      // Required fields validation
      const { email, companyName } = companyData;
     /* if (!email || !companyName) {
        return res.status(400).json({ message: "Email and Company Name are required" });
      }*/

      // Check if email already exists
      if(email){
      const existingCompany = await companySchema.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ message: "Company with this email already exists" });
      }
    }

      // If a logo file is uploaded
      if (req.file) {
        companyData.logo = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        };
      }
       // Parse array fields if they are JSON strings
    if (companyData.OurValues && typeof companyData.OurValues === "string") {
      companyData.OurValues = JSON.parse(companyData.OurValues);
    }

    if (companyData.internBenifits && typeof companyData.internBenifits === "string") {
      companyData.internBenifits = JSON.parse(companyData.internBenifits);
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
      if ((key === "OurValues" || key === "internBenifits") && typeof req.body[key] === "string") {
        company[key] = JSON.parse(req.body[key]); // parse array fields
      } else {
        company[key] = req.body[key];
      }
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

    const formattedCompanies = companies.map(c => ({
      id: c._id,
      name: c.name,
      description: c.description,
      website: c.website,
      email: c.email,
      role: c.role,
      companyName: c.companyName,
      location: c.location,
      employees: c.employees,
      industry: c.industry,
      logo: c.logo?.data ? c.logo.data.toString("base64") : null,
      logoType: c.logo?.contentType || "image/png",
      logoFilename: c.logo?.filename || null,
      isApproved: c.isApproved,
      internships: c.internships || [],
      phoneNo :c.phoneNo,
      WorkCulture:c.WorkCulture,
      internBenifits:c.internBenifits || [],
      OurValues:c.OurValues ||[],
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      subfield:c.subfield || "",
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
        phoneNo :company.phoneNo,
        WorkCulture:company.WorkCulture,
        internBenifits:company.internBenifits || [],
        OurValues:company.OurValues ||[],
        internships: company.internships || [],
        fullTimeOpportunities:company.fullTimeOpportunities,
        certification:company.companycertification,
        mentorship:company.mentorship,
        stipend:company.stipend,
        foundedYear:company.foundedYear,
        companyType:company.companyType,
        address:company.address,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        subfield:company.subfield || "",
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

// Company login / verification
static async verifyCompany(req, res) {
  try {
    const { email, password } = req.body; // use password for login

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find company by email
    const company = await companySchema.findOne({ email });
    if (!company) {
      return res.status(401).json({ exists: false, message: "Invalid email or password" });
    }

    // Compare password directly (plain text)
    if (company.password !== password) {
      return res.status(401).json({ exists: false, message: "Invalid email or password" });
    }

    // Convert profile picture to Base64 if exists
    let profilePictureBase64 = null;
    if (company.logo && company.logo.data) {
      profilePictureBase64 = `data:${company.logo.contentType};base64,${company.logo.data.toString('base64')}`;
    }

    // Send all necessary info to frontend
    return res.status(200).json({
      exists: true,
      id: company._id,
      email: company.email,
      role: 'company',
      companyName: company.companyName,
      profilePicture: profilePictureBase64 || null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server  error", error });
  }
}

// Delete a company by ID
static async deleteCompanyById(req, res) {
  try {
    const companyId = req.params.id;

    const deletedCompany = await companySchema.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}












}

export default CompanyController;