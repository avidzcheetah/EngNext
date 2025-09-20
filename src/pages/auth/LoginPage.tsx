import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `${baseUrl}/api/studentRoutes/loginStudent`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        setError("Incorrect email or password.");
        return;
      }

      const data: LoginResponse = await response.json();

      if (!data.exists) {
        setError("Student not found or invalid password.");
        return;
      }

      // Login with complete User object
      login({
        id: data.id,
        email: data.email,
        role: "student",
        profilePicture: data.profilePicture || "",
        department: data.department || "",
        createdAt: new Date(),
      });

      navigate("/student/dashboard", { state: { id: data.id } });
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 animate-gradient-xy"></div>
      <div className="absolute inset-0">
        {/* Nebula-like Glow 1 */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: "400px",
            height: "400px",
            left: "10%",
            top: "15%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent)",
            animationDuration: "8s",
          }}
        ></div>
        {/* Nebula-like Glow 2 */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: "500px",
            height: "500px",
            right: "5%",
            bottom: "10%",
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent)",
            animationDuration: "10s",
            animationDelay: "2s",
          }}
        ></div>
        {/* Stars */}
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
        {/* Floating Cosmic Particles */}
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 18 + 6;
          const delay = Math.random() * 5;
          const duration = Math.random() * 7 + 8;
          const driftX = (Math.random() - 0.5) * 100;
          return (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full animate-float"
              style={
                {
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: "rgba(59, 130, 246, 0.4)",
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  ["--drift-x" as string]: `${driftX}px`,
                } as React.CSSProperties
              }
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
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your EngNext account</p>
        </div>

        <Card className="p-8 bg-white/90 backdrop-blur-sm">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <div className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-white shadow-sm text-blue-600">
              <User className="w-4 h-4 mr-2" />
              Student Login
            </div>
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
                placeholder="Enter your student email"
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
                type={showPassword ? "text" : "password"}
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
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
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
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to={`/register/student`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Students must use their institutional email (@eng.jfn.ac.lk)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
