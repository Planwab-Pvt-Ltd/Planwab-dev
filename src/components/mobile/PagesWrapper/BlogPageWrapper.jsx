"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignInButton } from "@clerk/clerk-react";
import {
  Search,
  Calendar,
  User,
  Tag,
  Heart,
  TrendingUp,
  Filter,
  Eye,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
  Pen,
  AlertTriangle,
  Check,
  Upload,
  ImagePlus,
  Send,
  Mail,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
} from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";

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
  { id: "all", name: "All", icon: Grid3X3 },
  { id: "wedding", name: "Wedding", icon: Heart },
  { id: "birthday", name: "Birthday", icon: Star },
  { id: "corporate", name: "Corporate", icon: BookOpen },
  { id: "anniversary", name: "Anniversary", icon: Calendar },
  { id: "tips", name: "Tips", icon: Tag },
  { id: "other", name: "Other", icon: Pen },
];

const CATEGORY_IMAGES = {
  wedding: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/wedding_cat_eQikY7JCR.png",
  birthday: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/birthday_cat_ZFWlGHwqe.png",
  anniversary: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/anniversary_cat_eFoyx_1cB.png",
  corporate: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/corporate_cat_ig5vMcWDn.png",
  other: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/others_cat_2tkC8vg-0.png",
};

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const MobileBlogCard = ({ post, currentUserId, onEdit, onDelete, viewMode = "grid" }) => {
  const router = useRouter();
  const isOwner = currentUserId && post.authorClerkId === currentUserId;
  const category = CATEGORIES.find((c) => c.id === post.category);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => router.push(`/m/about/blogs/${post._id}`)}
        className="flex gap-4 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform"
      >
        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700">
          {post.coverImage ? (
            <MediaRenderer src={post.coverImage} className="w-full h-full object-cover" alt={post.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={20} className="text-slate-300 dark:text-slate-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <span className="text-[10px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
              {category?.name || post.category}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mt-1">
              {post.title}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Heart size={10} /> {post.likeCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={10} /> {post.viewCount || 0}
              </span>
            </div>
            {isOwner && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(post);
                  }}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700"
                >
                  <Edit2 size={12} className="text-slate-500 dark:text-slate-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post);
                  }}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700"
                >
                  <Trash2 size={12} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => router.push(`/m/about/blogs/${post._id}`)}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform"
    >
      <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-700">
        {post.coverImage ? (
          <MediaRenderer src={post.coverImage} className="w-full h-full object-cover" alt={post.title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={32} className="text-slate-300 dark:text-slate-600" />
          </div>
        )}
        {isOwner && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center"
            >
              <Edit2 size={14} className="text-slate-700 dark:text-slate-300" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post);
              }}
              className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {category?.name || post.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">
          {post.title}
        </h3>
        {post.excerpt && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{post.excerpt}</p>}
        <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-[11px] font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart size={12} className={post.likeCount > 0 ? "text-pink-500" : ""} /> {post.likeCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} /> {post.viewCount || 0}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar size={12} />{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const BlogFormModal = ({ isOpen, onClose, onSubmit, editingBlog, loading }) => {
  const [form, setForm] = useState({
    title: "",
    category: "wedding",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
  });
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
      if (file.size > 5 * 1024 * 1024) return setUploadError("Image must be under 5MB.");
      uploadToImageKit(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSubmit({
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
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
        className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col"
      >
        <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 active:scale-90 transition-transform"
          >
            <X size={20} className="text-slate-900 dark:text-white" />
          </button>
          <span className="font-bold text-sm text-slate-500 dark:text-slate-400">
            {editingBlog ? "Edit Article" : "New Article"}
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || imageUploading || !form.title.trim()}
            className="h-9 px-5 bg-blue-500 text-white rounded-full font-bold text-xs shadow-lg active:scale-95 disabled:opacity-30 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {editingBlog ? "Save" : "Publish"}
          </button>
        </div>

        <form className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-32">
          <div className="relative">
            <div
              className={`relative aspect-[16/10] bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-dashed transition-all ${imagePreview ? "border-transparent" : "border-slate-200 dark:border-slate-700"}`}
            >
              {imagePreview ? (
                <>
                  <MediaRenderer src={imagePreview} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setForm((f) => ({ ...f, coverImage: "" }));
                    }}
                    className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                    {imageUploading ? (
                      <Loader2 size={24} className="animate-spin text-blue-500" />
                    ) : (
                      <ImagePlus size={24} className="text-blue-500" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {imageUploading ? "Uploading..." : "Add Cover Image"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
            {uploadError && <p className="mt-2 text-center text-red-500 text-xs font-medium">{uploadError}</p>}
          </div>

          <div className="space-y-4">
            <textarea
              placeholder="Article title..."
              rows={2}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full text-2xl font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 border-none focus:ring-0 p-0 resize-none leading-tight text-slate-900 dark:text-white bg-transparent"
            />

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-5 px-5">
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${form.category === cat.id ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                  >
                    <Icon size={12} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            placeholder="Write a short excerpt..."
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            className="w-full text-base placeholder:text-slate-300 dark:placeholder:text-slate-600 border-none focus:ring-0 p-0 resize-none leading-relaxed text-slate-700 dark:text-slate-300 bg-transparent"
          />

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

          <textarea
            placeholder="Write your article content..."
            rows={12}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full text-base placeholder:text-slate-300 dark:placeholder:text-slate-600 border-none focus:ring-0 p-0 resize-none leading-relaxed text-slate-700 dark:text-slate-300 bg-transparent"
          />

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              <Tag size={12} className="text-blue-500" /> Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="wedding, tips, planning"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              className="w-full bg-white dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
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
        className="bg-white dark:bg-slate-800 w-full rounded-t-3xl p-6 pb-10"
      >
        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
        <div className="w-14 h-14 bg-red-50 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">Delete Article?</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm px-4">
          Are you sure you want to delete <span className="text-slate-900 dark:text-white">"{blog.title}"</span>?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onConfirm(blog._id)}
            disabled={loading}
            className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FilterSheet = ({ isOpen, onClose, selectedCategory, onCategoryChange, sortBy, onSortChange, categoryCounts }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-3xl p-5 pb-10 max-h-[80vh] overflow-y-auto"
      >
        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Filters</h3>

        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Sort By
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "newest", label: "Newest" },
              { id: "oldest", label: "Oldest" },
              { id: "views", label: "Most Viewed" },
              { id: "likes", label: "Most Liked" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSortChange(opt.id)}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${sortBy === opt.id ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    onClose();
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat.id ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
                >
                  <Icon size={14} />
                  {cat.name}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === cat.id ? "bg-white/20" : "bg-slate-200 dark:bg-slate-600"}`}
                  >
                    {categoryCounts[cat.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm"
        >
          Apply Filters
        </button>
      </motion.div>
    </motion.div>
  );
};

const BlogPageWrapper = () => {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setIsNavbarVisible } = useNavbarVisibilityStore();
  const [actionLoading, setActionLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fullAuthRedirectUrl = `${pathname}?${searchParams.toString()}`;

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [pagination, setPagination] = useState({ totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [categoryCounts, setCategoryCounts] = useState({});

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBlogs = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        let url = `/api/blogs?page=${page}&limit=10&sortBy=${sortBy}`;
        if (selectedCategory !== "all") url += `&category=${selectedCategory}`;
        if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;

        const res = await fetch(url);
        const result = await res.json();

        if (result.success) {
          setBlogs(result.data);
          setPagination(result.pagination);
          const countMap = { all: 0 };
          (result.categoryCounts || []).forEach((c) => {
            countMap[c._id] = c.count;
            countMap.all = (countMap.all || 0) + c.count;
          });
          setCategoryCounts(countMap);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, debouncedSearch, sortBy],
  );

  const fetchTrendingBlogs = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs?limit=5&sortBy=views`);
      const json = await res.json();
      if (json?.success) {
        setTrendingBlogs(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch trending blogs:", err);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [fetchBlogs, currentPage]);

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

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

      showToast(isEditing ? "Article updated!" : "Article published!");
      setShowCreateModal(false);
      setIsNavbarVisible(true);
      setEditingBlog(null);
      fetchBlogs(currentPage);
      fetchTrendingBlogs();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE", headers: { "x-clerk-user-id": user?.id } });
      if (res.ok) {
        setBlogs((p) => p.filter((b) => b._id !== id));
        setDeletingBlog(null);
        setIsNavbarVisible(true);
        showToast("Article deleted");
        fetchTrendingBlogs();
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
        setTimeout(() => setNewsletterStatus("idle"), 5000);
      } else {
        setNewsletterStatus("error");
        setNewsletterMsg(data.message);
        setTimeout(() => setNewsletterStatus("idle"), 5000);
      }
    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterMsg("Failed to subscribe.");
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    }
  };

  const openEdit = (post) => {
    setEditingBlog(post);
    setShowCreateModal(true);
    setIsNavbarVisible(false);
  };

  const categoryImages = [
    { id: "wedding", name: "Wedding", image: CATEGORY_IMAGES.wedding },
    { id: "birthday", name: "Birthday", image: CATEGORY_IMAGES.birthday },
    { id: "anniversary", name: "Anniversary", image: CATEGORY_IMAGES.anniversary },
    { id: "corporate", name: "Corporate", image: CATEGORY_IMAGES.corporate },
    { id: "other", name: "Others", image: CATEGORY_IMAGES.other },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-10">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className={`fixed top-24 left-4 right-4 z-[200] px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${toast.type === "error" ? "bg-red-500 text-white" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"}`}
          >
            {toast.type === "error" ? <AlertTriangle size={16} /> : <Check size={16} className="text-green-400" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-40 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} className="text-slate-900 dark:text-white" />
          </button>
          <span className="font-bold text-base text-slate-900 dark:text-white">Blog</span>
          <div className="flex items-center gap-2">
            {isSignedIn && (
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setShowCreateModal(true);
                  setIsNavbarVisible(false);
                }}
                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 pb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <button
            onClick={() => setShowFilterSheet(true)}
            className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center"
          >
            <SlidersHorizontal size={16} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center"
          >
            {viewMode === "grid" ? (
              <List size={16} className="text-slate-600 dark:text-slate-400" />
            ) : (
              <Grid3X3 size={16} className="text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
            Explore Categories
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
            {categoryImages.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`flex-shrink-0 w-28 h-36 rounded-2xl overflow-hidden relative active:scale-[0.95] transition-all ${selectedCategory === cat.id ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900" : ""}`}
              >
                <SmartMedia src={cat.image} className="absolute inset-0 w-full h-full object-cover" alt={cat.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xs font-bold text-center">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {trendingBlogs.length > 0 && !debouncedSearch && selectedCategory === "all" && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Trending</h2>
            </div>
            <div className="space-y-3">
              {trendingBlogs.slice(0, 3).map((blog, i) => (
                <div
                  key={blog._id}
                  onClick={() => router.push(`/m/about/blogs/${blog._id}`)}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform"
                >
                  <span className="text-lg font-bold text-slate-200 dark:text-slate-700 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{blog.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <Eye size={10} /> {blog.viewCount || 0}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Heart size={10} /> {blog.likeCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedCategory === "all" ? "All Articles" : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {pagination.total || blogs.length} articles
          </span>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl h-64 w-full border border-slate-100 dark:border-slate-700"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
            <button
              onClick={() => fetchBlogs(currentPage)}
              className="bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <BookOpen size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Try a different search or category.</p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4" : "space-y-3"}>
            {blogs.map((post) => (
              <MobileBlogCard
                key={post._id}
                post={post}
                currentUserId={user?.id}
                onEdit={openEdit}
                onDelete={setDeletingBlog}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-3">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30"
            >
              <ChevronLeft size={18} className="text-slate-600 dark:text-slate-400" />
            </button>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {currentPage} / {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30"
            >
              <ChevronRight size={18} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        )}
      </div>

      {!loading && (
        <div className="mx-4 mt-12 p-6 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-900 dark:to-slate-800 rounded-2xl text-white">
          <div className="text-center">
            <Mail size={28} className="mx-auto mb-3 opacity-70" />
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-white/80 text-sm mb-5">Get weekly event planning tips.</p>
            <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-white/50 text-white outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {newsletterStatus !== "idle" && (
              <p className={`text-xs mt-3 ${newsletterStatus === "success" ? "text-green-300" : "text-amber-200"}`}>
                {newsletterMsg}
              </p>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showFilterSheet && (
          <FilterSheet
            isOpen={showFilterSheet}
            onClose={() => setShowFilterSheet(false)}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categoryCounts={categoryCounts}
          />
        )}
        {showCreateModal && (
          <BlogFormModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setEditingBlog(null);
              setIsNavbarVisible(true);
            }}
            onSubmit={handleFormSubmit}
            editingBlog={editingBlog}
            loading={actionLoading}
          />
        )}
        {deletingBlog && (
          <DeleteConfirmModal
            blog={deletingBlog}
            onConfirm={handleDelete}
            onClose={() => {
              setDeletingBlog(null);
              setIsNavbarVisible(true);
            }}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPageWrapper;
