import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, User, GraduationCap, CheckCircle, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

type AdminDepartment = 'EEE' | 'Com';

const RegisterAdminPage: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    department: '' as AdminDepartment | '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const departments = [
    { value: 'EEE', label: 'Department of Electrical and Electronic Engineering', color: 'bg-blue-100 text-blue-800' },
    { value: 'Com', label: 'Department of Computer Engineering', color: 'bg-green-100 text-green-800' }
  ];

  const validatePassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.department) newErrors.department = 'Department selection is required';
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Username should follow department convention
    if (formData.username && formData.department) {
      const expectedPrefix = formData.department.toLowerCase() + '_';
      if (!formData.username.startsWith(expectedPrefix)) {
        newErrors.username = `Username should start with "${expectedPrefix}" for ${formData.department} department`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/adminRoutes/createAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          department: formData.department,
          password: formData.password,
        }),
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <Card className="p-8">
            <Clock className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted</h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your admin registration request! Your application has been submitted 
              and is now pending approval from the system administrators.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will receive an email notification once your admin account is approved. 
              This typically takes 1-2 business days for verification.
            </p>
            <Button onClick={() => navigate('/')} fullWidth>
              Return to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Registration</h2>
          <p className="mt-2 text-gray-600">Manage internship opportunities for students</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <Input
              name="fullName"
              type="text"
              label="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
              fullWidth
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-colors duration-200"
                required
              >
                <option value="">Select your department</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
              )}
            </div>

            <Input
              name="username"
              type="text"
              label="Username"
              placeholder={formData.department ? `${formData.department.toLowerCase()}_admin` : 'e.g., eee_admin or com_admin'}
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              fullWidth
              required
            />

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="admin@eng.jfn.ac.lk"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              fullWidth
              required
            />

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

            {/* Display selected department badge */}
            {formData.department && (
              <div className="flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  formData.department === 'EEE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  {formData.department} Department Admin
                </span>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
              Submit Admin Application
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Admin registrations require verification of university employment and super administrator approval
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdminPage;