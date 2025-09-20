import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Briefcase,
  Building2,
  Users,
  Eye,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useCompany } from "../../contexts/CompanyContext";

const AdminDashboard: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refetch, companyProfiles } = useCompany();
  const [companies, setCompanies] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [maximumApplications, setMaximumApplications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showform, setshowForm] = useState(false);
  const [restrictionNumber, setRestrictionNumber] = useState(0);
  const [isLoadingInternships, setIsLoadingInternships] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

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
    coverLetter: string;
    interestLevel?: number;
    companyName: string;
    __v: number;
  }

  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (user?.department) {
      fetchInternships();
      fetchRecentApplications();
      fetchTotalNumberOfApplicableInternshipsperStudent();
      refetch();
    }
  }, [user]);

  const fetchTotalNumberOfApplicableInternshipsperStudent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/studentRoutes/getMaximumApplications`
      );
      const data = await res.json();
      setMaximumApplications(data.maximumApplications);
      console.log("Fetched companies:", data.maximumApplications);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForm = () => {
    setshowForm(true);
  };

  const HandleSave = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/studentRoutes/setMaximumApplicationsForAll`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ maxApplications: maximumApplications }),
        }
      );

      if (res.ok) {
        alert("Maximum applications updated successfully");
        setshowForm(false);
        fetchTotalNumberOfApplicableInternshipsperStudent();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update maximum applications");
      }
    } catch (err) {
      console.error("Error updating maximum applications:", err);
      alert("Failed to update maximum applications");
    }
  };

  const fetchRecentApplications = async () => {
    setIsLoadingApplications(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/applicationRoutes/fetchAllApplications`
      );
      const data = await res.json();
      setApplications(data);
      console.log("Fetched applications:", data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const fetchInternships = async () => {
    if (!user || !user.department) return;
    setIsLoadingInternships(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/InternshipRoutes/getByDepartment/${user.department}`
      );
      const data = await res.json();
      setInternships(data);
    } catch (err) {
      console.error("Failed to fetch internships:", err);
    } finally {
      setIsLoadingInternships(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this company? This will also delete all associated internships."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/companyRoutes/deleteCompanyById/${companyId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Company deleted successfully");
        await refetch();
        fetchInternships();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to delete company");
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      alert("Failed to delete company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCompany = (companyId: string, companyIndustry: string) => {
    const industryLower = companyIndustry?.toLowerCase() || "";
    const requiredDeptLower = industryLower.includes("com") ? "com" : "eee";
    const deptLower = user?.department?.toLowerCase() || "";
    const canManage = deptLower === requiredDeptLower;

    if (!canManage) {
      const requiredDepartment = industryLower.includes("com") ? "COM" : "EEE";
      alert(
        `You need a ${requiredDepartment} admin account to manage this company.`
      );
      return;
    }

    navigate("/company/dashboard", {
      state: { companyId },
    });
  };

  const isCompanyManageable = (companyIndustry: string) => {
    if (!user?.department) return false;
    const industryLower = companyIndustry?.toLowerCase() || "";
    const requiredDeptLower = industryLower.includes("com") ? "com" : "eee";
    const deptLower = user.department.toLowerCase();
    return deptLower === requiredDeptLower;
  };

  // Department name formatting
  const deptName = user?.department?.toLowerCase() === "com"
    ? "Computer Engineering"
    : "Electrical and Electronic Engineering";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-2">
            Welcome Admin, {user?.firstName}
          </h1>
          <p className="text-gray-600">
            Manage companies, internships, and student applications for the{" "}
            <span className="font-semibold">{deptName}</span> department.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                companyProfiles.length
              )}
            </h3>
            <p className="text-gray-600 text-sm">Total Companies</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {maximumApplications}
            </h3>
            <p className="text-gray-600 text-sm">
              Applicable Internships per Student
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {isLoadingApplications ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                applications.length
              )}
            </h3>
            <p className="text-gray-600 text-sm">Total Applications</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <PlusCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {isLoadingApplications ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                applications.filter((app) => app.status === "pending").length
              )}
            </h3>
            <p className="text-gray-600 text-sm">Pending Reviews</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Companies Section */}
            <Card className="p-6 shadow-sm hover:shadow-md transition bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> Companies (
                  {companyProfiles.length})
                </h3>
                <Button
                  onClick={() => navigate("/register/company")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Company
                </Button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">
                      Loading companies...
                    </span>
                  </div>
                ) : (
                  companyProfiles.map((company) => {
                    const canManage = isCompanyManageable(
                      company.industry || ""
                    );
                    return (
                      <Card key={company.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            {company.logoUrl && (
                              <img
                                src={company.logoUrl}
                                alt={company.companyName || "Company Logo"}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {company.companyName ?? "Unnamed Company"}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {company.email}
                              </p>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {company.industry || "Technology"}
                              </span>
                            </div>
                            {applications.filter(
                              (app) =>
                                app.companyId === company.id &&
                                app.status === "pending"
                            ).length > 0 && (
                              <span className="bg-green-500 text-white text-xs font-bold rounded-full px-3 py-2">
                                {
                                  applications.filter(
                                    (app) =>
                                      app.companyId === company.id &&
                                      app.status === "pending"
                                  ).length
                                }{" "}
                                New Applications
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant={canManage ? "outline" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleViewCompany(
                                  company.id!,
                                  company.industry || ""
                                )
                              }
                              title={
                                canManage
                                  ? "View and Manage Company"
                                  : "Access Restricted"
                              }
                              className={
                                !canManage
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                              disabled={!canManage}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {canManage ? "View & Manage" : "Restricted"}
                            </Button>
                            {!canManage && (
                              <div className="flex items-center text-xs text-amber-600">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <span>
                                  Need{" "}
                                  {(company.industry || "")
                                    .toLowerCase()
                                    .includes("com")
                                    ? "COM"
                                    : "EEE"}{" "}
                                  admin
                                </span>
                              </div>
                            )}
                            {canManage && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteCompany(company.id!)}
                                title="Delete Company"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
                {!isLoading && companyProfiles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No companies added yet. Click "Add Company" to get started.
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Applications Section */}
            <Card className="p-6 shadow-sm hover:shadow-md transition bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" /> Recent
                  Applications
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
                {applications
                  .sort((a, b) => {
                    const order = { pending: 1, accepted: 2, rejected: 3 };
                    const statusDiff =
                      order[a.status as keyof typeof order] -
                      order[b.status as keyof typeof order];
                    if (statusDiff !== 0) return statusDiff;
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    );
                  })
                  .slice(0, 20)
                  .map((app) => (
                    <Card key={app._id} className="p-4">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {app.studentName ?? "Unknown Student"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          applied to{" "}
                          <span className="font-semibold">
                            {app.companyName}{" "}
                          </span>
                          for{" "}
                          <span className="italic">{app.internshipTitle}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(app.createdAt).toLocaleDateString()} •
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              app.status === "pending"
                                ? "text-yellow-600"
                                : app.status === "accepted"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
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
            <Card className="p-6 text-center shadow-sm hover:shadow-md transition bg-white">
              <h3 className="font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-600">{user?.department} Admin</p>
              <p className="text-sm text-gray-600 mt-2">
                You are logged in using a {deptName} Admin account. You have access
                to add, remove, or manage companies and internships related to the{" "}
                {deptName} Department.
              </p>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-white">
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
                  onClick={() => navigate("/register/admin")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Create New Admin
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={handleForm}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Restrict applications per student
                </Button>
              </div>

              {showform && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="mt-4 space-y-4 border-t pt-4"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Applications
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maximumApplications}
                    onChange={(e) =>
                      setMaximumApplications(Number(e.target.value))
                    }
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter maximum number"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    className="bg-blue-600 text-white"
                    onClick={HandleSave}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    className="bg-gray-600 text-white"
                    onClick={() => setshowForm(false)}
                  >
                    Cancel
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;