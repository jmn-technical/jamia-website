/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cookies from "js-cookie";
import AdminNav from "../../../../../components/AdminNav";
import { ArrowLeft, Upload, Save, Eye } from "lucide-react";
import dynamic from "next/dynamic";

// Import React Quill dynamically (if you're using it)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditNews() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    imgId: "",
    isPublished: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [originalImageId, setOriginalImageId] = useState("");
  
  const router = useRouter();
  const { id } = router.query;
  const fileInputRef = useRef(null);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Check admin authentication
  useEffect(() => {
    const adminUser = cookies.get("admin");
    if (adminUser === "false") {
      router.push("/admin/Login");
    }
  }, [router]);

  // Fetch news data
  useEffect(() => {
    if (id) {
      fetchNewsData();
    }
  }, [id]);

  const fetchNewsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const { data } = await res.json();
      setFormData({
        title: data.title || "",
        content: data.content || "",
        image: data.image || "",
        imgId: data.imgId || "",
        isPublished: data.isPublished || false,
      });
      setImagePreview(data.image || "");
      setOriginalImageId(data.imgId || "");
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return { url: formData.image, publicId: formData.imgId };

    const imageData = new FormData();
    imageData.append("file", imageFile);
    imageData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    imageData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: imageData,
        }
      );

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();
      
      // Delete old image if exists and new image uploaded
      if (originalImageId && originalImageId !== formData.imgId) {
        await fetch("/api/deleteImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: originalImageId }),
        });
      }

      return { url: data.secure_url, publicId: data.public_id };
    } catch (error) {
      throw new Error("Failed to upload image: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!formData.content.trim()) {
      alert("Please enter content");
      return;
    }

    setSubmitting(true);
    try {
      // Upload new image if selected
      const { url: imageUrl, publicId } = await uploadImage();

      const updateData = {
        title: formData.title,
        content: formData.content,
        image: imageUrl,
        imgId: publicId,
        isPublished: formData.isPublished,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      alert("News updated successfully!");
      router.push("/admin/dashboard/news");
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    
    window.addEventListener('sidebarToggle', handleSidebarChange);
    return () => window.removeEventListener('sidebarToggle', handleSidebarChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0' : 'ml-0 md:ml-[280px] lg:ml-[280px]'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/admin/dashboard/news">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to News List</span>
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit News Article</h1>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading news article...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">Error: {error}</p>
              <button 
                onClick={fetchNewsData}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* Form */}
          {!loading && !error && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter news title"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </button>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={modules}
                  className="h-96 mb-16"
                />
              </div>

              {/* Publish Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Publish this article
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap gap-3 justify-end">
                  <Link href="/admin/dashboard/news">
                    <button
                      type="button"
                      className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </Link>
                  <Link href={`/admin/dashboard/news/View/${id}`}>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {submitting ? "Updating..." : "Update Article"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}