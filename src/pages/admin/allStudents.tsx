import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Eye,
  Loader2,
  AlertCircle,
  Search,
  Edit,
  Trash,
  Save,
  Check,
  X,
  Plus,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  skills: string[];
  gpa?: number;
  year: string;
  department: string;
  registrationNumber: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  availability: boolean;
}

const AllStudents: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [editForm, setEditForm] = useState<StudentProfile>({} as StudentProfile);
  const [newSkill, setNewSkill] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [progress, setProgress] = useState(100);

  const isAdmin = user?.role === "admin";

  // Calculate department counts
  const departmentCounts = students.reduce(
    (acc, student) => {
      acc[student.department] = (acc[student.department] || 0) + 1;
      return acc;
    },
    {
      "Electrical & Electronic Engineering": 0,
      "Computer Engineering": 0,
      "Mechanical Engineering": 0,
      "Civil Engineering": 0,
    } as Record<string, number>
  );

  useEffect(() => {
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (editingStudent) {
      setEditForm(editingStudent);
    }
  }, [editingStudent]);

  useEffect(() => {
    if (showSuccessPopup) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev - (100 / 50), 0)); // 5 seconds
      }, 100);
      const timeout = setTimeout(() => {
        setShowSuccessPopup(false);
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [showSuccessPopup]);

  const fetchAllStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/api/studentRoutes/getAllStudents`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data.map((s: any) => ({ ...s, id: s._id || s.id })));
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`${baseUrl}/api/studentRoutes/deleteStudent/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete student");
      setStudents(students.filter((s) => s.id !== id));
      setSuccess("Student deleted successfully!");
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Failed to delete student:", err);
      setError("Failed to delete student. Please try again.");
      setShowSuccessPopup(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const formData = new FormData();
      (Object.keys(editForm) as (keyof StudentProfile)[]).forEach((key) => {
        if (key !== "skills") {
          const value = editForm[key];
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });
      formData.append("skills", JSON.stringify(editForm.skills || []));

      const res = await fetch(`${baseUrl}/api/studentRoutes/updatestudents/${editingStudent.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update student");
      }
      const updated = await res.json();
      setStudents(students.map((s) => (s.id === updated.id ? { ...updated, id: updated._id || updated.id } : s)));
      setEditingStudent(null);
      setSuccess("Student profile updated successfully!");
      setShowSuccessPopup(true);
    } catch (err: any) {
      console.error("Failed to update student:", err);
      setError(err.message || "Failed to update student. Please try again.");
      setEditingStudent(null);
      setShowSuccessPopup(true);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.registrationNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedStudents = filteredStudents.reduce(
    (acc, student) => {
      if (!acc[student.department]) {
        acc[student.department] = [];
      }
      acc[student.department].push(student);
      return acc;
    },
    {} as Record<string, StudentProfile[]>
  );

  const departmentOrder = [
    "Computer Engineering",
    "Electrical & Electronic Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ];

  const sortedDepartments = departmentOrder.filter((dept) =>
    Object.keys(groupedStudents).includes(dept)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 sm:h-12 bg-white/20 rounded-lg mb-4 mx-auto max-w-md"></div>
              <div className="h-4 sm:h-6 bg-white/10 rounded-lg mx-auto max-w-lg"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading students...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-4">
            All Students
            {isAdmin && (
              <span className="inline-flex items-center px-4 py-2 bg-red-600/80 backdrop-blur-sm rounded-full text-base sm:text-lg font-semibold shadow-md">
                Admin Mode
              </span>
            )}
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-blue-100 mb-4 sm:mb-6 px-4">
            View and manage student profiles across all departments.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {departmentCounts["Computer Engineering"]}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">Computer</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {departmentCounts["Electrical & Electronic Engineering"]}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">EEE</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {departmentCounts["Mechanical Engineering"]}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">Mechanical</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {departmentCounts["Civil Engineering"]}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">Civil</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message on Parent Page */}
        {error && !showSuccessPopup && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 animate-slide-in">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Success/Error Popup */}
        {showSuccessPopup && (success || error) && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 transition-opacity duration-300">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className={success ? "bg-green-100 p-2 rounded-full" : "bg-red-100 p-2 rounded-full"}>
                  {success ? (
                    <Check className="w-8 h-8 text-green-500" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {success ? "Success" : "Error"}
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-center">{success || error}</p>
              <div className="relative w-full h-1 bg-gray-200 rounded-full mb-6">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, email, or registration number"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Students Sections */}
        {sortedDepartments.length === 0 && searchTerm ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No students found matching your search.
          </div>
        ) : sortedDepartments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No students available.
          </div>
        ) : (
          sortedDepartments.map((dept) => (
            <div key={dept} className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {dept} ({groupedStudents[dept].length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedStudents[dept].map((student) => (
                  <Card
                    key={student.id}
                    className="p-4 shadow-sm hover:shadow-md transition bg-white rounded-xl border border-gray-100"
                  >
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={`${baseUrl}/api/studentRoutes/getProfilePicture/${student.id}`}
                            alt={`${student.firstName || "Student"} ${student.lastName || ""}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iMTYiIHk9IjM2IiBmb250LXNpemU9IjE2IiBmaWxsPSIjYWFhIj5Vc2VyPC90ZXh0Pjwvc3ZnPg==";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">
                            {student.firstName || "Unknown"} {student.lastName || "Student"}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {student.email || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Reg: {student.registrationNumber || "N/A"}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              student.availability ? "bg-green-500" : "bg-gray-400"
                            }`}
                            title={
                              student.availability
                                ? "Available for opportunities"
                                : "Not available"
                            }
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Year:</span> {student.year || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">GPA:</span>{" "}
                          {student.gpa?.toFixed(2) || "N/A"}
                        </p>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Skills:
                          </span>
                          <div className="text-sm text-blue-800 line-clamp-2">
                            {(student.skills || []).join(", ")}
                            {(student.skills || []).length > 5 && (
                              <span className="text-xs text-blue-600">
                                {" "}
                                +{(student.skills || []).length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/student/publicprofile/${student.id}`)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      {isAdmin && (
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setEditingStudent(student)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white opacity-75 hover:opacity-100 transition-opacity duration-200"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(student.id)}
                            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white opacity-75 hover:opacity-100 transition-opacity duration-200"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Student Profile
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+94 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    name="department"
                    value={editForm.department || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">None</option>
                    <option value="Electrical & Electronic Engineering">Electrical & Electronic Engineering</option>
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <select
                    name="year"
                    value={editForm.year || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">None</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    name="gpa"
                    value={editForm.gpa || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={editForm.registrationNumber || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  rows={4}
                  placeholder="Tell us about the student, their interests, and career goals..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Expertise</label>
                <div className="mb-4 text-blue-700">
                  {editForm.skills?.map((skill, index) => (
                    <span key={index} className="inline-flex items-center">
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-blue-500 hover:text-red-500 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index < (editForm.skills?.length || 0) - 1 && <span>,&nbsp;</span>}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Add a skill..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Button
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                <input
                  type="url"
                  name="portfolio"
                  value={editForm.portfolio || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://portfolio.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={editForm.linkedin || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={editForm.github || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="availability"
                  checked={editForm.availability || false}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Available for opportunities
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tailwind Animation Classes */}
      <style>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AllStudents;