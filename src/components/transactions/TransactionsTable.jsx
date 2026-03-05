import React, { useEffect, useState } from "react";
import {
  getAllTransactions,
  deleteTransaction,
} from "../../api/service/axiosService";
import {
  Search,
  Filter,
  RefreshCcw,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getAllTransactions();
      if (res?.data?.success) {
        setTransactions(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await deleteTransaction(id);
        if (res?.data?.success) {
          Swal.fire("Deleted!", "Transaction has been deleted.", "success");
          fetchTransactions();
        } else {
          Swal.fire("Error!", "Failed to delete transaction.", "error");
        }
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Reset page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const filteredTransactions = transactions.filter((tx) => {
    const sTerm = searchTerm.toLowerCase();
    const matchesSearch =
      tx.orderId?.toLowerCase().includes(sTerm) ||
      tx.paymentId?.toLowerCase().includes(sTerm) ||
      (tx.candidateName || "").toLowerCase().includes(sTerm) ||
      (tx.companyName || "").toLowerCase().includes(sTerm) ||
      (tx.candidateEmail || "").toLowerCase().includes(sTerm) ||
      (tx.planType || "").toLowerCase().includes(sTerm);

    const statusMap = {
      created: ["created"],
      paid: ["paid", "success"],
      pending: ["pending"],
      failed: ["failed", "cancelled", "failure"],
    };

    const txStatus = (tx.status || "").toLowerCase();
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "created" && statusMap.created.includes(txStatus)) ||
      (activeTab === "paid" && statusMap.paid.includes(txStatus)) ||
      (activeTab === "pending" && statusMap.pending.includes(txStatus)) ||
      (activeTab === "failed" && statusMap.failed.includes(txStatus));

    return matchesSearch && matchesTab;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const stats = {
    total: transactions.reduce(
      (acc, curr) =>
        ["paid", "success"].includes((curr.status || "").toLowerCase())
          ? acc + (curr.amount || 0)
          : acc,
      0,
    ),
    count: transactions.length,
    created: transactions.filter(
      (t) => (t.status || "").toLowerCase() === "created",
    ).length,
    success: transactions.filter((t) =>
      ["paid", "success"].includes((t.status || "").toLowerCase()),
    ).length,
    pending: transactions.filter(
      (t) => (t.status || "").toLowerCase() === "pending",
    ).length,
    failed: transactions.filter((t) =>
      ["failed", "cancelled", "failure"].includes(
        (t.status || "").toLowerCase(),
      ),
    ).length,
  };

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
    return <Filter size={14} />;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            Detailed history of all platform payments
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-200"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Collected Revenue
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ₹{stats.total.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">
                {stats.created}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <CreditCard size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Success</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {stats.success}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {stats.pending}
              </h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Failed/Cancelled
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {stats.failed}
              </h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <XCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {["all", "created", "paid", "pending", "failed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                } capitalize`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search ID, Name, Plan..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-16 text-center">
                  #
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Transaction Info
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  User / Candidate
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Plan / Type
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="7" className="px-6 py-4">
                        <div className="h-12 bg-gray-100 rounded-xl"></div>
                      </td>
                    </tr>
                  ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <CreditCard size={48} className="mb-2 opacity-20" />
                      <p className="text-sm font-medium uppercase tracking-wider">
                        No matching transactions
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((tx, index) => {
                  const isEmployee = !!tx.employeeId;
                  const displayName =
                    tx.candidateName || tx.companyName || "Unknown Entity";
                  const displayEmail =
                    tx.candidateEmail ||
                    tx.companyEmail ||
                    tx.employeeId ||
                    tx.employerid ||
                    "N/A";

                  return (
                    <tr
                      key={tx._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm text-gray-400 font-medium text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tx.orderId || tx._id}
                          </span>
                          <div className="flex items-center text-[11px] text-gray-400 mt-1 uppercase font-semibold">
                            <Clock size={10} className="mr-1" />
                            {formatDate(tx.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${
                              isEmployee
                                ? "bg-blue-50 text-blue-600"
                                : "bg-purple-50 text-purple-600"
                            }`}
                          >
                            {isEmployee ? (
                              <User size={16} />
                            ) : (
                              <Briefcase size={16} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-tight">
                              {displayName}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {displayEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded w-fit uppercase mb-1">
                            {tx.planType || "Starter"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            {tx.type?.replace("_", " ") ||
                              (isEmployee ? "Employee Sub" : "Employer Sub")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-900">
                            ₹{tx.amount?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">
                            {tx.currency || "INR"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border tracking-wider uppercase ${getStatusStyle(
                            tx.status,
                          )}`}
                        >
                          {getStatusIcon(tx.status)}
                          <span className="ml-1.5">{tx.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(tx._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Transaction"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-sm text-gray-500 font-medium">
              Page{" "}
              <span className="text-gray-900 font-bold">{currentPage}</span> of{" "}
              <span className="text-gray-900 font-bold">{totalPages}</span>
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 self-center text-gray-400">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "border border-gray-200 hover:bg-white text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
