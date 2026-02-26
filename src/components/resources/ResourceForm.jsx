import React, { useEffect, useState } from "react";
import {
  addResource,
  getResourceById,
  updateResource,
} from "../../api/service/axiosService";
import { uploadCloudinary } from "../../utils/cloudinaryConfig";
import { useParams, useNavigate } from "react-router-dom";
import fallbackImage from "../../../public/img-08.jpg";

const ResourceForm = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [fetchingResource, setFetchingResource] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    link: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (resourceId) {
        setFetchingResource(true);
        try {
          const response = await getResourceById(resourceId);
          if (response.data && response.data.resource) {
            const resource = response.data.resource;

            setFormData({
              title: resource.title || "",
              category: resource.category || "",
              description: resource.description || "",
              link: resource.link || "",
              image: null,
            });

            if (resource.image) {
              setExistingImageUrl(resource.image);
              setImagePreview(resource.image);
            }
          }
        } catch (error) {
          console.error("Error fetching resource:", error);
          alert("Failed to fetch resource details. Please try again.");
        } finally {
          setFetchingResource(false);
        }
      }
    };
    fetchData();
  }, [resourceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert(
          "Please upload a valid image file (JPG, PNG, WebP) for the Cover Image, not a document or PDF.",
        );
        e.target.value = ""; // Clear the input
        return;
      }

      setFormData({
        ...formData,
        image: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setExistingImageUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadingImages(true);

    try {
      let resourceImageUrl = existingImageUrl || "";

      if (formData.image) {
        const imageResponse = await uploadCloudinary(formData.image);
        resourceImageUrl = imageResponse.url;
      }

      setUploadingImages(false);

      const resourceData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        link: formData.link,
        image: resourceImageUrl,
      };

      let response;
      if (resourceId) {
        response = await updateResource(resourceId, resourceData);
      } else {
        response = await addResource(resourceData);
      }

      if (response.data && response.data.success) {
        alert(
          resourceId
            ? "Resource updated successfully!"
            : "Resource added successfully!",
        );

        if (!resourceId) {
          setFormData({
            title: "",
            category: "",
            description: "",
            link: "",
            image: null,
          });
          setImagePreview(null);
          setExistingImageUrl(null);
        }
        navigate("/admin/resources");
      }
    } catch (error) {
      console.error(
        resourceId ? "Error updating resource:" : "Error adding resource:",
        error,
      );
      alert(
        resourceId
          ? "Failed to update resource. Please try again."
          : "Failed to add resource. Please try again.",
      );
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleReset = () => {
    if (resourceId) {
      window.location.reload();
    } else {
      setFormData({
        title: "",
        category: "",
        description: "",
        link: "",
        image: null,
      });
      setImagePreview(null);
      setExistingImageUrl(null);
    }
  };

  if (fetchingResource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">
            Loading resource details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div
            className="mb-8 flex align-items-center cursor-pointer text-indigo-600 font-bold"
            onClick={() => navigate("/admin/resources")}
          >
            ← Back to Resources
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              {resourceId ? "Edit Resource" : "Create New Resource"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Salary Advice">Salary Advice</option>
                  <option value="Resume Building">Resume Building</option>
                  <option value="Career Path">Career Path</option>
                  <option value="Industry Trends">Industry Trends</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link/URL
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                  placeholder="e.g. https://www.google.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image
              </label>
              <div className="mt-1">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImage;
                        }}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="font-semibold">Click to upload</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={!resourceId && !imagePreview}
                  />
                </label>
              </div>
            </div>

            {uploadingImages && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 font-medium">
                Uploading image to cloud...
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6 mt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg"
              >
                {loading
                  ? "Saving..."
                  : resourceId
                    ? "Update Resource"
                    : "Create Resource"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
