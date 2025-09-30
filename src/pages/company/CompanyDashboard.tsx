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
  AlertTriangle,
  Check,
  Phone,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId } = location.state || { companyId: null };
  const id = companyId;
  console.log("Company ID from state:", id);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const MAX_COMPANY_APPLICATIONS = 27; // Configurable limit
  const [activeTab, setActiveTab] = useState<"applications" | "positions" | "company">("applications");
  const [showJobModal, setShowJobModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [error, setError] = useState("");
  const [coverletter, setCoverletter] = useState(false);
  const [coverletterstudentID, setCoverletterstudentId] = useState("");
  const [coverletterID, setCoverletterID] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [progress, setProgress] = useState(100);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState("");
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isUpdatingJob, setIsUpdatingJob] = useState(false);
  const [isDeletingJob, setIsDeletingJob] = useState(false);
  const [isUpdatingApplication, setIsUpdatingApplication] = useState<{ [key: string]: boolean }>({});
  const [downloadingCV, setDownloadingCV] = useState<{ [key: string]: boolean }>({});

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
    subfield?: string[];
    phoneNo?: string;
  }

  const [companyProfile, setCompanyProfile] = useState<CompanyProfileData | null>(null);

  interface Application {
    _id: string;
    studentId: string;
    companyId: string;
    studentName: string;
    email: string;
    phone?: string;
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
    useProfileCV?: boolean;
  }

  const [applications, setApplications] = useState<Application[]>([]);
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

  const [fData, setFdata] = useState<{
    companyName?: string;
    title?: string;
    description?: string;
    requirements?: string[];
    duration?: string;
    location?: string;
    industry?: string;
  }>({
    title: "",
    description: "",
    requirements: [],
    duration: "",
    location: "",
  });

  // Progress bar animation for success modal
  useEffect(() => {
    if (showSuccessModal) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev - (100 / 50), 0));
      }, 100);
      const timeout = setTimeout(() => {
        setShowSuccessModal(false);
        setSuccessMessage("");
      }, 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [showSuccessModal]);

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      setError("");
      const res = await fetch(`${baseUrl}/api/InternshipRoutes/getInternshipsByCompanyId/${id}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setJob(Array.isArray(data) ? data : data.internships || []);
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
      const res = await fetch(`${baseUrl}/api/applicationRoutes/fetchByCompanyId/${id}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const applicationData = await res.json();

      const applicationsWithPhone = await Promise.all(
        applicationData.map(async (app: Application) => {
          try {
            const studentRes = await fetch(`${baseUrl}/api/studentRoutes/getStudentById/${app.studentId}`);
            if (!studentRes.ok) throw new Error(`Error fetching student data: ${studentRes.status}`);
            const studentData = await studentRes.json();
            return { ...app, phone: studentData.phone || "" };
          } catch (err) {
            console.error(`Error fetching phone for student ${app.studentId}:`, err);
            return { ...app, phone: "" };
          }
        })
      );

      setApplications(applicationsWithPhone);
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const fetchCompanyDetails = async () => {
    setIsLoadingProfile(true);
    try {
      setError("");
      const res = await fetch(`${baseUrl}/api/companyRoutes/getById/${id}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      if (data.company.logo) {
        const logoDataUrl = `data:${data.company.logoType || "image/png"};base64,${data.company.logo}`;
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
    if (!id) {
      navigate("/login");
    } else {
      fetchCompanyDetails();
      fetchJobs();
      fetchApplication();
    }
  }, [id, navigate]);

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    email: "",
    description: "",
    logoFile: null as File | null,
    location: "",
    industry: "",
    subfield: [] as string[],
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
        subfield: Array.isArray(companyProfile.subfield) ? [...new Set(companyProfile.subfield)] : [],
        phoneNo: companyProfile.phoneNo || "",
      }));
    }
  }, [companyProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubfieldChange = (subfield: string) => {
    try {
      setFormData((prev) => {
        const currentSubfields = Array.isArray(prev.subfield) ? [...new Set(prev.subfield)] : [];
        console.log("Current subfields before update:", currentSubfields, "Clicked subfield:", subfield);

        if (currentSubfields.includes(subfield)) {
          const updatedSubfields = currentSubfields.filter((item) => item !== subfield);
          console.log("Updated subfields (removed):", updatedSubfields);
          return { ...prev, subfield: updatedSubfields };
        } else if (currentSubfields.length < 3) {
          const updatedSubfields = [...new Set([...currentSubfields, subfield])];
          console.log("Updated subfields (added):", updatedSubfields);
          return { ...prev, subfield: updatedSubfields };
        }
        console.log("No update (limit reached or no change):", currentSubfields);
        return prev;
      });
    } catch (err) {
      console.error("Error in handleSubfieldChange:", err);
      setError("Failed to update subfields. Please try again.");
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
      formToSend.append("subfield", JSON.stringify(formData.subfield));
      formToSend.append("phoneNo", formData.phoneNo);

      if (formData.logoFile) formToSend.append("logo", formData.logoFile);

      const res = await fetch(`${baseUrl}/api/companyRoutes/updateCompany/${id}`, {
        method: "PUT",
        body: formToSend,
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      console.log("Updated company:", data);
      setCompanyProfile(data.company);
      setSuccessMessage("Profile updated successfully!");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddPosition = () => {
    setEdit(false);
    setEditId("");
    setFdata({
      title: "",
      description: "",
      requirements: [],
      duration: "",
      location: "",
    });
    setShowJobModal(true);
  };

  const handleEdit = (internshipId: string) => {
    const foundJob = Job.find((j) => j._id === internshipId);
    if (foundJob) {
      setEdit(true);
      setEditId(internshipId);
      setEditJob(foundJob);
      setFdata({
        title: foundJob.title || "",
        description: foundJob.description || "",
        requirements: foundJob.requirements || [],
        duration: foundJob.duration || "",
        location: foundJob.location || "",
      });
      setShowJobModal(true);
    } else {
      setError("Job not found");
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setEditId("");
    setShowJobModal(false);
    setFdata({
      title: "",
      description: "",
      requirements: [],
      duration: "",
      location: "",
    });
  };

  const handleJobPosition = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!(fData.title || '').trim()) {
      setError("Position Title is required");
      return;
    }
    setIsCreatingJob(true);
    try {
      const response = await fetch(`${baseUrl}/api/InternshipRoutes/createInternship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: id,
          companyName: companyProfile?.companyName || "",
          duration: fData.duration || "",
          requirements: fData.requirements || [],
          description: fData.description || "",
          title: fData.title,
          location: fData.location || "",
          industry: companyProfile?.industry || "",
        }),
      });

      if (!response.ok) throw new Error("Failed to create job position");
      setSuccessMessage("Job created successfully!");
      setShowSuccessModal(true);
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
      setError("Failed to create job. Please try again.");
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleEditPosition = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!(fData.title || '').trim()) {
      setError("Position Title is required");
      return;
    }
    setIsUpdatingJob(true);
    try {
      const response = await fetch(`${baseUrl}/api/InternshipRoutes/editInternshipById/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: id,
          companyName: companyProfile?.companyName || "",
          duration: fData.duration || "",
          requirements: fData.requirements || [],
          description: fData.description || "",
          title: fData.title,
          location: fData.location || "",
          industry: companyProfile?.industry || "",
        }),
      });

      if (!response.ok) throw new Error("Failed to edit the job");
      setSuccessMessage("Job updated successfully!");
      setShowSuccessModal(true);
      setEdit(false);
      setEditId("");
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
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsUpdatingJob(false);
    }
  };

  const handleConfirmDelete = (ID: string) => {
    setDeleteJobId(ID);
    setShowDeleteConfirmModal(true);
  };

  const handleDelete = async () => {
    setIsDeletingJob(true);
    try {
      const res = await fetch(`${baseUrl}/api/InternshipRoutes/deleteInternshipById/${deleteJobId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error deleting job position");
      }
      setSuccessMessage("Job deleted successfully!");
      setShowSuccessModal(true);
      fetchJobs();
      setShowDeleteConfirmModal(false);
    } catch (error) {
      setError("Something went wrong while deleting.");
    } finally {
      setIsDeletingJob(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setDeleteJobId("");
  };

  const handleViewCoverletter = (id: string, id2: string) => {
    setCoverletter(true);
    setCoverletterstudentId(id);
    setCoverletterID(id2);
  };

  const handleCancelCoverLetter = () => {
    setCoverletter(false);
    setCoverletterstudentId("");
    setCoverletterID("");
  };

  const handleViewApplication = (internshipId: string) => {
    navigate("/company/application", { state: { internshipId } });
  };

  const sendAcceptmail = (studentid: string) => {
    const studentName = applications.find((app) => app._id === studentid)?.studentName;
    const position = applications.find((app) => app._id === studentid)?.internshipTitle;
    const email = applications.find((app) => app._id === studentid)?.email;

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
    const studentName = applications.find((app) => app._id === studentid)?.studentName;
    const position = applications.find((app) => app._id === studentid)?.internshipTitle;
    const email = applications.find((app) => app._id === studentid)?.email;

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

  const incrementProfileView = async (ID: string) => {
    const studentID = applications.find((app) => app._id === ID)?.studentId;
    try {
      const res = await fetch(`${baseUrl}/api/studentRoutes/incrementProfileView/${studentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Error incrementing profile view: ${res.status}`);
      console.log("Profile view incremented successfully");
    } catch (error) {
      console.error("Error in incrementProfileView:", error);
    }
  };

  const sendMessageToStudent = async (ID: string, message: string) => {
    const studentID = applications.find((app) => app._id === ID)?.studentId;
    try {
      const res = await fetch(`${baseUrl}/api/studentRoutes/addRecentNotification/${studentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification: message }),
      });
      if (!res.ok) throw new Error(`Error sending message: ${res.status}`);
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error in sendMessageToStudent:", error);
    }
  };

  const handleViewProfile = (id: string, ID: string) => {
    sendMessageToStudent(ID, `Your account has been viewed by ${companyProfile?.companyName}`);
    incrementProfileView(ID);
    navigate(`/student/publicprofile/${id}`);
  };

  const handleAccept = async (ID: string) => {
    setIsUpdatingApplication((prev) => ({ ...prev, [ID]: true }));
    try {
      const response = await fetch(`${baseUrl}/api/applicationRoutes/acceptApplication/${ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update the status");
      }
      setSuccessMessage("Application accepted successfully!");
      setShowSuccessModal(true);
      sendAcceptmail(ID);
      sendMessageToStudent(ID, `${companyProfile?.companyName} has accepted your application. Check your mail`);
      fetchApplication();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsUpdatingApplication((prev) => ({ ...prev, [ID]: false }));
    }
  };

  const handleReject = async (ID: string) => {
    setIsUpdatingApplication((prev) => ({ ...prev, [ID]: true }));
    try {
      const response = await fetch(`${baseUrl}/api/applicationRoutes/rejectApplication/${ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update the status");
      }
      setSuccessMessage("Application rejected successfully!");
      setShowSuccessModal(true);
      sendRejectemail(ID);
      sendMessageToStudent(ID, `${companyProfile?.companyName} has rejected your application. Check your mail`);
      fetchApplication();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsUpdatingApplication((prev) => ({ ...prev, [ID]: false }));
    }
  };

  const handleDownloadCV = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/studentRoutes/getCV/${id}`);
      if (!response.ok) throw new Error("CV download failed");
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
      setError("Error downloading CV");
    }
  };

  const downloadCV = async (id: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/applicationRoutes/getCV/${id}`);
      if (!res.ok) throw new Error("CV not found or failed to download");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const disposition = res.headers.get("Content-Disposition");
      let filename = "cv.pdf";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Error downloading CV");
    }
  };

  const DOWNLOADCV = async (Fid1: string, Sid2: string, value: boolean) => {
    setDownloadingCV((prev) => ({ ...prev, [Fid1]: true }));
    try {
      if (!value) {
        await downloadCV(Fid1);
      } else {
        await handleDownloadCV(Sid2);
      }
    } finally {
      setDownloadingCV((prev) => ({ ...prev, [Fid1]: false }));
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 transition-opacity duration-300">
      <Card className="max-w-md w-full p-8 rounded-xl shadow-2xl bg-white text-center animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-full">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Success
          </h3>
        </div>
        <p className="text-gray-600 mb-6">{successMessage}</p>
        <div className="relative w-full h-1 bg-gray-200 rounded-full mb-6">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between gap-4">
          <Button
            onClick={() => setShowSuccessModal(false)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setShowSuccessModal(false);
              if (successMessage.includes("Job created")) setShowJobModal(true);
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            {successMessage.includes("Job created") ? "Add Another Job" : "Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );

  // Delete Confirmation Modal Component
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-8 rounded-xl shadow-2xl bg-white text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this job position? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleCancelDelete}
            className="hover:scale-105 transition"
            disabled={isDeletingJob}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeletingJob}
            className="hover:scale-105 transition"
          >
            {isDeletingJob ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );

  const industryOptions = [
    { value: "EEE", label: "Electrical and Electronic Engineering" },
    { value: "Com", label: "Computer Engineering" },
    { value: "Mech", label: "Mechanical Engineering" },
    { value: "Civil", label: "Civil Engineering" },
  ];

  const availableSubfieldOptions = industryOptions.filter(
    (option) => option.value !== formData.industry
  );

  const isApplicationLimitReached = applications.length >= MAX_COMPANY_APPLICATIONS;
  const isApplicationLimitNear = applications.length >= MAX_COMPANY_APPLICATIONS - 1 && applications.length < MAX_COMPANY_APPLICATIONS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 animate-slide-in">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Application Limit Notifications */}
        {isApplicationLimitReached && (
          <Card className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Application Limit Reached</h3>
                <p className="text-sm text-red-700">
                  You have reached the maximum limit of {MAX_COMPANY_APPLICATIONS} applications. No further applications can be received until some are processed or declined.
                </p>
              </div>
            </div>
          </Card>
        )}
        {isApplicationLimitNear && !isApplicationLimitReached && (
          <Card className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Approaching Application Limit</h3>
                <p className="text-sm text-yellow-700">
                  You have {MAX_COMPANY_APPLICATIONS - applications.length} application slot(s) remaining out of {MAX_COMPANY_APPLICATIONS}. Consider reviewing or declining existing applications.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            {isLoadingProfile ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading Dashboard...
              </span>
            ) : (
              `Company Dashboard - ${formData.companyName || "Unnamed Company"}`
            )}
          </h1>
          <p className="text-gray-600">Manage your job programs and candidates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <Users className="w-6 h-6 text-blue-600" />,
              value: applications.length,
              label: `Total Applications (${applications.length}/${MAX_COMPANY_APPLICATIONS})`,
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
              value: applications.filter((app) => app.status === "pending").length,
              label: "Pending Reviews",
              color: "bg-orange-100",
              isLoading: isLoadingApplications,
            },
            {
              icon: <Download className="w-6 h-6 text-green-600" />,
              value: applications.filter((app) => app.status === "accepted").length,
              label: "Accepted Applications",
              color: "bg-green-100",
              isLoading: isLoadingApplications,
            },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className="p-6 text-center hover:shadow-lg transition-all bg-white rounded-xl"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { key: "applications", label: `Applications (${applications.length})` },
              { key: "positions", label: `Job Positions (${Job.length})` },
              { key: "company", label: "Company Profile" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`pb-2 transition-all text-sm font-medium border-b-2 ${
                  activeTab === tab.key ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"
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
            ) : applications.length === 0 ? (
              <Card className="p-6 text-center border border-gray-100 shadow-sm bg-white rounded-xl">
                <p className="text-gray-600">No applications yet.</p>
              </Card>
            ) : (
              applications
                .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
                .map((forms) => (
                  <Card key={forms._id} className="p-6 hover:shadow-lg transition rounded-xl bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                          {forms.studentName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{forms.studentName}</h3>
                          <p className="text-gray-600">{forms.email}</p>
                          {forms.phone && (
                            <p className="text-gray-600">
                              <Phone className="w-4 h-4 inline mr-1" />
                              {forms.phone}
                            </p>
                          )}
                          <p className="text-sm text-blue-600">{forms.internshipTitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(forms.status)}`}>
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
                            (forms.interestLevel ?? 0) >= 80 ? "bg-green-600" : (forms.interestLevel ?? 0) >= 50 ? "bg-yellow-500" : "bg-red-500"
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
                        disabled={isUpdatingApplication[forms._id]}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition"
                        onClick={() => DOWNLOADCV(forms._id, forms.studentId, forms.useProfileCV ?? true)}
                        disabled={isUpdatingApplication[forms._id] || downloadingCV[forms._id]}
                      >
                        {downloadingCV[forms._id] ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" /> Download CV
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition"
                        onClick={() => handleViewCoverletter(forms.studentId, forms._id)}
                        disabled={isUpdatingApplication[forms._id]}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Cover Letter
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAccept(forms._id)}
                        disabled={isUpdatingApplication[forms._id]}
                      >
                        {isUpdatingApplication[forms._id] ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            Accepting...
                          </>
                        ) : (
                          "Accept"
                        )}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(forms._id)}
                        disabled={isUpdatingApplication[forms._id]}
                      >
                        {isUpdatingApplication[forms._id] ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            Rejecting...
                          </>
                        ) : (
                          "Reject"
                        )}
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
                disabled={isCreatingJob || isUpdatingJob}
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
              ) : Job.length === 0 ? (
                <Card className="p-6 text-center border border-gray-100 shadow-sm bg-white rounded-xl">
                  <p className="text-gray-600">No job positions yet.</p>
                </Card>
              ) : (
                Job.map((internship) => (
                  <Card key={internship._id} className="p-6 hover:shadow-lg transition bg-white rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{internship.title}</h3>
                        <p className="text-gray-600 mb-3">{internship.description || "No description provided"}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {internship.location || "Not specified"}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {internship.duration || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          internship.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
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
                        disabled={isUpdatingJob || isDeletingJob}
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(internship._id || "")}
                        disabled={isUpdatingJob || isDeletingJob}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Applications
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleConfirmDelete(internship._id || "")}
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, industry: e.target.value, subfield: [] }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    >
                      <option value="">Select Industry</option>
                      {industryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subfield (Select up to 3)
                    </label>
                    {availableSubfieldOptions.length > 0 ? (
                      <div className="space-y-2">
                        {availableSubfieldOptions.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={option.value}
                              checked={(formData.subfield || []).includes(option.value)}
                              onChange={() => handleSubfieldChange(option.value)}
                              disabled={
                                !(formData.subfield || []).includes(option.value) &&
                                (formData.subfield || []).length >= 3
                              }
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                        <p className="text-xs text-gray-500 mt-1">
                          Selected: {(formData.subfield || []).length}/3
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No subfields available. Select an industry first.</p>
                    )}
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
              <h3 className="text-xl font-bold mb-6">{edit ? "Edit Job Position" : "Add New Job Position"}</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Position Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g., Software Engineering Intern"
                      value={fData.title}
                      onChange={(e) => setFdata((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                      value={fData.duration}
                      onChange={(e) => setFdata((prev) => ({ ...prev, duration: e.target.value }))}
                    >
                      <option value="">Select duration</option>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    value={fData.location}
                    type="text"
                    placeholder="e.g., Colombo, Remote, Hybrid"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    onChange={(e) => setFdata((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={fData.description}
                    rows={4}
                    placeholder="Describe the job role..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    onChange={(e) => setFdata((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Requirements</label>
                  <input
                    value={fData.requirements?.join(", ") || ""}
                    type="text"
                    placeholder="e.g., JavaScript, React, Node.js"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    onChange={(e) =>
                      setFdata((prev) => ({
                        ...prev,
                        requirements: e.target.value
                          .split(",")
                          .map((req) => req.trim())
                          .filter((req) => req.length > 0),
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter multiple requirements separated by commas</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleCancel} disabled={isCreatingJob || isUpdatingJob}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={edit ? handleEditPosition : handleJobPosition}
                    disabled={isCreatingJob || isUpdatingJob}
                  >
                    {isCreatingJob || isUpdatingJob ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {edit ? "Saving..." : "Creating..."}
                      </>
                    ) : edit ? (
                      "Save Changes"
                    ) : (
                      "Create Position"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Cover Letter Modal */}
        {coverletter && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full p-6 rounded-xl shadow-lg bg-white">
              <h3 className="text-xl font-bold mb-6">Cover Letter</h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {applications.find(
                    (app) => String(app.studentId) === String(coverletterstudentID) && String(app._id) === String(coverletterID)
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

        {/* Success Modal */}
        {showSuccessModal && <SuccessModal />}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmModal && <DeleteConfirmModal />}

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
    </div>
  );
};

export default CompanyDashboard;