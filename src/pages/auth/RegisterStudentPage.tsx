import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const RegisterStudentPage: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@eng\.jfn\.ac\.lk$/;
    return pattern.test(email);
  };

  const validatePassword = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: "File size must be less than 3MB",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: "Please select an image file",
        }));
        return;
      }
      setProfilePicture(file);
      setErrors((prev) => ({ ...prev, profilePicture: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please use your institutional email (@eng.jfn.ac.lk)";
    }

    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/studentRoutes/createStudent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || "Registration failed" });
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 animate-gradient-xy"></div>
        <div className="absolute inset-0">
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              width: "400px",
              height: "400px",
              left: "10%",
              top: "15%",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)",
              animationDuration: "8s",
            }}
          ></div>
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              width: "500px",
              height: "500px",
              right: "5%",
              bottom: "10%",
              background: "radial-gradient(circle, rgba(79, 70, 229, 0.3), transparent)",
              animationDuration: "10s",
              animationDelay: "2s",
            }}
          ></div>
          {[...Array(40)].map((_, i) => {
            const size = Math.random() * 3 + 1;
            const delay = Math.random() * 4;
            const duration = Math.random() * 3 + 3;
            return (
              <div
                key={`star-${i}`}
                className="absolute rounded-full animate-twinkle"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: "white",
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
          {[...Array(15)].map((_, i) => {
            const size = Math.random() * 18 + 6;
            const delay = Math.random() * 5;
            const duration = Math.random() * 7 + 8;
            const driftX = (Math.random() - 0.5) * 100;
            return (
              <div
                key={`particle-${i}`}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: "rgba(139, 92, 246, 0.4)",
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  ["--drift-x" as string]: `${driftX}px`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>

        <style>{`
          @keyframes gradient-xy {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0.4;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(-100vh) translateX(var(--drift-x, 20px));
              opacity: 0.4;
            }
          }

          @keyframes twinkle {
            0% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.5);
            }
            100% {
              opacity: 0.4;
              transform: scale(1);
            }
          }

          .animate-gradient-xy {
            background-size: 200% 200%;
            animation: gradient-xy 15s ease infinite;
          }

          .animate-float {
            animation: float linear infinite;
          }

          .animate-twinkle {
            animation: twinkle ease-in-out infinite;
          }
        `}</style>

        <div className="max-w-md w-full relative z-10 text-center">
          <Card className="p-8 bg-white/90 backdrop-blur-sm">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Account Successfully Created
            </h2>
            <p className="text-gray-600 mb-4">
              Your account has been created successfully.
            </p>
            <p className="text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm mb-6">
              Note: Accounts with invalid emails will be automatically removed. Please ensure your email is in the format <strong>regno@eng.jfn.ac.lk</strong>.
            </p>
            <Button onClick={() => navigate("/login")} fullWidth>
              Go to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 animate-gradient-xy"></div>
      <div className="absolute inset-0">
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: "400px",
            height: "400px",
            left: "10%",
            top: "15%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)",
            animationDuration: "8s",
          }}
        ></div>
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: "500px",
            height: "500px",
            right: "5%",
            bottom: "10%",
            background: "radial-gradient(circle, rgba(79, 70, 229, 0.3), transparent)",
            animationDuration: "10s",
            animationDelay: "2s",
          }}
        ></div>
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const delay = Math.random() * 4;
          const duration = Math.random() * 3 + 3;
          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full animate-twinkle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: "white",
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 18 + 6;
          const delay = Math.random() * 5;
          const duration = Math.random() * 7 + 8;
          const driftX = (Math.random() - 0.5) * 100;
          return (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full animate-float"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: "rgba(139, 92, 246, 0.4)",
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                ["--drift-x" as string]: `${driftX}px`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(var(--drift-x, 20px));
            opacity: 0.4;
          }
        }

        @keyframes twinkle {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
        }

        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Student Registration
          </h2>
          <p className="mt-2 text-gray-600">
            Join the Engineering internship network
          </p>
        </div>

        <Card className="p-8 bg-white/90 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                type="text"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
                className="w-full"
              />
              <Input
                name="lastName"
                type="text"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
                className="w-full"
              />
            </div>

            <Input
              name="email"
              type="email"
              label="Student Email"
              placeholder="regno@eng.jfn.ac.lk"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              fullWidth
              required
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
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
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
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
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Create Student Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudentPage;