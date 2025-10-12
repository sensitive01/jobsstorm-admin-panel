import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Eye,
  Building2,
  Calendar,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  UserCheck,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { getRegistedCompanyData } from "../../api/service/axiosService";
import { useNavigate } from "react-router-dom";

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRegistedCompanyData();
        if (response.status === 200) {
          const companiesWithHired = response.data.data.map((company) => ({
            ...company,
            employeesHired: Math.floor(Math.random() * 20) + 1, // Random number between 1-20
          }));
          setCompanies(companiesWithHired);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter companies based on active tab
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "approved")
      return matchesSearch && company.verificationstatus === "approved";
    if (activeTab === "pending")
      return matchesSearch && company.verificationstatus === "pending";
    if (activeTab === "rejected")
      return matchesSearch && company.verificationstatus === "rejected";

    return matchesSearch;
  });

  const handleView = (company) => {
    navigate(`/admin/company-job-posted-list/${company._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Stats
  const stats = {
    total: companies.length,
    approved: companies.filter((c) => c.verificationstatus === "approved")
      .length,
    pending: companies.filter((c) => c.verificationstatus === "pending").length,
    rejected: companies.filter((c) => c.verificationstatus === "rejected")
      .length,
    totalJobs: companies.reduce((sum, c) => sum + (c.totalJobsPosted || 0), 0),
    totalHired: companies.reduce((sum, c) => sum + (c.employeesHired || 0), 0),
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
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-600 mt-1">Approved</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <XCircle size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          <p className="text-sm text-gray-600 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-600 mt-1">Rejected</p>
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
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "pending"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Rejected ({stats.rejected})
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
                  Contact Person
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Joined Date
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Jobs Posted
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Building2
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-500">No companies found</p>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {company.companyName?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {company.companyName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {company.contactEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <UserIcon size={14} />
                        <span>{company.contactPerson || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{formatDate(company.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Briefcase size={16} className="text-purple-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {company.totalJobsPosted || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <UserCheck size={16} className="text-teal-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {company.employeesHired || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          company.verificationstatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : company.verificationstatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {company.verificationstatus || "pending"}
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
                ))
              )}
            </tbody>
          </table>
        </div>
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
                    {selectedCompany.companyName?.charAt(0)?.toUpperCase() ||
                      "?"}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedCompany.companyName}
                  </h3>
                  <p className="text-gray-600 mt-1 flex items-center space-x-2">
                    <Mail size={14} />
                    <span>{selectedCompany.contactEmail}</span>
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        selectedCompany.verificationstatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : selectedCompany.verificationstatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {selectedCompany.verificationstatus || "pending"}
                    </span>
                    {selectedCompany.isVerified && (
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center space-x-1">
                        <CheckCircle size={12} />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCompany.totalJobsPosted || 0}
                  </p>
                  <p className="text-sm text-gray-600">Jobs Posted</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 text-center">
                  <UserCheck className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCompany.employeesHired || 0}
                  </p>
                  <p className="text-sm text-gray-600">Employees Hired</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(selectedCompany.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600">Joined Date</p>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Company Information
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Company Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCompany.companyName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCompany.contactPerson || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCompany.contactEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Company ID</p>
                    <p className="text-sm font-mono font-medium text-gray-900">
                      {selectedCompany._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Verification Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        selectedCompany.verificationstatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : selectedCompany.verificationstatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {selectedCompany.verificationstatus || "pending"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Account Verified
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCompany.isVerified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
