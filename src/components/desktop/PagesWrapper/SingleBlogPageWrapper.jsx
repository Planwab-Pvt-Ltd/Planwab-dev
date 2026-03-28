"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { ShareModal } from "./VendorProfilePageWrapper"
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Calendar,
  Clock,
  User,
  Eye,
  Tag,
  BookOpen,
  ChevronRight,
  Copy,
  Check,
  X,
  Facebook,
  MessageCircle,
  ArrowUp,
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
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 z-[50] origin-left"
      style={{ scaleX }}
    />
  );
};

const ContentSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="h-5 w-20 rounded mb-8 bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="rounded-2xl p-8 mb-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          <div className="h-6 w-24 rounded mb-4 bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-10 w-full rounded mb-3 bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-10 w-3/4 rounded mb-6 bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex gap-4">
            <div className="h-5 w-32 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
            <div className="h-5 w-28 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
        <div className="h-80 rounded-2xl mb-8 bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="rounded-2xl p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded mb-3 bg-slate-100 dark:bg-slate-700 animate-pulse"
              style={{ width: `${70 + Math.random() * 30}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
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
      className="fixed bottom-6 right-6 w-11 h-11 rounded-xl shadow-lg flex items-center justify-center z-40 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-500 hover:text-white border border-slate-200 dark:border-slate-700"
    >
      <ArrowUp size={18} />
    </motion.button>
  );
};

const TableOfContents = ({ content }) => {
  const headings = [];

  if (content?.includes("<")) {
    const parser = typeof DOMParser !== "undefined" ? new DOMParser() : null;
    if (parser) {
      try {
        const doc = parser.parseFromString(content, "text/html");
        doc.querySelectorAll("h2, h3").forEach((el, i) => {
          headings.push({ text: el.textContent, level: el.tagName === "H2" ? 2 : 3, id: `heading-${i}` });
        });
      } catch {}
    }
  }

  if (headings.length < 2) return null;

  return (
    <div className="rounded-2xl p-5 mb-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={16} className="text-blue-500 dark:text-blue-400" />
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Contents</h4>
      </div>
      <nav className="space-y-1.5">
        {headings.map((h, i) => (
          <button
            key={i}
            onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className={`block w-full text-left text-sm transition-colors leading-relaxed ${h.level === 3 ? "pl-4" : ""} text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400`}
          >
            {h.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

const RelatedArticle = ({ blog, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex gap-4 p-3 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
        {blog.coverImage ? (
          <MediaRenderer
            src={blog.coverImage}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt={blog.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
            <BookOpen size={16} className="text-slate-300 dark:text-slate-600" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <h5 className="font-medium text-sm leading-snug line-clamp-2 transition-colors text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {blog.title}
        </h5>
        <span className="text-xs mt-1 text-slate-400 dark:text-slate-500">
          {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
};

export default function SingleBlogPageWrapper() {
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
          const relRes = await fetch(`/api/blogs?category=${b.category}&limit=6`, { cache: "no-store" });
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedBlogs((relData.data || []).filter((r) => r._id !== id).slice(0, 4));
          }
        } catch {}
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
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
    } catch {
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
      }
    } finally {
      setInteractingAction(null);
    }
  };

  if (loading) return <ContentSkeleton />;

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 pt-20">
        <BookOpen size={48} className="text-slate-200 dark:text-slate-700" />
        <h2 className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-white">Article not found</h2>
        <p className="mb-6 text-slate-500 dark:text-slate-400">This article may have been removed or doesn't exist.</p>
        <button
          onClick={() => router.push("/about/blogs")}
          className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  const categoryConfig = CATEGORIES.find((c) => c.id === blog.category);

  const processContent = (rawContent) => {
    if (rawContent.includes("<")) {
      const parser = typeof DOMParser !== "undefined" ? new DOMParser() : null;
      if (parser) {
        try {
          const doc = parser.parseFromString(rawContent, "text/html");
          let idx = 0;
          doc.querySelectorAll("h2, h3").forEach((el) => {
            el.id = `heading-${idx++}`;
          });
          return { __html: doc.body.innerHTML };
        } catch {
          return { __html: rawContent };
        }
      }
      return { __html: rawContent };
    }
    return null;
  };

  const htmlContent = processContent(blog.content);

  return (
    <div className="min-h-screen pb-20 transition-colors bg-slate-50 dark:bg-slate-900 pt-20">
      <ReadingProgressBar />
      <ScrollToTop />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <nav className="hidden lg:flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
            <button
              onClick={() => router.push("/about/blogs")}
              className="transition-colors hover:text-blue-500 dark:hover:text-blue-400"
            >
              Blog
            </button>
            <ChevronRight size={14} />
            <span className="text-slate-500 dark:text-slate-400">{categoryConfig?.name || "Article"}</span>
          </nav>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="rounded-2xl p-6 lg:p-8 mb-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
                    {categoryConfig?.name || blog.category}
                  </span>
                  {blog.tags?.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-6 text-slate-900 dark:text-white">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    {blog.authorPhoto ? (
                      // <img
                      //   src={blog.authorPhoto}
                      //   className="w-8 h-8 rounded-full border border-slate-200"
                      //   alt={blog.authorName}
                      // />
                      <SmartMedia src={blog.authorPhoto} alt={blog.authorName} className="w-8 h-8 rounded-full border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                        <User size={14} className="text-slate-400 dark:text-slate-500" />
                      </div>
                    )}
                    <span className="font-medium text-slate-900 dark:text-white">{blog.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {estimatedReadTime}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} />
                    {localMetrics.viewCount} views
                  </div>
                </div>
              </div>

              {blog.coverImage && (
                <div className="w-full h-64 lg:h-96 relative rounded-2xl overflow-hidden mb-6 border border-slate-100 dark:border-slate-700">
                  <MediaRenderer src={blog.coverImage} className="w-full h-full object-cover" alt={blog.title} />
                </div>
              )}

              <div className="rounded-2xl p-6 lg:p-8 mb-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                {blog.excerpt && (
                  <p className="text-lg leading-relaxed mb-8 pb-8 border-b italic text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700">
                    {blog.excerpt}
                  </p>
                )}
                <div className="prose prose-lg max-w-none prose-slate dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400">
                  {htmlContent ? (
                    <div dangerouslySetInnerHTML={htmlContent} />
                  ) : (
                    <div className="whitespace-pre-wrap">{blog.content}</div>
                  )}
                </div>
              </div>

              {blog.tags?.length > 0 && (
                <div className="rounded-2xl p-5 mb-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={14} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <button
                        key={i}
                        onClick={() => router.push(`/about/blogs?search=${tag}`)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-600/20 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleInteract("like")}
                    disabled={interactingAction === "like"}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${localMetrics.isLiked ? "bg-pink-50 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/30" : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-pink-200 dark:hover:border-pink-500/30"}`}
                  >
                    <Heart size={16} fill={localMetrics.isLiked ? "currentColor" : "none"} />
                    {localMetrics.likeCount}
                  </button>
                  <button
                    onClick={() => handleInteract("save")}
                    disabled={interactingAction === "save"}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${localMetrics.isSaved ? "bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30" : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-amber-200 dark:hover:border-amber-500/30"}`}
                  >
                    <Bookmark size={16} fill={localMetrics.isSaved ? "currentColor" : "none"} />
                    Save
                  </button>
                  <button
                    onClick={() => handleInteract("share")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500/30"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </motion.article>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-slate-400 dark:text-slate-500">
                    About Author
                  </h4>
                  <div className="flex items-center gap-3 mb-4">
                    {blog.authorPhoto ? (
                      // <img
                      //   src={blog.authorPhoto}
                      //   className="w-12 h-12 rounded-xl border border-slate-200 object-cover"
                      //   alt={blog.authorName}
                      // />
                      <SmartMedia src={blog.authorPhoto} alt={blog.authorName} className="w-12 h-12 rounded-xl border border-slate-200 object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                        <User size={20} className="text-slate-400 dark:text-slate-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{blog.authorName}</div>
                      <div className="text-sm text-slate-400 dark:text-slate-500">Content Creator</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100 dark:border-slate-700">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{localMetrics.likeCount}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{localMetrics.viewCount}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{localMetrics.shareCount}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Shares</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <TableOfContents content={blog.content} />

              {relatedBlogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-slate-400 dark:text-slate-500">
                      Related Articles
                    </h4>
                    <div className="space-y-1">
                      {relatedBlogs.map((rel) => (
                        <RelatedArticle
                          key={rel._id}
                          blog={rel}
                          onClick={() => router.push(`/about/blogs/${rel._id}`)}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => router.push("/about/blogs")}
                      className="w-full mt-4 py-2.5 text-sm font-medium rounded-xl border-2 border-dashed transition-colors border-slate-200 dark:border-slate-700 text-slate-400 hover:border-blue-200 dark:hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      View All Articles
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShareModal title={blog.title} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
}