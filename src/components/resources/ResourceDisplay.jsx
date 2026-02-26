import React, { useState, useEffect } from "react";
import {
  deleteResource,
  getAllResources,
} from "../../api/service/axiosService";
import { useNavigate } from "react-router-dom";
import fallbackImage from "../../../public/img-08.jpg";

const ResourceDisplay = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getAllResources();
      if (response.status === 200) {
        setResources(response.data.resources);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    navigate(`/admin/edit-resource/${resource._id}`);
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        const response = await deleteResource(resourceId);
        if (response.status === 200) {
          alert("Resource deleted successfully!");
          fetchResources();
        }
      } catch (error) {
        console.error("Error deleting resource:", error);
        alert("Failed to delete resource. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Resources</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage user resources (salary guides, interview questions, etc.)
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/resource-form")}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Add Resource
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        resource.image
                          ? resource.image.replace(/\.pdf$/i, ".jpg")
                          : fallbackImage
                      }
                      alt={resource.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {resource.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    {resource.link && (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 font-medium text-sm mb-4 inline-block hover:underline"
                      >
                        View External Link
                      </a>
                    )}

                    <div className="mt-auto flex space-x-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition duration-200 font-medium text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource._id)}
                        className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 font-medium text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 w-full text-gray-500">
                No resources available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDisplay;
