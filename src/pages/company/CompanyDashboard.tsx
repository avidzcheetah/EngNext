import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import {
  Plus,
  Users,
  Eye,
  Download,
  MessageCircle,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "applications" | "positions" | "company"
  >("applications");
  const [showJobModal, setShowJobModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverletter, setCoverletter] = useState(false);
  const [coverletterstudentID, setcoverletterstudentId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isUpdatingJob, setIsUpdatingJob] = useState(false);
  const [isDeletingJob, setIsDeletingJob] = useState(false);
  const [isUpdatingApplication, setIsUpdatingApplication] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const { companyId } = location.state || { companyId: null };
  const id = companyId;
  console.log("Company ID from state:", id);

interface CompanyProfileData {
  id?: string;
  description?: string;
  website?: string;
  email?: string;
  role?: string;
  logo?: string;
  logoType?: string;
  logoUrl?: string;
  companyName?: string;
  location?: string;
  industry?: string;
  subfield?: string;
  phoneNo?: string;
}

  const [companyProfile, setCompanyProfile] = useState<CompanyProfileData | null>(null);

  const handleEdit = (internshipId: string) => {
    const foundJob = Job.find(j => j._id === internshipId) || null;
    setEditJob(foundJob);
    setEdit(true);
    setEditId(internshipId);

    if (foundJob) {
      setFdata({
        title: foundJob.title || "",
        description: foundJob.description || "",
        requirements: foundJob.requirements || [],
        duration: foundJob.duration || "",
        location: foundJob.location || "",
      });
    }
  };

  const [coverletterID, setcoverletterID] = useState("");

  const handleViewCoverletter = (id: string, id2: string) => {
    setCoverletter(true);
    setcoverletterstudentId(id);
    setcoverletterID(id2);
  };

  const handleCancelCoverLetter = () => {
    setCoverletter(false);
    setcoverletterstudentId("");
  };

  const handleCancel = () => {
    setEdit(false);
    setShowJobModal(false);
    setFdata({
      title: "",
      description: "",
      requirements: [],
      duration: "",
      location: "",
    });
  };

  const handleViewApplication = (internshipId: string) => {
    navigate("/company/application", { state: { internshipId } });
  };

  const [Job, setJob] = useState<
    Array<{
      _id?: string;
      companyName?: string;
      title?: string;
      description?: string;
      requirements?: string[];
      duration?: string;
      location?: string;
      isActive?: boolean;
      industry?: string;
    }>
  >([]);

  const [editJob, setEditJob] = useState<{
    _id?: string;
    companyName?: string;
    title?: string;
    description?: string;
    requirements?: string[];
    duration?: string;
    location?: string;
    isActive?: boolean;
    industry?: string;
  } | null>(null);

  const sendAcceptmail = (studentid: string) => {
    const studentName = applications.find(app => app._id === studentid)?.studentName;
    const position = applications.find(app => app._id === studentid)?.internshipTitle;
    const email = applications.find(app => app._id === studentid)?.email;
    
    emailjs
      .send(
        "service_yeke3la",
        "template_mogx38j",
        {
          toemail: email,
          applicat_name: studentName,
          title: position,
          hr_email: companyProfile?.email,
          organization_name: companyProfile?.companyName,
          time: new Date().toLocaleDateString(),
          email: companyProfile?.email,
        },
        "xoBLJNkyjseJaPApW"
      )
      .then(
        (result) => {
          console.log("✅ Email sent:", result.text);
        },
        (error) => {
          console.error("❌ Email failed:", error.text);
        }
      );
  };

  const sendRejectemail = (studentid: string) => {
    const studentName = applications.find(app => app._id === studentid)?.studentName;
    const position = applications.find(app => app._id === studentid)?.internshipTitle;
    const email = applications.find(app => app._id === studentid)?.email;
    
    emailjs
      .send(
        "service_yeke3la",
        "template_06tm1fa",
        {
          toemail: email,
          Applicant_Name: studentName,
          Position: position,
          hr_email: companyProfile?.email,
          Organization_Name: companyProfile?.companyName,
          time: new Date().toLocaleDateString(),
          email: companyProfile?.email,
          name: companyProfile?.companyName,
        },
        "xoBLJNkyjseJaPApW"
      )
      .then(
        (result) => {
          console.log("✅ Email sent:", result.text);
        },
        (error) => {
          console.error("❌ Email failed:", error.text);
        }
      );
  };

  const [fData, setFdata] = useState<{
    companyName?: string;
    title?: string;
    description?: string;
    requirements?: string[];
    duration?: string;
    location?: string;
    industry?: string;
  } | null>(null);

  const handleViewProfile = (id: string, ID: string) => {
    sendMessageToStudent(
      ID,
      `Your account has been viewed by ${companyProfile?.companyName}`
    );
    navigate("/student/PublicProfile", { state: { id: id } });
    incrementProfileView(ID);
  };

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
  __v: number;
}

  const [applications, setApplications] = useState<Application[]>([]);

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      setError("");

      const res = await fetch(
        `${baseUrl}/api/InternshipRoutes/getInternshipsByCompanyId/${id}`
      );

      const data = await res.json();
      console.log("API response:", data);

      setJob(Array.isArray(data) ? data : data.internships || []);

      useEffect(() => {
        if (!id) {
          navigate("/login");
        }
        console.log(id);
      }, [id, navigate]);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const fetchApplication = async () => {
    setIsLoadingApplications(true);
    try {
      setError("");

      const res = await fetch(
        `${baseUrl}/api/applicationRoutes/fetchByCompanyId/${id}`
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log("API response:", data);

      setApplications(data);
    } catch (error: any) {
      console.error("Failed to fetch applications:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const incrementProfileView = async (ID: string) => {
    const studentID = applications.find(app => app._id === ID)?.studentId;
    try {
      const res = await fetch(
        `${baseUrl}/api/studentRoutes/incrementProfileView/${studentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Error incrementing profile view: ${res.status}`);
      }

      console.log("Profile view incremented successfully");
    } catch (error) {
      console.error("Error in incrementProfileView:", error);
    }
  };

  const sendMessageToStudent = async (ID: string, message: string) => {
    const studentID = applications.find(app => app._id === ID)?.studentId;

    try {
      const res = await fetch(
        `${baseUrl}/api/studentRoutes/addRecentNotification/${studentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notification: message }),
        }
      );

      if (!res.ok) {
        throw new Error(`Error sending message: ${res.status}`);
      }

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error in sendMessageToStudent:", error);
    }
  };

  const fetchCompanyDetails = async () => {
    setIsLoadingProfile(true);
    try {
      setError("");

      const res = await fetch(
        `${baseUrl}/api/companyRoutes/getById/${id}`
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      console.log("API response:", data);

      if (data.company.logo) {
        const logoDataUrl = `data:${
          data.company.logoType || "image/png"
        };base64,${data.company.logo}`;
        data.company.logoUrl = logoDataUrl;
      }

      setCompanyProfile(data.company);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
    fetchJobs();
    fetchApplication();
  }, [id]);

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    email: "",
    description: "",
    logoFile: null as File | null,
    location: "",
    industry: "",
    subfield: "",
    phoneNo: "",
  });

  useEffect(() => {
    if (companyProfile) {
      setFormData((prev) => ({
        ...prev,
        companyName: companyProfile.companyName || "",
        website: companyProfile.website || "",
        email: companyProfile.email || "",
        description: companyProfile.description || "",
        logoFile: prev.logoFile || null,
        location: companyProfile.location || "",
        industry: companyProfile.industry || "",
        subfield: companyProfile.subfield || "",
        phoneNo: companyProfile.phoneNo || "",
      }));
    }
  }, [companyProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, logoFile: file }));

      const reader = new FileReader();
      reader.onload = () => {
        setCompanyProfile((prev) => ({
          ...prev,
          logoUrl: reader.result as string,
          id: prev?.id,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSavingProfile(true);
    try {
      const formToSend = new FormData();
      formToSend.append("companyName", formData.companyName);
      formToSend.append("website", formData.website);
      formToSend.append("email", formData.email);
      formToSend.append("description", formData.description);
      formToSend.append("location", formData.location);
      formToSend.append("industry", formData.industry);
      formToSend.append("subfield", formData.subfield);
      formToSend.append("phoneNo", formData.phoneNo);

      if (formData.logoFile) formToSend.append("logo", formData.logoFile);

      const res = await fetch(
        `${baseUrl}/api/companyRoutes/updateCompany/${companyProfile?.id}`,
        {
          method: "PUT",
          body: formToSend,
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      console.log("Updated company:", data);
      setCompanyProfile(data.company);
      setShowSuccessModal(true);
      
      // Auto-hide success modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);

    } catch (err: any) {
      console.error(err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddPosition = () => {
    setShowJobModal(true);
  };

  const handleDelete = async (ID: string) => {
    setIsDeletingJob(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/InternshipRoutes/deleteInternshipById/${ID}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Error deleting job position: " + data.message);
        return;
      }

      alert("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting.");
    } finally {
      setIsDeletingJob(false);
    }
  };

  const handleJobPosition = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCreatingJob(true);

    try {
      const response = await fetch(`${baseUrl}/api/InternshipRoutes/createInternship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: id,
          companyName: companyProfile?.companyName,
          duration: fData?.duration,
          requirements: fData?.requirements,
          description: fData?.description,
          title: fData?.title,
          location: fData?.location,
          industry: companyProfile?.industry,
        }),
      });

      if (!response.ok) throw new Error("Failed to create job position");

      const data = await response.json();
      alert("job created successfully!");
      console.log("job created:", data);
      setShowJobModal(false);
      fetchJobs();
      setFdata({
        title: "",
        description: "",
        requirements: [],
        duration: "",
        location: "",
      });

    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleEditPosition = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsUpdatingJob(true);

    try {
      const response = await fetch(`${baseUrl}/api/InternshipRoutes/editInternshipById/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: id,
          companyName: companyProfile?.companyName,
          duration: fData?.duration,
          requirements: fData?.requirements,
          description: fData?.description,
          title: fData?.title,
          location: fData?.location,
          industry: companyProfile?.industry,
        }),
      });

      if (!response.ok) throw new Error("Failed to edit the job");

      const data = await response.json();
      alert("Changes saved successfully!");
      console.log("job edited successfully:", data);
      setEdit(false);
      fetchJobs();
      setFdata({
        title: "",
        description: "",
        requirements: [],
        duration: "",
        location: "",
      
      });

    } catch (error) {
      console.error("Error editing job:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsUpdatingJob(false);
    }
  };

  const handleAccept = async (ID: string) => {
    setIsUpdatingApplication(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/applicationRoutes/acceptApplication/${ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Failed to update the status. Try again.");
        throw new Error(errorData.message || "Failed to update the status");
      }

      const data = await response.json();
      console.log("Application status updated:", data);
      alert("Application accepted successfully!");
      sendAcceptmail(ID);
      fetchApplication();
      
      sendMessageToStudent(ID, `${companyProfile?.companyName} has accepted your application. Check your mail`);

    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsUpdatingApplication(false);
    }
  };

  const handleReject = async (ID: string) => {
    setIsUpdatingApplication(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/applicationRoutes/rejectApplication/${ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Failed to update the status. Try again.");
        throw new Error(errorData.message || "Failed to update the status");
      }

      const data = await response.json();
      console.log("Application status updated:", data);
      alert("Application rejected successfully!");
      fetchApplication();
      sendRejectemail(ID);
      
      sendMessageToStudent(ID, `${companyProfile?.companyName} has rejected your application. Check your mail`);

    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsUpdatingApplication(false);
    }
  };

  const handleDownloadCV = async (id: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/studentRoutes/getCV/${id}`
      );

      if (!response.ok) {
        throw new Error("CV download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const disposition = response.headers.get("Content-Disposition");
      let filename = "CV.pdf";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : String(error));
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-8 rounded-xl shadow-2xl bg-white text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Changes Saved!</h3>
        <p className="text-gray-600 mb-6">
          Your company profile has been updated successfully.
        </p>
        <Button
          onClick={() => setShowSuccessModal(false)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Continue
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            {isLoadingProfile ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading Dashboard...
              </span>
            ) : (
              `Company Dashboard - ${formData.companyName}`
            )}
          </h1>
          <p className="text-gray-600">
            Manage your job programs and candidates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <Users className="w-6 h-6 text-blue-600" />,
              value: applications.length,
              label: "Total Applications",
              color: "bg-blue-100",
              isLoading: isLoadingApplications,
            },
            {
              icon: <Eye className="w-6 h-6 text-teal-600" />,
              value: Job.length,
              label: "Active Positions",
              color: "bg-teal-100",
              isLoading: isLoadingJobs,
            },
            {
              icon: <MessageCircle className="w-6 h-6 text-orange-600" />,
              value: applications.filter(app => app.status === "pending").length,
              label: "Pending Reviews",
              color: "bg-orange-100",
              isLoading: isLoadingApplications,
            },
            {
              icon: <Download className="w-6 h-6 text-green-600" />,
              value: applications.filter(app => app.status === "accepted").length,
              label: "Accepted Applications",
              color: "bg-green-100",
              isLoading: isLoadingApplications,
            },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl"
            >
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
              >
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  stat.value
                )}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              {
                key: "applications",
                label: `Applications (${applications.length})`,
              },
              {
                key: "positions",
                label: `Job Positions (${Job.length})`,
              },
              { key: "company", label: "Company Profile" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`pb-2 transition-all text-sm font-medium border-b-2 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            {isLoadingApplications ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading applications...</span>
              </div>
            ) : (
              [
                ...applications
                  .filter((app) => app.status === "pending")
                  .sort((a, b) => (b.interestLevel ?? 0) - (a.interestLevel ?? 0)),
                ...applications
                  .filter((app) => app.status === "accepted")
                  .sort((a, b) => (b.interestLevel ?? 0) - (a.interestLevel ?? 0)),
                ...applications
                  .filter((app) => app.status === "rejected")
                  .sort((a, b) => (b.interestLevel ?? 0) - (a.interestLevel ?? 0)),
              ].map((forms) => (
                <Card
                  key={forms._id}
                  className="p-6 hover:shadow-lg transition rounded-xl bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                        {forms.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {forms.studentName}
                        </h3>
                        <p className="text-gray-600">{forms.email}</p>
                        <p className="text-sm text-blue-600">{forms.internshipTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(
                          forms.status
                        )}`}
                      >
                        {forms.status.charAt(0).toUpperCase() + forms.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied on{" "}
                        {new Date(forms.appliedDate).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {forms.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm hover:bg-blue-100 transition"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Interest Level:</span>
                      <span
                        className={`px-3 py-1 rounded-full font-semibold text-white ${
                          (forms.interestLevel ?? 0) >= 80
                            ? "bg-green-600"
                            : (forms.interestLevel ?? 0) >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {forms.interestLevel ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:scale-105 transition"
                      onClick={() => handleViewProfile(forms.studentId, forms._id)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadCV(forms.studentId)}
                    >
                      <Download className="w-4 h-4 mr-1" /> Download CV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCoverletter(forms.studentId, forms._id)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View Cover Letter
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleAccept(forms._id)}
                      disabled={isUpdatingApplication}
                    >
                      {isUpdatingApplication ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : null}
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(forms._id)}
                      disabled={isUpdatingApplication}
                    >
                      {isUpdatingApplication ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : null}
                      Reject
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Positions Tab */}
        {activeTab === "positions" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Job Positions</h2>
              <Button
                onClick={handleAddPosition}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Position
              </Button>
            </div>

            <div className="space-y-6">
              {isLoadingJobs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
                  <span className="text-gray-600">Loading positions...</span>
                </div>
              ) : (
                Job.map((internship) => (
                  <Card
                    key={internship._id}
                    className="p-6 hover:shadow-lg transition bg-white rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {internship.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {internship.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {internship.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {internship.duration}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          internship.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {internship.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(internship._id || "")}
                        disabled={isUpdatingJob}
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(internship._id || "")}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Applications
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(internship._id || "")}
                        disabled={isDeletingJob}
                      >
                        {isDeletingJob ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Company Profile Tab */}
        {activeTab === "company" && (
          <Card className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-6">Company Profile</h2>
            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading profile...</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({...prev, industry: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    >
                      <option value="">Select Industry</option>
                      <option value="EEE">Electrical and Electronic Engineering</option>
                      <option value="Com">Computer Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subfield
                    </label>
                    <input
                      type="text"
                      name="subfield"
                      value={formData.subfield || ""}
                      onChange={handleChange}
                      placeholder="e.g., Power Systems, Web Development, AI/ML"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Logo
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition">
                      {companyProfile?.logoUrl ? (
                        <img
                          src={companyProfile.logoUrl}
                          alt={formData.description || "Company Logo"}
                          className="w-40 h-40 mx-auto mb-2 rounded object-cover"
                        />
                      ) : (
                        <div className="w-40 h-40 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                          No Logo
                        </div>
                      )}

                      <Button variant="outline" size="sm">
                        <label className="cursor-pointer">
                          Change Logo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                        </label>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Changes Button */}
            <div className="mt-6">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition"
                onClick={handleSaveChanges}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Add Job Modal */}
        {showJobModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full p-6 rounded-xl shadow-lg bg-white">
              <h3 className="text-xl font-bold mb-6">
                Add New job Position
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Position Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Software Engineering Intern"
                      value={fData?.title || ""}
                      onChange={(e) =>
                        setFdata((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duration
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                      value={fData?.duration || ""}
                      onChange={(e) =>
                        setFdata((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select duration</option>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    value={fData?.location}
                    type="text"
                    placeholder="e.g., Colombo, Remote, Hybrid"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    onChange={(e) =>
                      setFdata((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={fData?.description}
                    rows={4}
                    placeholder="Describe the job role..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    onChange={(e) =>
                      setFdata((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Requirements
                  </label>
                  <input
                    value={fData?.requirements}
                    type="text"
                    placeholder="e.g., JavaScript, React, Node.js"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    onChange={(e) =>
                      setFdata((prev) => ({
                        ...prev,
                        requirements: e.target.value
                          .split(",")
                          .map((req) => req.trim()),
                      }))
                    }
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" fullWidth onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={handleJobPosition}
                    disabled={isCreatingJob}
                  >
                    {isCreatingJob ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Position"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/*Cover Letter Modal */}
        {coverletter && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full p-6 rounded-xl shadow-lg bg-white">
              <h3 className="text-xl font-bold mb-6">Cover Letter</h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {applications.find(
                    (app) =>
                      String(app.studentId) === String(coverletterstudentID) &&
                      String(app._id) === String(coverletterID)
                  )?.coverLetter || "No cover letter submitted"}
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={handleCancelCoverLetter}>
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/*Edit job Modal*/}
        {edit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full p-6 rounded-xl shadow-lg bg-white">
              <h3 className="text-xl font-bold mb-6">Edit job Position</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Position Title
                    </label>
                    <input
                      type="text"
                      value={fData?.title || ""}
                      onChange={(e) =>
                        setFdata((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duration
                    </label>
                    <select
                      value={fData?.duration || ""}
                      onChange={(e) =>
                        setFdata((prev) => ({ ...prev, duration: e.target.value }))
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    >
                      <option value="">Select duration</option>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={fData?.location || ""}
                    onChange={(e) =>
                      setFdata((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={fData?.description || ""}
                    onChange={(e) =>
                      setFdata((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Requirements
                  </label>
                  <input
                    type="text"
                    value={fData?.requirements?.join(", ") || ""}
                    onChange={(e) =>
                      setFdata((prev) => ({
                        ...prev,
                        requirements: e.target.value
                          .split(",")
                          .map((req) => req.trim())
                          .filter((req) => req.length > 0),
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter multiple requirements separated by commas
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" fullWidth onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={handleEditPosition}
                    disabled={isUpdatingJob}
                  >
                    {isUpdatingJob ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && <SuccessModal />}
      </div>
    </div>
  );
};

export default CompanyDashboard;