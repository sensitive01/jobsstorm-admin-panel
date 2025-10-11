import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  UserCheck,
} from "lucide-react";

export default function CompaniesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Dummy Data
  const companiesData = [
    {
      id: 1,
      companyName: "Tech Innovators Inc",
      logo: "TI",
      industry: "Technology",
      location: "San Francisco, CA",
      email: "contact@techinnovators.com",
      phone: "+1 555-0123",
      website: "www.techinnovators.com",
      status: "active",
      jobsPosted: 25,
      activeEmployees: 450,
      hired: 12,
      joinedDate: "2023-06-15",
      description:
        "Leading technology company specializing in AI and machine learning solutions.",
    },
    {
      id: 2,
      companyName: "Design Studio Pro",
      logo: "DS",
      industry: "Design & Creative",
      location: "New York, NY",
      email: "hello@designstudio.com",
      phone: "+1 555-0124",
      website: "www.designstudio.com",
      status: "active",
      jobsPosted: 18,
      activeEmployees: 125,
      hired: 8,
      joinedDate: "2023-08-20",
      description:
        "Creative design agency focused on brand identity and digital experiences.",
    },
    {
      id: 3,
      companyName: "Marketing Masters",
      logo: "MM",
      industry: "Marketing & Advertising",
      location: "Chicago, IL",
      email: "info@marketingmasters.com",
      phone: "+1 555-0125",
      website: "www.marketingmasters.com",
      status: "inactive",
      jobsPosted: 12,
      activeEmployees: 85,
      hired: 5,
      joinedDate: "2023-09-10",
      description:
        "Full-service marketing agency helping businesses grow their online presence.",
    },
    {
      id: 4,
      companyName: "AI Solutions Ltd",
      logo: "AS",
      industry: "Artificial Intelligence",
      location: "Austin, TX",
      email: "contact@aisolutions.com",
      phone: "+1 555-0126",
      website: "www.aisolutions.com",
      status: "active",
      jobsPosted: 32,
      activeEmployees: 320,
      hired: 18,
      joinedDate: "2023-05-05",
      description:
        "Pioneering AI solutions for enterprise automation and data analytics.",
    },
    {
      id: 5,
      companyName: "Cloud Systems Inc",
      logo: "CS",
      industry: "Cloud Computing",
      location: "Seattle, WA",
      email: "admin@cloudsystems.com",
      phone: "+1 555-0127",
      website: "www.cloudsystems.com",
      status: "active",
      jobsPosted: 28,
      activeEmployees: 540,
      hired: 22,
      joinedDate: "2023-03-12",
      description:
        "Cloud infrastructure and services provider for modern businesses.",
    },
    {
      id: 6,
      companyName: "FinTech Innovations",
      logo: "FI",
      industry: "Financial Technology",
      location: "Boston, MA",
      email: "hello@fintechinno.com",
      phone: "+1 555-0128",
      website: "www.fintechinno.com",
      status: "active",
      jobsPosted: 20,
      activeEmployees: 275,
      hired: 14,
      joinedDate: "2023-07-22",
      description:
        "Revolutionary fintech solutions for digital banking and payments.",
    },
    {
      id: 7,
      companyName: "HealthCare Plus",
      logo: "HP",
      industry: "Healthcare",
      location: "Denver, CO",
      email: "info@healthcareplus.com",
      phone: "+1 555-0129",
      website: "www.healthcareplus.com",
      status: "inactive",
      jobsPosted: 8,
      activeEmployees: 150,
      hired: 3,
      joinedDate: "2023-10-15",
      description:
        "Healthcare technology company improving patient care through innovation.",
    },
    {
      id: 8,
      companyName: "EduTech Solutions",
      logo: "ES",
      industry: "Education Technology",
      location: "Miami, FL",
      email: "contact@edutech.com",
      phone: "+1 555-0130",
      website: "www.edutech.com",
      status: "active",
      jobsPosted: 15,
      activeEmployees: 200,
      hired: 9,
      joinedDate: "2023-11-08",
      description: "EdTech platform transforming online learning experiences.",
    },
  ];

  const [companies, setCompanies] = useState(companiesData);

  // Filter companies based on active tab
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && company.status === "active";
    if (activeTab === "inactive")
      return matchesSearch && company.status === "inactive";

    return matchesSearch;
  });

  const handleView = (company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  // Stats
  const stats = {
    total: companies.length,
    active: companies.filter((c) => c.status === "active").length,
    inactive: companies.filter((c) => c.status === "inactive").length,
    totalJobs: companies.reduce((sum, c) => sum + c.jobsPosted, 0),
    totalEmployees: companies.reduce((sum, c) => sum + c.activeEmployees, 0),
    totalHired: companies.reduce((sum, c) => sum + c.hired, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            View and manage all registered companies
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600 mt-1">Total Companies</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-600 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          <p className="text-sm text-gray-600 mt-1">Inactive</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totalJobs}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Jobs</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {stats.totalEmployees}
          </p>
          <p className="text-sm text-gray-600 mt-1">Employees</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <UserCheck size={20} className="text-teal-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-teal-600">{stats.totalHired}</p>
          <p className="text-sm text-gray-600 mt-1">Total Hired</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "active"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setActiveTab("inactive")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "inactive"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Inactive ({stats.inactive})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search companies..."
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
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Company
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Industry
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Location
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Jobs Posted
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Employees
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Hired
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {company.logo}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {company.companyName}
                        </p>
                        <p className="text-xs text-gray-500">{company.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{company.industry}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{company.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Briefcase size={16} className="text-purple-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        {company.jobsPosted}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-orange-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        {company.activeEmployees}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <UserCheck size={16} className="text-teal-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        {company.hired}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        company.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleView(company)}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No companies found</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Company Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Header */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {selectedCompany.logo}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedCompany.companyName}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedCompany.industry}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      selectedCompany.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedCompany.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  {selectedCompany.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCompany.jobsPosted}
                  </p>
                  <p className="text-sm text-gray-600">Jobs Posted</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCompany.activeEmployees}
                  </p>
                  <p className="text-sm text-gray-600">Active Employees</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 text-center">
                  <UserCheck className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCompany.hired}
                  </p>
                  <p className="text-sm text-gray-600">Total Hired</p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Mail size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedCompany.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedCompany.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedCompany.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a
                        href={`https://${selectedCompany.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {selectedCompany.website}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Joined Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedCompany.joinedDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
