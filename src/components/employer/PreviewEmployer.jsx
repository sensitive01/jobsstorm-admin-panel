import React, { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  Lock,
  Unlock,
  Users,
  Briefcase,
  Eye,
  Download,
  TrendingUp,
  Gift,
  Clock,
  ArrowLeft,
  Crown,
} from "lucide-react";
import { getEmployerDetails } from "../../api/service/axiosService";
import { useParams, useNavigate } from "react-router-dom";

const PreviewEmployer = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployerDetails(empId);
        if (response.status===200) {
          setEmployer(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching employer details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [empId]);

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
          <p className="text-gray-600">Loading employer details...</p>
        </div>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Employer Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The employer you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
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
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Employers</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-4xl">
                  {employer.companyName?.charAt(0) || "?"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {employer.companyName}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail size={16} />
                    <span>{employer.contactEmail}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Joined {formatDate(employer.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      employer.verificationstatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : employer.verificationstatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {employer.verificationstatus === "approved"
                      ? "Approved"
                      : employer.verificationstatus === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      employer.blockstatus === "unblock"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {employer.blockstatus === "unblock" ? "Active" : "Blocked"}
                  </span>
                  {employer.emailverifedstatus && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center space-x-1">
                      <CheckCircle size={14} />
                      <span>Email Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Employer ID</p>
              <p className="text-sm font-mono font-semibold text-gray-900">
                {employer.uuid}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Job Posting Limit</p>
                <p className="text-3xl font-bold text-blue-600">
                  {employer.totaljobpostinglimit}
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
                <p className="text-sm text-gray-600 mb-1">Profile Views</p>
                <p className="text-3xl font-bold text-purple-600">
                  {employer.totalprofileviews}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <Eye size={28} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resume Downloads</p>
                <p className="text-3xl font-bold text-green-600">
                  {employer.totaldownloadresume}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <Download size={28} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Referral Count</p>
                <p className="text-3xl font-bold text-orange-600">
                  {employer.referralCount}
                </p>
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <Users size={28} className="text-orange-600" />
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
                    employer.emailverifedstatus
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {employer.emailverifedstatus ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Shield size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Account Status</span>
                </div>
                <span
                  className={`text-sm font-semibold flex items-center space-x-1 ${
                    employer.blockstatus === "unblock"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {employer.blockstatus === "unblock" ? (
                    <Unlock size={16} />
                  ) : (
                    <Lock size={16} />
                  )}
                  <span>
                    {employer.blockstatus === "unblock" ? "Active" : "Blocked"}
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
                    employer.verificationstatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : employer.verificationstatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {employer.verificationstatus}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Gift size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Referral Code</span>
                </div>
                <span className="text-sm font-mono font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                  {employer.referralCode}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Referral Rewards
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {employer.referralRewards}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Crown size={24} className="text-yellow-600" />
              <span>Subscription Details</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Crown size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Subscription Status
                  </span>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    employer.subscription === "true"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {employer.subscription === "true" ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Trial Status</span>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    employer.trial === "true"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {employer.trial === "true" ? "Active Trial" : "No Trial"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Subscription Days Left
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {employer.subscriptionleft} days
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Briefcase size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Daily Limit</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {employer.totalperdaylimit}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Crown size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Current Plan</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {employer.currentSubscription || "No Active Plan"}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <TrendingUp size={24} className="text-green-600" />
              <span>Activity Summary</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Viewed Employees</span>
                <span className="text-sm font-semibold text-gray-900">
                  {employer.viewedEmployees?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Resume Downloads</span>
                <span className="text-sm font-semibold text-gray-900">
                  {employer.resumedownload?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">FCM Tokens</span>
                <span className="text-sm font-semibold text-gray-900">
                  {employer.employerfcmtoken?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600">
                  Total Subscriptions
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {employer.subscriptions?.length || 0}
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
                Edit Employer Details
              </button>
              {employer.blockstatus === "unblock" ? (
                <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center space-x-2">
                  <Lock size={18} />
                  <span>Block Employer</span>
                </button>
              ) : (
                <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center space-x-2">
                  <Unlock size={18} />
                  <span>Unblock Employer</span>
                </button>
              )}
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                View Job Postings
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                View Subscription History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewEmployer;
