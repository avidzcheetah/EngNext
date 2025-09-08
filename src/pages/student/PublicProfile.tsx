import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Award,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ExternalLink,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";

// -------------------------
// TypeScript Interfaces
// -------------------------
interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  profilePicture?: string | null;
  bio?: string;
  skills: string[];
  gpa?: number;
  year?: string;
  registrationNumber?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  availability?: boolean;
  ApplicationsSent?: number;
}

interface PublicStudentProfileProps {
  onBack?: () => void;
}

// -------------------------
// Component
// -------------------------
const PublicStudentProfile: React.FC<PublicStudentProfileProps> = ({ onBack }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [profileData, setProfileData] = useState<StudentProfile>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    skills: [],
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const { id: stateId } = location.state || {};

  const studentId = stateId || paramId;

  // -------------------------
  // Fetch Data
  // -------------------------
  const fetchProfile = async () => {
    if (!studentId) {
      setError("Student ID not provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/studentRoutes/getStudentById/${studentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfilePicture = async () => {
    if (!studentId) return;
    try {
      const res = await fetch(
        `${baseUrl}/api/studentRoutes/getProfilePicture/${studentId}`
      );
      if (!res.ok) return;
      const blob = await res.blob();
      setProfilePreview(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Failed to fetch profile picture", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProfilePicture();
  }, [studentId]);

  // -------------------------
  // Render Loading / Error
  // -------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading student profile...</span>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The student profile is not accessible."}
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------
  // Render Profile
  // -------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-3xl font-extrabold ml-4 text-blue-600">
            Student Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-40 relative">
            {/* Profile Picture */}
            <div className="absolute -bottom-20 left-8 w-40 h-40 rounded-full border-4 border-white overflow-hidden shadow-lg">
              {profileData.profilePicture && profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="absolute top-6 right-6">
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  profileData.availability
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                <span>
                  {profileData.availability
                    ? "Available for Internships"
                    : "Not Available"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-24 pb-8 px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <span>Engineering Undergraduate • {profileData.year}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Registration: {profileData.registrationNumber}
                </p>
                {profileData.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {profileData.bio}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a
                        href={`mailto:${profileData.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {profileData.email}
                      </a>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a
                          href={`tel:${profileData.phone}`}
                          className="text-gray-700"
                        >
                          {profileData.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <Award className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-900">
                        {profileData.gpa}
                      </div>
                      <div className="text-sm text-gray-600">GPA</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <GraduationCap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900">
                        {profileData.year}
                      </div>
                      <div className="text-sm text-gray-600">Current Year</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Online Presence
          </h3>
          <div className="space-y-3">
            {profileData.portfolio && (
              <a
                href={profileData.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <Globe className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                <span className="text-gray-700 group-hover:text-blue-600">
                  Portfolio Website
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
              </a>
            )}
            {profileData.linkedin && (
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                <span className="text-gray-700 group-hover:text-blue-600">
                  LinkedIn Profile
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
              </a>
            )}
            {profileData.github && (
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                <span className="text-gray-700 group-hover:text-blue-600">
                  GitHub Profile
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
              </a>
            )}
            {!profileData.portfolio &&
              !profileData.linkedin &&
              !profileData.github && (
                <div className="text-center text-gray-500 py-8">
                  <ExternalLink className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No social links provided</p>
                </div>
              )}
          </div>
        </div>

        {/* Skills */}
        {profileData.skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-3">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100 hover:shadow-sm transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicStudentProfile;