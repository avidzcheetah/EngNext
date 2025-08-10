import React, { useState } from 'react';
import { Plus, Users, Eye, Download, MessageCircle, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockInternships } from '../../data/mockData';

const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'positions' | 'company'>('applications');
  const [showJobModal, setShowJobModal] = useState(false);

  const mockApplications = [
    {
      id: '1',
      studentName: 'John Doe',
      email: 'john.doe@eng.jfn.ac.lk',
      internshipTitle: 'Electronics Engineering Intern',
      appliedDate: '2025-01-15',
      status: 'pending',
      skills: ['Circuit Design', 'MATLAB', 'PCB Design'],
      gpa: '3.75'
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      email: 'jane.smith@eng.jfn.ac.lk',
      internshipTitle: 'Software Development Intern',
      appliedDate: '2025-01-14',
      status: 'reviewed',
      skills: ['Python', 'JavaScript', 'React'],
      gpa: '3.85'
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
          <p className="text-gray-600">Manage your internship programs and candidates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
            <p className="text-gray-600 text-sm">Total Applications</p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
            <p className="text-gray-600 text-sm">Active Positions</p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">12</h3>
            <p className="text-gray-600 text-sm">Pending Reviews</p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">8</h3>
            <p className="text-gray-600 text-sm">Interviews Scheduled</p>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Applications ({mockApplications.length})
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'positions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Job Positions ({mockInternships.length})
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'company'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Company Profile
            </button>
          </nav>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {mockApplications.map((application) => (
              <Card key={application.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {application.studentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.studentName}
                      </h3>
                      <p className="text-gray-600">{application.email}</p>
                      <p className="text-sm text-blue-600">{application.internshipTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadge(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Applied on {application.appliedDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">GPA:</h4>
                    <p className="text-lg font-semibold text-green-600">{application.gpa}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Accept
                  </Button>
                  <Button variant="danger" size="sm">
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Job Positions Tab */}
        {activeTab === 'positions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Job Positions</h2>
              <Button onClick={() => setShowJobModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Position
              </Button>
            </div>

            <div className="space-y-6">
              {mockInternships.map((internship) => (
                <Card key={internship.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {internship.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{internship.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {internship.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {internship.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        internship.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {internship.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Applications (5)
                    </Button>
                    <Button variant="danger" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Company Profile Tab */}
        {activeTab === 'company' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value="TechCorp Lanka"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value="https://techcorp.lk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value="hr@techcorp.lk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <img
                      src="https://images.pexels.com/photos/248515/pexels-photo-248515.jpeg?auto=compress&cs=tinysrgb&w=200"
                      alt="Company Logo"
                      className="w-20 h-20 mx-auto mb-2 rounded-lg object-cover"
                    />
                    <Button variant="outline" size="sm">
                      Change Logo
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value="Leading technology company specializing in electronics and software solutions."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button>Save Changes</Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6">Add New Internship Position</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineering Intern"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500">
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>12 months</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Colombo, Remote, Hybrid"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., JavaScript, React, Node.js"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowJobModal(false)}
                >
                  Cancel
                </Button>
                <Button fullWidth>Create Position</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;