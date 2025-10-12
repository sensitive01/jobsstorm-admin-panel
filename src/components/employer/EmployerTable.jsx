import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  Calendar,
  Clock,
  Mail,
  User,
} from "lucide-react";
import { approveEmployer, getEmployersData, rejectEmployer } from "../../api/service/axiosService";
import { useNavigate } from "react-router-dom";

// Toast Component
const Toast = ({ show, message, type = "success" }) => {
  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg border p-4 flex items-center space-x-3 min-w-[300px] ${
          type === "success" ? "border-green-200" : "border-red-200"
        }`}
      >
        <div className="flex-shrink-0">
          {type === "success" ? (
            <CheckCircle className="text-green-500" size={24} />
          ) : (
            <XCircle className="text-red-500" size={24} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default function EmployerRegistrationTable() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployersData();
        if (response.status===200) {
          setEmployers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching employers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Filter employers based on active tab
  const filteredEmployers = employers.filter((employer) => {
    const matchesSearch =
      employer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return matchesSearch && employer.verificationstatus === "pending";
    if (activeTab === "approved")
      return matchesSearch && employer.verificationstatus === "approved";
    if (activeTab === "rejected")
      return matchesSearch && employer.verificationstatus === "rejected";

    return matchesSearch;
  });

  // Actions
  const handleApprove = async (id) => {
    try {
      await approveEmployer(id);

      setEmployers(
        employers.map((emp) =>
          emp._id === id
            ? { ...emp, verificationstatus: "approved", isVerified: true }
            : emp
        )
      );
      showToast("Employer approved successfully!", "success");
    } catch (error) {
      showToast("Failed to approve employer", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      // API call to reject employer
      await rejectEmployer(id);

      setEmployers(
        employers.map((emp) =>
          emp._id === id
            ? { ...emp, verificationstatus: "rejected", isVerified: false }
            : emp
        )
      );
      showToast("Employer rejected", "success");
    } catch (error) {
      showToast("Failed to reject employer", "error");
    }
  };

  const handlePreview = (employer) => {
   navigate(`/admin/preview-employer/${employer._id}`)
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
    total: employers.length,
    pending: employers.filter((e) => e.verificationstatus === "pending").length,
    approved: employers.filter((e) => e.verificationstatus === "approved")
      .length,
    rejected: employers.filter((e) => e.verificationstatus === "rejected")
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employer Registrations
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage new employer registrations
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.approved}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {stats.rejected}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
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
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Company
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Contact Person
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Registration Date
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
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredEmployers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Building2
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-500">No employers found</p>
                  </td>
                </tr>
              ) : (
                filteredEmployers.map((employer) => (
                  <tr
                    key={employer._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {employer.companyName?.charAt(0) || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {employer.companyName}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Mail size={12} />
                            <span>{employer.contactEmail}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <User size={14} />
                        <span>{employer.contactPerson || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{formatDate(employer.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          employer.verificationstatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : employer.verificationstatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {employer.verificationstatus || "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handlePreview(employer)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} className="text-blue-600" />
                        </button>
                        {employer.verificationstatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(employer._id)}
                              className="p-2 hover:bg-green-50 rounded-lg transition"
                              title="Approve"
                            >
                              <CheckCircle
                                size={18}
                                className="text-green-600"
                              />
                            </button>
                            <button
                              onClick={() => handleReject(employer._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="Reject"
                            >
                              <XCircle size={18} className="text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedEmployer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Employer Details
                </h2>
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
                    {selectedEmployer.companyName?.charAt(0) || "?"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedEmployer.companyName}
                  </h3>
                  <span
                    className={`mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      selectedEmployer.verificationstatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : selectedEmployer.verificationstatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {selectedEmployer.verificationstatus || "pending"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEmployer.contactEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Person</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEmployer.contactPerson || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Registration Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedEmployer.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Verification Status
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEmployer.isVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              {selectedEmployer.verificationstatus === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedEmployer._id);
                      setShowPreviewModal(false);
                    }}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedEmployer._id);
                      setShowPreviewModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                </>
              )}
              {selectedEmployer.verificationstatus !== "pending" && (
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
