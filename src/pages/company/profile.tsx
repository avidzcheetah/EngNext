import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from '../../contexts/AuthContext';
interface CompanyProfileData {
  id?: string;
  description?: string;
  website?: string;
  email?: string;
  role?: string;
  logo?: string;
  logoType?: string;
  logoUrl?: string;
  companyName?: string;
  location?: string;
  industry?: string;
  employees?: string;
}

const CompanyProfile: React.FC<{}> = () => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfileData | null>(
    null
  );
  const { user, isAuthenticated, logout } = useAuth();
  let id =user?.id;
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    email: "",
    description: "",
    logoFile: null as File | null,
    location: "",
    industry: "",
    employees: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch company details
  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/companyRoutes/getById/${id}`
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      console.log("API response:", data);

      // Convert Base64 logo to data URL
      if (data.company.logo) {
        const logoDataUrl = `data:${
          data.company.logoType || "image/png"
        };base64,${data.company.logo}`;
        data.company.logoUrl = logoDataUrl;
      }

      setCompanyProfile(data.company);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  // Sync formData when companyProfile updates
  useEffect(() => {
    if (companyProfile) {
      setFormData((prev) => ({
        companyName: companyProfile.companyName || "",
        website: companyProfile.website || "",
        email: companyProfile.email || "",
        description: companyProfile.description || "",
        logoFile: prev.logoFile || null,
        location: companyProfile.location || "",
        industry: companyProfile.industry || "",
        employees: companyProfile.employees || "",
      }));
    }
  }, [companyProfile]);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, logoFile: file }));

      const reader = new FileReader();
      reader.onload = () => {
        setCompanyProfile((prev) => ({
          ...prev,
          logoUrl: reader.result as string,
          id: prev?.id,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formToSend = new FormData();
      formToSend.append("companyName", formData.companyName);
      formToSend.append("website", formData.website);
      formToSend.append("email", formData.email);
      formToSend.append("description", formData.description);
      formToSend.append("industry", formData.industry);
      formToSend.append("employees", formData.employees);
      formToSend.append("location", formData.location);
      if (formData.logoFile) formToSend.append("logo", formData.logoFile);

      const res = await fetch(
        `http://localhost:5000/api/companyRoutes/updateCompany/${companyProfile?.id}`,
        {
          method: "PUT",
          body: formToSend,
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      console.log("Updated company:", data);
      setCompanyProfile(data.company);
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-6">{error}</div>;
  }

  return (
    <Card className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-6">Company Profile</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Count
            </label>
            <input
              type="text"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Logo
            </label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition">
              {companyProfile?.logoUrl ? (
                <img
                  src={companyProfile.logoUrl}
                  alt={formData.description || "Company Logo"}
                  className="w-40 h-40 mx-auto mb-2 rounded object-cover"
                />
              ) : (
                <div className="w-40 h-40 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                  No Logo
                </div>
              )}

              <Button variant="outline" size="sm">
                <label className="cursor-pointer">
                  Change Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition"
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </div>
    </Card>
  );
};

export default CompanyProfile;
