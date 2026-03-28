"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignInButton } from "@clerk/clerk-react";
import {
  ArrowLeft,
  Search,
  Calendar,
  User,
  Clock,
  Tag,
  Heart,
  Share2,
  Bookmark,
  TrendingUp,
  Filter,
  Eye,
  ArrowRight,
  Star,
  Mail,
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
  ImageIcon,
  Link,
  Grid3X3,
  List,
  SlidersHorizontal,
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

const ITEMS_PER_PAGE = 12;

const CATEGORIES = [
  { id: "all", name: "All Blogs", icon: Grid3X3 },
  { id: "wedding", name: "Wedding", icon: Heart },
  { id: "birthday", name: "Birthday", icon: Star },
  { id: "corporate", name: "Corporate", icon: BookOpen },
  { id: "anniversary", name: "Anniversary", icon: Calendar },
  { id: "tips", name: "Planning Tips", icon: Tag },
  { id: "other", name: "Other", icon: Pen },
];

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const SkeletonCard = () => {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
      <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-700 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
        <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
        <div className="flex justify-between pt-2">
          <div className="h-4 w-24 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

const ArticleCard = ({ post, index = 0, currentUserId, onEdit, onDelete }) => {
  const router = useRouter();
  const isOwner = currentUserId && post.authorClerkId === currentUserId;
  const category = CATEGORIES.find((c) => c.id === post.category);
  const CategoryIcon = category?.icon || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <article
        onClick={() => router.push(`/about/blogs/${post._id}`)}
        className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-lg"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.coverImage ? (
            <MediaRenderer
              src={post.coverImage}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt={post.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50 dark:bg-slate-700">
              <BookOpen size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 dark:bg-blue-600/90 text-white">
              <CategoryIcon size={12} />
              {category?.name || post.category}
            </span>
          </div>
          {isOwner && (
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post);
                }}
                className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <Edit2 size={14} className="text-slate-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post);
                }}
                className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold leading-snug mb-2 line-clamp-2 transition-colors text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm leading-relaxed line-clamp-2 mb-4 text-slate-500 dark:text-slate-400">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.authorPhoto ? (
                <SmartMedia
                  src={post.authorPhoto}
                  className="w-6 h-6 rounded-full border border-slate-200"
                  alt={post.authorName}
                />
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                  <User size={12} className="text-slate-400 dark:text-slate-500" />
                </div>
              )}
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{post.authorName}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Heart size={12} /> {post.likeCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> {post.viewCount || 0}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </article>
    </motion.div>
  );
};

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categoryCounts,
  viewMode,
  onViewModeChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-8">
      <div className="rounded-2xl p-4 lg:p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium cursor-pointer bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Most Liked</option>
            </select>

            <div className="flex rounded-xl border overflow-hidden border-slate-200 dark:border-slate-600">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-3 transition-colors ${viewMode === "grid" ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-3 transition-colors ${viewMode === "list" ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400"}`}
              >
                <List size={16} />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilters ? "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-400 dark:text-slate-500">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
                      >
                        <Icon size={14} />
                        {cat.name}
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${selectedCategory === cat.id ? "bg-white/20" : "bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400"}`}
                        >
                          {categoryCounts[cat.id] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ListArticleCard = ({ post, currentUserId, onEdit, onDelete }) => {
  const router = useRouter();
  const isOwner = currentUserId && post.authorClerkId === currentUserId;
  const category = CATEGORIES.find((c) => c.id === post.category);
  const CategoryIcon = category?.icon || BookOpen;

  return (
    <article
      onClick={() => router.push(`/about/blogs/${post._id}`)}
      className="group cursor-pointer flex gap-5 p-4 rounded-2xl transition-all bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-md"
    >
      <div className="w-48 h-32 rounded-xl overflow-hidden shrink-0">
        {post.coverImage ? (
          <MediaRenderer
            src={post.coverImage}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt={post.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50 dark:bg-slate-700">
            <BookOpen size={24} className="text-slate-300 dark:text-slate-600" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
              <CategoryIcon size={10} />
              {category?.name || post.category}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h3 className="text-lg font-semibold leading-snug mb-2 line-clamp-1 transition-colors text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm leading-relaxed line-clamp-2 text-slate-500 dark:text-slate-400">{post.excerpt}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {post.authorPhoto ? (
              <SmartMedia
                src={post.authorPhoto}
                className="w-5 h-5 rounded-full border border-slate-200"
                alt={post.authorName}
              />
            ) : (
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                <User size={10} className="text-slate-400 dark:text-slate-500" />
              </div>
            )}
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Heart size={12} /> {post.likeCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> {post.viewCount || 0}
              </span>
            </div>
            {isOwner && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(post);
                  }}
                  className="p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Edit2 size={14} className="text-slate-500 dark:text-slate-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post);
                  }}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-500/20"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const Sidebar = ({
  isSignedIn,
  isLoaded,
  categoryCounts,
  selectedCategory,
  onCategoryChange,
  onCreateBlog,
  newsletterEmail,
  onNewsletterEmailChange,
  onNewsletterSubscribe,
  newsletterStatus,
  newsletterMsg,
  fullAuthRedirectUrl,
  trendingBlogs,
}) => {
  const router = useRouter();

  return (
    <aside className="space-y-6">
      {isSignedIn ? (
        <button
          onClick={onCreateBlog}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={18} /> Write New Article
        </button>
      ) : (
        isLoaded && (
          <SignInButton mode="modal" forceRedirectUrl={fullAuthRedirectUrl}>
            <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
              <User size={18} /> Sign In to Write
            </button>
          </SignInButton>
        )
      )}

      <div className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-blue-500 dark:text-blue-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Categories</h3>
        </div>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={14} />
                  {cat.name}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat.id ? "bg-blue-100 dark:bg-blue-600/30" : "bg-slate-100 dark:bg-slate-700"}`}
                >
                  {categoryCounts[cat.id] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {trendingBlogs && trendingBlogs.length > 0 && (
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-amber-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Trending</h3>
          </div>
          <div className="space-y-4">
            {trendingBlogs.slice(0, 5).map((blog, i) => (
              <div
                key={blog._id}
                onClick={() => router.push(`/about/blogs/${blog._id}`)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <span className="text-xl font-bold leading-none w-6 text-slate-200 dark:text-slate-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2 transition-colors leading-snug text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {blog.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 dark:text-slate-500">
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

      <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-900 dark:to-slate-800 text-white">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
          <Mail size={18} />
        </div>
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-sm text-white/80 mb-4 leading-relaxed">
          Get the latest event planning tips delivered to your inbox.
        </p>
        <form onSubmit={onNewsletterSubscribe} className="space-y-3">
          <input
            type="email"
            required
            value={newsletterEmail}
            onChange={(e) => onNewsletterEmailChange(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-white/50 outline-none focus:border-white/40 transition-colors"
          />
          <button
            type="submit"
            disabled={newsletterStatus === "loading"}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-50"
          >
            {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {newsletterStatus !== "idle" && (
          <p
            className={`text-xs mt-3 text-center ${newsletterStatus === "success" ? "text-green-300" : "text-amber-200"}`}
          >
            {newsletterMsg}
          </p>
        )}
      </div>
    </aside>
  );
};

const PaginationBar = ({ pagination, currentPage, onPageChange }) => {
  const { totalPages } = pagination;
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++)
      pages.push(i);
    if (currentPage - delta > 2) pages.unshift("...");
    if (currentPage + delta < totalPages - 1) pages.push("...");
    pages.unshift(1);
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        <ChevronLeft size={16} /> Prev
      </button>
      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-400 dark:text-slate-500">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === currentPage ? "bg-blue-500 text-white" : "border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
          >
            {page}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

const BlogFormModal = ({ isOpen, onClose, onSubmit, editingBlog, loading }) => {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "other",
    tags: "",
  });
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
      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: fd });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.message || "Upload failed");
      setForm((f) => ({ ...f, coverImage: uploadJson.url }));
      setImagePreview(uploadJson.url);
    } catch (err) {
      setUploadError(err.message || "Upload failed. Try a URL instead.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col bg-white dark:bg-slate-800"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Pen size={16} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">{editingBlog ? "Edit Article" : "Write New Article"}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Enter article title..."
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Cover Image <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <div className="flex rounded-xl p-1 mb-3 w-fit gap-1 bg-slate-100 dark:bg-slate-700">
                <button
                  type="button"
                  onClick={() => setImageTab("upload")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${imageTab === "upload" ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
                >
                  <Upload size={12} /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("url")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${imageTab === "url" ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
                >
                  <Link size={12} /> URL
                </button>
              </div>

              {imageTab === "upload" ? (
                <div>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => !imageUploading && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer ${imageUploading ? "border-blue-300 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-500/10" : "border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500/50 bg-slate-50 dark:bg-slate-900"}`}
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
                        {/* <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" /> */}
                        <SmartMedia
                          src={imagePreview}
                          className="w-full h-40 object-cover rounded-xl"
                          alt="Preview"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview("");
                            setForm((f) => ({ ...f, coverImage: "" }));
                          }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                        >
                          <X size={13} className="text-slate-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center gap-2 text-center px-4">
                        {imageUploading ? (
                          <>
                            <Loader2 size={28} className="text-blue-500 animate-spin" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <ImageIcon size={28} className="text-slate-400 dark:text-slate-500" />
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              Drop or <span className="text-blue-500">browse</span>
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, WEBP — max 5 MB</p>
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
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="url"
                    value={form.coverImage}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, coverImage: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 dark:focus:border-blue-500"
                  />
                  {imagePreview && (
                    <SmartMedia
                      src={imagePreview}
                      className="w-full h-32 object-cover rounded-xl border border-slate-100 dark:border-slate-600"
                      alt="Preview"
                    />
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="A short summary..."
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Content *</label>
              <textarea
                rows={8}
                required
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your content here..."
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                Tags <span className="font-normal text-slate-400">(comma separated)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="wedding, tips, budget"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 dark:focus:border-blue-500"
              />
            </div>
          </form>

          <div className="px-6 py-4 border-t flex items-center justify-between shrink-0 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || imageUploading || !form.title.trim() || !form.content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {editingBlog ? "Save Changes" : "Publish"}
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
      className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl p-6 max-w-md w-full shadow-2xl bg-white dark:bg-slate-800"
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-50 dark:bg-red-500/20">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-center mb-2 text-slate-900 dark:text-white">Delete Article?</h3>
        <p className="text-sm text-center mb-6 text-slate-500 dark:text-slate-400">
          Are you sure you want to delete <span className="text-slate-700 dark:text-white">"{blog.title}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(blog._id)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PageHeader = ({ title, description, onCreateBlog, isSignedIn }) => {
  return (
    <div className="mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">{title}</h1>
          <p className="text-base text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {isSignedIn && (
            <button
              onClick={onCreateBlog}
              className="lg:hidden flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              <Plus size={16} /> Write
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BlogPageWrapper = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const fullAuthRedirectUrl = `${pathname}?${searchParams.toString()}`;

  const [allBlogs, setAllBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [categoryCounts, setCategoryCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [toast, setToast] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const topRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllBlogs = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page, limit: ITEMS_PER_PAGE, sortBy });
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

        const res = await fetch(`/api/blogs?${params.toString()}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to fetch");

        setAllBlogs(json.data);
        setPagination(json.pagination);
        setCurrentPage(json.pagination.page);

        const countMap = { all: 0 };
        (json.categoryCounts || []).forEach((c) => {
          countMap[c._id] = c.count;
          countMap.all = (countMap.all || 0) + c.count;
        });
        setCategoryCounts(countMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, selectedCategory, sortBy],
  );

  const fetchTrendingBlogs = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs?limit=10&sortBy=views`);
      const json = await res.json();
      if (json?.success) {
        setTrendingBlogs(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch trending blogs:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllBlogs(1);
  }, [debouncedSearch, selectedCategory, sortBy]);

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  const handlePageChange = (page) => {
    fetchAllBlogs(page);
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
        headers: { "Content-Type": "application/json", "x-clerk-user-id": user.id },
        body: JSON.stringify({
          ...formData,
          authorName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
          authorPhoto: user.imageUrl || null,
          authorClerkId: user.id,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Action failed");
      showToast(isEditing ? "Article updated successfully!" : "Article published successfully!");
      setShowCreateModal(false);
      setEditingBlog(null);
      fetchAllBlogs(currentPage);
      fetchTrendingBlogs();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE", headers: { "x-clerk-user-id": user.id } });
      const json = await res.json();
      if (res.ok) {
        showToast("Article deleted successfully");
        setDeletingBlog(null);
        fetchAllBlogs(currentPage);
        fetchTrendingBlogs();
      } else {
        showToast(json.message || "Delete failed", "error");
      }
    } catch (e) {
      showToast("Delete failed", "error");
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
        body: JSON.stringify({ email: newsletterEmail, visitedUrl: window.location.href, clerkId: user?.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus("success");
        setNewsletterMsg(data.message);
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setNewsletterMsg(data.message);
      }
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    } catch {
      setNewsletterStatus("error");
      setNewsletterMsg("Failed to subscribe.");
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    }
  };

  const openEdit = (post) => {
    setEditingBlog(post);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen transition-colors bg-slate-50 dark:bg-slate-900 pt-10" ref={topRef}>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === "error" ? "bg-red-500 text-white" : "bg-slate-900 text-white"}`}
          >
            {toast.type === "error" ? <AlertTriangle size={16} /> : <Check size={16} className="text-green-400" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <PageHeader
          title="Blog & Insights"
          description="Discover expert tips, inspiring stories, and the latest trends in event planning."
          onCreateBlog={() => {
            setEditingBlog(null);
            setShowCreateModal(true);
          }}
          isSignedIn={isSignedIn}
        />

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categoryCounts={categoryCounts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {loading ? (
              <SkeletonGrid count={8} />
            ) : error ? (
              <div className="text-center py-20 rounded-2xl border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
                <p className="font-medium mb-4 text-slate-600 dark:text-slate-300">{error}</p>
                <button
                  onClick={() => fetchAllBlogs(currentPage)}
                  className="bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : allBlogs.length > 0 ? (
              <>
                {debouncedSearch.trim() && (
                  <div className="flex items-center gap-2 mb-6">
                    <Search size={18} className="text-slate-400 dark:text-slate-500" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {pagination.total} results for{" "}
                      <span className="text-slate-900 dark:text-white">"{debouncedSearch}"</span>
                    </p>
                  </div>
                )}

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allBlogs.map((post, i) => (
                      <ArticleCard
                        key={post._id}
                        post={post}
                        index={i}
                        currentUserId={user?.id}
                        onEdit={openEdit}
                        onDelete={setDeletingBlog}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allBlogs.map((post) => (
                      <ListArticleCard
                        key={post._id}
                        post={post}
                        currentUserId={user?.id}
                        onEdit={openEdit}
                        onDelete={setDeletingBlog}
                      />
                    ))}
                  </div>
                )}

                <PaginationBar pagination={pagination} currentPage={currentPage} onPageChange={handlePageChange} />
              </>
            ) : (
              <div className="text-center py-20 rounded-2xl border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                <BookOpen size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">No articles found</h3>
                <p className="mb-6 text-slate-500 dark:text-slate-400">
                  {debouncedSearch.trim()
                    ? "Try different keywords or browse by category."
                    : "Be the first to share your insights!"}
                </p>
                {isSignedIn && !debouncedSearch.trim() && (
                  <button
                    onClick={() => {
                      setEditingBlog(null);
                      setShowCreateModal(true);
                    }}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Write Your First Article
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="xl:w-80 shrink-0 hidden xl:block">
            <Sidebar
              isSignedIn={isSignedIn}
              isLoaded={isLoaded}
              categoryCounts={categoryCounts}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              onCreateBlog={() => {
                setEditingBlog(null);
                setShowCreateModal(true);
              }}
              newsletterEmail={newsletterEmail}
              onNewsletterEmailChange={setNewsletterEmail}
              onNewsletterSubscribe={handleNewsletterSubscribe}
              newsletterStatus={newsletterStatus}
              newsletterMsg={newsletterMsg}
              fullAuthRedirectUrl={fullAuthRedirectUrl}
              trendingBlogs={trendingBlogs}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <BlogFormModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setEditingBlog(null);
            }}
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
