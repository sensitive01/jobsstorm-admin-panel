import React, { useEffect, useState } from "react";
import { addBlog, getblogById, updateBlog } from "../../api/service/axiosService";
import { uploadCloudinary } from "../../utils/cloudinaryConfig";
import { useParams, useNavigate } from "react-router-dom";

const BlogForm = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [fetchingBlog, setFetchingBlog] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        author: "",
        authorRole: "",
        image: null,
        authorImage: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [authorImagePreview, setAuthorImagePreview] = useState(null);

    // Store existing image URLs (for edit mode)
    const [existingImageUrl, setExistingImageUrl] = useState(null);
    const [existingAuthorImageUrl, setExistingAuthorImageUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (blogId) {
                setFetchingBlog(true);
                try {
                    const response = await getblogById(blogId);
                    if (response.data && response.data.blogs) {
                        const blog = response.data.blogs;

                        setFormData({
                            title: blog.title || "",
                            category: blog.category || "",
                            description: blog.description || "",
                            author: blog.author || "",
                            authorRole: blog.authorRole || "",
                            image: null,
                            authorImage: null,
                        });

                        // Set existing images
                        if (blog.image) {
                            setExistingImageUrl(blog.image);
                            setImagePreview(blog.image);
                        }

                        if (blog.authorImage) {
                            setExistingAuthorImageUrl(blog.authorImage);
                            setAuthorImagePreview(blog.authorImage);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching blog:", error);
                    alert("Failed to fetch blog details. Please try again.");
                } finally {
                    setFetchingBlog(false);
                }
            }
        };
        fetchData();
    }, [blogId]);

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

            setFormData({
                ...formData,
                image: file,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear existing image URL since we're uploading a new one
            setExistingImageUrl(null);
        }
    };

    const handleAuthorImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Author image size should be less than 2MB");
                return;
            }

            setFormData({
                ...formData,
                authorImage: file,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setAuthorImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear existing author image URL since we're uploading a new one
            setExistingAuthorImageUrl(null);
        }
    };

    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            image: null,
        });
        setImagePreview(null);
        setExistingImageUrl(null);
    };

    const handleRemoveAuthorImage = () => {
        setFormData({
            ...formData,
            authorImage: null,
        });
        setAuthorImagePreview(null);
        setExistingAuthorImageUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadingImages(true);

        try {
            let blogImageUrl = existingImageUrl || "";
            let authorImageUrl = existingAuthorImageUrl || "";

            // Upload blog image to Cloudinary if new file is selected
            if (formData.image) {
                const blogImageResponse = await uploadCloudinary(formData.image);
                blogImageUrl = blogImageResponse.url;
            }

            // Upload author image to Cloudinary if new file is selected
            if (formData.authorImage) {
                const authorImageResponse = await uploadCloudinary(formData.authorImage);
                authorImageUrl = authorImageResponse.url;
            }

            setUploadingImages(false);

            // Prepare data to send to backend
            const blogData = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                author: formData.author,
                authorRole: formData.authorRole,
                image: blogImageUrl,
                authorImage: authorImageUrl,
            };

            let response;
            if (blogId) {
                // Update existing blog
                response = await updateBlog(blogId, blogData);
            } else {
                // Create new blog
                response = await addBlog(blogData);
            }

            if (response.data && response.data.success) {
                alert(blogId ? "Blog updated successfully!" : "Blog added successfully!");

                // Reset form if creating new blog
                if (!blogId) {
                    setFormData({
                        title: "",
                        category: "",
                        description: "",
                        author: "",
                        authorRole: "",
                        image: null,
                        authorImage: null,
                    });
                    setImagePreview(null);
                    setAuthorImagePreview(null);
                    setExistingImageUrl(null);
                    setExistingAuthorImageUrl(null);
                }

                // Optionally navigate to blog list or detail page
                // navigate('/blogs');
            }
        } catch (error) {
            console.error(blogId ? "Error updating blog:" : "Error adding blog:", error);
            alert(blogId ? "Failed to update blog. Please try again." : "Failed to add blog. Please try again.");
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

    const handleReset = () => {
        if (blogId) {
            // If editing, fetch original data again
            window.location.reload();
        } else {
            // If creating new, clear form
            setFormData({
                title: "",
                category: "",
                description: "",
                author: "",
                authorRole: "",
                image: null,
                authorImage: null,
            });
            setImagePreview(null);
            setAuthorImagePreview(null);
            setExistingImageUrl(null);
            setExistingAuthorImageUrl(null);
        }
    };

    if (fetchingBlog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg
                        className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p className="text-gray-600 font-medium">Loading blog details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 text-center">
                            {blogId ? "Edit Blog Post" : "Create New Blog Post"}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {blogId ? "Update the details below to modify your blog" : "Fill in the details below to publish your blog"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Blog Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Blog Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="Enter an engaging blog title"
                            />
                        </div>

                        {/* Category and Author Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Product">Product</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Business">Business</option>
                                    <option value="Development">Development</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="author"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Author Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                    placeholder="Enter author name"
                                />
                            </div>
                        </div>

                        {/* Author Role */}
                        <div>
                            <label
                                htmlFor="authorRole"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Author Role <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="authorRole"
                                name="authorRole"
                                value={formData.authorRole}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="e.g., Product Manager, Fashion Designer"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Blog Content <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none resize-none"
                                placeholder="Write your blog content here..."
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                {formData.description.length} characters
                            </p>
                        </div>

                        {/* Image Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Blog Image */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Blog Cover Image <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="image"
                                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 relative"
                                        >
                                            {imagePreview ? (
                                                <>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRemoveImage();
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg
                                                        className="w-10 h-10 mb-3 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG or JPEG (MAX. 5MB)
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                required={!blogId && !imagePreview}
                                            />
                                        </label>
                                    </div>
                                    {formData.image && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Selected: {formData.image.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Author Image */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Author Photo <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="authorImage"
                                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 relative"
                                        >
                                            {authorImagePreview ? (
                                                <>
                                                    <img
                                                        src={authorImagePreview}
                                                        alt="Author Preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRemoveAuthorImage();
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg
                                                        className="w-10 h-10 mb-3 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG or JPEG (MAX. 2MB)
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id="authorImage"
                                                name="authorImage"
                                                accept="image/*"
                                                onChange={handleAuthorImageChange}
                                                className="hidden"
                                                required={!blogId && !authorImagePreview}
                                            />
                                        </label>
                                    </div>
                                    {formData.authorImage && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Selected: {formData.authorImage.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Upload Progress */}
                        {uploadingImages && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <svg
                                        className="animate-spin h-5 w-5 text-blue-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span className="text-blue-700 font-medium">
                                        Uploading images to cloud...
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {blogId ? "Reset Changes" : "Reset Form"}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>{blogId ? "Updating..." : "Publishing..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>{blogId ? "Update Blog" : "Publish Blog"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogForm;