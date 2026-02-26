import React, { useEffect, useState } from "react";
import {
  getAllEmployerPlans,
  updateEmployerPlan,
  deleteEmployerPlan,
  createEmployerPlan,
} from "../../api/service/axiosService";
import {
  Pencil,
  Trash2,
  Check,
  X,
  XCircle,
  Save,
  Loader2,
  Plus,
  Zap,
  Star,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";

// Mapping icons for dynamic rendering based on the schema's "iconType" enum
const ICON_MAP = {
  bolt: { component: Zap, bgColor: "bg-blue-50", color: "text-blue-500" },
  star: { component: Star, bgColor: "bg-orange-50", color: "text-orange-400" },
  shield: {
    component: Shield,
    bgColor: "bg-purple-50",
    color: "text-purple-500",
  },
};

const EmployerPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const plansRes = await getAllEmployerPlans();
      const planData = plansRes?.data?.data || plansRes?.data || [];
      if (Array.isArray(planData)) {
        setPlans(planData);
      } else {
        console.error("Unexpected plan data structure", plansRes);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Error loading plans");
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this plan? This action cannot be undone.",
      )
    ) {
      try {
        const response = await deleteEmployerPlan(id);
        if (response?.data?.success || response?.status === 200) {
          toast.success("Plan deleted successfully");
          fetchPlans();
        } else {
          toast.error("Failed to delete plan");
        }
      } catch (error) {
        console.error("Error deleting plan:", error);
        toast.error("Error deleting plan");
      }
    }
  };

  // Edit Handler - Open Modal
  const handleEditClick = (plan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingPlan({
      name: "",
      tagline: "",
      iconType: "bolt",
      isPopular: false,
      buttonText: "",
      billingCycle: "monthly",
      price: "",
      validityDays: 30, // Default to a month
      perDayLimit: "",
      profileViews: "",
      downloadResume: "",
      jobPostingLimit: "",
      featuresList: [],
      // Keep legacy properties initialized so backend validations don't fail
      verifiedCandidateAccess: false,
      candidatesLiveChat: false,
      hasAds: true,
      hasDRM: false,
      accessToWebinars: false,
      interviewType: "Standard",
      accessToRecruitmentFair: true,
      customerSupport: true,
      fastTrackSupport: false,
      isActive: true,
    });
    setIsEditModalOpen(true);
  };

  // Save Changes
  const handleSaveChanges = async () => {
    if (!editingPlan) return;

    const payload = { ...editingPlan };

    // Set empty inputs to 0 gracefully before sending to backend API
    const numberFields = [
      "price",
      "validityDays",
      "jobPostingLimit",
      "profileViews",
      "downloadResume",
      "perDayLimit",
    ];
    numberFields.forEach((field) => {
      if (payload[field] === "") payload[field] = 0;
    });

    // Auto-compute validityDays based on the billing cycle selection if it matches 30/365 rules
    if (payload.billingCycle === "monthly" && payload.validityDays === 365) {
      payload.validityDays = 30;
    } else if (
      payload.billingCycle === "yearly" &&
      payload.validityDays === 30
    ) {
      payload.validityDays = 365;
    }

    try {
      const id = payload.id || payload._id;
      let response;
      if (id) {
        response = await updateEmployerPlan(id, payload);
      } else {
        response = await createEmployerPlan(payload);
      }

      if (
        response?.data?.success ||
        response?.status === 200 ||
        response?.status === 201
      ) {
        toast.success(
          id ? "Plan updated successfully" : "Plan created successfully",
        );
        setIsEditModalOpen(false);
        fetchPlans();
      } else {
        toast.error(id ? "Failed to update plan" : "Failed to create plan");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Error saving plan structure",
      );
    }
  };

  // Field Update Helper
  const handleFieldChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      value = checked;
    } else if (type === "number") {
      // Allows user to natively backspace/delete the '0' to safely type new numbers
      value = value === "" ? "" : parseFloat(value);
    }

    setEditingPlan((prev) => {
      const newState = { ...prev, [name]: value };
      // Convenience: auto-adjust days if they strictly toggle the dropdown
      if (name === "billingCycle") {
        if (value === "monthly") newState.validityDays = 30;
        else if (value === "yearly") newState.validityDays = 365;
      }
      return newState;
    });
  };

  // Custom Feature List Mappers
  const handleFeatureTextChange = (index, value) => {
    const newFeatures = [...(editingPlan.featuresList || [])];
    newFeatures[index] = { ...newFeatures[index], text: value };
    setEditingPlan((prev) => ({ ...prev, featuresList: newFeatures }));
  };

  const handleFeatureToggle = (index) => {
    const newFeatures = [...(editingPlan.featuresList || [])];
    newFeatures[index] = {
      ...newFeatures[index],
      included: !newFeatures[index].included,
    };
    setEditingPlan((prev) => ({ ...prev, featuresList: newFeatures }));
  };

  const addFeatureRow = () => {
    const newFeatures = [...(editingPlan.featuresList || [])];
    newFeatures.push({ text: "", included: true });
    setEditingPlan((prev) => ({ ...prev, featuresList: newFeatures }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Employer Pricing Plans
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Manage the frontend display cards, features, and limits for employer
            subscriptions.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
        >
          <Plus size={18} /> Add New Plan
        </button>
      </div>

      {/* Plans Rendered Similarly to User Facing Frontend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const iconConfig = ICON_MAP[plan.iconType] || ICON_MAP.bolt;
          const IconComp = iconConfig.component;

          let cycleLabel = "";
          if (plan.billingCycle === "monthly") cycleLabel = "/mo";
          else if (plan.billingCycle === "yearly") cycleLabel = "/yr";
          else if (plan.validityDays) cycleLabel = `/${plan.validityDays}d`;

          return (
            <div
              key={plan.id || plan._id}
              className={`relative bg-white rounded-3xl p-8 flex flex-col hover:shadow-2xl transition-all duration-300 border ${
                plan.isPopular
                  ? "border-indigo-500 shadow-xl shadow-indigo-500/10"
                  : "border-slate-200 shadow-lg shadow-slate-200/50"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider z-10 uppercase shadow-md shadow-indigo-500/30">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${iconConfig.bgColor}`}
              >
                <IconComp size={24} className={iconConfig.color} />
              </div>

              {/* Title & Tagline */}
              <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                {plan.name}
              </h2>
              <p className="text-slate-500 text-sm mb-6 min-h-[40px] leading-relaxed">
                {plan.tagline}
              </p>

              {/* Price */}
              <div className="flex items-baseline mb-8">
                <span className="text-slate-900 text-4xl font-extrabold tracking-tight">
                  ₹{plan.price?.toLocaleString()}
                </span>
                {plan.price > 0 && (
                  <span className="text-slate-500 ml-1 text-sm font-medium">
                    {cycleLabel}
                  </span>
                )}
              </div>

              {/* Features List Base - Mapping over arbitrary text features */}
              <ul className="space-y-4 mb-8 flex-1">
                {plan.jobPostingLimit > 0 && (
                  <li className="flex items-start">
                    <Check
                      className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-slate-700 font-bold">
                      {plan.jobPostingLimit} Active Job Posts
                    </span>
                  </li>
                )}
                {plan.profileViews > 0 && (
                  <li className="flex items-start">
                    <Check
                      className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-slate-700 font-bold">
                      {plan.profileViews} Profile Views
                    </span>
                  </li>
                )}
                {plan.downloadResume > 0 && (
                  <li className="flex items-start">
                    <Check
                      className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-slate-700 font-bold">
                      {plan.downloadResume} Resume Downloads
                    </span>
                  </li>
                )}
                {plan.perDayLimit > 0 && (
                  <li className="flex items-start">
                    <Check
                      className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-slate-700 font-bold">
                      {plan.perDayLimit} Actions Limit / Day
                    </span>
                  </li>
                )}

                {/* Dynamically typed bullet points */}
                {(plan.featuresList || []).map((feat, idx) => (
                  <li key={idx} className="flex items-start">
                    {feat.included ? (
                      <Check
                        className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <X
                        className="w-5 h-5 text-slate-300 mr-3 shrink-0"
                        strokeWidth={2.5}
                      />
                    )}
                    <span
                      className={`text-sm ${feat.included ? "text-slate-700 font-medium" : "text-slate-400 line-through"}`}
                    >
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button Preview */}
              {plan.buttonText && (
                <button
                  disabled
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                    plan.isPopular
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : plan.buttonText === "Contact Sales"
                        ? "bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-300"
                        : "bg-slate-50 text-slate-900 border border-slate-200"
                  }`}
                >
                  {plan.buttonText}
                </button>
              )}

              {/* Admin Actions overlay on hover or below */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleEditClick(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold text-xs"
                >
                  <Pencil size={14} /> Edit Data
                </button>
                <button
                  onClick={() => handleDelete(plan.id || plan._id)}
                  className="w-12 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Edit Form Modal */}
      {isEditModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-20">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                  <Pencil size={18} />
                </div>
                {editingPlan._id
                  ? `Edit Employer Plan: ${editingPlan.name}`
                  : "Create New Employer Plan"}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto">
              {/* Left Column Strategy: Visual Elements */}
              <div className="flex-1 space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                    1. Visual Branding
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editingPlan.name}
                        onChange={handleFieldChange}
                        placeholder="e.g. Startup, Growth..."
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        Tagline
                      </label>
                      <input
                        type="text"
                        name="tagline"
                        value={editingPlan.tagline || ""}
                        onChange={handleFieldChange}
                        placeholder="Perfect for small teams just getting started."
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editingPlan.price}
                          onChange={handleFieldChange}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none text-sm font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                          Billing Cycle
                        </label>
                        <select
                          name="billingCycle"
                          value={editingPlan.billingCycle || "monthly"}
                          onChange={handleFieldChange}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium cursor-pointer"
                        >
                          <option value="monthly">Monthly (/mo)</option>
                          <option value="yearly">Yearly (/yr)</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        Icon Theme
                      </label>
                      <select
                        name="iconType"
                        value={editingPlan.iconType || "bolt"}
                        onChange={handleFieldChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium cursor-pointer"
                      >
                        <option value="bolt">⚡ Lightening (Blue)</option>
                        <option value="star">⭐ Star (Orange)</option>
                        <option value="shield">🛡️ Shield (Purple)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Features Customizer */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      2. Display Bullet Points
                    </h3>
                    <button
                      type="button"
                      onClick={addFeatureRow}
                      className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} /> Add Row
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(editingPlan.featuresList || []).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200"
                      >
                        <button
                          onClick={() => handleFeatureToggle(idx)}
                          className={`p-2 rounded-lg transition-colors ${
                            feature.included
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                          title={
                            feature.included
                              ? "Feature Included"
                              : "Feature Excluded"
                          }
                        >
                          {feature.included ? (
                            <Check size={16} strokeWidth={3} />
                          ) : (
                            <X size={16} strokeWidth={3} />
                          )}
                        </button>
                        <input
                          type="text"
                          value={feature.text}
                          onChange={(e) =>
                            handleFeatureTextChange(idx, e.target.value)
                          }
                          placeholder="Type feature bullet point..."
                          className="flex-1 px-3 py-2 text-sm focus:outline-none placeholder-slate-300 text-slate-700 font-medium bg-transparent"
                        />
                        <button
                          onClick={() => {
                            const newList = [...editingPlan.featuresList];
                            newList.splice(idx, 1);
                            setEditingPlan({
                              ...editingPlan,
                              featuresList: newList,
                            });
                          }}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {(!editingPlan.featuresList ||
                      editingPlan.featuresList.length === 0) && (
                      <p className="text-xs text-center text-slate-400 py-4 italic">
                        No bullet points added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column Strategy: Underlying Limits & API logic */}
              <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Backend Limits
                    </h3>
                    <label className="flex items-center space-x-2 cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      <input
                        type="checkbox"
                        name="isPopular"
                        checked={editingPlan.isPopular || false}
                        onChange={handleFieldChange}
                        className="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
                        Mark Most Popular
                      </span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                        Validity (Days)
                      </label>
                      <input
                        type="number"
                        name="validityDays"
                        value={editingPlan.validityDays}
                        onChange={handleFieldChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                        Job Posting Cap
                      </label>
                      <input
                        type="number"
                        name="jobPostingLimit"
                        value={editingPlan.jobPostingLimit}
                        onChange={handleFieldChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                        Resume Profile Data Views
                      </label>
                      <input
                        type="number"
                        name="profileViews"
                        value={editingPlan.profileViews}
                        onChange={handleFieldChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                        Resume Download Limit
                      </label>
                      <input
                        type="number"
                        name="downloadResume"
                        value={editingPlan.downloadResume}
                        onChange={handleFieldChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                        Per Day Action Throttle Limit
                      </label>
                      <input
                        type="number"
                        name="perDayLimit"
                        value={editingPlan.perDayLimit}
                        onChange={handleFieldChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                        Support Type Enum
                      </label>
                      <input
                        type="text"
                        name="interviewType"
                        value={editingPlan.interviewType}
                        onChange={handleFieldChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Developer / Misc Toggles */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                    Toggle Metadata
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: "isActive", label: "Globally Active" },
                      {
                        name: "verifiedCandidateAccess",
                        label: "Access Verified Users",
                      },
                      {
                        name: "candidatesLiveChat",
                        label: "Live Chat Unlocked",
                      },
                      { name: "hasAds", label: "Show AdSense Defaults" },
                    ].map((toggle) => (
                      <label
                        key={toggle.name}
                        className="flex items-center space-x-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          name={toggle.name}
                          checked={editingPlan[toggle.name]}
                          onChange={handleFieldChange}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-xs font-semibold text-slate-600">
                          {toggle.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur z-20">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm tracking-wide"
              >
                <Save size={18} />{" "}
                {editingPlan._id ? "Update Plan" : "Save Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerPlanPage;
