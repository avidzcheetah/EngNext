import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const createInternship = async (req, res) => {
  try {
    const { companyId, title, companyName, description, requirements, duration, location, industry } = req.body;

    if (!companyId || !title) {
      return res.status(400).json({ message: "companyId and title are required" });
    }

    const internshipData = {
      id: Date.now().toString(),
      companyId,
      title,
      companyName: companyName || "",
      description: description || "",
      requirements: requirements || [],
      duration: duration || "",
      location: location || "",
      industry: industry || "",
      isActive: true,
    };

    const { data: savedInternship, error } = await supabase
      .from('internships')
      .insert([internshipData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(savedInternship);
  } catch (error) {
    console.error("Error creating internship:", error);
    res.status(400).json({ message: error.message || "Failed to create internship" });
  }
};

export const getAllInternships = async (req, res) => {
  try {
    const { data: internships, error } = await supabase.from('internships').select('*');
    if (error) throw error;
    res.status(200).json(internships);
  } catch (error) {
    console.error("Error fetching all internships:", error);
    res.status(500).json({ message: error.message || "Failed to fetch internships" });
  }
};

export const getInternshipsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!companyId) return res.status(400).json({ message: "companyId is required" });

    const { data: internships, error } = await supabase
      .from('internships')
      .select('*')
      .eq('companyId', companyId);
      
    if (error) throw error;
    res.status(200).json(internships);
  } catch (error) {
    console.error("Error fetching internships by companyId:", error);
    res.status(500).json({ message: error.message || "Failed to fetch internships" });
  }
};

export const deleteInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Internship ID is required" });

    const { data, error } = await supabase
      .from('internships')
      .delete()
      .eq('id', id)
      .select();

    if (error || !data.length) return res.status(404).json({ message: "Internship not found" });

    res.status(200).json({ message: "Internship deleted successfully", deleted: data[0] });
  } catch (error) {
    console.error("Error deleting internship:", error);
    res.status(500).json({ message: error.message || "Failed to delete internship" });
  }
};

export const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Internship ID is required" });

    const { data: internship, error } = await supabase
      .from('internships')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !internship) return res.status(404).json({ message: "Internship not found" });
    res.status(200).json(internship);
  } catch (error) {
    console.error("Error fetching internship by ID:", error);
    res.status(500).json({ message: error.message || "Failed to fetch internship" });
  }
};

export const editInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, title, companyName, description, requirements, duration, location, industry } = req.body;

    if (!id) return res.status(400).json({ message: "Internship ID is required" });
    if (!title) return res.status(400).json({ message: "Title is required" });

    const updateData = {
      companyId,
      title,
      companyName: companyName || "",
      description: description || "",
      requirements: requirements || [],
      duration: duration || "",
      location: location || "",
      industry: industry || "",
      updatedAt: new Date().toISOString()
    };

    const { data: updatedInternship, error } = await supabase
      .from('internships')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedInternship) return res.status(404).json({ message: "Internship not found" });

    res.status(200).json(updatedInternship);
  } catch (error) {
    console.error("Error updating internship:", error);
    res.status(400).json({ message: error.message || "Failed to update internship" });
  }
};