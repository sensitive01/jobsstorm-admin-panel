import React, { useEffect, useState } from "react";
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
import { getJobDetailsPage } from "../../api/service/axiosService";
import { useParams } from "react-router-dom";

const ViewJobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getJobDetailsPage(jobId);
        if (response.status === 200) {
          setJob(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      </div>
    </div>
  );
};

export default ViewJobDetails;
