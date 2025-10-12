import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Eye,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Mail,
  User,
  Shield,
} from "lucide-react";
import { getRegisterdCandidate } from "../../api/service/axiosService";
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

export default function CandidateTable() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRegisterdCandidate();
        if (response.status===200) {
          setCandidates(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
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

  // Filter candidates based on active tab
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && candidate.blockstatus === "unblock";
    if (activeTab === "inactive")
      return matchesSearch && candidate.blockstatus === "block";
    if (activeTab === "pending")
      return matchesSearch && candidate.verificationstatus === "pending";

    return matchesSearch;
  });

  // Actions
  const handleBlock = async (id) => {
    try {
      // API call to block candidate
      // await blockCandidate(id);

      setCandidates(
        candidates.map((candidate) =>
          candidate._id === id
            ? { ...candidate, blockstatus: "block" }
            : candidate
        )
      );
      showToast("Candidate blocked successfully", "success");
    } catch (error) {
      showToast("Failed to block candidate", "error");
    }
  };

  const handleUnblock = async (id) => {
    try {
      // API call to unblock candidate
      // await unblockCandidate(id);

      setCandidates(
        candidates.map((candidate) =>
          candidate._id === id
            ? { ...candidate, blockstatus: "unblock" }
            : candidate
        )
      );
      showToast("Candidate unblocked successfully", "success");
    } catch (error) {
      showToast("Failed to unblock candidate", "error");
    }
  };

  const handleApprove = async (id) => {
    try {
      // API call to approve candidate
      // await approveCandidate(id);

      setCandidates(
        candidates.map((candidate) =>
          candidate._id === id
            ? { ...candidate, verificationstatus: "approved", isVerified: true }
            : candidate
        )
      );
      showToast("Candidate approved successfully!", "success");
    } catch (error) {
      showToast("Failed to approve candidate", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      // API call to reject candidate
      // await rejectCandidate(id);

      setCandidates(
        candidates.map((candidate) =>
          candidate._id === id
            ? {
                ...candidate,
                verificationstatus: "rejected",
                isVerified: false,
              }
            : candidate
        )
      );
      showToast("Candidate rejected", "success");
    } catch (error) {
      showToast("Failed to reject candidate", "error");
    }
  };

  const handlePreview = (candidate) => {
    navigate(`/admin/preview-candidate/${candidate._id}`)
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
    total: candidates.length,
    active: candidates.filter((c) => c.blockstatus === "unblock").length,
    inactive: candidates.filter((c) => c.blockstatus === "block").length,
    pending: candidates.filter((c) => c.verificationstatus === "pending")
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
            Candidates Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all registered candidates
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
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
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
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.active}
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
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {stats.inactive}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-orange-600" />
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
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
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
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Candidate
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Email Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Registration Date
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Verification
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
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No candidates found</p>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {candidate.userName?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {candidate.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {candidate.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {candidate.emailverifedstatus ? (
                        <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                          <CheckCircle size={16} />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-orange-600 text-sm font-medium">
                          <XCircle size={16} />
                          <span>Not Verified</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{formatDate(candidate.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          candidate.verificationstatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : candidate.verificationstatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {candidate.verificationstatus || "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          candidate.blockstatus === "unblock"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {candidate.blockstatus === "unblock"
                          ? "Active"
                          : "Blocked"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handlePreview(candidate)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} className="text-blue-600" />
                        </button>
                        {candidate.verificationstatus === "pending" && (
                          <>
                            {/* <button
                              onClick={() => handleApprove(candidate._id)}
                              className="p-2 hover:bg-green-50 rounded-lg transition"
                              title="Approve"
                            >
                              <CheckCircle
                                size={18}
                                className="text-green-600"
                              />
                            </button> */}
                            {/* <button
                              onClick={() => handleReject(candidate._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="Reject"
                            >
                              <XCircle size={18} className="text-red-600" />
                            </button> */}
                          </>
                        )}
                        {candidate.blockstatus === "unblock" ? (
                          <button
                            onClick={() => handleBlock(candidate._id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                            title="Block"
                          >
                            <Lock size={18} className="text-red-600" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblock(candidate._id)}
                            className="p-2 hover:bg-green-50 rounded-lg transition"
                            title="Unblock"
                          >
                            <Unlock size={18} className="text-green-600" />
                          </button>
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
      {showPreviewModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Candidate Details
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
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {selectedCandidate.userName?.charAt(0)?.toUpperCase() ||
                      "?"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedCandidate.userName}
                  </h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedCandidate.verificationstatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : selectedCandidate.verificationstatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {selectedCandidate.verificationstatus || "pending"}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedCandidate.blockstatus === "unblock"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedCandidate.blockstatus === "unblock"
                        ? "Active"
                        : "Blocked"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <Mail size={14} />
                    <span>Email</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedCandidate.userEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <CheckCircle size={14} />
                    <span>Email Verified</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedCandidate.emailverifedstatus ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Registration Date</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedCandidate.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                    <Shield size={14} />
                    <span>Account Verified</span>
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedCandidate.isVerified ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">User ID</p>
                  <p className="text-sm font-mono font-medium text-gray-900">
                    {selectedCandidate._id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Block Status</p>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      selectedCandidate.blockstatus === "unblock"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedCandidate.blockstatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              {selectedCandidate.verificationstatus === "pending" && (
                <>
                  {/* <button
                    onClick={() => {
                      handleReject(selectedCandidate._id);
                      setShowPreviewModal(false);
                    }}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button> */}
                  {/* <button
                    onClick={() => {
                      handleApprove(selectedCandidate._id);
                      setShowPreviewModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button> */}
                </>
              )}
              {selectedCandidate.blockstatus === "unblock" ? (
                <button
                  onClick={() => {
                    handleBlock(selectedCandidate._id);
                    setShowPreviewModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Block Candidate
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleUnblock(selectedCandidate._id);
                    setShowPreviewModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Unblock Candidate
                </button>
              )}
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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
