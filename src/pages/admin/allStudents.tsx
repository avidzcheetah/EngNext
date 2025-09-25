import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Eye,
  Loader2,
  AlertCircle,
  Search,
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

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/api/studentRoutes/getAllStudents`);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-2 break-words">
            All Students
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            View and manage student profiles across all departments.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 animate-slide-in">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
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
                    className="p-4 shadow-sm hover:shadow-md transition bg-white"
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
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tailwind Animation Classes */}
      <style>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AllStudents;