import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Lock, 
  Unlock, 
  CheckCircle, 
  XCircle,
  MoreVertical,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Clock
} from 'lucide-react';

export default function EmployerTable() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Dummy Data
  const employersData = [
    {
      id: 1,
      companyName: 'Tech Innovators Inc',
      email: 'contact@techinnovators.com',
      location: 'San Francisco, CA',
      jobsPosted: 12,
      status: 'active',
      isApproved: true,
      joinedDate: '2024-01-15',
      phone: '+1 555-0123',
      website: 'www.techinnovators.com',
      industry: 'Technology'
    },
    {
      id: 2,
      companyName: 'Design Studio Pro',
      email: 'hello@designstudio.com',
      location: 'New York, NY',
      jobsPosted: 8,
      status: 'active',
      isApproved: true,
      joinedDate: '2024-02-10',
      phone: '+1 555-0124',
      website: 'www.designstudio.com',
      industry: 'Design'
    },
    {
      id: 3,
      companyName: 'Marketing Masters',
      email: 'info@marketingmasters.com',
      location: 'Chicago, IL',
      jobsPosted: 6,
      status: 'inactive',
      isApproved: true,
      joinedDate: '2024-03-05',
      phone: '+1 555-0125',
      website: 'www.marketingmasters.com',
      industry: 'Marketing'
    },
    {
      id: 4,
      companyName: 'AI Solutions Ltd',
      email: 'contact@aisolutions.com',
      location: 'Austin, TX',
      jobsPosted: 0,
      status: 'active',
      isApproved: false,
      joinedDate: '2024-03-20',
      phone: '+1 555-0126',
      website: 'www.aisolutions.com',
      industry: 'Artificial Intelligence'
    },
    {
      id: 5,
      companyName: 'Cloud Systems Inc',
      email: 'admin@cloudsystems.com',
      location: 'Seattle, WA',
      jobsPosted: 15,
      status: 'active',
      isApproved: true,
      joinedDate: '2023-12-20',
      phone: '+1 555-0127',
      website: 'www.cloudsystems.com',
      industry: 'Cloud Computing'
    },
    {
      id: 6,
      companyName: 'Startup Hub',
      email: 'hello@startuphub.com',
      location: 'Boston, MA',
      jobsPosted: 3,
      status: 'inactive',
      isApproved: false,
      joinedDate: '2024-03-25',
      phone: '+1 555-0128',
      website: 'www.startuphub.com',
      industry: 'Technology'
    }
  ];

  const [employers, setEmployers] = useState(employersData);

  // Filter employers based on active tab
  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && employer.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && employer.status === 'inactive';
    if (activeTab === 'pending') return matchesSearch && !employer.isApproved;
    
    return matchesSearch;
  });

  // Actions
  const handleApprove = (id) => {
    setEmployers(employers.map(emp => 
      emp.id === id ? { ...emp, isApproved: true } : emp
    ));
  };

  const handleReject = (id) => {
    setEmployers(employers.map(emp => 
      emp.id === id ? { ...emp, isApproved: false } : emp
    ));
  };

  const handleBlock = (id) => {
    setEmployers(employers.map(emp => 
      emp.id === id ? { ...emp, status: 'inactive' } : emp
    ));
  };

  const handleUnblock = (id) => {
    setEmployers(employers.map(emp => 
      emp.id === id ? { ...emp, status: 'active' } : emp
    ));
  };

  const handlePreview = (employer) => {
    setSelectedEmployer(employer);
    setShowPreviewModal(true);
  };

  // Stats
  const stats = {
    total: employers.length,
    active: employers.filter(e => e.status === 'active').length,
    inactive: employers.filter(e => e.status === 'inactive').length,
    pending: employers.filter(e => !e.isApproved).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employers Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all registered employers</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive ({stats.inactive})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Company</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Location</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Jobs Posted</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Approval</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployers.map((employer) => (
                <tr key={employer.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {employer.companyName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{employer.companyName}</p>
                        <p className="text-xs text-gray-500">{employer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{employer.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Briefcase size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{employer.jobsPosted}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      employer.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {employer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {employer.isApproved ? (
                      <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                        <CheckCircle size={16} />
                        <span>Approved</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-orange-600 text-sm font-medium">
                        <Clock size={16} />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handlePreview(employer)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                        title="Preview"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit size={18} className="text-gray-600" />
                      </button>
                      {!employer.isApproved && (
                        <>
                          <button
                            onClick={() => handleApprove(employer.id)}
                            className="p-2 hover:bg-green-50 rounded-lg transition"
                            title="Approve"
                          >
                            <CheckCircle size={18} className="text-green-600" />
                          </button>
                          <button
                            onClick={() => handleReject(employer.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                            title="Reject"
                          >
                            <XCircle size={18} className="text-red-600" />
                          </button>
                        </>
                      )}
                      {employer.status === 'active' ? (
                        <button
                          onClick={() => handleBlock(employer.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                          title="Block"
                        >
                          <Lock size={18} className="text-red-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblock(employer.id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition"
                          title="Unblock"
                        >
                          <Unlock size={18} className="text-green-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployers.length === 0 && (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No employers found</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedEmployer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Employer Details</h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {selectedEmployer.companyName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedEmployer.companyName}</h3>
                  <p className="text-gray-600">{selectedEmployer.industry}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployer.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Website</p>
                  <p className="text-sm font-medium text-blue-600">{selectedEmployer.website}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Jobs Posted</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployer.jobsPosted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Joined Date</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployer.joinedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    selectedEmployer.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedEmployer.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approval Status</p>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    selectedEmployer.isApproved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {selectedEmployer.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Employer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}