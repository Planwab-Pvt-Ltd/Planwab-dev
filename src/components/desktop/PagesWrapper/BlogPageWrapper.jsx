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
} from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import { BookOpen as BookOpenIcon } from "lucide-react";

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

const ITEMS_PER_PAGE = 9;

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



const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-100" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-200 rounded-full w-1/4" />
      <div className="h-5 bg-gray-200 rounded-full w-3/4" />
      <div className="h-3 bg-gray-200 rounded-full w-full" />
      <div className="h-3 bg-gray-200 rounded-full w-2/3" />
      <div className="flex justify-between pt-2">
        <div className="h-8 w-24 bg-gray-200 rounded-full" />
        <div className="h-8 w-16 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);



const CATEGORY_GRADIENTS = {
  wedding: "from-pink-400 to-rose-500",
  birthday: "from-purple-400 to-indigo-500",
  corporate: "from-blue-400 to-cyan-500",
  anniversary: "from-red-400 to-pink-500",
  tips: "from-amber-400 to-orange-500",
  other: "from-gray-400 to-slate-500",
};



const GridCard = ({ post, currentUserId, onEdit, onDelete }) => {
  const router = useRouter();
  const isOwner = currentUserId && post.authorClerkId === currentUserId;

  return (
    <div
      onClick={() => router.push(`/about/blogs/${post._id}`)}
      className="group cursor-pointer flex flex-col h-full relative"
    >
      <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[32px] overflow-hidden bg-gray-100 mb-6">
        {post.coverImage ? (
          <MediaRenderer
            src={post.coverImage}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            alt={post.title}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <BookOpen size={40} className="text-gray-400" />
          </div>
        )}

        {/* Owner Controls Overlay */}
        {isOwner && (
          <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onEdit(post); }} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"><Edit2 size={14} className="text-gray-700" /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(post); }} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"><Trash2 size={14} className="text-red-500" /></button>
          </div>
        )}
      </div>

      <h3 className="text-[22px] leading-[1.3] font-medium text-[#111827] mb-4 group-hover:text-pink-600 transition-colors line-clamp-2">
        {post.title}
      </h3>

      <div className="mt-auto flex items-center justify-between">
        <span className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-500 tracking-wide">
          {new Date(post.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
        </span>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <span className="flex items-center gap-1.5"><Heart size={14} /> {post.likeCount || 0}</span>
          <span className="flex items-center gap-1.5"><Eye size={14} /> {post.viewCount || 0}</span>
        </div>
      </div>
    </div>
  );
};



const PopularArticles = ({ blogs, selectedCategory = "all", onShowMore }) => {
  const router = useRouter();
  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="w-full mb-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">What We Do</h2>
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-gray-900">
            {selectedCategory === "all" ? "Popular Articles" : `Popular ${CATEGORIES.find(c => c.id === selectedCategory)?.name || ""} Articles`}
          </h1>
        </div>
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-gray-500 text-sm max-w-sm text-center md:text-right leading-relaxed mb-1">
            PlanWAB brings together collective knowledge and experience to help curate your perfect moments.
          </p>
          <TrendingUp className="text-[#FF1A75] w-5 h-5 hidden md:block" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {blogs.map((post) => (
          <div
            key={post._id}
            onClick={() => router.push(`/about/blogs/${post._id}`)}
            className="group cursor-pointer flex flex-col h-full"
          >
            <div className="relative w-full aspect-[1.15/1] rounded-[32px] overflow-hidden bg-gray-100 mb-6 shadow-sm border border-gray-50">
              {post.coverImage ? (
                <MediaRenderer
                  src={post.coverImage}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  alt={post.title}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <BookOpen size={48} />
                </div>
              )}
            </div>

            <h3 className="text-[22px] lg:text-[24px] font-medium leading-[1.3] text-[#111827] mb-4 group-hover:text-[#FF1A75] transition-colors line-clamp-2 pr-4">
              {post.title}
            </h3>

            <div className="mt-auto flex items-center justify-between">
              <span className="inline-flex px-4 py-1.5 rounded-full border border-gray-100 text-[11px] font-semibold text-gray-500 bg-gray-50/50 backdrop-blur-sm">
                {new Date(post.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
              </span>
              <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                <span className="flex items-center gap-1.5"><Heart size={14} /> {post.likeCount || 0}</span>
                <span className="flex items-center gap-1.5"><Eye size={14} /> {post.viewCount || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {onShowMore && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={onShowMore}
            className="flex items-center gap-2 px-10 py-4 bg-white border-2 border-gray-100 text-gray-900 font-black text-sm rounded-full hover:border-[#FF1A75] hover:text-[#FF1A75] transition-all shadow-sm hover:shadow-md"
          >
            Show More Popular Articles <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};



const CategoryCarousel = ({ onCategorySelect, selectedCategory }) => {
  const router = useRouter();
  const scrollRef = useRef(null);

  const categories = [
    { id: "wedding", name: "Wedding", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/wedding_cat_eQikY7JCR.png", desc: "Plan your dream wedding" },
    { id: "birthday", name: "Birthday", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/birthday_cat_ZFWlGHwqe.png", desc: "Celebrate another year" },
    { id: "anniversary", name: "Anniversary", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/anniversary_cat_eFoyx_1cB.png", desc: "Mark your milestones" },
    { id: "corporate", name: "Corporate", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/corporate_cat_ig5vMcWDn.png", desc: "Professional events" },
    { id: "other", name: "Others", image: "https://ik.imagekit.io/nkeo53cqt/planwab/categories/others_cat_2tkC8vg-0.png", desc: "Everything else" },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-24 relative group">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Top Stories</h2>
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-gray-900">
            Discover Our Global<br />Event Projects
          </h1>
        </div>
        <p className="text-gray-500 text-sm max-w-sm text-left md:text-right leading-relaxed mb-2">
          Explore curated content and expert advice across various event categories to inspire your next big moment.
        </p>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-2 snap-x snap-mandatory"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -10 }}
              onClick={() => onCategorySelect(cat.id)}
              className={`flex-shrink-0 w-[280px] h-[380px] rounded-[40px] overflow-hidden cursor-pointer relative snap-start shadow-sm hover:shadow-2xl transition-all duration-500 ${selectedCategory === cat.id ? "ring-4 ring-pink-500 ring-offset-4" : "border border-gray-100"}`}
            >
              <MediaRenderer
                src={cat.image}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2 block">
                  Category
                </span>
                <h3 className="text-2xl font-black mb-2">{cat.name}</h3>
                <p className="text-xs text-white/70 font-medium line-clamp-2">
                  {cat.desc}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E4F181]">
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};





const YourArticlesAccordion = ({ blogs, onEdit, onDelete }) => {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const router = useRouter();

  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">What We Do</h2>
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-gray-900">
            Your Articles
          </h1>
        </div>
        <p className="text-gray-500 text-sm max-w-sm text-left md:text-right leading-relaxed mb-2">
          Explore your diverse array of community-driven event insights, tips, and inspiration.
        </p>
      </div>

      <div className="flex flex-col md:flex-row h-[320px] lg:h-[350px] gap-4 w-full">
        {Array.from({ length: 5 }).map((_, index) => {
          const post = blogs[index];
          if (!post) {
            return <div key={`empty-${index}`} style={{ flex: 1.5 }} className="hidden md:block transition-all duration-300" />;
          }
          const isActive = hoveredIndex === index;
          return (
            <motion.div
              key={post._id}
              onClick={() => router.push(`/about/blogs/${post._id}`)}
              onMouseEnter={() => setHoveredIndex(index)}
              layout
              style={{ flex: isActive ? 5 : 1.5 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="relative rounded-[32px] overflow-hidden cursor-pointer group shadow-sm bg-gray-900"
            >
              <MediaRenderer
                src={post.coverImage || ""}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onEdit(post); }} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"><Edit2 size={14} className="text-gray-700" /></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(post); }} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"><Trash2 size={14} className="text-red-500" /></button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 flex flex-col justify-end h-full">
                <motion.h3
                  layout="position"
                  className={`text-white font-medium drop-shadow-md transition-all duration-300 ${isActive ? 'text-3xl lg:text-4xl mb-4 leading-tight' : 'text-xl lg:text-2xl leading-snug md:origin-bottom-left md:-rotate-90 md:translate-y-10 md:-translate-x-6 md:whitespace-nowrap md:w-[600px]'}`}
                >
                  {post.title}
                </motion.h3>

                <AnimatePresence>
                  {isActive && post.excerpt && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-white/80 text-sm lg:text-base leading-relaxed mb-6 line-clamp-2 max-w-2xl"
                    >
                      {post.excerpt}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between gap-4 w-full"
                    >
                      <button className="bg-[#E4F181] text-gray-900 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#d6e56a] transition-colors inline-flex items-center gap-2 shrink-0">
                        More Detail <ArrowRight size={14} />
                      </button>

                      <div className="flex items-center gap-3 lg:gap-4 text-white/90 text-xs lg:text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md shrink-0">
                        <span className="flex items-center gap-1.5"><Heart size={14} /> {post.likeCount || 0}</span>
                        <span className="flex items-center gap-1.5 hidden sm:flex"><Eye size={14} /> {post.viewCount || 0}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};



const PaginationBar = ({ pagination, currentPage, onPageChange }) => {
  const { totalPages } = pagination;
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }
    if (currentPage - delta > 2) pages.unshift("...");
    if (currentPage + delta < totalPages - 1) pages.push("...");
    pages.unshift(1);
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-10 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronLeft size={16} /> Prev
      </button>
      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all shadow-sm ${page === currentPage
              ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200"
              : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
              }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};



const BlogFormModal = ({ isOpen, onClose, onSubmit, editingBlog, loading }) => {
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", coverImage: "", category: "other", tags: "",
  });
  // "url" | "upload"
  const [imageTab, setImageTab] = useState("upload");
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingBlog) {
      setForm({
        title: editingBlog.title || "",
        excerpt: editingBlog.excerpt || "",
        content: editingBlog.content || "",
        coverImage: editingBlog.coverImage || "",
        category: editingBlog.category || "other",
        tags: (editingBlog.tags || []).join(", "),
      });
      setImagePreview(editingBlog.coverImage || "");
    } else {
      setForm({ title: "", excerpt: "", content: "", coverImage: "", category: "other", tags: "" });
      setImagePreview("");
    }
    setUploadError("");
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
      fd.append("fileName", `blog_cover_${Date.now()}_${file.name}`);
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

      const url = uploadJson.url;
      setForm((f) => ({ ...f, coverImage: url }));
      setImagePreview(url);
    } catch (err) {
      setUploadError(err.message || "Upload failed. Try a URL instead.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError("Image must be under 5 MB."); return; }

    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    uploadToImageKit(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange({ target: { files: [file] } });
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ type: "spring", damping: 30, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >

          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-7 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Pen size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">
                {editingBlog ? "Edit Blog Post" : "Write a New Blog"}
              </h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>


          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Give your blog an amazing title..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-sm"
              />
            </div>


            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-sm"
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image <span className="font-normal text-gray-400">(optional)</span></label>


              <div className="flex bg-gray-100 rounded-xl p-1 mb-3 w-fit gap-1">
                <button
                  type="button"
                  onClick={() => setImageTab("upload")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${imageTab === "upload" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Upload size={12} /> Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("url")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${imageTab === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Link size={12} /> Paste URL
                </button>
              </div>

              <AnimatePresence mode="wait">
                {imageTab === "upload" ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => !imageUploading && fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer group ${imageUploading ? "border-pink-300 bg-pink-50" : "border-gray-200 hover:border-pink-400 hover:bg-pink-50/40 bg-gray-50"
                        }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {imagePreview && !imageUploading ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                              <Upload size={14} /> Change Image
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setImagePreview(""); setForm((f) => ({ ...f, coverImage: "" })); }}
                            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                          >
                            <X size={13} className="text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-8 flex flex-col items-center justify-center gap-2 text-center px-4">
                          {imageUploading ? (
                            <>
                              <Loader2 size={28} className="text-pink-400 animate-spin" />
                              <p className="text-sm font-semibold text-gray-600">Uploading image...</p>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                <ImageIcon size={22} className="text-pink-400" />
                              </div>
                              <p className="text-sm font-semibold text-gray-600">Drop an image here or <span className="text-pink-500">click to browse</span></p>
                              <p className="text-[11px] text-gray-400">PNG, JPG, WEBP — max 5 MB</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {uploadError && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertTriangle size={11} /> {uploadError}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-2"
                  >
                    <input
                      type="url"
                      value={form.coverImage}
                      onChange={(e) => { setForm((f) => ({ ...f, coverImage: e.target.value })); setImagePreview(e.target.value); }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-sm"
                    />
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" onError={() => setImagePreview("")} className="w-full h-36 object-cover rounded-xl border border-gray-100" />
                        <p className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full">Preview</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="A short summary that appears on the card..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content *</label>
              <textarea
                rows={8}
                required
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your blog content here..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags <span className="font-normal text-gray-400">(comma separated)</span></label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="wedding, budget, tips, decor"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-sm"
              />
            </div>
          </form>


          <div className="px-7 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || imageUploading || !form.title.trim() || !form.content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-200"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {editingBlog ? "Save Changes" : "Publish Blog"}
            </button>
          </div>
        </motion.div>
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
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl"
      >
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Blog Post?</h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-700">"{blog.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(blog._id)}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};



const BlogPageWrapper = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, hasNextPage: false, hasPrevPage: false });
  const [categoryCounts, setCategoryCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [showMorePopular, setShowMorePopular] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle"); // idle, loading, success, error
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [toast, setToast] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const topRef = useRef(null);
  const popularRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };



  const fetchBlogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        sortBy,
      });
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

      const res = await fetch(`/api/blogs?${params.toString()}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.message || "Failed to fetch");

      setBlogs(json.data);
      setPagination(json.pagination);
      setCurrentPage(json.pagination.page);

      // Category count map
      const countMap = { all: json.pagination.total };
      (json.categoryCounts || []).forEach((c) => { countMap[c._id] = c.count; });
      setCategoryCounts(countMap);

      // Featured = highest views on first load
      if (page === 1 && !debouncedSearch && selectedCategory === "all") {
        const byViews = [...json.data].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        setFeaturedBlog(byViews[0] || null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, sortBy]);

  useEffect(() => {
    fetchBlogs(1);
  }, [debouncedSearch, selectedCategory, sortBy]);

  const handlePageChange = (page) => {
    fetchBlogs(page);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };



  const handleFormSubmit = async (formData) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const isEditing = !!editingBlog;
      const url = isEditing ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({
          ...formData,
          authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
          authorPhoto: user.imageUrl || null,
          authorClerkId: user.id,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Action failed");

      showToast(isEditing ? "Blog updated successfully! 🎉" : "Blog published successfully! 🎉");
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
        setBlogs((p) => p.filter((b) => b._id !== id));
        setDeletingBlog(null);
      }
    } catch (e) {
      console.error("Delete failed", e);
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
      setNewsletterMsg("Failed to subscribe. Please try again.");
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    }
  };

  const openEdit = (post) => {
    setEditingBlog(post);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]" ref={topRef}>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[100] px-5 py-3 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2.5 ${toast.type === "error" ? "bg-red-500 text-white" : "bg-gray-900 text-white"
              }`}
          >
            {toast.type === "error" ? <AlertTriangle size={16} /> : <Check size={16} className="text-green-400" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-16 lg:pb-24">

        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back
          </button>
          {isSignedIn && (
            <button onClick={() => { setEditingBlog(null); setShowCreateModal(true); }} className="xl:hidden bg-[#E4F181] text-gray-900 px-6 py-2.5 rounded-full font-bold text-sm">
              Write Article
            </button>
          )}
        </div>

        {!loading && !error && blogs.length > 0 && currentPage === 1 && !debouncedSearch && (
          <div className="flex flex-col xl:flex-row gap-12 xl:gap-20 mb-20">
            <div className="flex-1 min-w-0">
              <CategoryCarousel
                key="category-carousel"
                onCategorySelect={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                  setTimeout(() => {
                    popularRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }}
                selectedCategory={selectedCategory}
              />
            </div>

            <aside className="w-full xl:w-[320px] shrink-0 space-y-10">
              {isSignedIn ? (
                <button onClick={() => { setEditingBlog(null); setShowCreateModal(true); }} className="hidden xl:flex w-full items-center justify-center gap-2 bg-[#E4F181] text-gray-900 py-4 text-[15px] rounded-[24px] font-bold shadow-sm hover:bg-[#d6e56a] transition-all">
                  <Plus size={18} /> Write an Article
                </button>
              ) : isLoaded && (
                <SignInButton mode="modal">
                  <button className="hidden xl:flex w-full items-center justify-center gap-2 border-2 border-gray-100 text-gray-600 py-4 text-[15px] rounded-[24px] font-bold hover:border-gray-900 hover:text-gray-900 transition-all">
                    <User size={18} /> Sign In to Write
                  </button>
                </SignInButton>
              )}

              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2.5 mb-5">
                  <Filter className="text-pink-500 w-4 h-4" />
                  <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                      className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-[#FF1A75] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {cat.name}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${selectedCategory === cat.id ? 'bg-white/20' : 'text-gray-400 bg-white'}`}>
                        {categoryCounts[cat.id] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#FF1A75] via-[#D81B60] to-[#8E24AA] rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl shadow-pink-500/20">
                <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none" />
                <div className="relative z-10 text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                  <p className="text-white/90 text-[13px] mb-5 leading-relaxed">
                    Get the latest planning tips and trends directly to your inbox.
                  </p>
                  <div className="space-y-3">
                    <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full bg-black/10 border border-white/20 rounded-[16px] px-5 py-3 text-sm placeholder:text-white/60 text-white outline-none focus:border-white/50 transition-all backdrop-blur-sm"
                      />
                      <button
                        type="submit"
                        disabled={newsletterStatus === "loading"}
                        className="w-full bg-white text-[#FF1A75] font-bold py-3 rounded-[16px] hover:bg-gray-50 transition-colors shadow-lg disabled:opacity-50"
                      >
                        {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
                      </button>
                    </form>
                    {newsletterStatus !== "idle" && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-[11px] font-bold mt-2 ${newsletterStatus === "success" ? "text-green-300" : "text-yellow-200"}`}
                      >
                        {newsletterMsg}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && currentPage === 1 && !debouncedSearch && (
          <div ref={popularRef} className="mb-20">
            <PopularArticles
              blogs={showMorePopular ? blogs : blogs.slice(0, 8)}
              selectedCategory={selectedCategory}
              onShowMore={!showMorePopular && blogs.length > 8 ? () => setShowMorePopular(true) : null}
            />
          </div>
        )}

        {loading && (
          <div className="space-y-20">
            <div className="animate-pulse bg-gray-100 rounded-[32px] h-[500px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={() => fetchBlogs(currentPage)} className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800">Try Again</button>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-32 bg-gray-50 rounded-[40px]">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">{selectedCategory !== "all" ? "No articles in this category yet." : "Be the first to share an article here."}</p>
            {isSignedIn && (
              <button onClick={() => { setEditingBlog(null); setShowCreateModal(true); }} className="bg-[#E4F181] text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-[#d6e56a]">Write Article</button>
            )}
          </div>
        )}
        {!loading && !error && blogs.length > 0 && (currentPage > 1 || debouncedSearch) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 mb-20">
            {blogs.map((post) => (
              <GridCard
                key={post._id}
                post={post}
                currentUserId={user?.id}
                onEdit={openEdit}
                onDelete={setDeletingBlog}
              />
            ))}
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="w-full">
            <AnimatePresence mode="popLayout">
              {isSignedIn && blogs.filter(b => b.authorClerkId === user?.id).length > 0 && (
                <div key="your-articles-section" className="mb-20">
                  <YourArticlesAccordion
                    blogs={blogs.filter(b => b.authorClerkId === user?.id)}
                    onEdit={openEdit}
                    onDelete={setDeletingBlog}
                  />
                </div>
              )}
            </AnimatePresence>

            <div className="mt-10">
              <PaginationBar
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>


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
      </AnimatePresence>

      <AnimatePresence>
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