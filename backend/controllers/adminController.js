// controllers/AdminController.js
import Admin from "../models/adminSchema.js"; // adjust path if needed

class AdminController {
  // ✅ Create a new Admin
  static async createAdmin(req, res) {
    try {
      const { username, email, password, department } = req.body;

      // Basic validation
      if (!username || !email || !password || !department) {
        return res.status(400).json({
          message: "username, email, password, and department are required",
        });
      }

      // Check if email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create admin
      const admin = new Admin({ username, email, password, department });
      await admin.save();

      res.status(201).json({ message: "Admin created successfully", admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // ✅ Verify Admin login
  static async verifyAdmin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res
          .status(401)
          .json({ exists: false, message: "Invalid email or password" });
      }

      // Compare plain-text password (⚠️ in production use bcrypt!)
      if (admin.password !== password) {
        return res
          .status(401)
          .json({ exists: false, message: "Invalid email or password" });
      }

      // Return minimal info
      return res.status(200).json({
        exists: true,
        id: admin._id,
        firstName: admin.username,
        email: admin.email,
        role: "admin",
        department: admin.department,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

export default AdminController;
