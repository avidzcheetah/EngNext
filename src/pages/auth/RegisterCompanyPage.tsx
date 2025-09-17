import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, Upload, Globe, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const RegisterCompanyPage: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if this is being accessed by an admin
  const isAdminMode = location.pathname === '/register/company' && user?.role === 'admin';
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    website: '',
    description: '',
    password: '',
    confirmPassword: '',
    logo: null,
    industry: isAdminMode ? user?.department || '' : '',
    subfield: '',
  });
  const [Logo, setLogo] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validatePassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'File size must be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: 'Please select an image file' }));
        return;
      }
      setLogo(file);
      setErrors(prev => ({ ...prev, logo: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdminMode) {
      if (!window.confirm('Are you sure you want to add this company?')) {
        return;
      }
    }
    
    setLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.description.trim()) newErrors.description = 'Company description is required';
    
    if (isAdminMode) {
      if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
      if (!formData.subfield.trim()) newErrors.subfield = 'Subfield is required';
    }
    
    if (formData.website && !validateURL(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }
    
    if (!isAdminMode) {
      if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    
    try {
      const fd = new FormData();
      fd.append('companyName', formData.companyName);
      fd.append('email', formData.email);
      fd.append('description', formData.description);
      if (formData.website) fd.append('website', formData.website);
      
      if (isAdminMode) {
        fd.append('industry', formData.industry);
        fd.append('subfield', formData.subfield);
        fd.append('addedByAdmin', 'true');
      } else {
        fd.append('password', formData.password);
      }
      
      if (Logo) fd.append('logo', Logo);

      const response = await fetch(`${baseUrl}/api/companyRoutes/createCompany`, {
        method: 'POST',
        body: fd,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || 'Registration failed' });
      } else {
        setSubmitted(true);
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    if (isAdminMode) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <Card className="p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Added Successfully</h2>
              <p className="text-gray-600 mb-6">
                The company "{formData.companyName}" has been successfully added to the system.
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/admin/dashboard')} fullWidth>
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      companyName: '',
                      email: '',
                      website: '',
                      description: '',
                      password: '',
                      confirmPassword: '',
                      logo: null,
                      industry: user?.department || '',
                      subfield: '',
                    });
                    setLogo(null);
                  }}
                  variant="outline"
                  fullWidth
                >
                  Add Another Company
                </Button>
              </div>
            </Card>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <Card className="p-8">
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted</h2>
              <p className="text-gray-600 mb-6">
                Thank you for registering with Inturnix! Your company application has been submitted 
                and is now pending approval from our administrators.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                You will receive an email notification once your account is approved. 
                This typically takes 1-2 business days.
              </p>
              <Button onClick={() => navigate('/')} fullWidth>
                Return to Home
              </Button>
            </Card>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-0 overflow-hidden">
          {/* Header with back button */}
          {isAdminMode && (
            <div className="flex items-center justify-between bg-gray-100 px-4 py-3 border-b">
              <Button
                onClick={() => navigate('/admin/dashboard')}
                variant="outline"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>
          )}

          {/* Card Body */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {isAdminMode ? 'Add a Company' : 'Company Registration'}
              </h2>
              <p className="mt-2 text-gray-600">
                {isAdminMode ? 'Add a new company to the system' : 'Partner with Engineering students'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <Input
                name="companyName"
                type="text"
                label="Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                fullWidth
                required
              />

              <Input
                name="email"
                type="email"
                label="Official Email Address"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                fullWidth
                required
              />

              <Input
                name="website"
                type="url"
                label="Company Website (Optional)"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={handleInputChange}
                error={errors.website}
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-colors duration-200"
                  placeholder="Brief description of your company..."
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Industry & Subfield - Admin only */}
              {isAdminMode && (
                <>
                  <Input
                    name="industry"
                    type="text"
                    label="Industry"
                    value={formData.industry === 'com' ? 'Computer' : formData.industry === 'eee' ? 'Electrical and Electronic' : formData.industry}
                    onChange={handleInputChange}
                    error={errors.industry}
                    fullWidth
                    required
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />

                  <Input
                    name="subfield"
                    type="text"
                    label="Subfield"
                    placeholder="e.g., Software Development, Power Systems, etc."
                    value={formData.subfield}
                    onChange={handleInputChange}
                    error={errors.subfield}
                    fullWidth
                    required
                  />
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {Logo && (
                    <span className="text-sm text-green-600">{Logo.name}</span>
                  )}
                </div>
                {errors.logo && (
                  <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                )}
              </div>

              {/* Password fields - Non admin only */}
              {!isAdminMode && (
                <>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      error={errors.password}
                      fullWidth
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      error={errors.confirmPassword}
                      fullWidth
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </>
              )}

              <Button type="submit" fullWidth loading={loading}>
                {isAdminMode ? 'Add Company' : 'Add company'}
              </Button>
            </form>

            {!isAdminMode && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in here
                  </Link>
                </p>
              </div>
            )}
          </div>
        </Card>

        {!isAdminMode && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Company registrations require administrator approval before access is granted
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterCompanyPage;
