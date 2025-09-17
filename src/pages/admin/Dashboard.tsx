import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Briefcase, Building2, Users, Eye, Trash2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useCompany } from "../../contexts/CompanyContext";

const AdminDashboard: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth(); // contains admin info incl. department
  const navigate = useNavigate();
  const { refetch, companyProfiles } = useCompany();
  const [companies, setCompanies] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
 
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data for this admin's department only

interface Application {
  _id: string;
  studentId: string;
  companyId: string;
  studentName: string;
  email: string;
  internshipTitle: string;
  appliedDate: string;
  status: string;
  skills: string[];
  gpa: number;
  createdAt: string;
  updatedAt: string;
  coverLetter:string;
  interestLevel?:number;
  __v: number;
}

const [applications, setApplications] = useState<Application[]>([
  {
    _id: "",
    studentId: "",
    companyId: "",
    studentName: "",
    email: "",
    internshipTitle: "",
    appliedDate: "",
    status: "",
    skills: [], // ✅ corrected from [string]
    gpa: 0,     // start with 0 or any default
    coverLetter:"",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
]);

  useEffect(() => {
    if (user?.department) {
      fetchCompanies();
      fetchInternships();
      fetchRecentApplications();
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

  const fetchRecentApplications = async () => {
    
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/companyRoutes/fetchAllPendingApplications`);
      const data = await res.json();
      setApplications(data);
      console.log("Fetched companies:", data);
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

  const fetchRecentApplications = async () => {
    if (!user || !user.department) return;
    try {
      const res = await fetch(`${baseUrl}/api/applicationRoutes/getRecentByDepartment/${user.department}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company? This will also delete all associated internships.")) {
      return;
    }
    
    try {
      const res = await fetch(`${baseUrl}/api/companyRoutes/deleteCompanyById/${companyId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert("Company deleted successfully");
        await refetch(); 
        fetchCompanies();
        fetchInternships();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to delete company");
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      alert("Failed to delete company");
    }
  };

  const handleViewCompany = (companyId: string) => {
    navigate('/company/dashboard', {
      state: { companyId },
    });
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
            Manage companies, internships, and student applications for the <span className="font-semibold">{user?.department?.toLocaleLowerCase() === 'com'
              ? 'Computer'
              : 'Electrical and Electronic'}</span> department.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{companyProfiles.length}</h3>
            <p className="text-gray-600 text-sm">Total Companies</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{internships.length}</h3>
            <p className="text-gray-600 text-sm">Active Internships</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{applications.length}</h3>
            <p className="text-gray-600 text-sm">Total Applications</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <PlusCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {applications.filter(app => app.status === "pending").length}
            </h3>
            <p className="text-gray-600 text-sm">Pending Reviews</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Companies Section */}
            <Card className="p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> Companies ({companyProfiles.length})
                </h3>
                <Button
                  onClick={() => navigate("/register/company")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Company
                </Button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {companyProfiles.map((company) => (
                  <Card key={company.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        {company.logoUrl && (
                          <img 
                            src={company.logoUrl} 
                            alt={company.companyName || 'Company Logo'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-gray-900">{company.companyName ?? 'Unnamed Company'}</h4>
                          <p className="text-sm text-gray-600">{company.email}</p>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {company.industry || 'Technology'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCompany(company.id!)}
                          title="View Company Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteCompany(company.id!)}
                          title="Delete Company"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {companyProfiles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No companies added yet. Click "Add Company" to get started.
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Applications Section */}
            <Card className="p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" /> Recent Applications
                </h3>
                <Button
                  onClick={() => navigate("/admin/applications")}
                  variant="outline"
                  size="sm"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {applications.slice(0, 5).map((app) => (
                  <Card key={app._id} className="p-4">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {app.studentName ?? "Unknown Student"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        applied to <span className="font-semibold">{app.companyName}</span> 
                        for <span className="italic">{app.internshipTitle}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(app.createdAt).toLocaleDateString()} • Status:{" "}
                        <span className={`font-medium ${
                          app.status === "pending" ? "text-yellow-600" :
                          app.status === "accepted" ? "text-green-600" : "text-red-600"
                        }`}>
                          {app.status}
                        </span>
                      </p>
                    </div>
                  </Card>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No applications submitted yet.
                  </div>
                )}
              </div>
            </Card>
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

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate("/register/company")}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New Company
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate("/admin/allInternships")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Manage Internships
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate("/admin/applications")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Review Applications
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
