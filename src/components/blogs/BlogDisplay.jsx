import React, { useState, useEffect } from "react";
// import { getAllBlogs, updateBlog, deleteBlog } from "../../api/service/axiosService";
import { uploadCloudinary } from "../../utils/cloudinaryConfig";
import { deleteBlog, getAllBlogs } from "../../api/service/axiosService";
import blogImage from "../../../public/img-08.jpg";
import authorImage from "../../../public/img-02.jpg";
import { useNavigate } from "react-router-dom";

const BlogDisplay = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

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

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await getAllBlogs();
            if (response.status === 200) {
                setBlogs(response.data.blogs);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

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
        }
    };

    const handleEdit = (blog) => {
        navigate(`/admin/edit-blog/${blog._id}`);
    };

    const handleDelete = async (blogId) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const response = await deleteBlog(blogId);
                if (response.status === 200) {
                    alert("Blog deleted successfully!");
                    fetchBlogs();
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
                alert("Failed to delete blog. Please try again.");
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadingImages(true);

        try {
            let blogImageUrl = editingBlog.image;
            let authorImageUrl = editingBlog.authorImage;

            // Upload new blog image if changed
            if (formData.image && typeof formData.image !== 'string') {
                const blogImageResponse = await uploadCloudinary(formData.image);
                blogImageUrl = blogImageResponse.url;
            }

            // Upload new author image if changed
            if (formData.authorImage && typeof formData.authorImage !== 'string') {
                const authorImageResponse = await uploadCloudinary(formData.authorImage);
                authorImageUrl = authorImageResponse.url;
            }

            setUploadingImages(false);

            const blogData = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                author: formData.author,
                authorRole: formData.authorRole,
                image: blogImageUrl,
                authorImage: authorImageUrl,
            };

            const response = await updateBlog(editingBlog._id, blogData);

            if (response.data && response.data.success) {
                alert("Blog updated successfully!");
                setShowEditModal(false);
                setEditingBlog(null);
                fetchBlogs();
                resetForm();
            }
        } catch (error) {
            console.error("Error updating blog:", error);
            alert("Failed to update blog. Please try again.");
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

    const resetForm = () => {
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
    };

    const closeModal = () => {
        setShowEditModal(false);
        setEditingBlog(null);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">All Blog Posts</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Browse and manage all your blog posts
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/blog-form')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Blog
                    </button>
                </div>

                {/* Blog Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Blog Image */}
                                <div className="relative h-48 overflow-hidden group">
                                    <img
                                        src={blogImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Blog Content */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition cursor-pointer">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {blog.description}
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                                        <img
                                            src={authorImage}
                                            alt={blog.author}
                                            className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{blog.author}</p>
                                            <p className="text-xs text-gray-500">{blog.authorRole}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition duration-200 font-medium"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 font-medium"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No blogs</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No blog posts available at the moment.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/admin/blog-form')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Blog
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Blog Post</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-6">
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
                                        Blog Cover Image
                                    </label>
                                    <div className="mt-1">
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="image"
                                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200"
                                            >
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
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
                                                            <span className="font-semibold">
                                                                Click to upload new image
                                                            </span>
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
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Author Image */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Author Photo
                                    </label>
                                    <div className="mt-1">
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="authorImage"
                                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200"
                                            >
                                                {authorImagePreview ? (
                                                    <img
                                                        src={authorImagePreview}
                                                        alt="Author Preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
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
                                                            <span className="font-semibold">
                                                                Click to upload new image
                                                            </span>
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
                                                />
                                            </label>
                                        </div>
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
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
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
                                            <span>Updating...</span>
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
                                            <span>Update Blog</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDisplay;