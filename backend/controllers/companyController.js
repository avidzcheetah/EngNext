import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class CompanyController {
  static async createCompany(req, res) {
    try {
      const companyData = req.body;
      const { email, companyName } = companyData;

      if (req.file) {
        companyData.logo = req.file.path;
      }

      if (companyData.OurValues && typeof companyData.OurValues === "string") {
        try { companyData.OurValues = JSON.parse(companyData.OurValues); } catch(e) { companyData.OurValues = []; }
      }

      if (companyData.internBenifits && typeof companyData.internBenifits === "string") {
        try { companyData.internBenifits = JSON.parse(companyData.internBenifits); } catch(e) { companyData.internBenifits = []; }
      }

      if (companyData.departments && typeof companyData.departments === "string") {
        try { companyData.departments = JSON.parse(companyData.departments); } catch(e) { companyData.departments = []; }
      }

      if (companyData.subfield && typeof companyData.subfield === "string") {
        companyData.subfield = [companyData.subfield];
      }

      delete companyData.addedByAdmin;

      companyData.id = Date.now().toString();

      const { data: company, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Company created successfully",
        company
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async updateCompany(req, res) {
    try {
      const companyId = req.params.id;
      if (!companyId) return res.status(400).json({ message: "Company ID is required" });

      const { data: company, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (fetchError || !company) return res.status(404).json({ message: "Company not found" });

      const updates = {};
      Object.keys(req.body).forEach(key => {
        if ((key === "OurValues" || key === "internBenifits" || key === "subfield") && typeof req.body[key] === "string") {
          try { updates[key] = JSON.parse(req.body[key]); } catch(e) { updates[key] = []; }
        } else {
          updates[key] = req.body[key];
        }
      });

      if (req.file) {
        updates.logo = req.file.path;
      }
      
      updates.updatedAt = new Date().toISOString();

      const { data: updatedCompany, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', companyId)
        .select()
        .single();

      if (error) throw error;
      res.status(200).json({ message: "Company updated successfully", company: updatedCompany });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getAllCompanies(req, res) {
    try {
      const { data: companies, error } = await supabase.from('companies').select('*');
      if (error) throw error;

      const formattedCompanies = companies.map(c => ({
        id: c.id,
        name: c.companyName,
        description: c.description,
        website: c.website,
        email: c.email,
        role: c.role,
        companyName: c.companyName,
        location: c.location,
        employees: c.employees,
        industry: c.industry,
        logo: c.logo || null,
        isApproved: c.isApproved,
        internships: c.internships || [],
        phoneNo: c.phoneNo,
        WorkCulture: c.WorkCulture,
        internBenifits: c.internBenifits || [],
        OurValues: c.OurValues || [],
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        subfield: c.subfield || "",
        departments: c.departments || [],
      }));

      res.status(200).json({ companies: formattedCompanies });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getCompanyById(req, res) {
    try {
      const companyId = req.params.id;
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error || !company) return res.status(404).json({ message: "Company not found" });

      const formattedCompany = {
        id: company.id,
        email: company.email,
        companyName: company.companyName,
        role: company.role,
        website: company.website,
        description: company.description,
        logo: company.logo || null,
        isApproved: company.isApproved,
        location: company.location,
        employees: company.employees,
        industry: company.industry,
        phoneNo: company.phoneNo,
        WorkCulture: company.WorkCulture,
        internBenifits: company.internBenifits || [],
        OurValues: company.OurValues || [],
        internships: company.internships || [],
        fullTimeOpportunities: company.fullTimeOpportunities,
        certification: company.certification,
        mentorship: company.mentorship,
        stipend: company.stipend,
        foundedYear: company.foundedYear,
        companyType: company.companyType,
        address: company.address,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        subfield: company.subfield || "",
        departments: company.departments || [],
      };

      res.status(200).json({ company: formattedCompany });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async verifyCompany(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

      const { data: company, error } = await supabase
        .from('companies')
        .select('id, email, password, companyName, logo')
        .eq('email', email)
        .single();

      if (error || !company || company.password !== password) {
        return res.status(401).json({ exists: false, message: "Invalid email or password" });
      }

      return res.status(200).json({
        exists: true,
        id: company.id,
        email: company.email,
        role: 'company',
        companyName: company.companyName,
        profilePicture: company.logo || null,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async deleteCompanyById(req, res) {
    try {
      const companyId = req.params.id;

      const { data, error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId)
        .select();

      if (error || !data.length) return res.status(404).json({ message: "Company not found" });

      res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

export default CompanyController;