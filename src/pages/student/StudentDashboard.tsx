import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Heart
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { mockInternships, mockCompanies } from '../../data/mockData';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
  const location = useLocation();
  const [applicationsInfo, setApplicationsInfo] = useState<{
  ApplicationsSent: number;
  maximumApplications: number;
  message: string;
} | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Updated state variables for CV upload, cover letter, and interest level
  const [uploadedCV, setUploadedCV] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [interestLevel, setInterestLevel] = useState(60); // Default to 60%
   const [maximumApplications, setMaximumApplications] = useState<number>(0);
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
    interestLevel: number; // Added interest level to interface
    companyName: string; // Added companyName to interface
  }

// Initialize with empty array, will populate later with setApplications

   
   
  // Initialize with empty array, will populate later with setApplications
  const [applications, setApplications] = useState<Application[]>([]);
  const { user, isAuthenticated, logout } = useAuth();
  console.log(user);
  const id = user?.id;

  // Updated CV upload handler with proper validation
  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        alert('File size should be less than 4MB');
        return;
      }
      setUploadedCV(file);
    }
  };

  const [profileData, setProfileData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    postalCode: '',
    profilePicture: null,
    bio: '',
    skills: [],
    gpa: 0,
    year: '1st Year',
    registrationNumber: '',
    portfolio: '',
    linkedin: '',
    github: '',
    availability: true,
    ApplicationsSent: '',
    RecentNotifications: [],
    ProfileViews: '',
  });

  type Internships = {
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
  };

  const [fData, setFdata] = useState<Internships[] | null>(null);

  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [CVPreview, setCVPreview] = useState<{
    filename: string;
    uploadDate: string;
    size: string;
  } | null>(null);

  const [profilepreview, setProfilePreview] = useState<string | null>(null);
  

  // Function to get interest level color and text
  const getInterestLevelInfo = (level: number) => {
    if (level <= 20) return { color: 'bg-red-400', text: 'Low Interest', textColor: 'text-red-600' };
    if (level <= 40) return { color: 'bg-orange-400', text: 'Moderate Interest', textColor: 'text-orange-600' };
    if (level <= 60) return { color: 'bg-yellow-400', text: 'Good Interest', textColor: 'text-yellow-600' };
    if (level <= 80) return { color: 'bg-blue-400', text: 'High Interest', textColor: 'text-blue-600' };
    return { color: 'bg-green-400', text: 'Very High Interest', textColor: 'text-green-600' };
  };

  const handleUpdateprofile = () => {
    navigate("/student/profile", { state: { id: id } });
  }

  useEffect(() => {
    fetchProfile();
    fetchCV();
    fetchProfilePicture();
    fetchAllJobs();
    fetchTotalNumberOfApplicableInternshipsperStudent();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/studentRoutes/getStudentById/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      console.log(data);
      setProfileData(data);
    } catch (err) {
      console.log("Error fetching data")
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/studentRoutes/getProfilePicture/${id}`
      );

      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob); // create a temporary URL
      setProfilePreview(imageUrl);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/InternshipRoutes/getAllInternships`
      );

      if (!response.ok) throw new Error("Failed to fetch internships");

      const data = await response.json(); // ✅ parse JSON body
      setFdata(data); // ✅ update state with actual data
    } catch (err) {
      console.error("Error fetching internships:", err);
    }
  };


const fetchTotalNumberOfApplicableInternshipsperStudent =async ()=>{
      setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/studentRoutes/getMaximumApplications`);
      const data = await res.json();
      setMaximumApplications(data.maximumApplications);
      console.log("Fetched companies:", data.maximumApplications);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setIsLoading(false);
    }

}

  const fetchCV = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/studentRoutes/getCV/${id}`,
        {
          method: "GET",
          // No need for 'Content-Type' when getting a file
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch CV");
      }

      const blob = await response.blob(); // get the file as a Blob
      const fileUrl = URL.createObjectURL(blob); // create temporary URL
      setCvPreview(fileUrl); // store in state
    } catch (err) {
      console.log("Error fetching CV:", err);
      setError("Failed to fetch CV");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      const newApplication = {
        studentId: id,
        companyId: fData?.find((item) => item._id === selectedInternship)?.companyId || "",
        studentName: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        internshipTitle: fData?.find((item) => item._id === selectedInternship)?.title || "",
        appliedDate: new Date().toISOString(),
        status: "pending",
        skills: profileData.skills,
        gpa: profileData.gpa,
        internshipId: selectedInternship || "",
        coverLetter: coverLetter,
        interestLevel: interestLevel, // Include interest level in application
        companyName: fData?.find((item) => item._id === selectedInternship)?.companyName || "",
      };

      // 1️⃣ Send application to backend
      const res = await fetch(`${baseUrl}/api/applicationRoutes/createApplication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApplication),
      });
       
      // 2 Increment the numper of inter Applications sent by student
       const res2 = await fetch(`${baseUrl}/api/studentRoutes/incrementApplicationsSent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApplication),
      });

      if(res2.ok){
        const data2 = await res2.json();
        console.log("Application sent incremented",data2);
        setApplicationsInfo(data2)
        fetchTotalNumberOfApplicableInternshipsperStudent();
      }else{
        console.warn("Incrementing application sent failed");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert("You have already applied for this");
        setShowApplicationModal(false);
        return;
      }

      const data = await res.json();
      console.log("Application submitted to backend:", data);

      // 2️⃣ Update UI only after success
      setApplications((prev) => [...prev, data]);
      alert("Applied successfully");
      setShowApplicationModal(false);
      
      // Reset form state
      setUploadedCV(null);
      setCoverLetter('');
      setInterestLevel(60); // Reset interest level to default

      // 3️⃣ Increment ApplicationsSent
      const res1 = await fetch(
        `${baseUrl}/api/studentRoutes/incrementApplicationsSent/${id}`,
        { method: "PUT" }
      );

      if (!res1.ok) {
        console.warn("Increment failed:", res1.statusText);
      } else {
        const updated = await res1.json();
        console.log("Updated ApplicationsSent:", updated);
        // Optionally update local profileData state:
        // setProfileData((prev) => ({ ...prev, ApplicationsSent: updated.ApplicationsSent }));
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const filteredInternships = fData?.filter((internship) => {
    const title = internship.title ?? "";
    const company = internship.companyName ?? "";
    const field   =internship.title ??"";
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()); // ✅ use API field
      field.toLocaleLowerCase().includes(selectedFilter.toLocaleLowerCase())
    return matchesSearch && internship.isActive;
  });

  const handleApply = (internshipId: string) => {
    setSelectedInternship(internshipId);
    setShowApplicationModal(true);
    setInterestLevel(60); // Reset to default when opening modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Welcome back, {profileData.firstName} !
          </h1>
          <p className="text-gray-600">
            Discover your next internship opportunity and take your career forward.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <Card className="p-6 mb-8 border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search internships or companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                      fullWidth
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                  >
                    <option value="all">All Fields</option>
                    <option value="eee">Electronic and Electrical</option>
                    <option value="com">Computer</option>
                    <option value="mech">Mechanical</option>
                    <option value="civil">Civil</option>
                  </select>
                  <Button variant="outline" className="hover:shadow-md transition-all">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </Card>

            {/* Internship Listings */}
            <div className="space-y-6">
              {filteredInternships?.map((internship) => {
                const company = mockCompanies.find((c) => c.id === internship.companyId);
                return (
                  <Card
                    key={internship._id}
                    className="p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {internship.title}
                          </h3>
                          <p className="text-blue-600 font-medium">{internship?.companyName}</p>
                        </div>
                      </div>
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{internship.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{internship.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{internship.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Full-time</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {internship.requirements && internship.requirements.map((req, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" className="hover:bg-gray-80">
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleApply(internship._id || "")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] transition"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Quick View */}
            <Card className="p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="">
                {profileData.profilePicture ? (
                  <img
                    src={user?.profilePicture} // ✅ blob URL from state, never null
                    alt="Profile"
                    className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 ring-2 ring-blue-200"
                  />
                ) : (
                  <div className="w-21 h-21 bg-gradient-to-br from-blue-150 to-purple-150 flex items-center justify-center">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h3>
              <p className="text-sm text-gray-600">Engineering Undergraduate</p>

               <Button fullWidth className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={handleUpdateprofile}>
                <User className="w-4 h-4 mr-2" />
                Update Profile
              </Button>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Internships Applied:</span>
                  <span className="text-green-600 font-medium">{profileData?.ApplicationsSent}/{maximumApplications}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(Number(profileData?.ApplicationsSent) && maximumApplications ? (Number(profileData?.ApplicationsSent) / maximumApplications) * 100 : 0)}%` }}
                  ></div>
                </div>
              </div>

             
            </Card>

            {/* Notifications */}
            <Card className="p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Notifications</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <p className="text-sm font-medium text-blue-900">Application Status</p>
                  <p className="text-xs text-blue-700">
                    {profileData.RecentNotifications
                      .filter(
                        (note) =>
                          (note as string).toLowerCase().includes("accepted") ||
                          (note as string).toLowerCase().includes("rejected")
                      )
                      .slice(-3) // ✅ only last 3
                      .map((note, index) => (
                        <div key={index}>{note}</div>
                      ))}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition">
                  <p className="text-sm font-medium text-green-900">Application viewed</p>
                  <p className="text-xs text-green-700">
                    {profileData.RecentNotifications
                      .filter(
                        (note) =>
                          (note as string).toLowerCase().includes("viewed")
                      )
                      .slice(-3)
                      .map((note, index) => (
                        <div key={index}>{note}</div>
                      ))}
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
              {[
                { label: "Applications Sent:", value: profileData?.ApplicationsSent },
                { label: "Profile Views:", value: profileData?.ProfileViews },
              ].map((stat) => (
                <div className="flex justify-between" key={stat.label}>
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-medium">{stat.value ?? 0}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      {/* Updated Application Modal with Interest Level */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <Card className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Submit Application</h3>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Completeness Check */}
            {(!profileData.skills.length || !cvPreview) ? (
              <div className="text-center py-6">
                <div className="mb-4">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Complete Your Profile First</h4>
                  <p className="text-gray-600 mb-4">
                    Please make sure your profile is complete with your CV and skills before applying.
                    Companies will review your profile details during the application process.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/student/profile')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  Complete Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Your Application Profile</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{profileData.firstName} {profileData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">CV Status</p>
                      <p className="text-green-600 font-medium flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        Uploaded
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interest Level Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Heart className="w-4 h-4 inline mr-2" />
                    Select your Interest Level for this Position:
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      {/* Background bar */}
                      <div className="w-full h-4 bg-gray-200 rounded-full shadow-inner">
                        {/* Progress bar that changes color */}
                        <div 
                          className={`h-4 rounded-full transition-all duration-300 ease-out ${getInterestLevelInfo(interestLevel).color} shadow-sm`}
                          style={{ width: `${interestLevel}%` }}
                        ></div>
                      </div>
                      
                      {/* Invisible slider overlay */}
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="20"
                        value={interestLevel}
                        onChange={(e) => setInterestLevel(Number(e.target.value))}
                        className="absolute top-0 w-full h-4 opacity-0 cursor-pointer"
                      />
                      
                      {/* Slider thumb indicator */}
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-md pointer-events-none transition-all duration-300"
                        style={{ 
                          left: `calc(${interestLevel}% - 12px)`,
                          borderColor: getInterestLevelInfo(interestLevel).color.replace('bg-', '').replace('-400', '-500')
                        }}
                      >
                        <div className={`w-2 h-2 ${getInterestLevelInfo(interestLevel).color} rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>
                      </div>
                      
                      <div className="relative mt-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span style={{ position: 'absolute', left: '0%', transform: 'translateX(-50%)' }}>0%</span>
                          <span style={{ position: 'absolute', left: '20%', transform: 'translateX(-50%)' }}>20%</span>
                          <span style={{ position: 'absolute', left: '40%', transform: 'translateX(-50%)' }}>40%</span>
                          <span style={{ position: 'absolute', left: '60%', transform: 'translateX(-50%)' }}>60%</span>
                          <span style={{ position: 'absolute', left: '80%', transform: 'translateX(-50%)' }}>80%</span>
                          <span style={{ position: 'absolute', left: '100%', transform: 'translateX(-50%)' }}>100%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Heart className={`w-5 h-5 ${getInterestLevelInfo(interestLevel).color.replace('bg-', 'text-')}`} />
                      <span className={`font-medium ${getInterestLevelInfo(interestLevel).textColor}`}>
                        {getInterestLevelInfo(interestLevel).text} ({interestLevel}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Recommended)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                    placeholder="Why are you interested in this position? Share a brief message with the employer..."
                  />
                </div>

                {/* Info Notice */}
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Your interest level helps employers understand your priority for this position
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowApplicationModal(false)}
                    className="hover:bg-red-300 hover:text-white transition"
                  >
                    Cancel
                  </Button>
                  <Button 
                    fullWidth 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.02] transition"
                    onClick={handleSubmitApplication}
                  >
                    Submit Application
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;