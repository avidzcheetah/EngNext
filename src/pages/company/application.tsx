import React, { useEffect, useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import emailjs from "emailjs-com";


// Components (replace with your UI components)
import {
  Eye,
  Download,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// -------------------- Types --------------------
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

interface CompanyProfile {
  email: string;
  companyName: string;
}

// -------------------- Page --------------------
const ApplicationsPage: React.FC = () => {
  const location = useLocation();
  const { internshipId } = location.state as { internshipId: string };
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------- Fetch Applications --------------------
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`http://localhost:5000/api/applicationRoutes/fetchByInternshipId/${internshipId}`);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

      const data = await res.json();
      setApplications(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [internshipId]);

  // -------------------- Email --------------------
  const sendEmail = (studentId: string, templateId: string) => {
    const app = applications.find(app => app._id === studentId);
    if (!app) return;

    emailjs
      .send(
        "service_yeke3la",
        templateId,
        {
          toemail: app.email,
          applicat_name: app.studentName,
          title: app.internshipTitle,
          hr_email: companyProfile?.email,
          organization_name: companyProfile?.companyName,
          time: new Date().toLocaleDateString(),
          email: companyProfile?.email,
        },
        "xoBLJNkyjseJaPApW"
      )
      .then(
        result => {
          console.log("✅ Email sent:", result.text);
          alert("Email sent successfully!");
        },
        error => {
          console.error("❌ Email failed:", error.text);
          alert("Failed to send email.");
        }
      );
  };

  const handleAccept = async (ID: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applicationRoutes/acceptApplication/${ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to accept application");
      }

      await res.json();
      fetchApplications();
      sendEmail(ID, "template_mogx38j"); // Accept template
      sendMessageToStudent(ID, `${companyProfile?.companyName} has accepted your application`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleReject = async (ID: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applicationRoutes/rejectApplication/${ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to reject application");
      }

      await res.json();
      fetchApplications();
      sendEmail(ID, "template_06tm1fa"); // Reject template
      sendMessageToStudent(ID, `${companyProfile?.companyName} has rejected your application`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  // -------------------- Notifications --------------------
  const sendMessageToStudent = async (ID: string, message: string) => {
    const studentID = applications.find(app => app._id === ID)?.studentId;
    if (!studentID) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/studentRoutes/addRecentNotification/${studentID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notification: message }),
        }
      );
      if (!res.ok) throw new Error(`Error sending message: ${res.status}`);
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error in sendMessageToStudent:", error);
    }
  };

  // -------------------- Profile View --------------------
  const incrementProfileView = async (ID: string) => {
    const studentID = applications.find(app => app._id === ID)?.studentId;
    if (!studentID) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/studentRoutes/incrementProfileView/${studentID}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error(`Error incrementing profile view: ${res.status}`);
      console.log("Profile view incremented successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewProfile = (studentId: string) => {
    incrementProfileView(studentId);
    navigate("/student/PublicProfile", { state: { id: studentId } });
  };

  // -------------------- Download CV --------------------
  const handleDownloadCV = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/studentRoutes/getCV/${id}`);
      if (!res.ok) throw new Error("CV download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const disposition = res.headers.get("Content-Disposition");
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
      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  // -------------------- Helpers --------------------
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // -------------------- Render --------------------
  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="space-y-6">
          {applications
            .sort((a, b) => a.status.localeCompare(b.status))
            .map(app => (
              <Card key={app._id} className="p-6 hover:shadow-lg transition rounded-xl bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                      {app.studentName
                        .split(" ")
                        .map(n => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.studentName}</h3>
                      <p className="text-gray-600">{app.email}</p>
                      <p className="text-sm text-blue-600">{app.internshipTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied on{" "}
                      {new Date(app.appliedDate).toLocaleString("en-GB", {
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
                      {app.skills.map((skill, idx) => (
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
                    <p className="text-lg font-semibold text-green-600">{app.gpa}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:scale-105 transition"
                    onClick={() => handleViewProfile(app.studentId)}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadCV(app.studentId)}
                  >
                    <Download className="w-4 h-4 mr-1" /> Download CV
                  </Button>

                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAccept(app._id)}
                  >
                    Accept
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleReject(app._id)}>
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
