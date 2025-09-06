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
  phoneNo?:string;
  OurValues?:[string];
  WorkCulture?:string;
  internBenifits?:[string];
    
    fullTimeOpportunities?: boolean;
    certification?: boolean;
    mentorship?: boolean;
    stipend?: boolean;
  
   foundedYear?:string,
   companyType?:string,
   address? :string,

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
    phoneNo:"",
    WorkCulture:"",
    OurValues:[""],
    internBenifits:[""],
    foundedYear:"",
    companyType:"",
    address :"",
    
    fullTimeOpportunities:false,
    certification:false,
    mentorship:false,
    stipend:false
    

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
      ...prev, // keep anything not explicitly overwritten
      companyName: companyProfile.companyName || "",
      website: companyProfile.website || "",
      email: companyProfile.email || "",
      description: companyProfile.description || "",
      logoFile: prev.logoFile || null, // keep file if already uploaded
      location: companyProfile.location || "",
      industry: companyProfile.industry || "",
      employees: companyProfile.employees || "",
      phoneNo: companyProfile.phoneNo || "",
      OurValues: companyProfile.OurValues || [],
      WorkCulture: companyProfile.WorkCulture || "",
      internBenifits: companyProfile.internBenifits|| [],
      foundedYear: companyProfile.foundedYear || "",
      companyType: companyProfile.companyType || "",
      address: companyProfile.address || "",
       
        fullTimeOpportunities: companyProfile.fullTimeOpportunities ||false,
        certification: companyProfile.certification || false,
        mentorship: companyProfile.mentorship || false,
        stipend: companyProfile.stipend || false,
      
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
formToSend.append("phoneNo", formData.phoneNo);
formToSend.append("WorkCulture", formData.WorkCulture);
formToSend.append("OurValues", JSON.stringify(formData.OurValues));
formToSend.append("internBenifits", JSON.stringify(formData.internBenifits));
formToSend.append("foundedYear", formData.foundedYear);
formToSend.append("companyType", formData.companyType);
formToSend.append("address", formData.address);
formToSend.append("fullTimeOpportunities", formData.fullTimeOpportunities ? "true" : "false");
formToSend.append("certification", formData.certification ? "true" : "false");
formToSend.append("mentorship", formData.mentorship ? "true" : "false");
formToSend.append("stipend", formData.stipend ? "true" : "false");

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

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Internship Program
  </label>

  <div className="flex flex-col space-y-2">
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        checked={formData.fullTimeOpportunities}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            fullTimeOpportunities: e.target.checked,
          }))
        }
        className="mr-2"
      />
      Full-time Opportunities
    </label>

    <label className="inline-flex items-center">
      <input
        type="checkbox"
        checked={formData.certification}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            certification: e.target.checked,
          }))
        }
        className="mr-2"
      />
      Certification
    </label>

    <label className="inline-flex items-center">
      <input
        type="checkbox"
        checked={formData.mentorship}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            mentorship: e.target.checked,
          }))
        }
        className="mr-2"
      />
      Mentorship
    </label>

    <label className="inline-flex items-center">
      <input
        type="checkbox"
        checked={formData.stipend}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            stipend: e.target.checked,
          }))
        }
        className="mr-2"
      />
      Stipend
    </label>
  </div>
</div>



          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Founded Year
  </label>
  <input
    type="text"
    name="foundedYear"
    value={formData.foundedYear}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Address
  </label>
  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
  />
</div>


<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Company Type
  </label>
  <select
    name="companyType"
    value={formData.companyType}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, companyType: e.target.value }))
    }
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 ${
      {
        Startup: "bg-green-100 text-green-800",
        MNC: "bg-blue-100 text-blue-800",
        SME: "bg-purple-100 text-purple-800",
        Other: "bg-gray-100 text-gray-800",
      }[formData.companyType] || "bg-gray-100 text-gray-800"
    }`}
  >
    <option value="">Select Company Type</option>
    <option value="Startup">Startup</option>
    <option value="MNC">MNC</option>
    <option value="SME">SME</option>
    <option value="Other">Other</option>
  </select>
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
              Contact Number
            </label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>

           {formData.internBenifits.map((benefit, index) => (
  <div key={index} className="flex gap-2 mb-2">
    <input
      type="text"
      value={benefit}
      onChange={(e) => {
        const newBenefits = [...formData.internBenifits];
        newBenefits[index] = e.target.value;
        setFormData((prev) => ({ ...prev, internBenifits: newBenefits }));
      }}
      className="flex-1 px-3 py-2 border rounded-lg"
    />
    <button
      type="button"
      onClick={() => {
        const newBenefits = formData.internBenifits.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, internBenifits: newBenefits }));
      }}
      className="px-3 py-2 bg-red-500 text-white rounded"
    >
      Delete
    </button>
  </div>
))}
<button
  type="button"
  onClick={() =>
    setFormData((prev) => ({
      ...prev,
      internBenifits: [...prev.internBenifits, ""],
    }))
  }
  className="px-3 py-2 bg-blue-500 text-white rounded"
>
  Add Intern Benefits
</button>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Our Values
  </label>

  {formData.OurValues.map((value, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const newValues = [...formData.OurValues];
          newValues[index] = e.target.value;
          setFormData((prev) => ({ ...prev, OurValues: newValues }));
        }}
        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
      />
      <button
        type="button"
        onClick={() => {
          const newValues = formData.OurValues.filter((_, i) => i !== index);
          setFormData((prev) => ({ ...prev, OurValues: newValues }));
        }}
        className="px-3 py-2 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        OurValues: [...prev.OurValues, ""],
      }))
    }
    className="px-3 py-2 bg-blue-500 text-white rounded"
  >
    Add Company Value
  </button>
</div>

          

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Culture
            </label>
            <input
              type="text"
              name="WorkCulture"
              value={formData.WorkCulture}
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
