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
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { mockInternships } from "../../data/mockData";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "applications" | "positions" | "company"
  >("applications");
  const [showJobModal, setShowJobModal] = useState(false);
  const [edit,setEdit]=useState(false);
  const [editId,setEditId]=useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyProfile, setCompanyProfile] = useState<{
    id?: string;
    description?: string;
    website?: string;
    email?: string;
    role?: string;
    logo?: string;
    logoType?: string;
    logoUrl?: string;
    companyName?: string;
    location?:string;
    industry?:string;
    employees?:string;
  } | null>(null);

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

const handleViewApplication=(internshipId:string)=>{
   navigate("/company/application",{state:{internshipId}})
}
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
} | null>(null);



const sendAcceptmail = (studentid: string) => {
  // find the student details first
  const studentName = applications.find(app => app._id === studentid)?.studentName;
  const position = applications.find(app => app._id === studentid)?.internshipTitle;
  const email =applications.find(app=>app._id===studentid)?.email
  emailjs
    .send(
      "service_yeke3la",     // ✅ Your Service ID
      "template_mogx38j",     // ✅ Your Template ID
      { toemail:email,
        applicat_name: studentName,
        title: position,
        hr_email: companyProfile?.email,
        organization_name: companyProfile?.companyName,
        time: new Date().toLocaleDateString(),
        email:companyProfile?.email,
      },
      "xoBLJNkyjseJaPApW"     // ✅ Your Public Key (from EmailJS dashboard)
    )
    .then(
      (result) => {
        console.log("✅ Email sent:", result.text);
        alert("Application email sent successfully!");
      },
      (error) => {
        console.error("❌ Email failed:", error.text);
        alert("Failed to send email. Please try again.");
      }
    );
};


const sendRejectemail = (studentid: string) => {
  // find the student details first
  const studentName = applications.find(app => app._id === studentid)?.studentName;
  const position = applications.find(app => app._id === studentid)?.internshipTitle;
  const email =applications.find(app=>app._id===studentid)?.email
  emailjs
    .send(
      "service_yeke3la",     // ✅ Your Service ID
      "template_06tm1fa",     // ✅ Your Template ID
      { toemail:email,
        Applicant_Name: studentName,
        Position: position,
        hr_email: companyProfile?.email,
        Organization_Name: companyProfile?.companyName,
        time: new Date().toLocaleDateString(),
        email:companyProfile?.email,
        name:companyProfile?.companyName,
      },
      "xoBLJNkyjseJaPApW"     // ✅ Your Public Key (from EmailJS dashboard)
    )
    .then(
      (result) => {
        console.log("✅ Email sent:", result.text);
        alert("Application email sent successfully!");
      },
      (error) => {
        console.error("❌ Email failed:", error.text);
        alert("Failed to send email. Please try again.");
      }
    );
};


  const [fData, setFdata] = useState<{
  companyName?:string
  title?: string;
  description?: string;
  requirements?: string[];
  duration?: string;
  location?: string;
} | null>(null);

  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);

  

  const handleViewProfile = (id: string,ID:string) => {
    
    sendMessageToStudent(
    ID,
    `Your account has been viewed by ${companyProfile?.companyName}`
  );
    navigate("/student/PublicProfile",{ state: { id: id } });
    incrementProfileView(ID)

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
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
]);

  const fetchJobs = async ()=>{
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/InternshipRoutes/getInternshipsByCompanyId/${id}`
      );

      const data = await res.json();
      console.log("API response:", data);

      // If your API returns { internships: [...] }, adjust accordingly
      setJob(Array.isArray(data) ? data : data.internships || []);
      
      useEffect(() => {
        if (!id) {
          navigate("/login");
        }
        console.log(id);
      }, [id, navigate]);

      setJob(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchApplication = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await fetch(
      `http://localhost:5000/api/applicationRoutes/fetchByCompanyId/${id}`
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("API response:", data);

    // ✅ if you want to set applications to state
    setApplications(data); 
  } catch (error: any) {
    console.error("Failed to fetch applications:", error);
    setError(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  



// Helper to increment profile view
const incrementProfileView = async (ID: string) => {
  const studentID = applications.find(app => app._id === ID)?.studentId;
  try {
    const res = await fetch(
      `http://localhost:5000/api/studentRoutes/incrementProfileView/${studentID}`,
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

// Helper to send a message
const sendMessageToStudent = async (ID: string, message: string) => {
 const studentID = applications.find(app => app._id === ID)?.studentId;

  try {
    const res = await fetch(
      `http://localhost:5000/api/studentRoutes/addRecentNotification/${studentID}`,
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
    
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/companyRoutes/getById/${id}`
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      console.log("API response:", data);

      // Convert Base64 logo to data URL for <img>
      if (data.company.logo) {
        const logoDataUrl = `data:${
          data.company.logoType || "image/png"
        };base64,${data.company.logo}`;
        data.company.logoUrl = logoDataUrl; // attach a new field for rendering
      }

      setCompanyProfile(data.company);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatically on mount
  useEffect(() => {
    fetchCompanyDetails();
    fetchJobs();
    fetchApplication();
  }, []);

  const [formData, setFormData] = useState({
    companyName: companyProfile?.companyName || "",
    website: companyProfile?.website || "",
    email: companyProfile?.email || "",
    description: companyProfile?.description || "",
    logoFile: null as File | null, // For new logo upload
    location:companyProfile?.location ||"",
    industry:companyProfile?.industry ||"",
    employees:companyProfile?.employees ||""
  });

  useEffect(() => {
    if (companyProfile) {
      setFormData((prev) => ({
        companyName: companyProfile.companyName || "",
        website: companyProfile.website || "",
        email: companyProfile.email || "",
        description: companyProfile.description || "",
        logoFile: prev.logoFile || null,
        location:companyProfile.location ||"",
        industry:companyProfile.industry ||"",
        employees:companyProfile.employees||""
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

      // Optional: preview immediately
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
    try {
      const formToSend = new FormData();
      formToSend.append("companyName", formData.companyName);
      formToSend.append("website", formData.website);
      formToSend.append("email", formData.email);
      formToSend.append("description", formData.description);
      formToSend.append("industry", formData.industry);
      formToSend.append("employees", formData.employees);
      formToSend.append("location", formData.location);
      if (formData.logoFile) formToSend.append("logo", formData.logoFile);

      const res = await fetch(
        `http://localhost:5000/api/companyRoutes/updateCompany/${companyProfile?.id}`,
        {
          method: "PUT",
          body: formToSend,
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      console.log("Updated company:", data);
      fetchCompanyDetails();
      setCompanyProfile(data.company); // update local state
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAddPosition =()=>{
     setShowJobModal(true);

  }

 const handleDelete = async (ID: string) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/InternshipRoutes/deleteInternshipById/${ID}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert("Error deleting internship: " + data.message);
      return;
    }

    // Optional: remove deleted internship from local state if you have a list
    

    alert("Internship deleted successfully!");
     fetchJobs();
  } catch (error) {
    console.error("Delete error:", error);
    alert("Something went wrong while deleting.");
  }
};


const handleJobPosition = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  try {
  console.log({
  companyId: id,
  companyName: companyProfile?.companyName,
  duration: fData?.duration,
  requirements: fData?.requirements,
  description: fData?.description,
  title: fData?.title,
  location: fData?.location,
});

    const response = await fetch("http://localhost:5000/api/InternshipRoutes/createInternship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        
        companyId: id,
        companyName:companyProfile?.companyName,
        duration: fData?.duration,
        requirements: fData?.requirements,
        description: fData?.description,
        title: fData?.title,
        location: fData?.location,
      }),
    });

    if (!response.ok) throw new Error("Failed to  create internship");

    const data = await response.json();
    alert("Internship created Succesfully")
    console.log("Internship created:", data);
    setShowJobModal(false)
    fetchJobs();

  } catch (error) {
    console.error("Error creating internship:", error);
  }
};

const handleEditPosition = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  try {
  console.log({
  companyId: id,
  companyName: companyProfile?.companyName,
  duration: fData?.duration,
  requirements: fData?.requirements,
  description: fData?.description,
  title: fData?.title,
  location: fData?.location,
});
   
    const response = await fetch(`http://localhost:5000/api/InternshipRoutes/editInternshipById/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        
        companyId: id,
        companyName:companyProfile?.companyName,
        duration: fData?.duration,
        requirements: fData?.requirements,
        description: fData?.description,
        title: fData?.title,
        location: fData?.location,
      }),
    });

    if (!response.ok) throw new Error("Failed to  Edit the internship");

    const data = await response.json();
    alert("Changes saved")
    console.log("Internship Edited Succesfully:", data);
    setEdit(false)
    fetchJobs();

  } catch (error) {
    console.error("Error creating internship:", error);
  }
};

const handleAccept = async (ID: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/applicationRoutes/acceptApplication/${ID}`,
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
    alert("Status updated successfully!");
    sendAcceptmail(ID)
    fetchApplication();
    
    sendMessageToStudent(ID,`${companyProfile?.companyName} has accepted your application. Check your mail`)
    // Optional: update local state if needed, e.g.,
    // setApplications(prev => prev.map(app => app._id === ID ? { ...app, status: "rejected" } : app));

  } catch (error) {
    console.error(error);
    alert(error instanceof Error ? error.message : "Something went wrong");
  }
};


const handleReject = async (ID: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/applicationRoutes/rejectApplication/${ID}`,
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
    alert("Status updated successfully!");
    fetchApplication();
    sendRejectemail(ID);
    
    sendMessageToStudent(ID,`${companyProfile?.companyName}  has been rejected your application check you mail`)
    // Optional: update local state if needed, e.g.,
    // setApplications(prev => prev.map(app => app._id === ID ? { ...app, status: "rejected" } : app));

  } catch (error) {
    console.error(error);
    alert(error instanceof Error ? error.message : "Something went wrong");
  }
};

const handleDownloadCV = async (id:string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/studentRoutes/getCV/${id}`
    );

    if (!response.ok) {
      throw new Error("CV download failed");
    }

    // Get the file as a blob
    const blob = await response.blob();

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger download
    const a = document.createElement("a");
    a.href = url;

    // Optionally, get the filename from Content-Disposition header
    const disposition = response.headers.get("Content-Disposition");
    let filename = "CV.pdf"; // default
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Company Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your internship programs and candidates
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
            },
            {
              icon: <Eye className="w-6 h-6 text-teal-600" />,
              value: Job.length,
              label: "Active Positions",
              color: "bg-teal-100",
            },
            {
              icon: <MessageCircle className="w-6 h-6 text-orange-600" />,
              value: applications.filter(app => app.status === "pending").length,
              label: "Pending Reviews",
              color: "bg-orange-100",
            },
            {
              icon: <Download className="w-6 h-6 text-green-600" />,
              value: applications.filter(app => app.status === "accepted").length,
              label: "Interviews Scheduled",
              color: "bg-green-100",
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
                {stat.value}
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
    {[
      ...applications.filter((app) => app.status === "pending"),
      ...applications.filter((app) => app.status === "accepted"),
      ...applications.filter((app) => app.status === "rejected"),
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
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">GPA:</h4>
            <p className="text-lg font-semibold text-green-600">{forms.gpa}</p>
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
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleAccept(forms._id)}
          >
            Accept
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleReject(forms._id)}
          >
            Reject
          </Button>
        </div>
      </Card>
    ))}
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
              {Job.map((internship) => (
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
                    <Button variant="outline" size="sm" onClick={()=>handleEdit(internship._id||"")}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm"onClick={()=>handleViewApplication(internship._id||"")}>
                      <Eye className="w-4 h-4 mr-1" /> View Applications
                    </Button>
                    <Button
                                   variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(internship._id||"")}
                                     >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Company Profile Tab */}
        {activeTab === "company" && (
          <Card className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-6">Company Profile</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Company Name */}
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

                {/* Website */}
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

                  {/*Location */}
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
                      {/* Email */}
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

                    {/*Employee count */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee count
                  </label>
                  <input
                    type="text"
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                  />
                </div>

                    {/*Industry */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                  />
                </div>
              </div>
            
              

              {/* Right Column */}
              <div className="space-y-4">
                {/* Company Logo */}
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

                {/* Description */}
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

            {/* Save Changes Button */}
            <div className="mt-6">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {/* Add Job Modal */}
        {showJobModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full p-6 rounded-xl shadow-lg bg-white">
              <h3 className="text-xl font-bold mb-6">
                Add New Internship Position
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
                    value={fData?.title || ""}   // ✅ controlled value
                    onChange={(e) =>
                    setFdata((prev) => ({
                     ...prev,
                    title: e.target.value,     // ✅ update title
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
    value={fData?.duration || ""}  // ✅ controlled value
    onChange={(e) =>
      setFdata((prev) => ({
        ...prev,
        duration: e.target.value,   // ✅ update duration
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
                    onChange={(e)=> setFdata((prev) => ({
                     ...prev,
                    location: e.target.value,     // ✅ update location
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
                    placeholder="Describe the internship role..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                    onChange={(e)=>setFdata((prev) => ({
                     ...prev,
                    description: e.target.value,     // ✅ update title
                  }))}
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
                    onChange={(e)=>setFdata((prev) => ({
                     ...prev,
                    requirements: e.target.value.split(",").map(req => req.trim()), // convert to string[]
                  }))}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowJobModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={handleJobPosition}
                  >
                    Create Position
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}


        {/*Edit job Model*/}
        {edit && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <Card className="max-w-2xl w-full p-6 rounded-xl shadow-lg bg-white">
      <h3 className="text-xl font-bold mb-6">Edit Internship Position</h3>
      <div className="space-y-4">
        {/* Position & Duration */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Position Title</label>
            <input
              type="text"
              value={fData?.title || ""}
              onChange={(e) =>
                setFdata(prev => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <select
              value={fData?.duration || ""}
              onChange={(e) =>
                setFdata(prev => ({ ...prev, duration: e.target.value }))
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

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={fData?.location || ""}
            onChange={(e) =>
              setFdata(prev => ({ ...prev, location: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={4}
            value={fData?.description || ""}
            onChange={(e) =>
              setFdata(prev => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium mb-1">Requirements</label>
          <input
            type="text"
            value={fData?.requirements?.join(", ") || ""}
            onChange={(e) =>
              setFdata(prev => ({
                ...prev,
                requirements: e.target.value
                  .split(",")
                  .map(req => req.trim())
                  .filter(req => req.length > 0),
              }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter multiple requirements separated by commas
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setEdit(false)}>
            Cancel
          </Button>
          <Button
            fullWidth
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            onClick={ handleEditPosition} // call your save/update function
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  </div>
)}
      </div>
    </div>
  );
};

export default CompanyDashboard;