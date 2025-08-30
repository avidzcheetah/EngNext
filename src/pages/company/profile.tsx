import React, { useEffect, useState } from 'react';
import { Upload, Save, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import axios from 'axios';

interface Company {
  _id: string;
  companyName: string;
  email: string;
  website?: string;
  description?: string;
  logo?: string;
  address?: string;
  contactNumber?: string;
  industry?: string;
  founded?: string;
}

const CompanyProfile: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get<Company>('/api/company/profile', {
          withCredentials: true
        });
        setCompany(data);
      } catch (err) {
        console.error('Error fetching company profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (company) {
      setCompany({ ...company, [e.target.name]: e.target.value });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0]);
      setCompany({ ...company!, logo: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(company).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      await axios.put(`/api/company/profile/${company._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating company profile', err);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Company Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left - Text Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={company?.companyName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={company?.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Website</label>
                <input
                  type="url"
                  name="website"
                  value={company?.website || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={company?.contactNumber || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right - Logo Upload & Other Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Company Logo</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition">
                  {company?.logo ? (
                    <img
                      src={company.logo}
                      alt="Company Logo"
                      className="w-24 h-24 mx-auto rounded object-cover mb-2"
                    />
                  ) : (
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="text-blue-600 cursor-pointer">
                    Change Logo
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={company?.industry || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Founded</label>
                <input
                  type="text"
                  name="founded"
                  value={company?.founded || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
                  placeholder="e.g., 2015"
                />
              </div>
            </div>
          </div>

          {/* Full-width fields */}
          <div className="mt-6">
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={company?.address || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              value={company?.description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-blue-500"
            />
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyProfile;
