import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Briefcase, Building2, Users, Edit3 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth(); // contains admin info incl. department
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data for this admin's department only
  useEffect(() => {
    if (user?.department) {
      fetchCompanies();
      fetchInternships();
    }
  }, [user]);

  const fetchCompanies = async () => {
    if (!user || !user.department) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/companyRoutes/getByDepartment/${user.department}`);
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInternships = async () => {
    if (!user || !user.department) return;
    try {
      const res = await fetch(`${baseUrl}/api/InternshipRoutes/getByDepartment/${user.department}`);
      const data = await res.json();
      setInternships(data);
    } catch (err) {
      console.error("Failed to fetch internships:", err);
    }
  };

  const fetchApplications = async (internshipId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/applicationRoutes/getByInternship/${internshipId}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-2">
            Welcome Admin, {user?.firstName}
          </h1>
          <p className="text-gray-600">
            Manage companies, internships, and student applications for the <span className="font-semibold">{user?.department}</span> department.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Companies Section */}
            <Card className="p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> Companies
                </h3>
                <Button
                  onClick={() => navigate("/admin/addCompany")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Company
                </Button>
              </div>
              <div className="space-y-3">
                {companies.map((company) => (
                  <Card key={company._id} className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">{company.name}</h4>
                      <p className="text-sm text-gray-600">{company.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/admin/editCompany/${company._id}`)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Internships Section */}
            <Card className="p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" /> Internships
                </h3>
                <Button
                  onClick={() => navigate("/admin/postInternship")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Post Internship
                </Button>
              </div>
              <div className="space-y-3">
                {internships.map((internship) => (
                  <Card key={internship._id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{internship.title}</h4>
                        <p className="text-sm text-gray-600">{internship.companyName}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/admin/editInternship/${internship._id}`)}
                        >
                          <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fetchApplications(internship._id)}
                        >
                          <Users className="w-4 h-4 mr-2" /> View Applicants
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Applications Section */}
            {applications.length > 0 && (
              <Card className="p-6 shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" /> Applications
                </h3>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <Card key={app._id} className="p-4">
                      <h4 className="font-bold text-gray-900">{app.studentName}</h4>
                      <p className="text-sm text-gray-600">{app.email}</p>
                      <p className="text-xs text-gray-500">
                        GPA: {app.gpa} | Skills: {app.skills.join(", ")}
                      </p>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-sm text-gray-600">Admin - {user?.department}</p>
              <Button
                fullWidth
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={() => navigate("/admin/profile")}
              >
                Manage Profile
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;