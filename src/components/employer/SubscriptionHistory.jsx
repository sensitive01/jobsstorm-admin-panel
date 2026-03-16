import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployerTransactions, getEmployerDetails } from "../../api/service/axiosService";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Calendar,
  DollarSign,
  Search,
  RefreshCcw,
  Building2
} from "lucide-react";

const SubscriptionHistory = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [txRes, empRes] = await Promise.all([
        getEmployerTransactions(empId),
        getEmployerDetails(empId)
      ]);

      if (txRes?.data?.success) {
        setTransactions(txRes.data.data);
      }
      if (empRes?.status === 200) {
        setEmployer(empRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscription history:", error);
    } finally {
      setLoading(false);
    }
  }, [empId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (["paid", "success"].includes(s))
      return "bg-green-100 text-green-700 border-green-200";
    if (["failed", "cancelled", "failure"].includes(s))
      return "bg-red-100 text-red-700 border-red-200";
    if (s === "pending")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s === "created")
      return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const s = (status || "").toLowerCase();
    if (["paid", "success"].includes(s)) return <CheckCircle size={14} />;
    if (["failed", "cancelled", "failure"].includes(s))
      return <XCircle size={14} />;
    if (s === "pending") return <Clock size={14} />;
    if (s === "created") return <CreditCard size={14} />;
    return <Clock size={14} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTransactions = transactions.filter((tx) => {
    const sTerm = searchTerm.toLowerCase();
    return (
      tx.orderId?.toLowerCase().includes(sTerm) ||
      tx.paymentId?.toLowerCase().includes(sTerm) ||
      (tx.planType || "").toLowerCase().includes(sTerm)
    );
  });

  const stats = {
    totalSpent: transactions.reduce(
      (acc, curr) =>
        ["paid", "success"].includes((curr.status || "").toLowerCase())
          ? acc + (curr.amount || 0)
          : acc,
      0
    ),
    activeSubscription: employer?.subscriptionActive || false,
    currentPlan: employer?.subscriptionleft > 0 ? "Premium" : "None",
    daysLeft: employer?.subscriptionleft || 0
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription History</h1>
            <p className="text-gray-600">
              {employer?.companyName || "Employer"} - Detailed billing history
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Spent</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Subscription Status</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className={`text-2xl font-bold ${stats.activeSubscription ? 'text-green-600' : 'text-red-500'}`}>
              {stats.activeSubscription ? 'Active' : 'Expired'}
            </h3>
            <div className={`p-2 rounded-lg ${stats.activeSubscription ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              <CheckCircle size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Days Remaining</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold text-blue-600">{stats.daysLeft} Days</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Company</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-lg font-bold text-purple-600 truncate mr-2">{employer?.companyName || "N/A"}</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Building2 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Transaction Logs</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search plan or ID..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Payment ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No transactions found for this employer.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{formatDate(tx.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-blue-600">{tx.orderId || tx._id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold uppercase">
                        {tx.planType || "Starter"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">
                      ₹{tx.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${getStatusStyle(tx.status)}`}>
                        {getStatusIcon(tx.status)}
                        <span className="ml-1.5">{tx.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {tx.paymentId || "Pending"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistory;
