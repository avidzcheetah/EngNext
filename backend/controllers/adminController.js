import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class AdminController {
  static async createAdmin(req, res) {
    try {
      const { username, email, password, department } = req.body;

      if (!username || !email || !password || !department) {
        return res.status(400).json({
          message: "username, email, password, and department are required",
        });
      }

      const { data: existingAdmin } = await supabase
        .from('admins')
        .select('id')
        .eq('email', email)
        .single();

      if (existingAdmin) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const adminData = {
        id: Date.now().toString(),
        username,
        email,
        password,
        department
      };

      const { data: admin, error } = await supabase
        .from('admins')
        .insert([adminData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ message: "Admin created successfully", admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async verifyAdmin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, username, email, password, department')
        .eq('email', email)
        .single();

      if (error || !admin || admin.password !== password) {
        return res.status(401).json({ exists: false, message: "Invalid email or password" });
      }

      return res.status(200).json({
        exists: true,
        id: admin.id,
        firstName: admin.username,
        email: admin.email,
        role: "admin",
        department: admin.department,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

export default AdminController;
