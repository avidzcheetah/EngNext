import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const createApplication = async (req, res) => {
  try {
    const applicationData = { ...req.body };

    if (req.file) {
      applicationData.cv = req.file.path;
    }

    applicationData.id = Date.now().toString();

    const { data: savedApplication, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const acceptApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: updatedApp, error } = await supabase
      .from('applications')
      .update({ status: "accepted", updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: updatedApp, error } = await supabase
      .from('applications')
      .update({ status: "rejected", updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { data: apps, error } = await supabase
      .from('applications')
      .select('*')
      .eq('companyId', companyId);
      
    if (error) throw error;
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchAllApplications = async (req, res) => {
  try {
    const { data: apps, error } = await supabase.from('applications').select('*');
    if (error) throw error;
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { data: apps, error } = await supabase
      .from('applications')
      .select('*')
      .eq('studentId', studentId);
      
    if (error) throw error;
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchByInternshipId = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { data: apps, error } = await supabase
      .from('applications')
      .select('*')
      .eq('internshipId', internshipId);
      
    if (error) throw error;
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
