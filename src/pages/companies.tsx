import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  MapPin,
  Users,
  Calendar,
  Search,
  Filter,
  Building2,
  Globe,
  Mail,
} from "lucide-react";

import { useCompany } from "../contexts/CompanyContext";

const Companies: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [filteredCompanies, setFilteredCompanies] = useState<
    {
      id?: string;
      description?: string;
      website?: string;
      email?: string;
      role?: string;
      logo?: string;
      logoType?: string;
      logoUrl?: string;
      companyName?: string;
      employees?: number;
      location?: string;
      industry?: string;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [loadings, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0); // State for student count
  const { companyProfiles, loading, error } = useCompany();
  const [errors, setError] = useState<string | null>(null);

  // Get unique industries and locations for filters
  const industries = [
    ...new Set(companyProfiles.map((company) => company.industry)),
  ];
  const locations = [
    ...new Set(companyProfiles.map((company) => company.location)),
  ];

  // Fetch student count by getting all students
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/studentRoutes/getAllStudents`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudentCount(data.length); // Set student count based on the length of the students array
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch student count");
      }
    };

    fetchStudentCount();
  }, [baseUrl]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter companies based on search and filters
  useEffect(() => {
    let filtered = companyProfiles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (company) =>
          company.companyName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          company.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          company.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter(
        (company) => company.industry === selectedIndustry
      );
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (company) => company.location === selectedLocation
      );
    }

    setFilteredCompanies(filtered);
  }, [searchTerm, selectedIndustry, selectedLocation, companyProfiles]);

  if (loading || loadings) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 sm:h-12 bg-white/20 rounded-lg mb-4 mx-auto max-w-md"></div>
              <div className="h-4 sm:h-6 bg-white/10 rounded-lg mx-auto max-w-lg"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6 animate-pulse"
              >
                <div className="h-12 sm:h-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-100 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12 sm:py-20">
        {/* Inline CSS for Animations - REMOVE LATER */}
        <style>
          {`
            @keyframes notice {
              0% {
                opacity: 0;
                transform: translateY(10px) scale(0.95);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>

        {/* Header Section - KEEP */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Partner Companies
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-blue-100 mb-4 sm:mb-6 px-4">
            Discover leading companies offering exciting job opportunities for Engineering students
          </p>

          {/* Notice with Inline CSS Animation and Rotating Spinner - REMOVE LATER */}
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '0.5rem',
                padding: '0.5rem 1.5rem',
                fontSize: '1rem',
                color: '#DBEAFE',
                animation: 'notice 0.8s ease-out forwards',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid #DBEAFE',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              ></span>
              <span style={{ fontWeight: '500' }}>Notice:</span> Companies are currently being added. All companies will be available soon!
            </div>
          </div>

          {/* Stats - Display student count */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-4xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {studentCount}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">Students</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {companyProfiles.length}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">Companies</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {industries.length}
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <div className="relative flex-1 sm:flex-none min-w-0">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full sm:w-auto pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative flex-1 sm:flex-none min-w-0">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full sm:w-auto pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                No companies found
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group relative"
                >
                  {/* Company Header */}
                  <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={company.logoUrl || company.logo}
                          alt={`${company.companyName} logo`}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                          {company.companyName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                          {company.industry}
                        </p>
                        <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{company.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{company.employees}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Description */}
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {company.description}
                    </p>
                  </div>

                  {/* Company Actions */}
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="flex space-x-2">
                      <Link
                        to={`/company/PublicProfile/${company.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 sm:py-2 px-3 sm:px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-xs sm:text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group flex items-center justify-center"
                        title="Visit Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-blue-600" />
                      </a>
                      <a
                        href={`mailto:${company.email}`}
                        className="px-2.5 sm:px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group flex items-center justify-center"
                        title="Contact Company"
                      >
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-green-600" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg px-4">
            Join thousands of engineering students who have found their dream
            jobs through EngNext
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/register/student"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              Register as Student
            </Link>
            <Link
              to="/register/company"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 border border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
            >
              Register as Company
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Companies;