import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

interface LoginResponse {
  exists: boolean;
  id: string;
  email: string;
  profilePicture?: string | null;
  department?: string | null;
  createdAt: string;
}

const LoginPage: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [userType, setUserType] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url =
        userType === 'admin'
          ? `${baseUrl}/api/adminRoutes/loginAdmin`
          : `${baseUrl}/api/studentRoutes/loginStudent`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server response:', text);
        setError('Incorrect email or password.');
        return;
      }

      const data: LoginResponse = await response.json();

      if (!data.exists) {
        setError(
          `${userType === 'admin' ? 'Admin' : 'Student'} not found or invalid password.`
        );
        return;
      }

      // Login with complete User object
      login({
        id: data.id,
        email: data.email,
        role: userType,
        profilePicture: data.profilePicture || '',
        department: data.department || '',
        createdAt: new Date(),
      });

      const redirectPath =
        userType === 'student' ? '/student/dashboard' : '/admin/dashboard';
      navigate(redirectPath, { state: { id: data.id } });
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your Inturnix account</p>
        </div>

        <Card className="p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${
                userType === 'student'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${
                userType === 'admin'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="relative">
              <Input
                type="email"
                placeholder={`Enter your ${userType} email`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                className="pl-10"
              />
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Sign in as {userType}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {userType === 'student' && (
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  to={`/register/student`}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up here
                </Link>
              </p>
            )}
            {userType === 'admin' && (
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  to={`/register/admin`}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up here
                </Link>
              </p>
            )}
          </div>
        </Card>

        {userType === 'student' && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Students must use their institutional email (@eng.jfn.ac.lk)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
