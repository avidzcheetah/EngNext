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
// Mock company data (will be replaced with API calls later)

const Companies: React.FC = () => {
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

  const { companyProfiles, loading, error } = useCompany();

  const [errors, setError] = useState<string | null>(null);

  // Get unique industries and locations for filters
  const industries = [
    ...new Set(companyProfiles.map((company) => company.industry)),
  ];
  const locations = [
    ...new Set(companyProfiles.map((company) => company.location)),
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded-lg mb-4 mx-auto max-w-md"></div>
              <div className="h-6 bg-white/10 rounded-lg mx-auto max-w-lg"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 animate-pulse"
              >
                <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 rounded mb-4"></div>
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Partner Companies
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100 mb-8">
            Discover leading companies offering exciting job
            opportunities for EEE students
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold">
                {companyProfiles.length}
              </div>
              <div className="text-blue-100 text-sm">Companies</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold">
                {industries.length}
              </div>
              <div className="text-blue-100 text-sm">Industries</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold">
                {locations.length}
              </div>
              <div className="text-blue-100 text-sm">Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="bg-white/80 backdrop-blur-md shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No companies found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Company Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={company.logoUrl || company.logo}
                          alt={`${company.companyName}  logo`}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                          {company.companyName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {company.industry}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{company.location}</span>
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
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {company.description}
                    </p>
                  </div>

                  {/* jobs Preview */}

                  {/* Company Actions */}
                  <div className="px-6 pb-6">
                    <div className="flex space-x-2">
                      <Link
                        to={`/comapny/PublicProfile/${company.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                        title="Visit Website"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </a>
                      <a
                        href={`mailto:${company.email}`}
                        className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                        title="Contact Company"
                      >
                        <Mail className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                      </a>
                    </div>
                  </div>

                  {/* Company Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of engineering students who have found their dream
            jobs through EngNext
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/student"
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Register as Student
            </Link>
            <Link
              to="/register/company"
              className="px-8 py-3 bg-white/10 border border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
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
