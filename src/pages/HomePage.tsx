import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Slider from "../components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../contexts/CompanyContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { companyProfiles, loading, error } = useCompany();

  // Limit the number of companies displayed in the carousel for performance
  // Full list is available on the dedicated companies page
  const MAX_CAROUSEL_COMPANIES = 20;
  const limitedProfiles = companyProfiles.slice(0, MAX_CAROUSEL_COMPANIES);

  const handleNavigate = () => {
    navigate("/companies", { state: { companies: companyProfiles } });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Slider Section */}
      <section className="bg-white">
        <Slider />
      </section>

      {/* About Faculty Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
              Faculty of Engineering
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Excellence in engineering education and research at the University
              of Jaffna's Faculty of Engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                The Faculty of Engineering is committed to providing world-class
                education and fostering innovation in Electrical and Electronic
                Engineering, Computer Engineering, Mechanical Engineering and
                Civil Engineering. We prepare our students to become leaders in
                their fields through comprehensive academic programs and
                hands-on research opportunities.
              </p>
              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <p className="text-slate-700 font-medium pt-1">
                    Cutting-edge curriculum aligned with industry needs
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <p className="text-slate-700 font-medium pt-1">
                    State-of-the-art laboratories and research facilities
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <p className="text-slate-700 font-medium pt-1">
                    Strong industry partnerships and engineering programs
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-100/50 to-purple-100/50 rounded-[2rem] blur-2xl -z-10"></div>
              <div className="space-y-6">
                <img
                  src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="EEE Laboratory"
                  className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 object-cover aspect-[4/5]"
                />
                <img
                  src="https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Engineering Equipment"
                  className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 object-cover aspect-square"
                />
              </div>
              <div className="space-y-6 mt-12">
                <img
                  src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Students Working"
                  className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 object-cover aspect-square"
                />
                <img
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Research Lab"
                  className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 object-cover aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
              Our Industry Partners
            </h2>
            <p className="text-xl text-slate-600">
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
              <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                <div
                  className="flex gap-8"
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
                <p className="text-center text-slate-500 mt-6 font-medium">
                  Showing {limitedProfiles.length} of {companyProfiles.length} partners...
                </p>
              )}

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  onClick={handleNavigate}
                  disabled={loading || companyProfiles.length === 0}
                  className={`bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 transition-all duration-300 font-medium px-8 ${
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
      <section className="py-24 bg-brand-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-400 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-800 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-brand-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the community to find the perfect
            job match through EngNext.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/student">
              <Button
                variant="outline"
                size="lg"
                className="!border-white/50 !text-white hover:!bg-white hover:!text-brand-700 font-semibold px-8 hover:!border-white shadow-lg shadow-black/10"
              >
                Register as Student
              </Button>
            </Link>
            <Link to="/register/company">
              <Button
                variant="outline"
                size="lg"
                className="!border-white/50 !text-white hover:!bg-white hover:!text-brand-700 font-semibold px-8 hover:!border-white shadow-lg shadow-black/10"
              >
                Register a Company
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;