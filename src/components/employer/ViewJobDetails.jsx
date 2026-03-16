import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Target,
  FileText,
  Award,
  TrendingUp,
  Home,
  Wifi,
} from "lucide-react";
import {
  getJobDetailsPage,
  getRegisterdCandidate,
  applyCandidateToJob,
} from "../../api/service/axiosService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ViewJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("preview"); // preview, applicants, discover

  // Discover candidates state
  const [allCandidates, setAllCandidates] = useState([]);
  const [loadingAllCandidates, setLoadingAllCandidates] = useState(false);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState("");
  const [isApplyingManual, setIsApplyingManual] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getJobDetailsPage(jobId);
      if (response.status === 200) {
        setJob(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const fetchAllCandidates = useCallback(async () => {
    try {
      setLoadingAllCandidates(true);
      const response = await getRegisterdCandidate();
      if (response.status === 200) {
        setAllCandidates(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoadingAllCandidates(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "discover" && allCandidates.length === 0) {
      fetchAllCandidates();
    }
  }, [activeTab, allCandidates.length, fetchAllCandidates]);

  const handleManualApply = async (candidate) => {
    const result = await Swal.fire({
      title: "Apply Candidate?",
      text: `Are you sure you want to apply ${candidate.userName} to this job?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, apply",
    });

    if (result.isConfirmed) {
      try {
        setIsApplyingManual(true);
        const response = await applyCandidateToJob(jobId, candidate._id);
        if (response.status === 200 || response.status === 201) {
          toast.success("Candidate applied successfully!");
          fetchJobDetails(); // Refresh to show new application
        } else {
          toast.error(response.data?.message || "Failed to apply candidate");
        }
      } catch (error) {
        console.error("Error applying candidate:", error);
        toast.error("An error occurred during application");
      } finally {
        setIsApplyingManual(false);
      }
    }
  };

  const filteredDiscoverCandidates = allCandidates.filter((candidate) => {
    const query = candidateSearchQuery.toLowerCase();
    const name = (candidate.userName || "").toLowerCase();
    const role = (candidate.currentrole || "").toLowerCase();
    const skills = (candidate.skills || []).map((s) => s.toLowerCase());

    return (
      name.includes(query) ||
      role.includes(query) ||
      skills.some((skill) => skill.includes(query))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDiscoverCandidates.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = filteredDiscoverCandidates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (from, to, type) => {
    return `₹${from?.toLocaleString()} - ₹${to?.toLocaleString()} ${type}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job posting you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Jobs</span>
        </button>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "preview"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            Job Details
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "applicants"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            Applicants
            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px]">
              {job.applications?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "discover"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            Discover Candidates
          </button>
        </div>

        {activeTab === "preview" && (
          <>
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="text-white" size={40} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {job.jobTitle}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <Building2 size={18} />
                        <span className="font-medium">{job.companyName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={18} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          job.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {job.status === "open" ? "Open" : "Closed"}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          job.postingStatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : job.postingStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {job.postingStatus}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          job.isActive
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                      {job.isRemote && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 flex items-center space-x-1">
                          <Wifi size={12} />
                          <span>Remote</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Job ID</p>
                  <p className="text-lg font-mono font-bold text-blue-600">
                    {job.jobId}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "preview" && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Salary Range</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatSalary(job.salaryFrom, job.salaryTo, job.salaryType)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vacancies</p>
                    <p className="text-lg font-bold text-blue-600">{job.vacancy}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Applications</p>
                    <p className="text-lg font-bold text-purple-600">
                      {job.applications?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Saved</p>
                    <p className="text-lg font-bold text-orange-600">
                      {job.saved?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "preview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText size={24} className="text-blue-600" />
                  <span>Job Description</span>
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.jobDescription}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Target size={24} className="text-green-600" />
                    <span>Key Responsibilities</span>
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle
                          size={20}
                          className="text-green-600 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <GraduationCap size={24} className="text-purple-600" />
                    <span>Qualifications</span>
                  </h2>
                  <ul className="space-y-3">
                    {job.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Award
                          size={20}
                          className="text-purple-600 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700">{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <TrendingUp size={24} className="text-orange-600" />
                    <span>Required Skills</span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Award size={24} className="text-teal-600" />
                    <span>Benefits & Perks</span>
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.benefits}
                  </p>
                </div>
              )}

              {/* Application Instructions */}
              {job.applicationInstructions && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FileText size={24} className="text-blue-600" />
                    <span>Application Instructions</span>
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.applicationInstructions}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Job Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Briefcase size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Job Type</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {job.jobType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Position Level</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {job.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.experienceLevel} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <GraduationCap size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Education</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {job.educationLevel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Posted On</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(job.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(job.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building2 size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.companyAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a
                        href={`mailto:${job.contactEmail}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {job.contactEmail}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone size={20} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a
                        href={`tel:${job.contactPhone}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {job.contactPhone}
                      </a>
                    </div>
                  </div>
                  {job.companyWebsite && (
                    <div className="flex items-start space-x-3">
                      <Globe size={20} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <a
                          href={job.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Badge */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                <p className="text-sm opacity-90 mb-2">Category</p>
                <p className="text-2xl font-bold">{job.category}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "applicants" && (
          <div className="grid gap-4">
            {(job.applications || []).length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No applicants for this job yet.</p>
              </div>
            ) : (
              job.applications.map((app, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                      {app.applicantName?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{app.applicantName}</p>
                      <p className="text-sm text-gray-500">{app.applicantEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                        app.status === "hired" || app.status === "shortlisted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {app.status || "Applied"}
                    </span>
                    <button
                      onClick={() => navigate(`/admin/preview-candidate/${app.applicantId}`)}
                      className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1"
                    >
                      View Profile <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "discover" && (
          <div className="space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search candidates by name, role, or skills..."
                  value={candidateSearchQuery}
                  onChange={(e) => {
                    setCandidateSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            {loadingAllCandidates ? (
              <div className="py-12 text-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Scanning candidate database...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {currentCandidates.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                    <p className="text-gray-500 font-medium">No candidates found.</p>
                  </div>
                ) : (
                  currentCandidates.map((candidate) => {
                    const isAlreadyApplied = (job.applications || []).some(
                      (app) => app.applicantId === candidate._id
                    );

                    return (
                      <div
                        key={candidate._id}
                        className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4 w-full flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0 mt-1">
                            {candidate.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 truncate">
                              {candidate.userName}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {candidate.currentrole || "Role not specified"}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(candidate.skills || []).slice(0, 5).map((skill, si) => (
                                <span
                                  key={si}
                                  className="text-[10px] bg-gray-50 text-gray-600 px-2.5 py-1 rounded border border-gray-100 uppercase font-black truncate max-w-[150px]"
                                >
                                  {skill}
                                </span>
                              ))}
                              {(candidate.skills || []).length > 5 && (
                                <span className="text-[10px] text-gray-400 font-bold px-1 py-1 italic">
                                  +{(candidate.skills || []).length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleManualApply(candidate)}
                          disabled={isAlreadyApplied || isApplyingManual}
                          className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex-shrink-0 whitespace-nowrap md:mt-1 ${
                            isAlreadyApplied
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default"
                              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                          } disabled:opacity-50`}
                        >
                          {isAlreadyApplied ? (
                            <span className="flex items-center gap-2">
                               <CheckCircle size={16} /> Applied
                            </span>
                          ) : isApplyingManual ? (
                            "Applying..."
                          ) : (
                            "Apply for Candidate"
                          )}
                        </button>
                      </div>
                    );
                  })
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, filteredDiscoverCandidates.length)}</span> of <span className="font-medium text-gray-900">{filteredDiscoverCandidates.length}</span> candidates
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewJobDetails;
