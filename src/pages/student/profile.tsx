import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  User, 
  Camera, 
  Save, 
  Edit3, 
  Phone, 
  Mail, 
  FileText, 
  Plus, 
  X, 
  Check,
  Upload,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Types for student profile
interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: File | null;
  bio?: string;
  skills: string[];
  subfields: string[]; // New field for interested subfields
  gpa?: number;
  year: string;
  department: string;
  registrationNumber: string;
  cv?: {
    filename: string;
    uploadDate: string;
    size: string;
  };
  portfolio?: string;
  linkedin?: string;
  github?: string;
  availability: boolean;
}

const StudentProfile: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [progress, setProgress] = useState(100); // Progress bar for auto-dismiss

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newSubfield, setNewSubfield] = useState(''); // New state for subfield input

  const [profileData, setProfileData] = useState<StudentProfile>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicture: null,
    bio: '',
    skills: [],
    subfields: [], // Initialize subfields
    gpa: 0,
    year: '1st Year',
    department: '',
    registrationNumber: '',
    portfolio: '',
    linkedin: '',
    github: '',
    availability: true,
  });

  const [cv, setCV] = useState<File | null>(null);
  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const location = useLocation();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  
  let id = user?.id;

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/api/studentRoutes/getStudentById/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setProfileData({ ...data, department: data.department, subfields: data.subfields || [] });
    } catch (err) {
      console.log("Error fetching data");
      setError("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, id]);

  const fetchProfilePicture = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/studentRoutes/getProfilePicture/${id}`);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProfilePreview(imageUrl);
    } catch (err) {
      console.error(err);
    }
  }, [baseUrl, id]);

  const fetchCV = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/studentRoutes/getCV/${id}`, { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch CV");

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      setCvPreview(fileUrl);
    } catch (err) {
      console.log("Error fetching CV:", err);
      setError("Failed to fetch CV");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, id]);

  // Load profile data on component mount
  useEffect(() => {
    Promise.all([fetchProfile(), fetchCV(), fetchProfilePicture()]);
  }, [fetchProfile, fetchCV, fetchProfilePicture]);

  // Progress bar animation for success popup
  useEffect(() => {
    if (showSuccessPopup) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress(prev => Math.max(prev - (100 / 50), 0)); // 5 seconds = 50 * 100ms
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showSuccessPopup]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  }, []);

  const handleProfilePictureChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError('Profile picture must be less than 3MB');
      return;
    }
    setProfileData(prev => ({ ...prev, profilePicture: file as File }));
    const previewUrl = URL.createObjectURL(file);
    setProfilePreview(previewUrl);
    setSuccess('Profile picture updated successfully!');
    setShowSuccessPopup(true);
  }, []);

  const handleCVUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('CV must be a PDF file');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('CV must be less than 4MB');
      return;
    }
    const newCV = {
      filename: file.name,
      uploadDate: new Date().toISOString(),
      size: `${(file.size / 1024).toFixed(2)} KB`,
    };
    setCV(file);
    setCvPreview(URL.createObjectURL(file));
    setProfileData(prev => ({ ...prev, cv: newCV }));
  }, []);

  const addSkill = useCallback(() => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  }, [newSkill, profileData.skills]);

  const removeSkill = useCallback((skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  }, []);

  const addSubfield = useCallback(() => {
    if (newSubfield.trim() && !profileData.subfields.includes(newSubfield.trim()) && profileData.subfields.length < 3) {
      setProfileData(prev => ({
        ...prev,
        subfields: [...prev.subfields, newSubfield.trim()]
      }));
      setNewSubfield('');
    } else if (profileData.subfields.length >= 3) {
      setError('You can only add up to 3 subfields');
    }
  }, [newSubfield, profileData.subfields]);

  const removeSubfield = useCallback((subfieldToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      subfields: prev.subfields.filter(subfield => subfield !== subfieldToRemove)
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      (Object.keys(profileData) as (keyof StudentProfile)[]).forEach(key => {
        if (key !== "cv" && key !== "profilePicture" && key !== "skills" && key !== "subfields") {
          const value = profileData[key];
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });
      if (profileData.skills) formData.append("skills", JSON.stringify(profileData.skills));
      if (profileData.subfields) formData.append("subfields", JSON.stringify(profileData.subfields));
      if (cv) formData.append("cv", cv);
      if (profileData.profilePicture) formData.append("profilePicture", profileData.profilePicture);

      const response = await fetch(`${baseUrl}/api/studentRoutes/updatestudents/${id}`, {
        method: "PUT",
        body: formData
      });

      if (!response.ok) throw new Error("Failed to update profile");

      await Promise.all([fetchCV(), fetchProfilePicture(), fetchProfile()]);
      
      setSuccess("Profile updated successfully!");
      setShowSuccessPopup(true);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }

    setTimeout(() => {
      setSuccess(null);
      setError(null);
      setShowSuccessPopup(false);
    }, 5000);
  }, [baseUrl, id, profileData, cv, fetchCV, fetchProfilePicture, fetchProfile]);

  // Memoized profile picture component to prevent re-renders
  const ProfilePicture = useMemo(() => (
    <div className="relative">
      <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
        {profileData.profilePicture ? (
          <img
            src={profilePreview ?? undefined}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <User className="w-12 h-12 text-blue-600" />
          </div>
        )}
      </div>
      {isEditing && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        >
          <Camera className="w-4 h-4" />
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureChange}
        className="hidden"
      />
    </div>
  ), [profileData.profilePicture, profilePreview, isEditing, handleProfilePictureChange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 mt-2">Manage your personal information and settings</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              isEditing
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 animate-slide-in">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && success && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 transition-opacity duration-300">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Success
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-center">{success}</p>
              <div className="relative w-full h-1 bg-gray-200 rounded-full mb-6">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
              <div className="absolute -bottom-16 left-8">{ProfilePicture}</div>
            </div>
            
            <div className="pt-20 pb-6 px-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-600">Engineering Undergraduate • {profileData.year}</p>
                  <p className="text-sm text-gray-500">Reg: {profileData.registrationNumber}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${profileData.availability ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      {profileData.availability ? 'Available for opportunities' : 'Not available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+94 XX XXX XXXX"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  name="department"
                  value={profileData.department}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                >
                  <option value="Electrical & Electronic Engineering">Electrical & Electronic Engineering</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <select
                  name="year"
                  value={profileData.year}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                <input
                  type="number"
                  name="gpa"
                  value={profileData.gpa}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="0"
                  max="4"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={profileData.registrationNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-all duration-200"
                placeholder="Tell us about yourself, your interests, and career goals..."
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills & Expertise</h3>
            
            <div className="mb-4 text-blue-700">
              {profileData.skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center">
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-blue-500 hover:text-red-500 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {index < profileData.skills.length - 1 && <span>,&nbsp;</span>}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>

          {/* Interested Subfields */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Interested Subfields</h3>
            
            <div className="mb-4 text-blue-700">
              {profileData.subfields.length > 0 ? (
                profileData.subfields.map((subfield, index) => (
                  <span key={index} className="inline-flex items-center">
                    <span>{subfield}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeSubfield(subfield)}
                        className="ml-1 text-blue-500 hover:text-red-500 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {index < profileData.subfields.length - 1 && <span>,&nbsp;</span>}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No subfields added</span>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubfield}
                  onChange={(e) => setNewSubfield(e.target.value)}
                  placeholder="Add a subfield (max 3)..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && addSubfield()}
                  disabled={profileData.subfields.length >= 3}
                />
                <button
                  onClick={addSubfield}
                  disabled={profileData.subfields.length >= 3}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            )}
            {isEditing && (
              <p className="text-sm text-gray-500 mt-2">
                Add most interested field first and others according to the interest level. {3 - profileData.subfields.length} subfield(s) remaining
              </p>
            )}
          </div>

          {/* CV & Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Documents</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CV/Resume</label>
                {profileData.cv ? (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">{profileData.cv.filename}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded on {new Date(profileData.cv.uploadDate).toLocaleDateString()} • {profileData.cv.size}
                        </p>
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => cvInputRef.current?.click()}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition-colors duration-200"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Replace</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">No CV uploaded</p>
                    {isEditing && (
                      <button
                        onClick={() => cvInputRef.current?.click()}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Upload CV
                      </button>
                    )}
                  </div>
                )}
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleCVUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Links</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                <input
                  type="url"
                  name="portfolio"
                  value={profileData.portfolio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="https://your-portfolio.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={profileData.linkedin}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={profileData.github}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Availability</h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="availability"
                checked={profileData.availability}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:bg-gray-50 transition-all duration-200"
              />
              <label className="text-gray-700">
                I am currently available for job opportunities
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Companies will be able to see your availability status when viewing your profile
            </p>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tailwind Animation Classes */}
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
  );
};

export default StudentProfile;