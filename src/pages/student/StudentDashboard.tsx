import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Building2,
  FileText,
  Send,
  Bell,
  User,
  Heart,
  AlertTriangle,
  Check,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { mockInternships, mockCompanies } from "../../data/mockData";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Define types for mock data
interface Company {
  id: string;
  name: string;
}

interface Internship {
  _id?: string;
  companyId?: string;
  companyName?: string;
  title?: string;
  description?: string;
  requirements?: string[];
  duration?: string;
  location?: string;
  isActive?: boolean;
  createdAt?: string;
  industry?: string;
}

interface Application {
  studentId: string;
  companyId: string;
  studentName: string;
  email: string;
  internshipTitle: string;
  appliedDate: string;
  status: string;
  skills: string[];
  gpa: number;
  internshipId: string;
  coverLetter: string;
  interestLevel: number;
  companyName: string;
  useProfileCV: boolean;
}

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  profilePicture: string | null;
  bio: string;
  skills: string[];
  gpa: number;
  year: string;
  registrationNumber: string;
  portfolio: string;
  linkedin: string;
  github: string;
  availability: boolean;
  ApplicationsSent: string;
  RecentNotifications: string[];
  ProfileViews: string;
  department: string;
}

// Add error handling function
interface ErrorResponse {
  includes: (text: string) => boolean;
}

interface ApiErrorHandler {
  (error: string | ErrorResponse): string;
}

const handleApiError: ApiErrorHandler = (error) => {
  const errorText = typeof error === "string" ? error : "";

  // Handle duplicate application error
  if (
    errorText.includes("E11000") &&
    errorText.includes("studentId_1_internshipId_1")
  ) {
    return "You have already applied for this position.";
  }

  // Handle other duplicate errors
  if (errorText.includes("E11000") && errorText.includes("duplicate key")) {
    return "This action has already been completed.";
  }

  // Handle validation errors
  if (errorText.includes("ValidationError")) {
    return "Please check your application details and try again.";
  }

  // Handle authentication errors
  if (errorText.includes("Unauthorized") || errorText.includes("401")) {
    return "Please log in again to continue.";
  }

  // Handle file upload errors
  if (errorText.includes("MulterError") || errorText.includes("file")) {
    return "There was an issue with your file upload. Please try again.";
  }

  // Handle company application limit error
  if (errorText.includes("CompanyApplicationLimit")) {
    return "This company has reached its maximum application limit.";
  }

  // Default fallback for other errors
  return errorText || "Something went wrong. Please try again.";
};

const StudentDashboard: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showInterestNotice, setShowInterestNotice] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<string | null>(
    null
  );
  const location = useLocation();
  const [applicationsInfo, setApplicationsInfo] = useState<{
    ApplicationsSent: number;
    maximumApplications: number;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [cvLoading, setCvLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [progress, setProgress] = useState(100);
  const navigate = useNavigate();

  const [uploadedCV, setUploadedCV] = useState<File | null>(null);
  const [useProfileCV, setUseProfileCV] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [interestLevel, setInterestLevel] = useState(60);
  const [maximumApplications, setMaximumApplications] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [applications, setApplications] = useState<Application[]>([]);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const id = user?.id;

  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);

  // Progress bar animation for success popup
  useEffect(() => {
    if (showSuccessPopup) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev - 100 / 50, 0)); // 5 seconds = 50 * 100ms
      }, 100);
      const timeout = setTimeout(() => {
        setShowSuccessPopup(false);
        setSuccess(null);
        setError("");
      }, 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [showSuccessPopup]);

  const handleNavigateClick = (id: string) => {
    navigate(`/company/PublicProfile/${id}`);
  };

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        setShowSuccessPopup(true);
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setError("File size should be less than 4MB");
        setShowSuccessPopup(true);
        return;
      }
      setUploadedCV(file);
    }
  };

  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    postalCode: "",
    profilePicture: null,
    bio: "",
    skills: [],
    gpa: 0,
    year: "1st Year",
    registrationNumber: "",
    portfolio: "",
    linkedin: "",
    github: "",
    availability: true,
    ApplicationsSent: "0",
    RecentNotifications: [],
    ProfileViews: "0",
    department: "",
  });

  const [fData, setFdata] = useState<Internship[] | null>(null);
  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [CVPreview, setCVPreview] = useState<{
    filename: string;
    uploadDate: string;
    size: string;
  } | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const getInterestLevelInfo = (level: number) => {
    if (level <= 20)
      return {
        color: "bg-red-400",
        text: "Low Interest",
        textColor: "text-red-600",
      };
    if (level <= 40)
      return {
        color: "bg-orange-400",
        text: "Moderate Interest",
        textColor: "text-orange-600",
      };
    if (level <= 60)
      return {
        color: "bg-yellow-400",
        text: "Good Interest",
        textColor: "text-yellow-600",
      };
    if (level <= 80)
      return {
        color: "bg-blue-400",
        text: "High Interest",
        textColor: "text-blue-600",
      };
    return {
      color: "bg-green-400",
      text: "Very High Interest",
      textColor: "text-green-600",
    };
  };

  const handleUpdateProfile = () => {
    navigate("/student/profile", { state: { id } });
  };

  useEffect(() => {
    if (user?.id) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await Promise.all([
            fetchProfile(),
            fetchCV(),
            fetchProfilePicture(),
            fetchAllJobs(),
            fetchTotalNumberOfApplicableInternshipsperStudent(),
            fetchUserApplications(),
          ]);
        } catch (err) {
          setError("Failed to load dashboard data");
          setShowSuccessPopup(true);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [user, id]);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      if (!id) throw new Error("User ID is missing");
      const response = await fetch(
        `${baseUrl}/api/studentRoutes/getStudentById/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile");
      setShowSuccessPopup(true);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      if (!id) throw new Error("User ID is missing");
      const response = await fetch(
        `${baseUrl}/api/studentRoutes/getProfilePicture/${id}`
      );

      if (!response.ok) throw new Error("Failed to fetch profile picture");

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProfilePreview(imageUrl);
    } catch (err) {
      console.error("Error fetching profile picture:", err);
    }
  };

  const fetchAllJobs = async () => {
    setJobsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/InternshipRoutes/getAllInternships`
      );

      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setFdata(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs");
      setShowSuccessPopup(true);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchTotalNumberOfApplicableInternshipsperStudent = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/studentRoutes/getMaximumApplications`
      );
      if (!res.ok) throw new Error("Failed to fetch maximum applications");
      const data = await res.json();
      setMaximumApplications(data.maximumApplications);
    } catch (err) {
      console.error("Failed to fetch maximum applications:", err);
      setError("Failed to fetch maximum applications");
      setShowSuccessPopup(true);
    }
  };

  const fetchUserApplications = async () => {
    try {
      if (!id) throw new Error("User ID is missing");
      
      console.log("Fetching user applications for student:", id);
      
      const response = await fetch(
        `${baseUrl}/api/applicationRoutes/getApplicationsByStudentId/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user applications");

      const data = await response.json();
      console.log("Fetched user applications:", data);
      console.log("Number of applications:", data.length);
      console.log("Application IDs:", data.map((app: Application) => app.internshipId));
      console.log("Interest levels used:", data.map((app: Application) => app.interestLevel));
      
      setUserApplications(data);
      setApplicationsLoaded(true);
    } catch (err) {
      console.error("Error fetching user applications:", err);
      setApplicationsLoaded(true); // Set to true even on error to prevent blocking
      // Don't show error popup for this as it's not critical
    }
  };

  const fetchStudentApplications = async () => {
    setIsApplicationsLoading(true);
    try {
      if (!id) throw new Error("User ID is missing");
      
      const response = await fetch(
        `${baseUrl}/api/applicationRoutes/fetchByStudentId/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setUserApplications(data);
      setProfileData((prev) => ({
        ...prev,
        ApplicationsSent: data.length.toString(),
      }));
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to fetch your applications");
      setShowSuccessPopup(true);
    } finally {
      setIsApplicationsLoading(false);
    }
  };

  const fetchCV = async () => {
    setCvLoading(true);
    try {
      if (!id) throw new Error("User ID is missing");
      const response = await fetch(`${baseUrl}/api/studentRoutes/getCV/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CV");
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      setCvPreview(fileUrl);
    } catch (err) {
      console.error("Error fetching CV:", err);
      setError("Failed to fetch CV");
      setShowSuccessPopup(true);
    } finally {
      setCvLoading(false);
    }
  };

  const fetchCompanyApplicationCount = async (companyId: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/applicationRoutes/fetchByCompanyId/${companyId}`
      );
      if (!response.ok) throw new Error("Failed to fetch company applications");
      const data = await response.json();
      return data.length;
    } catch (err) {
      console.error("Error fetching company application count:", err);
      throw new Error("CompanyApplicationLimit");
    }
  };

  const handleSubmitApplication = useCallback(async () => {
    if (!isAuthenticated || !id) {
      setError("Please log in to apply for this position.");
      setShowSuccessPopup(true);
      setShowApplicationModal(false);
      navigate("/login");
      return;
    }

    // Wait for applications to be loaded before proceeding
    if (!applicationsLoaded) {
      setError("Loading your application data. Please try again in a moment.");
      setShowSuccessPopup(true);
      return;
    }

    const selectedInternshipData = fData?.find(
      (item) => item._id === selectedInternship
    );
    const isGflowPlus = selectedInternshipData?.companyName === "Gflow+";

    if (Number(profileData.ApplicationsSent) >= maximumApplications && !isGflowPlus) {
      setError(
        "You have reached the maximum number of job applications allowed."
      );
      setShowSuccessPopup(true);
      setShowApplicationModal(false);
      return;
    }

    if (!useProfileCV && !uploadedCV) {
      setError("Please upload a new CV for this position.");
      setShowSuccessPopup(true);
      return;
    }

    // Check if user has already applied for this internship
    const hasAlreadyApplied = userApplications.some(
      (app) => app.internshipId === selectedInternship
    );
    if (hasAlreadyApplied) {
      setError("You have already applied for this position.");
      setShowSuccessPopup(true);
      setShowApplicationModal(false);
      return;
    }

    // Check if the interest level is already used
    const isInterestLevelUsed = userApplications.some(
      (app) => app.interestLevel === interestLevel
    );
    if (isInterestLevelUsed && !isGflowPlus) {
      setError(
        "You have already used this interest level for another application. Please choose a different interest level."
      );
      setShowSuccessPopup(true);
      return;
    }

    // Check if the company has reached the application limit
    const companyId = selectedInternshipData?.companyId;
    const MAX_COMPANY_APPLICATIONS = 27; // Configurable limit
    if (companyId) {
      try {
        const applicationCount = await fetchCompanyApplicationCount(companyId);
        if (applicationCount >= MAX_COMPANY_APPLICATIONS) {
          setError(
            "This company has reached its maximum application limit of " +
              MAX_COMPANY_APPLICATIONS +
              "."
          );
          setShowSuccessPopup(true);
          setShowApplicationModal(false);
          return;
        }
      } catch (err) {
        console.error("Error checking company application limit:", err);
        setError(handleApiError(err instanceof Error ? err.message : ""));
        setShowSuccessPopup(true);
        setShowApplicationModal(false);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const newApplication: Application = {
        studentId: id,
        companyId: selectedInternshipData?.companyId || "",
        studentName: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        internshipTitle: selectedInternshipData?.title || "",
        appliedDate: new Date().toISOString(),
        status: "pending",
        skills: profileData.skills,
        gpa: profileData.gpa,
        internshipId: selectedInternship || "",
        coverLetter: coverLetter,
        interestLevel: interestLevel,
        companyName: selectedInternshipData?.companyName || "",
        useProfileCV: useProfileCV,
      };

      let res;

      if (uploadedCV) {
        const formData = new FormData();
        Object.entries(newApplication).forEach(([key, value]) => {
          formData.append(
            key,
            value !== undefined && value !== null ? value.toString() : ""
          );
        });
        formData.append("cv", uploadedCV);

        res = await fetch(
          `${baseUrl}/api/applicationRoutes/createApplication`,
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        res = await fetch(
          `${baseUrl}/api/applicationRoutes/createApplication`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newApplication),
          }
        );
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const userFriendlyError = handleApiError(errorData.message || "");
        setError(userFriendlyError);
        setShowSuccessPopup(true);
        setShowApplicationModal(false);
        return;
      }

      const data = await res.json();
      console.log("Application submitted to backend:", data);

      const res2 = await fetch(
        `${baseUrl}/api/studentRoutes/incrementApplicationsSent/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newApplication),
        }
      );

      if (res2.ok) {
        const data2 = await res2.json();
        console.log("Application sent incremented:", data2);
        setApplicationsInfo(data2);
        setProfileData((prev) => ({
          ...prev,
          ApplicationsSent: data2.ApplicationsSent || prev.ApplicationsSent,
        }));
        await fetchTotalNumberOfApplicableInternshipsperStudent();
      } else {
        console.warn("Incrementing application sent failed");
      }

      setApplications((prev) => [...prev, data]);
      setUserApplications((prev) => {
        const updated = [...prev, data];
        console.log("Updated userApplications after submission:", updated);
        return updated;
      });
      setSuccess("Application submitted successfully!");
      setShowSuccessPopup(true);
      setShowApplicationModal(false);

      // Reset form
      setUploadedCV(null);
      setCoverLetter("");
      setInterestLevel(60);
      setUseProfileCV(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      const userFriendlyError = handleApiError(
        error instanceof Error ? error.message : ""
      );
      setError(userFriendlyError);
      setShowSuccessPopup(true);
      setShowApplicationModal(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isAuthenticated,
    id,
    profileData,
    maximumApplications,
    useProfileCV,
    uploadedCV,
    coverLetter,
    interestLevel,
    selectedInternship,
    fData,
    baseUrl,
    navigate,
    userApplications,
  ]);

  const mapDepartmentToCode = (dept: string) => {
    const lower = dept.toLowerCase();
    if (lower.includes("computer")) return "com";
    if (lower.includes("electrical") || lower.includes("electronic"))
      return "eee";
    if (lower.includes("mechanical")) return "mech";
    if (lower.includes("civil")) return "civil";
    return "";
  };

  const mapCodeToDepartmentName = (code: string) => {
    switch (code?.toLowerCase()) {
      case "com":
        return "Computer Engineering";
      case "eee":
        return "Electrical & Electronic Engineering";
      case "mech":
        return "Mechanical Engineering";
      case "civil":
        return "Civil Engineering";
      default:
        return code;
    }
  };

  // Helper function to check if user has already applied to this internship
  const hasUserApplied = (internshipId: string) => {
    const hasApplied = userApplications.some((app) => app.internshipId === internshipId);
    console.log(`Checking if user applied to ${internshipId}:`, hasApplied);
    console.log("Current user applications:", userApplications);
    return hasApplied;
  };

  const filteredInternships = fData
    ? fData.filter((internship) => {
        const title = internship.title ?? "";
        const company = internship.companyName ?? "";
        const industry = internship.industry ?? "";

        const matchesSearch =
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
          selectedFilter === "all" ||
          industry.toLowerCase() === selectedFilter.toLowerCase();

        return matchesSearch && matchesFilter && internship.isActive;
      })
    : [];

  const studentDeptCode = mapDepartmentToCode(profileData.department);

  const sortedInternships = filteredInternships.sort((a, b) => {
    const aPriority = a.industry?.toLowerCase() === studentDeptCode ? 0 : 1;
    const bPriority = b.industry?.toLowerCase() === studentDeptCode ? 0 : 1;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return (
      new Date(b.createdAt ?? "0").getTime() -
      new Date(a.createdAt ?? "0").getTime()
    );
  });

  const handleApply = (internshipId: string) => {
    if (!isAuthenticated || !id) {
      setError("Please log in to apply for this position.");
      setShowSuccessPopup(true);
      navigate("/login");
      return;
    }

    // Wait for applications to be loaded before allowing application
    if (!applicationsLoaded) {
      setError("Loading your application data. Please wait a moment and try again.");
      setShowSuccessPopup(true);
      return;
    }

    const selectedInternshipData = fData?.find(item => item._id === internshipId);
    const isGflowPlus = selectedInternshipData?.companyName === "Gflow+";

    if (Number(profileData.ApplicationsSent) >= maximumApplications && !isGflowPlus) {
      setError(
        "You have reached the maximum number of job applications allowed."
      );
      setShowSuccessPopup(true);
      return;
    }
    
    // Check if user has already applied for this internship
    if (hasUserApplied(internshipId)) {
      setError("You have already applied for this position.");
      setShowSuccessPopup(true);
      return;
    }
    
    setSelectedInternship(internshipId);
    setShowApplicationModal(true);
    setInterestLevel(60);
    setCoverLetter("");
    setUploadedCV(null);
    setUseProfileCV(!!cvPreview);
  };

  const applicationsSent = Number(profileData.ApplicationsSent);
  const isAtLimit = applicationsSent >= maximumApplications;
  const isNearLimit =
    applicationsSent >= maximumApplications - 2 &&
    applicationsSent < maximumApplications;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2 animate-fade-in">
            Welcome back, {profileData.firstName}!
          </h1>
          <p className="text-gray-600 animate-fade-in delay-100">
            Discover your next job opportunity and take your career forward.
          </p>
          <Card className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 animate-notice">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Application Period Ended
                </h3>
                <p className="text-sm text-red-700">
                  The application period for new jobs has closed. You can no longer apply for positions.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Success/Error Popup with higher z-index */}
        {showSuccessPopup && (success || error) && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-60 transition-opacity duration-300">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                {success ? (
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                ) : (
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {success ? "Success" : "Error"}
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-center">
                {success || error}
              </p>
              <div className="relative w-full h-1 bg-gray-200 rounded-full mb-6">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setSuccess(null);
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setSuccess(null);
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {isAtLimit && (
          <Card className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Application Limit Reached
                </h3>
                <p className="text-sm text-red-700">
                  You have reached the maximum limit of {maximumApplications}{" "}
                  job applications. You can't apply for any more jobs. Apply Now
                  button is disabled.
                </p>
              </div>
            </div>
          </Card>
        )}
        {isNearLimit && !isAtLimit && (
          <Card className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  Approaching Application Limit
                </h3>
                <p className="text-sm text-red-700">
                  You have {maximumApplications - applicationsSent}{" "}
                  application(s) remaining out of {maximumApplications}. Choose
                  your remaining applications carefully!
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="p-6 mb-8 border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search jobs or companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all"
                      fullWidth
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 transition-all"
                  >
                    <option value="all">All Fields</option>
                    <option value="com">Com</option>
                    <option value="eee">EEE</option>
                    <option value="mech">Mech</option>
                    <option value="civil">Civil</option>
                  </select>
                  <Button
                    variant="outline"
                    className="hover:shadow-md transition-all rounded-lg"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              {jobsLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card
                      key={i}
                      className="p-6 border border-gray-100 shadow-sm bg-white rounded-xl animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="flex gap-2">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="flex justify-end gap-3 mt-4">
                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : sortedInternships.length === 0 ? (
                <Card className="p-6 text-center border border-gray-100 shadow-sm bg-white rounded-xl">
                  <p className="text-gray-600">
                    No jobs found matching your criteria.
                  </p>
                </Card>
              ) : (
                sortedInternships.map((internship) => {
                  const isRelevant =
                    internship.industry?.toLowerCase() === studentDeptCode;
                  const alreadyApplied = hasUserApplied(internship._id || "");
                  const isGflowPlus = internship.companyName === "Gflow+";
                  return (
                    <Card
                      key={internship._id}
                      className="p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] bg-white rounded-xl"
                    >
                      {/* Gflow+ Special Note */}
                      {isGflowPlus && (
                        <div className="mb-4 flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <Info className="w-5 h-5 text-green-600 mr-2" />
                          <p className="text-sm text-green-800">
                            A new company added. Apply if you're interested.
                          </p>
                        </div>
                      )}

                      {/* Already Applied Warning */}
                      {alreadyApplied && (
                        <div className="mb-4 flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                          <p className="text-sm text-orange-800 font-medium">
                            ✓ Already Applied - You have already submitted an
                            application for this position
                          </p>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {internship.title}
                            </h3>
                            <p className="text-blue-600 font-medium">
                              {internship.companyName}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-block ${
                            isRelevant ? "bg-green-100" : "bg-red-100"
                          } text-gray-800 px-3 py-1 rounded-full text-sm`}
                        >
                          {mapCodeToDepartmentName(internship.industry || "")}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {internship.description}
                      </p>

                      {!isRelevant && !isGflowPlus && (
                        <div className="mb-4 flex items-center p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                          <p className="text-sm text-red-700">
                            This job is not in your department. You cannot apply
                            for this position.
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/company/PublicProfile/${internship.companyId}`}
                        >
                          <Button
                            variant="outline"
                            className="hover:bg-gray-80 rounded-lg transition-all"
                          >
                            View Company
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleApply(internship._id || "")}
                          className={`transition rounded-lg ${isGflowPlus && !alreadyApplied ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed text-white'}`}
                          disabled={!isGflowPlus || alreadyApplied}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-6">
            {profileLoading ? (
  <Card className="p-6 text-center shadow-sm hover:shadow-md transition rounded-xl animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-2 bg-gray-200 rounded"></div>
    </div>
  </Card>
) : (
  <Card className="p-6 text-center shadow-sm hover:shadow-md transition rounded-xl">
    <div>
      {profilePreview ? (
        <img
          src={profilePreview}
          alt="Profile"
          className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 ring-2 ring-blue-200 object-cover"
        />
      ) : (
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 ring-2 ring-blue-200">
          <User className="w-12 h-12 text-blue-600" />
        </div>
      )}
    </div>
    <h3 className="font-bold text-gray-900">
      {profileData.firstName} {profileData.lastName}
    </h3>
    <p className="text-sm text-gray-600">
      {profileData.department} Student
    </p>

    <Button
      fullWidth
      className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all hover:scale-[1.02]"
      onClick={handleUpdateProfile}
    >
      <User className="w-4 h-4 mr-2" />
      Update Profile
    </Button>

    <Button
      fullWidth
      className="mt-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg transition-all hover:scale-[1.02]"
      onClick={() => {
        setShowApplicationsModal(true);
        fetchStudentApplications();
      }}
    >
      <FileText className="w-4 h-4 mr-2" />
      View Applications
    </Button>

    <div className="mt-4 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Jobs Applied:</span>
        <span className="text-green-600 font-medium">
          {profileData.ApplicationsSent}/{maximumApplications}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{
            width: `${
              Number(profileData.ApplicationsSent) &&
              maximumApplications
                ? (Number(profileData.ApplicationsSent) /
                    maximumApplications) *
                  100
                : 0
            }%`,
          }}
        ></div>
      </div>
    </div>
  </Card>
)}

            <Card className="p-6 shadow-sm hover:shadow-md transition rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Recent Notifications
                </h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <p className="text-sm font-medium text-blue-900">
                    Application Status
                  </p>
                  <p className="text-xs text-blue-700">
                    {profileData.RecentNotifications.length > 0 ? (
                      profileData.RecentNotifications.filter(
                        (note) =>
                          note.toLowerCase().includes("accepted") ||
                          note.toLowerCase().includes("rejected")
                      )
                        .slice(-3)
                        .map((note, index) => <div key={index}>{note}</div>)
                    ) : (
                      <div>No recent status updates</div>
                    )}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition">
                  <p className="text-sm font-medium text-green-900">
                    Application Viewed
                  </p>
                  <p className="text-xs text-green-700">
                    {profileData.RecentNotifications.length > 0 ? (
                      profileData.RecentNotifications.filter((note) =>
                        note.toLowerCase().includes("viewed")
                      )
                        .slice(-3)
                        .map((note, index) => <div key={index}>{note}</div>)
                    ) : (
                      <div>No recent views</div>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm hover:shadow-md transition rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
              {[
                {
                  label: "Applications Sent:",
                  value: profileData.ApplicationsSent,
                },
                { label: "Profile Views:", value: profileData.ProfileViews },
              ].map((stat) => (
                <div className="flex justify-between mb-2" key={stat.label}>
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-medium">{stat.value ?? 0}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Submit Application</h3>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {cvLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile details...</p>
              </div>
            ) : !profileData.skills.length ||
              !profileData.firstName ||
              !profileData.lastName ||
              !profileData.email ? (
              <div className="text-center py-6">
                <div className="mb-4">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Complete Your Profile First
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Please ensure your profile includes all necessary details.
                    These details are required for companies to review your
                    application.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/student/profile")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all hover:scale-[1.02]"
                >
                  Complete Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Your Application Profile
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">
                        {profileData.firstName} {profileData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">CV</p>
                      {useProfileCV ? (
                        <p className="text-green-600 font-medium flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Using Profile CV
                        </p>
                      ) : uploadedCV ? (
                        <p className="text-green-600 font-medium flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          New CV: {uploadedCV.name}
                        </p>
                      ) : (
                        <p className="text-red-600 font-medium">
                          Please upload new CV
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    CV Selection
                  </h4>
                  {cvPreview ? (
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={useProfileCV}
                          onChange={() => setUseProfileCV(true)}
                          className="mr-2"
                        />
                        Use my profile CV
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!useProfileCV}
                          onChange={() => setUseProfileCV(false)}
                          className="mr-2"
                        />
                        Upload a new CV for this position
                      </label>
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-2">
                      No CV in profile. Please upload a new one for this
                      position.
                    </p>
                  )}
                  {!useProfileCV && (
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleCVUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 transition-all"
                      />
                      {uploadedCV && (
                        <p className="text-sm text-gray-600 mt-1">
                          Selected: {uploadedCV.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="cursor-help"
                  onMouseEnter={() => setShowInterestNotice(true)}
                  onMouseLeave={() => setShowInterestNotice(false)}
                  onClick={() => setShowInterestNotice(true)}>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Heart className="w-4 h-4 inline mr-2" />
                    Select your Interest Level for this Position:
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="w-full h-4 bg-gray-200 rounded-full shadow-inner overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all duration-300 ease-out ${
                            getInterestLevelInfo(interestLevel).color
                          } shadow-sm`}
                          style={{ width: `${interestLevel}%` }}
                        ></div>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="20"
                        value={interestLevel}
                        onChange={(e) =>
                          setInterestLevel(Number(e.target.value))
                        }
                        className="absolute top-0 w-full h-4 opacity-0 cursor-pointer"
                      />
                      <div
                        className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 rounded-full shadow-md pointer-events-none transition-all duration-300"
                        style={{
                          left: `calc(${interestLevel}% - 12px)`,
                          borderColor: getInterestLevelInfo(interestLevel)
                            .color.replace("bg-", "")
                            .replace("-400", "-500"),
                        }}
                      >
                        <div
                          className={`w-2 h-2 ${
                            getInterestLevelInfo(interestLevel).color
                          } rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                        ></div>
                      </div>
                      <div className="relative mt-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span
                            style={{
                              position: "absolute",
                              left: "0%",
                              transform: "translateX(-50%)",
                            }}
                          >
                            0%
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              left: "20%",
                              transform: "translateX(-50%)",
                            }}
                          >
                            20%
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              left: "40%",
                              transform: "translateX(-50%)",
                            }}
                          >
                            40%
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              left: "60%",
                              transform: "translateX(-50%)",
                            }}
                          >
                            60%
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              left: "80%",
                              transform: "translateX(-50%)",
                            }}
                          >
                            80%
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              left: "100%",
                              transform: "translateX(-50%)",
                            }}
                          >
                            100%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Heart
                        className={`w-5 h-5 ${getInterestLevelInfo(
                          interestLevel
                        ).color.replace("bg-", "text-")}`}
                      />
                      <span
                        className={`font-medium ${
                          getInterestLevelInfo(interestLevel).textColor
                        }`}
                      >
                        {getInterestLevelInfo(interestLevel).text} (
                        {interestLevel}%)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Used interest levels:{" "}
                      {userApplications
                        .map((app) => `${app.interestLevel}%`)
                        .join(", ") || "None"}
                    </p>
                    <div className={`${showInterestNotice ? "block" : "hidden"} bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm animate-blink transition-opacity duration-300`}>
                      <p className="font-medium flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Choose 100% for the position you like the MOST, and 20% for the one you like the LEAST.
                      </p>
                      <p className="mt-1">
                        Important: You can only use each interest level once across all your applications. You CANNOT use the same level to apply for multiple positions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm">
                  <p className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Your interest level helps employers understand your priority
                    for this position
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Recommended)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 transition-all"
                    placeholder="Why are you interested in this position? Share a brief message with the employer..."
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowApplicationModal(false)}
                    className="hover:bg-red-300 hover:text-white transition rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.02] transition rounded-lg flex items-center justify-center"
                    onClick={handleSubmitApplication}
                    disabled={
                      isSubmitting ||
                      isAtLimit ||
                      (!useProfileCV && !uploadedCV)
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
      {/* Applications Sent Modal */}
{showApplicationsModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <Card className="max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Your Applications</h3>
        <button
          onClick={() => setShowApplicationsModal(false)}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {isApplicationsLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      ) : userApplications.length === 0 ? (
        <div className="text-center py-6">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No applications submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userApplications.map((application) => (
            <Card
              key={application.internshipId}
              className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">
                  {application.internshipTitle}
                </h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    application.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : application.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Company</p>
                  <p className="font-medium">{application.companyName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Applied Date</p>
                  <p className="font-medium">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Interest Level</p>
                  <p className="font-medium">{application.interestLevel}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {application.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {application.coverLetter && (
                <div className="mt-3">
                  <p className="text-gray-600 text-sm">Cover Letter</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded whitespace-pre-line">
                    {application.coverLetter}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <Button
          variant="outline"
          onClick={() => setShowApplicationsModal(false)}
          className="hover:bg-gray-100 transition rounded-lg"
        >
          Close
        </Button>
      </div>
    </Card>
  </div>
)}
    </div>
  );
};

export default StudentDashboard;