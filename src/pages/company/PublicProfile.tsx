import React, { useState, useEffect } from 'react';
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

// Types for company profile
interface CompanyProfile {
  id: string;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  industry: string;
  companySize: string;
  foundedYear?: number;
  companyType: 'Startup' | 'SME' | 'MNC' | 'Government' | 'NGO';
  benefits: string[];
  companyValues: string[];
  workCulture: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  stats: {
    totalInternships: number;
    activePositions: number;
    successfulPlacements: number;
    averageRating: number;
  };
  internshipProgram: {
    duration: string[];
    stipend: boolean;
    mentorship: boolean;
    certification: boolean;
    fullTimeOpportunities: boolean;
  };
  featuredInternships: {
    id: string;
    title: string;
    department: string;
    location: string;
    duration: string;
    postedDate: string;
    applicants: number;
  }[];
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
  const [companyData, setCompanyData] = useState<CompanyProfile | null>(null);

  // Load company profile data on component mount
  useEffect(() => {
    fetchCompanyProfile();
  }, [companyId]);

  const fetchCompanyProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with actual API call to MongoDB
      const response = await fetch(`/api/companies/public-profile/${companyId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch company profile');
      }

      const data = await response.json();
      setCompanyData(data);
    } catch (err) {
      // Mock data for demonstration
      console.log('Using mock data - API not yet implemented');
      const mockCompany: CompanyProfile = {
        id: companyId,
        name: 'TechCorp Lanka',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
        description: 'TechCorp Lanka is a leading technology company specializing in innovative software solutions, electronics engineering, and renewable energy systems. We are committed to driving digital transformation across Sri Lanka while maintaining our focus on sustainable technology practices and employee development.',
        website: 'https://techcorp.lk',
        email: 'careers@techcorp.lk',
        phone: '+94 11 234 5678',
        address: '123 Business District, Level 15',
        city: 'Colombo',
        country: 'Sri Lanka',
        industry: 'Technology & Electronics',
        companySize: '200-500 employees',
        foundedYear: 2015,
        companyType: 'SME',
        benefits: [
          'Competitive stipend',
          'Mentorship program',
          'Health insurance',
          'Flexible working hours',
          'Free lunch',
          'Learning & development budget',
          'Performance bonuses',
          'Remote work options'
        ],
        companyValues: [
          'Innovation',
          'Sustainability',
          'Employee Growth',
          'Customer Success',
          'Integrity',
          'Collaboration'
        ],
        workCulture: 'We foster an inclusive, collaborative environment where innovation thrives. Our flat organizational structure encourages open communication, and we believe in work-life balance while pursuing excellence in everything we do.',
        socialLinks: {
          linkedin: 'https://linkedin.com/company/techcorp-lanka',
          facebook: 'https://facebook.com/techcorplanka',
          twitter: 'https://twitter.com/techcorplk'
        },
        stats: {
          totalInternships: 45,
          activePositions: 8,
          successfulPlacements: 156,
          averageRating: 4.7
        },
        internshipProgram: {
          duration: ['3 months', '6 months', '12 months'],
          stipend: true,
          mentorship: true,
          certification: true,
          fullTimeOpportunities: true
        },
        featuredInternships: [
          {
            id: '1',
            title: 'Software Engineering Intern',
            department: 'Engineering',
            location: 'Colombo',
            duration: '6 months',
            postedDate: '2025-01-20',
            applicants: 24
          },
          {
            id: '2',
            title: 'Electronics Design Intern',
            department: 'Hardware',
            location: 'Hybrid',
            duration: '3 months',
            postedDate: '2025-01-18',
            applicants: 15
          },
          {
            id: '3',
            title: 'Digital Marketing Intern',
            department: 'Marketing',
            location: 'Remote',
            duration: '4 months',
            postedDate: '2025-01-15',
            applicants: 31
          }
        ]
      };
      setCompanyData(mockCompany);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (error || !companyData) {
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
                  {companyData.logo ? (
                    <img
                      src={companyData.logo}
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
              {/* Rating Badge */}
              <div className="absolute top-6 right-6">
                <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{companyData.stats.averageRating}</span>
                  <span className="text-sm opacity-90">rating</span>
                </div>
              </div>
            </div>
            
            <div className="pt-20 pb-8 px-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{companyData.name}</h2>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{companyData.industry}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{companyData.companySize}</span>
                    </span>
                    {companyData.foundedYear && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Est. {companyData.foundedYear}</span>
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      companyData.companyType === 'Startup' ? 'bg-green-100 text-green-800' :
                      companyData.companyType === 'MNC' ? 'bg-blue-100 text-blue-800' :
                      companyData.companyType === 'SME' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {companyData.companyType}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{companyData.description}</p>
                </div>

                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a href={`mailto:${companyData.email}`} className="text-blue-600 hover:text-blue-700">
                          {companyData.email}
                        </a>
                      </div>
                      {companyData.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <a href={`tel:${companyData.phone}`} className="text-gray-700">
                            {companyData.phone}
                          </a>
                        </div>
                      )}
                      {companyData.website && (
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            Visit Website
                          </a>
                        </div>
                      )}
                      {(companyData.address || companyData.city) && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {[companyData.address, companyData.city, companyData.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Internship Statistics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{companyData.stats.activePositions}</div>
                        <div className="text-sm text-gray-600">Active Positions</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{companyData.stats.successfulPlacements}</div>
                        <div className="text-sm text-gray-600">Placements</div>
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
                  companyData.internshipProgram.stipend ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    companyData.internshipProgram.stipend ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Stipend</h4>
                <p className="text-sm text-gray-600">
                  {companyData.internshipProgram.stipend ? 'Competitive stipend offered' : 'Unpaid program'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  companyData.internshipProgram.mentorship ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Users className={`w-6 h-6 ${
                    companyData.internshipProgram.mentorship ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Mentorship</h4>
                <p className="text-sm text-gray-600">
                  {companyData.internshipProgram.mentorship ? '1-on-1 mentor assigned' : 'Self-guided learning'}
                </p>
              </div>

              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  companyData.internshipProgram.certification ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Shield className={`w-6 h-6 ${
                    companyData.internshipProgram.certification ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Certification</h4>
                <p className="text-sm text-gray-600">
                  {companyData.internshipProgram.certification ? 'Official completion certificate' : 'No certification'}
                </p>
              </div>

              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  companyData.internshipProgram.fullTimeOpportunities ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  <Target className={`w-6 h-6 ${
                    companyData.internshipProgram.fullTimeOpportunities ? 'text-orange-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Full-time Opportunities</h4>
                <p className="text-sm text-gray-600">
                  {companyData.internshipProgram.fullTimeOpportunities ? 'Potential for full-time roles' : 'Internship only'}
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
                {companyData.companyValues.map((value, index) => (
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
                {companyData.benefits.map((benefit, index) => (
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
            <p className="text-gray-700 leading-relaxed">{companyData.workCulture}</p>
          </div>

          {/* Current Openings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <span>Current Openings</span>
              </h3>
              <span className="text-sm text-gray-500">{companyData.featuredInternships.length} positions available</span>
            </div>
            
            <div className="space-y-4">
              {companyData.featuredInternships.map((internship) => (
                <div key={internship.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{internship.title}</h4>
                      <p className="text-gray-600 text-sm">{internship.department}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {internship.applicants} applicants
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
                      <span>Posted {new Date(internship.postedDate).toLocaleDateString()}</span>
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
          {companyData.socialLinks && Object.values(companyData.socialLinks).some(link => link) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {companyData.socialLinks.linkedin && (
                  <a
                    href={companyData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {companyData.socialLinks.facebook && (
                  <a
                    href={companyData.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                )}
                {companyData.socialLinks.twitter && (
                  <a
                    href={companyData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicCompanyProfile;