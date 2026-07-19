import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Camera,
  Edit3,
  Phone,
  Mail,
  Globe,
  MapPin,
  Plus,
  X,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CompanyProfileData {
  id?: string;
  description?: string;
  website?: string;
  email?: string;
  logoUrl?: string;
  logoFile?: File | null;
  companyName?: string;
  location?: string;
  departments?: string[];
  subfield?: string[];
  phoneNo?: string;
}

const CompanyProfile: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [progress, setProgress] = useState(100);

  const [isEditing, setIsEditing] = useState(false);
  const [newSubfield, setNewSubfield] = useState('');

  const departmentOptions = [
    { value: "EEE", label: "Electrical and Electronic Engineering" },
    { value: "COM", label: "Computer Engineering" },
    { value: "Mech", label: "Mechanical Engineering" },
    { value: "Civil", label: "Civil Engineering" },
  ];

  const [profileData, setProfileData] = useState<CompanyProfileData>({
    id: '',
    companyName: '',
    email: '',
    phoneNo: '',
    location: '',
    description: '',
    website: '',
    logoFile: null,
    logoUrl: '',
    departments: [],
    subfield: [],
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const id = user?.id;

  const fetchProfile = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/api/companyRoutes/getById/${id}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      
      const company = data.company;
      let logoUrl = company.logoUrl || '';
      if (company.logo) {
        if (company.logo.startsWith('http')) {
          logoUrl = company.logo;
        } else {
          logoUrl = `data:${company.logoType || "image/png"};base64,${company.logo}`;
        }
      }
      
      setProfileData({
        id: company._id || company.id,
        companyName: company.companyName || '',
        email: company.email || '',
        phoneNo: company.phoneNo || '',
        location: company.location || '',
        description: company.description || '',
        website: company.website || '',
        departments: company.departments || [],
        subfield: Array.isArray(company.subfield) ? [...new Set(company.subfield)] : [],
        logoUrl: logoUrl,
        logoFile: null
      });

      if (logoUrl) {
        setProfilePreview(logoUrl);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (showSuccessPopup) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress(prev => Math.max(prev - (100 / 50), 0));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showSuccessPopup]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleLogoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError('Logo must be less than 3MB');
      return;
    }
    setProfileData(prev => ({ ...prev, logoFile: file }));
    const previewUrl = URL.createObjectURL(file);
    setProfilePreview(previewUrl);
    setSuccess('Logo updated successfully! Remember to save changes.');
    setShowSuccessPopup(true);
  }, []);

  const addSubfield = useCallback(() => {
    const trimmed = newSubfield.trim();
    if (trimmed && !(profileData.subfield || []).includes(trimmed)) {
      setProfileData(prev => ({
        ...prev,
        subfield: [...(prev.subfield || []), trimmed]
      }));
      setNewSubfield('');
    }
  }, [newSubfield, profileData.subfield]);

  const removeSubfield = useCallback((subfieldToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      subfield: (prev.subfield || []).filter(s => s !== subfieldToRemove)
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("companyName", profileData.companyName || "");
      formData.append("email", profileData.email || "");
      formData.append("phoneNo", profileData.phoneNo || "");
      formData.append("location", profileData.location || "");
      formData.append("description", profileData.description || "");
      formData.append("website", profileData.website || "");
      formData.append("departments", JSON.stringify(profileData.departments || []));
      formData.append("subfield", JSON.stringify(profileData.subfield || []));
      
      if (profileData.logoFile) {
        formData.append("logo", profileData.logoFile);
      }

      const response = await fetch(`${baseUrl}/api/companyRoutes/updateCompany/${id}`, {
        method: "PUT",
        body: formData
      });

      if (!response.ok) throw new Error("Failed to update profile");

      await fetchProfile();
      
      setSuccess("Profile updated successfully!");
      setShowSuccessPopup(true);
      setIsEditing(false);
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
  }, [baseUrl, id, profileData, fetchProfile]);

  const ProfilePicture = useMemo(() => (
    <div className="relative">
      <div className="w-32 h-32 rounded-xl border-4 border-white bg-white overflow-hidden shadow-md">
        {profilePreview ? (
          <img
            src={profilePreview}
            alt="Company Logo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-blue-600" />
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
        onChange={handleLogoChange}
        className="hidden"
      />
    </div>
  ), [profilePreview, isEditing, handleLogoChange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading company profile...</span>
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
              Company Profile
            </h1>
            <p className="text-gray-600 mt-2">Manage your company information and settings</p>
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
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8">
          {/* Logo & Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
              <div className="absolute -bottom-16 left-8">{ProfilePicture}</div>
            </div>
            
            <div className="pt-20 pb-6 px-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.companyName || "Company Name"}
              </h2>
              <div className="flex items-center text-gray-600 mt-2 space-x-4">
                {profileData.location && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profileData.location}
                  </span>
                )}
                {profileData.departments && profileData.departments.length > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {profileData.departments.join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={profileData.companyName}
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
                <p className="text-xs text-gray-500 mt-1">Contact support to change your primary email.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNo"
                    value={profileData.phoneNo}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+94 XX XXX XXXX"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://yourcompany.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location / Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Headquarters Location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell students about your company..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Departments</label>
                <div className="grid grid-cols-2 gap-4">
                  {departmentOptions.map(option => (
                    <label key={option.value} className={`flex items-center space-x-2 ${!isEditing ? 'opacity-70' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={(profileData.departments || []).includes(option.value)}
                        disabled={!isEditing}
                        onChange={() => {
                          setProfileData(prev => {
                            const deps = prev.departments || [];
                            const isSelected = deps.includes(option.value);
                            return {
                              ...prev,
                              departments: isSelected
                                ? deps.filter(d => d !== option.value)
                                : [...deps, option.value]
                            };
                          });
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subfields</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(profileData.subfield || []).map((field, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center shadow-sm"
                    >
                      {field}
                      {isEditing && (
                        <button
                          onClick={() => removeSubfield(field)}
                          className="ml-2 p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSubfield}
                      onChange={(e) => setNewSubfield(e.target.value)}
                      placeholder="Add a subfield (e.g., Embedded Systems)"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubfield())}
                    />
                    <button
                      onClick={addSubfield}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 animate-fade-in">
              <button
                onClick={() => {
                  fetchProfile();
                  setIsEditing(false);
                }}
                disabled={isSaving}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;