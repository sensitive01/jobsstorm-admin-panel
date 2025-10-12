import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  Lock,
  Unlock,
  Gift,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Languages,
  Award,
  Video,
  Music,
  ArrowLeft,
  MapPin,
  Code,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getIndividualCandidateDetails } from "../../api/service/axiosService";

const PreviewCandidate = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call with demo data
        const response = await getIndividualCandidateDetails(candidateId);
        if (response.status===200) {
          setCandidate(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching candidate details:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Candidate Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The candidate you're looking for doesn't exist.
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
          <span>Back to Candidates</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-4xl">
                  {candidate.userName?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {candidate.userName}
                </h1>
                <div className="flex flex-col space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} />
                    <span>{candidate.userEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>{candidate.userMobile || "Not provided"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>Joined {formatDate(candidate.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      candidate.verificationstatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : candidate.verificationstatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {candidate.verificationstatus === "approved"
                      ? "Approved"
                      : candidate.verificationstatus === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      candidate.blockstatus === "unblock"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {candidate.blockstatus === "unblock" ? "Active" : "Blocked"}
                  </span>
                  {candidate.emailverifedstatus && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center space-x-1">
                      <CheckCircle size={14} />
                      <span>Email Verified</span>
                    </span>
                  )}
                  {candidate.isAvailable && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-700">
                      Available for Work
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Candidate ID</p>
              <p className="text-sm font-mono font-semibold text-gray-900">
                {candidate.uuid}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Skills</p>
                <p className="text-3xl font-bold text-blue-600">
                  {candidate.skills?.length || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Code size={28} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Referrals</p>
                <p className="text-3xl font-bold text-purple-600">
                  {candidate.referralCount}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={28} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rewards</p>
                <p className="text-3xl font-bold text-green-600">
                  {candidate.referralRewards}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <Gift size={28} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Languages</p>
                <p className="text-3xl font-bold text-orange-600">
                  {candidate.languages?.length || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <Languages size={28} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Shield size={24} className="text-blue-600" />
              <span>Account Information</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Email Verification
                  </span>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    candidate.emailverifedstatus
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {candidate.emailverifedstatus ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Shield size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Account Status</span>
                </div>
                <span
                  className={`text-sm font-semibold flex items-center space-x-1 ${
                    candidate.blockstatus === "unblock"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {candidate.blockstatus === "unblock" ? (
                    <Unlock size={16} />
                  ) : (
                    <Lock size={16} />
                  )}
                  <span>
                    {candidate.blockstatus === "unblock" ? "Active" : "Blocked"}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Verification Status
                  </span>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    candidate.verificationstatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : candidate.verificationstatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {candidate.verificationstatus}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <User size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Availability</span>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    candidate.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {candidate.isAvailable ? "Available" : "Not Available"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Gift size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Referral Code</span>
                </div>
                <span className="text-sm font-mono font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                  {candidate.referralCode}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Last Updated</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatDate(candidate.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Skills & Grade Levels */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Award size={24} className="text-purple-600" />
              <span>Skills & Expertise</span>
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Grade Levels
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidate.gradeLevels && candidate.gradeLevels.length > 0 ? (
                    candidate.gradeLevels.map((level, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {level}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No grade levels specified
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills && candidate.skills.length > 0 ? (
                    candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills added</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidate.languages && candidate.languages.length > 0 ? (
                    candidate.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                      >
                        {language}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No languages specified
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <GraduationCap size={24} className="text-blue-600" />
              <span>Education</span>
            </h2>
            {candidate.education && candidate.education.length > 0 ? (
              <div className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No education details added
              </p>
            )}
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Briefcase size={24} className="text-green-600" />
              <span>Work Experience</span>
            </h2>
            {candidate.workExperience && candidate.workExperience.length > 0 ? (
              <div className="space-y-4">
                {candidate.workExperience.map((work, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-green-500 pl-4 py-2"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {work.position}
                    </h3>
                    <p className="text-sm text-gray-600">{work.company}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {work.duration}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No work experience added</p>
            )}
          </div>

          {/* Media Files */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Video size={24} className="text-red-600" />
              <span>Media & Portfolio</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Video size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Video Files</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {candidate.videoFiles?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Music size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Audio Files</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {candidate.audioFiles?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">FCM Tokens</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {candidate.employeefcmtoken?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Edit Candidate Details
              </button>
              {candidate.blockstatus === "unblock" ? (
                <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center space-x-2">
                  <Lock size={18} />
                  <span>Block Candidate</span>
                </button>
              ) : (
                <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center space-x-2">
                  <Unlock size={18} />
                  <span>Unblock Candidate</span>
                </button>
              )}
              {candidate.verificationstatus === "pending" && (
                <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                  Approve Candidate
                </button>
              )}
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                View Application History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCandidate;
