import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Calendar,
  ExternalLink,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Briefcase,
  Clock,
  CheckCircle,
  Star,
  Award,
  Target,
  TrendingUp,
  Heart,
  Shield,
  Zap,
  Eye,
  Send
} from 'lucide-react';

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
   employees?: string;
   phoneNo?:string;
   OurValues?:[string];
   WorkCulture?:string;
   internBenifits?:[string];
    
    fullTimeOpportunities: boolean;
    certification: boolean;
    mentorship: boolean;
    stipend: boolean;
  
   foundedYear:string,
   companyType:string,
   address :string,
 }

interface PublicCompanyProfileProps {
  companyId?: string;
  onBack?: () => void;
}

const PublicCompanyProfile: React.FC<PublicCompanyProfileProps> = ({ 
  companyId = "1", 
  onBack 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
   const [companyProfile, setCompanyProfile] = useState<CompanyProfileData | null>(
       null
     );
  // Load company profile data on component mount
  useEffect(() => {
    fetchCompanyDetails();
    fetchJobs();
  }, [companyId]);
  const { id } = useParams<{ id: string }>();
  const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        setError("");
  
        const res = await fetch(
          `${baseUrl}/api/companyRoutes/getById/${id}`
        );
  
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
  
        const data = await res.json();
        console.log("API response:", data);
  
        // Convert Base64 logo to data URL
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
        setIsLoading(false);
      }
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
        createdAt?:string
      }>
    >([]);

  
   const fetchJobs = async ()=>{
       try {
         setIsLoading(true);
         setError("");
   
         const res = await fetch(
           `${baseUrl}/api/InternshipRoutes/getInternshipsByCompanyId/${id}`
         );
   
         const data = await res.json();
         console.log("API response:", data);
   
         // If your API returns { internships: [...] }, adjust accordingly
         setJob(Array.isArray(data) ? data : data.internships || []);
         
      
   
         setJob(data);
       } catch (err: any) {
         setError(err.message);
       } finally {
         setIsLoading(false);
       }
     }

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

  if (error || !companyProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The company profile you're looking for doesn't exist or is not accessible.</p>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Company Profile
              </h1>
              <p className="text-gray-600 mt-1">Explore career opportunities and company culture</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Company Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-xl border-4 border-white bg-white overflow-hidden shadow-lg">
                  {companyProfile.logoUrl ? (
                    <img
                      src={companyProfile.logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
             
              
            </div>
            
            <div className="pt-20 pb-8 px-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{companyProfile.companyName}</h2>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{companyProfile.industry}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{companyProfile.employees}</span>
                    </span>
                    {companyProfile.foundedYear && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Est. {companyProfile.foundedYear}</span>
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      companyProfile.companyType === 'Startup' ? 'bg-green-100 text-green-800' :
                      companyProfile.companyType === 'MNC' ? 'bg-blue-100 text-blue-800' :
                      companyProfile.companyType === 'SME' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {companyProfile.companyType}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{companyProfile.description}</p>
                </div>

                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a href={`mailto:${companyProfile.email}`} className="text-blue-600 hover:text-blue-700">
                          {companyProfile.email}
                        </a>
                      </div>
                      {companyProfile.phoneNo && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <a href={`tel:${companyProfile.phoneNo}`} className="text-gray-700">
                            {companyProfile.phoneNo}
                          </a>
                        </div>
                      )}
                      {companyProfile.website && (
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <a href={companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            Visit Website
                          </a>
                        </div>
                      )}
                      {(companyProfile.location || companyProfile.address) && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {[companyProfile.address, companyProfile.location].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Internship Statistics</h3>
                    <div className="grid grid-cols-2 gap-3 ">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{Job.length}</div>
                        <div className="text-sm text-gray-600">Active Positions</div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Internship Program Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Award className="w-6 h-6 text-blue-600" />
              <span>Internship Program</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  companyProfile.stipend ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                   companyProfile.stipend ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Stipend</h4>
                <p className="text-sm text-gray-600">
                  {companyProfile.stipend ? 'Competitive stipend offered' : 'Unpaid program'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  companyProfile.mentorship ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Users className={`w-6 h-6 ${
                   companyProfile.mentorship ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Mentorship</h4>
                <p className="text-sm text-gray-600">
                  {companyProfile.mentorship ? '1-on-1 mentor assigned' : 'Self-guided learning'}
                </p>
              </div>

              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  companyProfile.certification ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Shield className={`w-6 h-6 ${
                    companyProfile.certification ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Certification</h4>
                <p className="text-sm text-gray-600">
                  {companyProfile.certification ? 'Official completion certificate' : 'No certification'}
                </p>
              </div>

              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  companyProfile.fullTimeOpportunities ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  <Target className={`w-6 h-6 ${
                    companyProfile.fullTimeOpportunities ? 'text-orange-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Full-time Opportunities</h4>
                <p className="text-sm text-gray-600">
                  {companyProfile.fullTimeOpportunities ? 'Potential for full-time roles' : 'Internship only'}
                </p>
              </div>
            </div>
          </div>

          {/* Company Values & Benefits */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Company Values */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span>Our Values</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {companyProfile.OurValues?.map((value, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <span>Intern Benefits</span>
              </h3>
              <div className="space-y-2">
                {companyProfile.internBenifits?.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Culture */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Work Culture</h3>
            <p className="text-gray-700 leading-relaxed">{companyProfile.WorkCulture}</p>
          </div>

          {/* Current Openings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <span>Current Openings</span>
              </h3>
              <span className="text-sm text-gray-500">{Job.length} positions available</span>
            </div>
            
            <div className="space-y-4">
              {Job.map((internship) => (
                <div key={internship._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{internship.title}</h4>
                      
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {internship.isActive} 
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{internship.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{internship.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                    Posted {new Date(internship.createdAt!).toDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Send className="w-4 h-4" />
                      <span>Apply Now</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          
        </div>
      </div>
    </div>
  );
};

export default PublicCompanyProfile;