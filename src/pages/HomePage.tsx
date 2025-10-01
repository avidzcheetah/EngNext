import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Users, Building2, Award, Globe } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Slider from "../components/ui/slider";
import { lecturers, partners } from "../data/mockData";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../contexts/CompanyContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [errors, setError] = useState<string | null>(null);
  const [loadings, setLoading] = useState(false);

  const { companyProfiles, loading, error } = useCompany();

  // Limit the number of companies displayed in the carousel for performance
  // Full list is available on the dedicated companies page
  const MAX_CAROUSEL_COMPANIES = 20;
  const limitedProfiles = companyProfiles.slice(0, MAX_CAROUSEL_COMPANIES);

  const handleNavigate = () => {
    navigate("/companies", { state: { companies: companyProfiles } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Slider Section */}
      <section className="bg-white">
        <Slider />
      </section>

      {/* About Faculty Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Faculty of Engineering
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Excellence in engineering education and research at the University
              of Jaffna's Faculty of Engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Mission
              </h3>
              <p className="text-gray-600 mb-6">
                The Faculty of Engineering is committed to providing world-class
                education and fostering innovation in Electrical and Electronic
                Engineering, Computer Engineering, Mechanical Engineering and
                Civil Engineering. We prepare our students to become leaders in
                their fields through comprehensive academic programs and
                hands-on research opportunities.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">
                    Cutting-edge curriculum aligned with industry needs
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">
                    State-of-the-art laboratories and research facilities
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">
                    Strong industry partnerships and engineering programs
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="EEE Laboratory"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Engineering Equipment"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Students Working"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Research Lab"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Industry Partners
            </h2>
            <p className="text-xl text-gray-600">
              Collaborating with leading companies to create opportunities
            </p>
          </div>

          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-50 to-white p-6 shadow-sm">
                <div
                  className="flex gap-6"
                  style={{
                    animation: 'slide-left 60s linear infinite',
                    width: 'fit-content'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                  {[...limitedProfiles, ...limitedProfiles].map((profile, index) => (
                    <div
                      key={`${profile.id}-${index}`}
                      className="flex-none"
                      style={{ width: '240px' }}
                    >
                      <Card className="p-3 text-center h-32 flex flex-col justify-center items-center bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 rounded-xl">
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          <div className="flex items-center justify-center" style={{ height: '85%', width: '100%' }}>
                            <img
                              src={profile.logoUrl}
                              alt={profile.companyName}
                              className="object-contain"
                              style={{ 
                                maxHeight: '100%', 
                                maxWidth: '100%',
                                height: 'auto',
                                width: 'auto'
                              }}
                              loading="lazy" // Add lazy loading for images to improve performance
                            />
                          </div>
                          <div style={{ height: '15%' }} className="flex items-center justify-center w-full">
                            <h3 className="text-xs font-medium text-gray-500 leading-none truncate w-full text-center">
                              {profile.companyName}
                            </h3>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              
              <style>
                {`
                  @keyframes slide-left {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                `}
              </style>

              {companyProfiles.length > MAX_CAROUSEL_COMPANIES && (
                <p className="text-center text-gray-500 mt-4">
                  Showing {limitedProfiles.length} of {companyProfiles.length} partners...
                </p>
              )}

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  onClick={handleNavigate}
                  disabled={loading || companyProfiles.length === 0}
                  className={`bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-300 ${
                    loading || companyProfiles.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  View All Partners <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Join the community to find the perfect
            job match through EngNext.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/student">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Register as Student
              </Button>
            </Link>
            <Link to="/adminlogin">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Login as an Admin
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;