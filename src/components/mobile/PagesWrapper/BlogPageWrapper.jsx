"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignInButton } from "@clerk/clerk-react";
import {
  ArrowLeft, Search, Calendar, User, Clock, Tag, Heart, Share2,
  Bookmark, TrendingUp, Filter, Eye, ArrowRight,
  Star, Mail, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight,
  Loader2, BookOpen, Pen, AlertTriangle, Check, Upload, ImageIcon, Link,
  ImagePlus, Send,
} from "lucide-react";
import SmartMedia from "../SmartMediaLoader";

const MediaRenderer = ({ src, alt, className, ...props }) => {
  if (src?.startsWith("data:") || src?.startsWith("blob:")) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
      </div>
    );
  }
  return <SmartMedia src={src} alt={alt} className={className} {...props} />;
};

const CATEGORIES = [
  { id: "all", name: "All", emoji: "✨" },
  { id: "wedding", name: "Wedding", emoji: "💍" },
  { id: "birthday", name: "Birthday", emoji: "🎂" },
  { id: "corporate", name: "Corporate", emoji: "💼" },
  { id: "anniversary", name: "Anniversary", emoji: "🌹" },
  { id: "tips", name: "Planning Tips", emoji: "💡" },
  { id: "other", name: "Other", emoji: "📝" },
];

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const MobileBlogCard = ({ post, currentUserId, onEdit, onDelete }) => {
  const router = useRouter();
  const isOwner = currentUserId && post.authorClerkId === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => router.push(`/about/blogs/${post._id}`)}
      className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm mb-5 active:scale-[0.98] transition-transform"
    >
      <div className="relative aspect-[16/10] bg-gray-100">
        <MediaRenderer 
          src={post.coverImage} 
          className="w-full h-full object-cover" 
          alt={post.title} 
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {isOwner && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onEdit(post); }} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"><Edit2 size={14} className="text-gray-700"/></button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(post); }} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"><Trash2 size={14} className="text-red-500"/></button>
            </>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {post.title}
        </h3>
        <div className="flex items-center justify-between text-gray-400 text-[11px] font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Heart size={12} className={post.likeCount > 0 ? "text-pink-500 fill-current" : ""}/> {post.likeCount || 0}</span>
            <span className="flex items-center gap-1"><Eye size={12}/> {post.viewCount || 0}</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar size={12}/> {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const BlogFormModal = ({ isOpen, onClose, onSubmit, editingBlog, loading }) => {
  const [form, setForm] = useState({ title: "", category: "wedding", excerpt: "", content: "", coverImage: "", tags: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (editingBlog) {
      setForm({
        title: editingBlog.title || "",
        category: editingBlog.category || "wedding",
        excerpt: editingBlog.excerpt || "",
        content: editingBlog.content || "",
        coverImage: editingBlog.coverImage || "",
        tags: editingBlog.tags?.join(", ") || "",
      });
      setImagePreview(editingBlog.coverImage || "");
    } else {
      setForm({ title: "", category: "wedding", excerpt: "", content: "", coverImage: "", tags: "" });
      setImagePreview("");
    }
  }, [editingBlog, isOpen]);

  const uploadToImageKit = async (file) => {
    setImageUploading(true);
    setUploadError("");
    try {
      const authRes = await fetch("/api/imagekit/auth");
      const auth = await authRes.json();
      if (!auth.signature) throw new Error("Auth failed");

      const fd = new FormData();
      fd.append("file", file);
      fd.append("fileName", `blog_cover_${Date.now()}`);
      fd.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
      fd.append("signature", auth.signature);
      fd.append("expire", auth.expire);
      fd.append("token", auth.token);
      fd.append("folder", "/planwab/blogs");

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: fd,
      });

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.message || "Upload failed");

      setForm((f) => ({ ...f, coverImage: uploadJson.url }));
      setImagePreview(uploadJson.url);
    } catch (err) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return setUploadError("Please select an image.");
      uploadToImageKit(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSubmit({
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 250 }}
        className="fixed inset-0 z-[100] bg-white flex flex-col"
      >
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 h-16 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 active:scale-90 transition-transform">
            <X size={24} className="text-gray-900" />
          </button>
          <span className="font-extrabold text-[13px] uppercase tracking-[0.2em] text-gray-500">
            {editingBlog ? "Edit Story" : "New Story"}
          </span>
          <button 
            onClick={handleSubmit}
            disabled={loading || imageUploading || !form.title.trim()}
            className="h-10 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-200 active:scale-95 disabled:opacity-30 disabled:shadow-none transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {editingBlog ? "Save" : "Publish"}
          </button>
        </div>

        <form className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-32">
          <div className="relative group">
            <div className={`relative aspect-[16/10] bg-gray-50 rounded-[40px] overflow-hidden border-2 border-dashed transition-all duration-300 ${imagePreview ? "border-transparent" : "border-gray-200"}`}>
              {imagePreview ? (
                <>
                  <MediaRenderer src={imagePreview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(""); setForm(f => ({ ...f, coverImage: "" })); }}
                    className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 active:scale-90 transition-transform"
                  >
                    <X size={24} />
                  </button>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-xl shadow-gray-200/50 group-active:scale-95 transition-transform border border-gray-50">
                    {imageUploading ? <Loader2 size={28} className="animate-spin text-pink-500" /> : <ImagePlus size={28} className="text-pink-500" />}
                  </div>
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em]">
                    {imageUploading ? "Processing..." : "Add Featured Media"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
            {uploadError && <p className="mt-3 text-center text-red-500 text-[10px] font-black uppercase tracking-widest">{uploadError}</p>}
          </div>

          <div className="space-y-6">
            <textarea
              placeholder="Title your story..."
              rows={2}
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full text-4xl font-black placeholder:text-gray-300 border-none focus:ring-0 p-0 resize-none leading-[1.1] text-black"
            />

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                  className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${form.category === cat.id ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-gray-100 text-gray-500'}`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-50 w-full" />

          <textarea
            placeholder="Tell your story..."
            rows={15}
            value={form.content}
            onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            className="w-full text-xl placeholder:text-gray-300 border-none focus:ring-0 p-0 resize-none leading-relaxed text-gray-800 font-medium"
          />

          <div className="bg-gray-50 rounded-[40px] p-8 space-y-8">
            <div>
               <label className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">
                 <Tag size={14} className="text-pink-500" /> Tags
               </label>
               <input 
                type="text" 
                placeholder="Ex. travel, wedding, lifestyle"
                value={form.tags}
                onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 outline-none shadow-sm placeholder:text-gray-400"
               />
            </div>
            
            <div className="pt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                <AlertTriangle size={20} />
              </div>
                <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-wide">
                  Please ensure your content follows our community guidelines before publishing.
                </p>
            </div>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

const DeleteConfirmModal = ({ blog, onConfirm, onClose, loading }) => {
  if (!blog) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end justify-center"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full rounded-t-[40px] p-10 pb-12 shadow-2xl"
      >
        <div className="w-20 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h3 className="text-xl font-black text-gray-900 text-center mb-2 leading-tight">Delete Story?</h3>
        <p className="text-gray-500 text-center mb-10 text-sm font-medium px-4">
          Are you sure you want to delete <span className="text-gray-900">"{blog.title}"</span>? This cannot be undone.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onConfirm(blog._id)}
            className="w-full py-5 bg-red-500 text-white rounded-[24px] font-black uppercase tracking-widest text-sm shadow-xl shadow-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
          </button>
          <button 
            onClick={onClose} 
            className="w-full py-5 bg-gray-50 text-gray-500 rounded-[24px] font-black uppercase tracking-widest text-sm active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BlogPageWrapper = () => {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle"); // idle, loading, success, error
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [pagination, setPagination] = useState({ totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [categoryCounts, setCategoryCounts] = useState({});

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBlogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/blogs?page=${page}&limit=10`;
      if (selectedCategory !== "all") url += `&category=${selectedCategory}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;

      const res = await fetch(url);
      const result = await res.json();

      if (result.success) {
        setBlogs(result.data);
        setPagination(result.pagination);
        setCategoryCounts(result.categoryCounts || {});
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [fetchBlogs, currentPage]);

  const handleFormSubmit = async (formData) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const isEditing = !!editingBlog;
      const url = isEditing ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "x-clerk-user-id": user.id },
        body: JSON.stringify({
          ...formData,
          authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
          authorPhoto: user.imageUrl || null,
          authorClerkId: user.id,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      showToast(isEditing ? "Updated! 🎉" : "Published! 🎉");
      setShowCreateModal(false);
      setEditingBlog(null);
      fetchBlogs(currentPage);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs(p => p.filter(b => b._id !== id));
        setDeletingBlog(null);
        showToast("Deleted post");
      } else {
        const json = await res.json();
        throw new Error(json.message);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail,
          visitedUrl: window.location.href,
          clerkId: user?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus("success");
        setNewsletterMsg(data.message);
        setNewsletterEmail("");
        // Show success for 5 seconds then reset to idle
        setTimeout(() => setNewsletterStatus("idle"), 5000);
      } else {
        setNewsletterStatus("error");
        setNewsletterMsg(data.message);
        setTimeout(() => setNewsletterStatus("idle"), 5000);
      }
    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterMsg("Failed to subscribe. Please try again.");
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    }
  };

  const openEdit = (post) => {
    setEditingBlog(post);
    setShowCreateModal(true);
  };

  const categories = [
    { id: "wedding", name: "Wedding", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/wedding_cat_eQikY7JCR.png" },
    { id: "birthday", name: "Birthday", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/birthday_cat_ZFWlGHwqe.png" },
    { id: "anniversary", name: "Anniversary", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/anniversary_cat_eFoyx_1cB.png" },
    { id: "corporate", name: "Corporate", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/corporate_cat_ig5vMcWDn.png" },
    { id: "other", name: "Others", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/others_cat_2tkC8vg-0.png" },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl text-sm font-black flex items-center gap-2.5 whitespace-nowrap ${toast.type === "error" ? "bg-red-500 text-white" : "bg-gray-900 text-white"}`}
          >
            {toast.type === "error" ? <AlertTriangle size={18} /> : <Check size={18} className="text-green-400" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 active:scale-90 transition-transform">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <span className="font-black text-lg tracking-tight">PlanWAB Blog</span>
          <div className="w-10 flex justify-end">
            {isSignedIn && (
              <button 
                onClick={() => { setEditingBlog(null); setShowCreateModal(true); }}
                className="w-10 h-10 bg-[#FF1A75] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>
        
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search stories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-pink-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="px-5 pt-8">
        <div className="mb-10">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Explore Categories</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                className={`flex-shrink-0 w-32 h-44 rounded-[28px] overflow-hidden relative shadow-sm active:scale-[0.95] transition-all duration-300 ${selectedCategory === cat.id ? "ring-2 ring-pink-500 ring-offset-2" : ""}`}
              >
                <SmartMedia src={cat.image} className="absolute inset-0 w-full h-full object-cover" alt={cat.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-sm font-black leading-tight text-center">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 leading-none mb-2">Popular Articles</h2>
            <div className="w-12 h-1.5 bg-[#FF1A75] rounded-full" />
          </div>
          <TrendingUp className="text-pink-500 mb-2" size={24} />
        </div>

        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-[24px] h-[300px] w-full" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-gray-50 rounded-[32px]">
            <p className="text-gray-500 mb-5">{error}</p>
            <button onClick={() => fetchBlogs(currentPage)} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold">Try Again</button>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-[32px]">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-5" />
            <h3 className="text-xl font-bold text-gray-900">No articles found</h3>
            <p className="text-gray-500 text-sm px-10">Try a different category or search term.</p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="space-y-2">
            {blogs.map(post => (
              <MobileBlogCard 
                key={post._id} 
                post={post} 
                currentUserId={user?.id}
                onEdit={openEdit}
                onDelete={setDeletingBlog}
              />
            ))}
          </div>
        )}

        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-4">
            <button 
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-4 font-bold text-gray-900">
              {currentPage} / {pagination.totalPages}
            </div>
            <button 
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {!loading && (
        <div className="mx-5 mt-16 p-8 bg-gradient-to-br from-[#FF1A75] to-[#D81B60] rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-pink-200">
          <div className="relative z-10 text-center">
             <Mail size={32} className="mx-auto mb-4 opacity-50" />
             <h3 className="text-2xl font-black mb-3 leading-tight">Stay Inspired</h3>
             <p className="text-white/80 text-sm mb-8 leading-relaxed">Join 50k+ readers getting weekly event planning tips.</p>
              <div className="space-y-4">
                <form onSubmit={handleNewsletterSubscribe} className="space-y-4">
                  <input 
                    type="email" 
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address" 
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-sm placeholder:text-white/60 text-white outline-none focus:border-white/40 transition-colors" 
                  />
                  <button 
                    type="submit"
                    disabled={newsletterStatus === "loading"}
                    className="w-full bg-white text-[#FF1A75] font-black py-4 rounded-2xl shadow-xl shadow-black/10 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                  >
                    {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe Now"}
                  </button>
                </form>
                {newsletterStatus !== "idle" && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs font-bold mt-4 ${newsletterStatus === "success" ? "text-green-300" : "text-yellow-200"}`}
                  >
                    {newsletterMsg}
                  </motion.p>
                )}
              </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <BlogFormModal
            isOpen={showCreateModal}
            onClose={() => { setShowCreateModal(false); setEditingBlog(null); }}
            onSubmit={handleFormSubmit}
            editingBlog={editingBlog}
            loading={actionLoading}
          />
        )}
        {deletingBlog && (
          <DeleteConfirmModal
            blog={deletingBlog}
            onConfirm={handleDelete}
            onClose={() => setDeletingBlog(null)}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPageWrapper;
