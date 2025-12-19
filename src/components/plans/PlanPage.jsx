import React, { useEffect, useState } from "react";
import {
  getAllPlans,
  updatePlan,
  deletePlan,
} from "../../api/service/axiosService";
import { Pencil, Trash2, Check, X, XCircle, Save, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const PlanPage = () => {
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
      const response = await getAllPlans();
      if (response?.data?.success) {
        setPlans(response.data.data || []);
      } else {
        toast.error("Failed to fetch plans");
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
        "Are you sure you want to delete this plan? This action cannot be undone."
      )
    ) {
      try {
        const response = await deletePlan(id);
        if (response?.data?.success || response?.status === 200) {
          toast.success("Plan deleted successfully");
          setPlans(plans.filter((plan) => plan.id !== id && plan._id !== id));
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
    // Deep copy to avoid direct mutation issues during edit
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditModalOpen(true);
  };

  // Save Changes
  const handleSaveChanges = async () => {
    if (!editingPlan) return;

    try {
      const id = editingPlan.id || editingPlan._id;
      const response = await updatePlan(id, editingPlan);

      if (response?.data?.success || response?.status === 200) {
        toast.success("Plan updated successfully");
        setIsEditModalOpen(false);
        fetchPlans(); // Refresh to ensure sync
      } else {
        toast.error("Failed to update plan");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Error updating plan");
    }
  };

  // Field Update Helper
  const handleFieldChange = (e) => {
    const { name, value, type } = e.target;
    setEditingPlan((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  // Feature List Update Helper
  const handleFeatureTextChange = (index, value) => {
    const newFeatures = [...editingPlan.featuresList];
    newFeatures[index].text = value;
    setEditingPlan((prev) => ({ ...prev, featuresList: newFeatures }));
  };

  const handleFeatureToggle = (index) => {
    const newFeatures = [...editingPlan.featuresList];
    newFeatures[index].included = !newFeatures[index].included;
    setEditingPlan((prev) => ({ ...prev, featuresList: newFeatures }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
        <p className="text-gray-500 mt-2">
          Manage your subscription packages and features
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id || plan._id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col"
          >
            {/* Header Banner */}
            <div
              className="h-2"
              style={{ backgroundColor: plan.color || "#1976D2" }}
            />

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                    {plan.name}
                  </h2>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    {plan.validity}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {plan.isCustom
                      ? "Custom"
                      : `₹${plan.price?.toLocaleString()}`}
                  </p>
                  {!plan.isCustom && (
                    <p className="text-xs text-gray-500">+ GST</p>
                  )}
                </div>
              </div>

              <div className="my-4 border-t border-gray-100"></div>

              {/* Features List */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.featuresList?.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-sm text-gray-600"
                  >
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                    )}
                    <span
                      className={
                        feature.included ? "" : "text-gray-400 line-through"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditClick(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id || plan._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Edit Plan: {editingPlan.name}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingPlan.name}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editingPlan.price}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validity Text
                  </label>
                  <input
                    type="text"
                    name="validity"
                    value={editingPlan.validity}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Price Text
                  </label>
                  <input
                    type="text"
                    name="displayPrice"
                    value={editingPlan.displayPrice}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color (Hex)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="color"
                      value={editingPlan.color}
                      onChange={handleFieldChange}
                      className="h-10 w-12 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      name="color"
                      value={editingPlan.color}
                      onChange={handleFieldChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlan.isCustom}
                      onChange={(e) =>
                        setEditingPlan((prev) => ({
                          ...prev,
                          isCustom: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700 font-medium">
                      Is Custom Plan?
                    </span>
                  </label>
                </div>
              </div>

              {/* Features List Editor */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Features List
                </h3>
                <div className="space-y-3">
                  {editingPlan.featuresList?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <button
                        onClick={() => handleFeatureToggle(idx)}
                        className={`p-1.5 rounded-full ${
                          feature.included
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                        title="Toggle Included"
                      >
                        {feature.included ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </button>
                      <input
                        type="text"
                        value={feature.text}
                        onChange={(e) =>
                          handleFeatureTextChange(idx, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanPage;
