import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  ExternalLink,
  Download,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Award,
  Clock
} from 'lucide-react';

// Types for student profile
interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  profilePicture?: string;
  bio?: string;
  skills: string[];
  gpa?: number;
  year: string;
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
  appliedDate?: string;
  internshipTitle?: string;
}

interface PublicStudentProfileProps {
  studentId?: string;
  onBack?: () => void;
}

const PublicStudentProfile: React.FC<PublicStudentProfileProps> = ({ 
  studentId = "1", 
  onBack 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);

  // Load profile data on component mount
  useEffect(() => {
    fetchStudentProfile();
  }, [studentId]);

  const fetchStudentProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with actual API call to MongoDB
      const response = await fetch(`/api/students/public-profile/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student profile');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      // Mock data for demonstration
      console.log('Using mock data - API not yet implemented');
      const mockStudent: StudentProfile = {
        id: studentId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@eng.jfn.ac.lk',
        phone: '+94 77 123 4567',
        dateOfBirth: '1999-05-15',
        address: '123 University Road',
        city: 'Jaffna',
        postalCode: '40000',
        profilePicture: '',
        bio: 'Passionate Electronics and Electrical Engineering student with a strong interest in renewable energy systems, automation, and sustainable technology solutions. Currently seeking internship opportunities to apply theoretical knowledge in real-world projects and contribute to innovative engineering solutions.',
        skills: ['Python', 'Arduino', 'MATLAB', 'Circuit Design', 'Power Systems', 'PCB Design', 'Embedded Systems', 'C++', 'Renewable Energy'],
        gpa: 3.75,
        year: '3rd Year',
        registrationNumber: '2021ENG001',
        portfolio: 'https://johndoe.portfolio.com',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        availability: true,
        appliedDate: '2025-01-15',
        internshipTitle: 'Electronics Engineering Intern',
        cv: {
          filename: 'John_Doe_CV.pdf',
          uploadDate: '2024-12-01',
          size: '2.3 MB'
        }
      };
      setProfileData(mockStudent);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading student profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The student profile you're looking for doesn't exist or is not accessible.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Student Profile
              </h1>
              <p className="text-gray-600 mt-1">Public profile view for internship applications</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-40 relative">
              <div className="absolute -bottom-20 left-8">
                <div className="w-40 h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                  {profileData.profilePicture ? (
                    <img
                      src={profileData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
              {/* Availability Badge */}
              <div className="absolute top-6 right-6">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  profileData.availability 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      profileData.availability ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span>{profileData.availability ? 'Available for Internships' : 'Not Available'}</span>
                  </div>
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
                    <GraduationCap className="w-5 h-5" />
                    <span>EEE Student • {profileData.year}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Registration: {profileData.registrationNumber}</p>
                  
                  {profileData.appliedDate && profileData.internshipTitle && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Applied Position:</span>
                      </div>
                      <p className="text-blue-900 font-semibold">{profileData.internshipTitle}</p>
                      <p className="text-blue-600 text-sm">Applied on {new Date(profileData.appliedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  {profileData.bio && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a href={`mailto:${profileData.email}`} className="text-blue-600 hover:text-blue-700">
                          {profileData.email}
                        </a>
                      </div>
                      {profileData.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <a href={`tel:${profileData.phone}`} className="text-gray-700">
                            {profileData.phone}
                          </a>
                        </div>
                      )}
                      {(profileData.address || profileData.city) && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {[profileData.address, profileData.city].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                      {profileData.dateOfBirth && (
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {calculateAge(profileData.dateOfBirth)} years old
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Academic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Award className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{profileData.gpa}</div>
                        <div className="text-sm text-gray-600">GPA</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{profileData.year}</div>
                        <div className="text-sm text-gray-600">Current Year</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
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

          {/* Documents & Links */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* CV Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Documents</h3>
              {profileData.cv ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{profileData.cv.filename}</p>
                      <p className="text-sm text-gray-500">
                        Updated {new Date(profileData.cv.uploadDate).toLocaleDateString()} • {profileData.cv.size}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No CV available</p>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Online Presence</h3>
              <div className="space-y-3">
                {profileData.portfolio && (
                  <a
                    href={profileData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Globe className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                    <span className="text-gray-700 group-hover:text-blue-600">Portfolio Website</span>
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
                    <span className="text-gray-700 group-hover:text-blue-600">LinkedIn Profile</span>
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
                    <span className="text-gray-700 group-hover:text-blue-600">GitHub Profile</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto" />
                  </a>
                )}
                {!profileData.portfolio && !profileData.linkedin && !profileData.github && (
                  <div className="text-center text-gray-500 py-8">
                    <ExternalLink className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>No social links provided</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons for Company Dashboard */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Send Message</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Schedule Interview
              </button>
              {profileData.cv && (
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </button>
              )}
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Add Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicStudentProfile;