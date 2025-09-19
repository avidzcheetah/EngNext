import Student from "../models/studentSchema.js"; // adjust path if needed

class StudentController {
  // Create a new student with all fields
  static async createStudent(req, res) {
    try {
      const studentData = req.body; // take all fields from request body

      // Optional: basic validation for required fields
      const { firstName, lastName, email, password } = studentData;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "firstName, lastName, email, and password are required" });
      }

      // Check if email already exists
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create student document
      const student = new Student(studentData);
      await student.save();

      res.status(201).json({ message: "Student created successfully", student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

static async updateStudent(req, res) {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Update text fields, but skip 'profilePicture' and 'cv'
    Object.keys(req.body).forEach(key => {
      if (key !== "profilePicture" && key !== "cv" && key!=="skills" && key!=="RecentNotifications") {
        student[key] = req.body[key];
      }
    });

   if (req.body.skills) {
  try {
    student.skills = JSON.parse(req.body.skills); // convert string → array
  } catch (e) {
    student.skills = []; // fallback if parse fails
  }
}

  if (req.body.RecentNotifications) {
  try {
    student.RecentNotifications = JSON.parse(req.body.RecentNotifications); // convert string → array
  } catch (e) {
    student.RecentNotifications = []; // fallback if parse fails
  }
}

    // Update files if uploaded and they are actual files
    if (req.files) {
      // CV
      if (req.files.cv && req.files.cv[0] && req.files.cv[0].buffer) {
        student.cv = {
          data: req.files.cv[0].buffer,
          contentType: req.files.cv[0].mimetype,
          filename: req.files.cv[0].originalname,
          uploadDate: new Date()
        };
      }

      // Profile picture
      if (
        req.files.profilePicture &&
        req.files.profilePicture[0] &&
        req.files.profilePicture[0].buffer
      ) {
        student.profilePicture = {
          data: req.files.profilePicture[0].buffer,
          contentType: req.files.profilePicture[0].mimetype,
          filename: req.files.profilePicture[0].originalname,
          uploadDate: new Date()
        };
      }
    }

    await student.save();
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}


  static async getAllStudents(req, res) {
    try {
      const students = await Student.find().select("-cv.data -profilePicture.data"); 
      // Exclude actual file data for performance
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Get single student by ID
  static async getStudentById(req, res) {
    try {
      const student = await Student.findById(req.params.id).select("-cv.data -profilePicture.data");
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.status(200).json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Optional: get actual CV or profile picture
  static async getCV(req, res) {
    try {
      const student = await Student.findById(req.params.id);
      if (!student || !student.cv || !student.cv.data) {
        return res.status(404).json({ message: "CV not found" });
      }
      res.set("Content-Type", student.cv.contentType);
      res.send(student.cv.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Assuming Student is your Mongoose model
static async addRecentNotification(req, res) {
  try {
    const { notification } = req.body; // notification string from frontend

    if (!notification) {
      return res.status(400).json({ message: "Notification is required" });
    }
   
    // Find student by ID and push notification
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      { $push: { RecentNotifications: notification } },
      { new: true } // return the updated document
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
  
    res.status(200).json({
      message: "Notification added successfully",
      RecentNotifications: student.RecentNotifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}



  static async getProfilePicture(req, res) {
    try {
      const student = await Student.findById(req.params.id);
      if (!student || !student.profilePicture || !student.profilePicture.data) {
        return res.status(404).json({ message: "Profile picture not found" });
      }
      res.set("Content-Type", student.profilePicture.contentType);
      res.send(student.profilePicture.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

// Student login / verification (plain text password)
static async loginStudent(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ exists: false, message: "Invalid email or password" });
    }

    // Compare password directly (plain text)
    if (student.password !== password) {
      return res.status(401).json({ exists: false, message: "Invalid email or password" });
    }

    // Convert profile picture to Base64 if exists
    let profilePictureBase64 = null;
    if (student.profilePicture && student.profilePicture.data) {
      profilePictureBase64 = `data:${student.profilePicture.contentType};base64,${student.profilePicture.data.toString('base64')}`;
    }

    // Send all necessary info to frontend
    return res.status(200).json({
      exists: true,
      id: student._id,
      email: student.email,
      role: 'student',
      profilePicture: profilePictureBase64 || null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}


static async incrementApplicationsSent(req, res) {
  try {
    const id = req.params.id;
   
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $inc: { ApplicationsSent: 1 } },
      { new: true } // return updated document
    );
     
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
     
    res.status(200).json({
      
      message: "ApplicationsSent updated successfully",
      ApplicationsSent: updatedStudent.ApplicationsSent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}

static async incrementProfileView(req, res) {
  try {
    const id = req.params.studentId;
   
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $inc: {  ProfileViews: 1 } },
      { new: true } // return updated document
    );
     
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
     
    res.status(200).json({
      
      message: "ApplicationsSent updated successfully",
      ApplicationsSent: updatedStudent.ApplicationsSent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}

//set maximum number of applications for all students
static async setMaximumApplicationsForAll(req, res) {
  try {
    const { maxApplications } = req.body; // get value from request body

    const result = await Student.updateMany(
      {}, // empty filter means all documents
      { $set: { maximumApplications: maxApplications } }
    );

    res.status(200).json({
      message: "Maximum applications updated for all students",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}

//increment ApplicationsSent only if below maximumApplications
static async incrementApplicationsSent(req, res) {
  try {
    const id = req.params.studentId;

    // First find the student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if already at maximum
    if (student.ApplicationsSent >= student.maximumApplications) {
      return res.status(400).json({ 
        message: "Maximum application limit reached",
        current: student.ApplicationsSent,
        maximum: student.maximumApplications
      });
    }

    // Increment if not reached max
    student.ApplicationsSent += 1;
    await student.save();

    res.status(200).json({
      message: "ApplicationsSent incremented successfully",
      ApplicationsSent: student.ApplicationsSent,
      maximumApplications: student.maximumApplications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}

//get maximum number of applications allowed
static async getMaximumApplications(req, res) {
  try {
    const student = await Student.findOne({}, { maximumApplications: 1, _id: 0 });

    if (!student) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json({
      maximumApplications: student.maximumApplications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}



}





export default StudentController;
