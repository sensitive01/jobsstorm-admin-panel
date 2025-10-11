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
  Users,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export default function CandidateTable() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Dummy Data
  const candidatesData = [
    {
      id: 1,
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 555-0101',
      location: 'New York, NY',
      jobTitle: 'Senior React Developer',
      experience: '5 years',
      education: 'BS Computer Science',
      status: 'active',
      applicationsSubmitted: 8,
      joinedDate: '2024-01-10',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS']
    },
    {
      id: 2,
      fullName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 555-0102',
      location: 'San Francisco, CA',
      jobTitle: 'UI/UX Designer',
      experience: '3 years',
      education: 'BA Graphic Design',
      status: 'active',
      applicationsSubmitted: 12,
      joinedDate: '2024-01-15',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping']
    },
    {
      id: 3,
      fullName: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+1 555-0103',
      location: 'Austin, TX',
      jobTitle: 'Data Scientist',
      experience: '4 years',
      education: 'MS Data Science',
      status: 'inactive',
      applicationsSubmitted: 5,
      joinedDate: '2024-02-01',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow']
    },
    {
      id: 4,
      fullName: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 555-0104',
      location: 'Chicago, IL',
      jobTitle: 'Product Manager',
      experience: '6 years',
      education: 'MBA',
      status: 'active',
      applicationsSubmitted: 15,
      joinedDate: '2023-12-20',
      skills: ['Agile', 'Product Strategy', 'User Research', 'Analytics']
    },
    {
      id: 5,
      fullName: 'David Wilson',
      email: 'david.w@email.com',
      phone: '+1 555-0105',
      location: 'Seattle, WA',
      jobTitle: 'DevOps Engineer',
      experience: '5 years',
      education: 'BS Information Technology',
      status: 'active',
      applicationsSubmitted: 10,
      joinedDate: '2024-01-25',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS']
    },
    {
      id: 6,
      fullName: 'Jessica Martinez',
      email: 'jessica.m@email.com',
      phone: '+1 555-0106',
      location: 'Boston, MA',
      jobTitle: 'Marketing Specialist',
      experience: '2 years',
      education: 'BA Marketing',
      status: 'inactive',
      applicationsSubmitted: 3,
      joinedDate: '2024-02-10',
      skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics']
    },
    {
      id: 7,
      fullName: 'Robert Taylor',
      email: 'robert.t@email.com',
      phone: '+1 555-0107',
      location: 'Denver, CO',
      jobTitle: 'Backend Developer',
      experience: '4 years',
      education: 'BS Software Engineering',
      status: 'active',
      applicationsSubmitted: 7,
      joinedDate: '2024-01-05',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices']
    },
    {
      id: 8,
      fullName: 'Amanda White',
      email: 'amanda.w@email.com',
      phone: '+1 555-0108',
      location: 'Miami, FL',
      jobTitle: 'Frontend Developer',
      experience: '3 years',
      education: 'BS Computer Science',
      status: 'active',
      applicationsSubmitted: 9,
      joinedDate: '2024-02-15',
      skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML']
    }
  ];

  const [candidates, setCandidates] = useState(candidatesData);

  // Filter candidates based on active tab
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && candidate.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && candidate.status === 'inactive';
    
    return matchesSearch;
  });

  // Actions
  const handleBlock = (id) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, status: 'inactive' } : candidate
    ));
  };

  const handleUnblock = (id) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, status: 'active' } : candidate
    ));
  };

  const handlePreview = (candidate) => {
    setSelectedCandidate(candidate);
    setShowPreviewModal(true);
  };

  // Stats
  const stats = {
    total: candidates.length,
    active: candidates.filter(c => c.status === 'active').length,
    inactive: candidates.filter(c => c.status === 'inactive').length,
    applications: candidates.reduce((sum, c) => sum + c.applicationsSubmitted, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all registered candidates</p>
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
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
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
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.applications}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-purple-600" />
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
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
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
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Candidate</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Job Title</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Location</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Experience</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Applications</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {candidate.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{candidate.fullName}</p>
                        <p className="text-xs text-gray-500">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-gray-900">{candidate.jobTitle}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{candidate.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{candidate.experience}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Briefcase size={16} className="text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">{candidate.applicationsSubmitted}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      candidate.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handlePreview(candidate)}
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
                      {candidate.status === 'active' ? (
                        <button
                          onClick={() => handleBlock(candidate.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                          title="Block"
                        >
                          <Lock size={18} className="text-red-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblock(candidate.id)}
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

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No candidates found</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Candidate Details</h2>
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
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {selectedCandidate.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCandidate.fullName}</h3>
                  <p className="text-gray-600">{selectedCandidate.jobTitle}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <Mail size={14} />
                    <span>Email</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <Phone size={14} />
                    <span>Phone</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>Location</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <Briefcase size={14} />
                    <span>Experience</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <GraduationCap size={14} />
                    <span>Education</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.education}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Joined Date</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.joinedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Applications Submitted</p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.applicationsSubmitted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    selectedCandidate.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedCandidate.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
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
                Edit Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}