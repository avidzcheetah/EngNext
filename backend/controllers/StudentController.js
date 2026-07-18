import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class StudentController {
  // Create a new student with all fields
  static async createStudent(req, res) {
    try {
      const studentData = req.body;

      // Optional: basic validation for required fields
      const { firstName, lastName, email, password } = studentData;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "firstName, lastName, email, and password are required" });
      }

      // Check if email already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('email', email)
        .single();

      if (existingStudent) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Generate random ID (or let Supabase do it if default uuid, but we defined text pk)
      const id = Date.now().toString(); // simple ID generator for this text PK
      studentData.id = id;

      // Create student document
      const { data: student, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ message: "Student created successfully", student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async updateStudent(req, res) {
    try {
      const studentId = req.params.id;
      
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();
        
      if (fetchError || !student) return res.status(404).json({ message: "Student not found" });

      const updates = {};
      Object.keys(req.body).forEach(key => {
        if (key !== "profilePicture" && key !== "cv" && key!=="skills" && key!=="RecentNotifications"  && key !=="subfields") {
          updates[key] = req.body[key];
        }
      });

      if (req.body.skills) {
        try { updates.skills = JSON.parse(req.body.skills); } catch (e) { updates.skills = []; }
      }

      if (req.body.subfields) {
        try { updates.subfields = JSON.parse(req.body.subfields); } catch (e) { updates.subfields = []; }
      }

      if (req.body.RecentNotifications) {
        try { updates.RecentNotifications = JSON.parse(req.body.RecentNotifications); } catch (e) { updates.RecentNotifications = []; }
      }

      // Update files if uploaded (Cloudinary)
      if (req.files) {
        if (req.files.cv && req.files.cv[0]) updates.cv = req.files.cv[0].path;
        if (req.files.profilePicture && req.files.profilePicture[0]) updates.profilePicture = req.files.profilePicture[0].path;
      }
      
      updates.updatedAt = new Date().toISOString();

      const { data: updatedStudent, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', studentId)
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getAllStudents(req, res) {
    try {
      const { data: students, error } = await supabase.from('students').select('*');
      if (error) throw error;
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getStudentById(req, res) {
    try {
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', req.params.id)
        .single();
        
      if (error || !student) return res.status(404).json({ message: "Student not found" });
      res.status(200).json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async addRecentNotification(req, res) {
    try {
      const { notification } = req.body;
      if (!notification) return res.status(400).json({ message: "Notification is required" });

      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('RecentNotifications')
        .eq('id', req.params.studentId)
        .single();

      if (fetchError || !student) return res.status(404).json({ message: "Student not found" });

      const newNotifications = [...(student.RecentNotifications || []), notification];

      const { data: updatedStudent, error: updateError } = await supabase
        .from('students')
        .update({ RecentNotifications: newNotifications, updatedAt: new Date().toISOString() })
        .eq('id', req.params.studentId)
        .select('RecentNotifications')
        .single();

      if (updateError) throw updateError;

      res.status(200).json({
        message: "Notification added successfully",
        RecentNotifications: updatedStudent.RecentNotifications,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async loginStudent(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

      const { data: student, error } = await supabase
        .from('students')
        .select('id, email, password, profilePicture')
        .eq('email', email)
        .single();

      if (error || !student || student.password !== password) {
        return res.status(401).json({ exists: false, message: "Invalid email or password" });
      }

      return res.status(200).json({
        exists: true,
        id: student.id,
        email: student.email,
        role: 'student',
        profilePicture: student.profilePicture || null,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async incrementApplicationsSent(req, res) {
    try {
      const id = req.params.id;
      
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('ApplicationsSent, maximumApplications')
        .eq('id', id)
        .single();
        
      if (fetchError || !student) return res.status(404).json({ message: "Student not found" });

      if (student.ApplicationsSent >= student.maximumApplications) {
        return res.status(400).json({ 
          message: "Maximum application limit reached",
          current: student.ApplicationsSent,
          maximum: student.maximumApplications
        });
      }

      const { data: updatedStudent, error: updateError } = await supabase
        .from('students')
        .update({ ApplicationsSent: student.ApplicationsSent + 1, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select('ApplicationsSent, maximumApplications')
        .single();
        
      if (updateError) throw updateError;
       
      res.status(200).json({
        message: "ApplicationsSent updated successfully",
        ApplicationsSent: updatedStudent.ApplicationsSent,
        maximumApplications: updatedStudent.maximumApplications
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async incrementProfileView(req, res) {
    try {
      const id = req.params.studentId;
      
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('ProfileViews')
        .eq('id', id)
        .single();
        
      if (fetchError || !student) return res.status(404).json({ message: "Student not found" });

      const { data: updatedStudent, error: updateError } = await supabase
        .from('students')
        .update({ ProfileViews: student.ProfileViews + 1, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select('ProfileViews')
        .single();
        
      if (updateError) throw updateError;
       
      res.status(200).json({
        message: "ProfileViews updated successfully",
        ProfileViews: updatedStudent.ProfileViews,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async setMaximumApplicationsForAll(req, res) {
    try {
      let { maxApplications } = req.body;
      const parsedValue = Number(maxApplications);

      if (isNaN(parsedValue) || parsedValue <= 0) {
        return res.status(400).json({ message: "Invalid maximumApplications value" });
      }

      // Supabase doesn't support updateMany easily without eq. We can update where id is not null (which is all)
      const { data, error } = await supabase
        .from('students')
        .update({ maximumApplications: parsedValue, updatedAt: new Date().toISOString() })
        .not('id', 'is', null);

      if (error) throw error;

      res.status(200).json({
        message: "Maximum applications updated for all students",
      });
    } catch (error) {
      console.error("Error updating maximum applications:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getMaximumApplications(req, res) {
    try {
      const { data: student, error } = await supabase
        .from('students')
        .select('maximumApplications')
        .limit(1)
        .single();

      if (error || !student) {
        // If there are no students yet, return a default max applications value
        return res.status(200).json({ maximumApplications: 0 });
      }

      res.status(200).json({
        maximumApplications: student.maximumApplications
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

export default StudentController;
