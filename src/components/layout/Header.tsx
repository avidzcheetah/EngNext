import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "student":
        return "/student/dashboard";
      case "company":
        return "/company/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="bg-white/85 backdrop-blur-lg shadow-[0_2px_20px_rgb(0,0,0,0.04)] sticky top-0 z-50 border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="https://i.postimg.cc/sMHMSGWy/engnextlogo.png"
                    alt="EngNext logo"
                  />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-display font-extrabold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">
                    EngNext
                  </h1>
                  <p className="text-xs font-medium text-slate-500 tracking-wide uppercase mt-0.5">
                    Engineering Your Next Step
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "About", "Companies", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative text-slate-600 hover:text-brand-600 transition-all duration-200 font-semibold text-sm tracking-wide after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-brand-500 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center bg-slate-50 rounded-full p-1 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 transition-all duration-300 shadow-sm"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <User className="w-8 h-8 text-brand-600 p-1" />
                  )}
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in origin-top-right">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to={`/${user?.role}/profile`}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-brand-600 text-white px-5 py-2.5 rounded-full hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 active:scale-[0.98] font-medium"
              >
                Sign in
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {["Home", "About", "Companies", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="block text-slate-700 hover:bg-brand-50 hover:text-brand-600 px-4 py-2.5 rounded-xl transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to={getDashboardLink()}
                    className="block text-slate-700 hover:bg-brand-50 hover:text-brand-600 px-4 py-2.5 rounded-xl transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={`/${user?.role}/profile`}
                    className="block text-slate-700 hover:bg-brand-50 hover:text-brand-600 px-4 py-2.5 rounded-xl transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors font-medium mt-1"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-4 flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="w-full text-center text-brand-600 border-2 border-brand-600 px-4 py-2.5 rounded-xl hover:bg-brand-50 transition-colors font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/student/register"
                    className="w-full text-center bg-brand-600 text-white px-4 py-2.5 rounded-xl hover:bg-brand-700 transition-colors font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
