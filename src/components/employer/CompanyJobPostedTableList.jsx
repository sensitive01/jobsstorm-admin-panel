import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Briefcase,
  Calendar,
  Users,
  Building2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { getComapanyTotalJobs } from "../../api/service/axiosService";
import { useNavigate, useParams } from "react-router-dom";

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
          type === "success"
            ? "border-green-200"
            : type === "error"
            ? "border-red-200"
            : "border-orange-200"
        }`}
      >
        <div className="flex-shrink-0">
          {type === "success" ? (
            <div className="text-green-500">✓</div>
          ) : type === "error" ? (
            <div className="text-red-500">✕</div>
          ) : (
            <AlertTriangle className="text-orange-500" size={24} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{message}</p>
        </div>
      </div>
    </div>
  );
};

const CompanyJobPostedTableList = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getComapanyTotalJobs(companyId);
        if (response.status === 200) {
          setJobs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        showToast("Failed to fetch jobs", "error");
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (job) => {
    navigate(`/admin/view-job-details/${job._id}`);
  };

  const handleEdit = (job) => {
    navigate(`/admin/edit-job-details/${job._id}`);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // API call to delete job
      // await deleteJob(jobToDelete._id);

      setJobs(jobs.filter((job) => job._id !== jobToDelete._id));
      showToast("Job deleted successfully", "success");
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      showToast("Failed to delete job", "error");
    }
  };

  const stats = {
    total: jobs.length,
    totalVacancies: jobs.reduce((sum, job) => sum + (job.vacancy || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={20} />
        <span>Back to Companies</span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-1">
            {jobs[0]?.companyName || "Company"} - Manage all job postings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs Posted</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase size={28} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vacancies</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {stats.totalVacancies}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <Users size={28} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Company</p>
              <p className="text-lg font-bold text-purple-600 mt-1">
                {jobs[0]?.companyName || "N/A"}
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building2 size={28} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="relative w-full md:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by job title or job ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Job ID
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Job Title
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Company
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Vacancies
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Posted Date
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <Briefcase
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-500">No jobs found</p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono font-semibold text-blue-600">
                        {job.jobId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-900">
                        {job.jobTitle}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Building2 size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {job.companyName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-green-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {job.vacancy}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(job)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-2 hover:bg-green-50 rounded-lg transition"
                          title="Edit Job"
                        >
                          <Edit size={18} className="text-green-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(job)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                          title="Delete Job"
                        >
                          <Trash2 size={18} className="text-red-600" />
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
      {showViewModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Job Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Header */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="text-white" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedJob.jobTitle}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedJob.companyName}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-mono font-semibold bg-blue-100 text-blue-700 rounded">
                    {selectedJob.jobId}
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job Title</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedJob.jobTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-900">
                    {selectedJob.jobId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Company</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedJob.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vacancies</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedJob.vacancy}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posted Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(selectedJob.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Internal ID</p>
                  <p className="text-sm font-mono text-gray-900">
                    {selectedJob._id}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedJob);
                  setShowViewModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Job Posting
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete "{jobToDelete.jobTitle}"? This
                action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setJobToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyJobPostedTableList;
