"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import {
  Heart,
  Bookmark,
  Share2,
  Calendar,
  Clock,
  User,
  Loader2,
  Eye,
  Tag,
  BookOpen,
  ChevronLeft,
  Copy,
  Check,
  X,
  Facebook,
  MessageCircle,
  ArrowUp,
} from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import { ShareModal } from "./VendorProfilePageWrapper";

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
  { id: "wedding", name: "Wedding" },
  { id: "birthday", name: "Birthday" },
  { id: "corporate", name: "Corporate" },
  { id: "anniversary", name: "Anniversary" },
  { id: "tips", name: "Planning Tips" },
  { id: "other", name: "Other" },
];

const ReadingProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 z-[45] origin-left"
      style={{ scaleX }}
    />
  );
};

const ContentSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      <div className="animate-pulse">
        <div className="h-64 bg-slate-200 dark:bg-slate-800" />
        <div className="px-5 pt-6 space-y-4">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>
          <div className="pt-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-slate-100 dark:bg-slate-800 rounded"
                style={{ width: `${70 + Math.random() * 30}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-4 w-10 h-10 rounded-xl shadow-lg flex items-center justify-center z-40 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
    >
      <ArrowUp size={16} />
    </motion.button>
  );
};

const RelatedArticle = ({ blog, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700">
        {blog.coverImage ? (
          <MediaRenderer src={blog.coverImage} className="w-full h-full object-cover" alt={blog.title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={16} className="text-slate-300 dark:text-slate-600" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <h5 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">{blog.title}</h5>
        <span className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold uppercase tracking-wider mt-1">
          {blog.category}
        </span>
      </div>
    </div>
  );
};

export default function MobileSingleBlogPageWrapper() {
  const { id } = useParams();
  const router = useRouter();

  const { user, isLoaded: userLoaded } = useUser();
  const currentUserId = user?.id;

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estimatedReadTime, setEstimatedReadTime] = useState("");

  const [localMetrics, setLocalMetrics] = useState({
    likeCount: 0,
    isLiked: false,
    saveCount: 0,
    isSaved: false,
    shareCount: 0,
    viewCount: 0,
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [interactingAction, setInteractingAction] = useState(null);

  useEffect(() => {
    if (!id || !userLoaded) return;
    fetchBlogDetails();
  }, [id, userLoaded]);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const blogRes = await fetch(`/api/blogs/${id}`, { cache: "no-store" });

      if (blogRes.ok) {
        const blogData = await blogRes.json();
        const b = blogData.data;
        setBlog(b);

        const wordCount = (b.content || "").split(/\s+/).length;
        setEstimatedReadTime(b.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`);

        setLocalMetrics({
          likeCount: b.likeCount || 0,
          isLiked: currentUserId && Array.isArray(b.likedBy) ? b.likedBy.includes(currentUserId) : false,
          saveCount: Array.isArray(b.savedBy) ? b.savedBy.length : 0,
          isSaved: currentUserId && Array.isArray(b.savedBy) ? b.savedBy.includes(currentUserId) : false,
          shareCount: b.shareCount || 0,
          viewCount: b.viewCount || 0,
        });

        try {
          const relRes = await fetch(`/api/blogs?category=${b.category}&limit=4`, { cache: "no-store" });
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedBlogs((relData.data || []).filter((r) => r._id !== id).slice(0, 3));
          }
        } catch (e) {
          console.error("Related blogs fetch failed", e);
        }
      }
    } catch (err) {
      console.error("Error fetching blog details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInteract = async (action) => {
    if (!currentUserId) return;
    setInteractingAction(action);

    if (action === "like") {
      setLocalMetrics((p) => ({
        ...p,
        isLiked: !p.isLiked,
        likeCount: p.isLiked ? Math.max(0, p.likeCount - 1) : p.likeCount + 1,
      }));
    } else if (action === "save") {
      setLocalMetrics((p) => ({
        ...p,
        isSaved: !p.isSaved,
        saveCount: p.isSaved ? Math.max(0, p.saveCount - 1) : p.saveCount + 1,
      }));
    } else if (action === "share") {
      setIsShareModalOpen(true);
      setLocalMetrics((p) => ({ ...p, shareCount: p.shareCount + 1 }));
    }

    try {
      await fetch(`/api/blogs/${id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-clerk-user-id": currentUserId },
        body: JSON.stringify({ action }),
      });
    } catch (err) {
      console.error("Interaction failed", err);
      if (action === "like") {
        setLocalMetrics((p) => ({
          ...p,
          isLiked: !p.isLiked,
          likeCount: p.isLiked ? Math.max(0, p.likeCount - 1) : p.likeCount + 1,
        }));
      }
      if (action === "save") {
        setLocalMetrics((p) => ({
          ...p,
          isSaved: !p.isSaved,
          saveCount: p.isSaved ? Math.max(0, p.saveCount - 1) : p.saveCount + 1,
        }));
      }
    } finally {
      setInteractingAction(null);
    }
  };

  if (loading) return <ContentSkeleton />;

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center pt-20">
        <BookOpen size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Article not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">This article may have been removed.</p>
        <button
          onClick={() => router.push("/m/about/blogs")}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  const categoryConfig = CATEGORIES.find((c) => c.id === blog.category);

  const processContent = (rawContent) => {
    if (rawContent.includes("<")) {
      return { __html: rawContent };
    }
    return null;
  };

  const htmlContent = processContent(blog.content);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-10">
      <ReadingProgressBar />
      <ScrollToTop />

      <div className="sticky top-0 z-40 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform"
        >
          <ChevronLeft size={20} className="text-slate-900 dark:text-white" />
        </button>
        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate flex-1">{blog.title}</span>
      </div>

      <div>
        {blog.coverImage && (
          <div className="w-full aspect-[16/10] relative">
            <MediaRenderer src={blog.coverImage} className="w-full h-full object-cover" alt={blog.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {categoryConfig?.name || blog.category}
              </span>
            </div>
          </div>
        )}

        <div className="px-5 pt-6">
          {!blog.coverImage && (
            <span className="inline-block bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {categoryConfig?.name || blog.category}
            </span>
          )}

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-5">{blog.title}</h1>

          <div className="flex items-center gap-3 mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            {blog.authorPhoto ? (
              // <img
              //   src={blog.authorPhoto}
              //   className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700"
              //   alt={blog.authorName}
              // />
              <SmartMedia src={blog.authorPhoto} alt={blog.authorName} className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700" />
            ) : (
              <div className="w-11 h-11 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <User size={20} className="text-slate-400 dark:text-slate-500" />
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold text-slate-900 dark:text-white text-sm">{blog.authorName}</div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar size={10} />{" "}
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {estimatedReadTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={10} /> {localMetrics.viewCount}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 mb-6">
            {blog.excerpt && (
              <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6 pb-6 border-b border-slate-100 dark:border-slate-700 italic">
                {blog.excerpt}
              </p>
            )}

            <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
              {htmlContent ? (
                <div dangerouslySetInnerHTML={htmlContent} />
              ) : (
                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                  {blog.content}
                </div>
              )}
            </div>
          </div>

          {blog.tags?.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={12} className="text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(`/m/about/blogs?search=${tag}`)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleInteract("like")}
                disabled={interactingAction === "like"}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${localMetrics.isLiked ? "bg-pink-50 dark:bg-pink-500/20 text-pink-500" : "text-slate-600 dark:text-slate-400"}`}
              >
                <Heart size={18} fill={localMetrics.isLiked ? "currentColor" : "none"} />
                {localMetrics.likeCount}
              </button>

              <div className="h-8 w-px bg-slate-100 dark:bg-slate-700" />

              <button
                onClick={() => handleInteract("save")}
                disabled={interactingAction === "save"}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${localMetrics.isSaved ? "bg-amber-50 dark:bg-amber-500/20 text-amber-500" : "text-slate-600 dark:text-slate-400"}`}
              >
                <Bookmark size={18} fill={localMetrics.isSaved ? "currentColor" : "none"} />
              </button>

              <div className="h-8 w-px bg-slate-100 dark:bg-slate-700" />

              <button
                onClick={() => handleInteract("share")}
                className="flex items-center gap-2 px-5 py-3 text-slate-600 dark:text-slate-400 font-medium text-sm"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {relatedBlogs.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Related Articles</h4>
              <div className="space-y-3">
                {relatedBlogs.map((rel) => (
                  <RelatedArticle key={rel._id} blog={rel} onClick={() => router.push(`/m/about/blogs/${rel._id}`)} />
                ))}
              </div>
              <button
                onClick={() => router.push("/m/about/blogs")}
                className="w-full mt-4 py-3 text-sm font-semibold rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
              >
                View All Articles
              </button>
            </div>
          )}
        </div>
      </div>

      <ShareModal title={blog.title} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
}
