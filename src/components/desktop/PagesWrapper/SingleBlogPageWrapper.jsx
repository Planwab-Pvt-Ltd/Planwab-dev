"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { 
  ArrowLeft, Heart, Bookmark, Share2, 
  Calendar, Clock, User, Loader2, Star, Trash2 
} from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import { ShareModal } from "./VendorProfilePageWrapper";

export default function SingleBlogPageWrapper() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const currentUserId = user?.id;

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [localMetrics, setLocalMetrics] = useState({
    likeCount: 0,
    isLiked: false,
    saveCount: 0,
    isSaved: false,
    shareCount: 0,
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!id || !userLoaded) return;
    fetchBlogDetails();
  }, [id, userLoaded]);

  const fetchBlogDetails = async () => {
    try {
      const blogRes = await fetch(`/api/blogs/${id}`, { cache: 'no-store' });

      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setBlog(blogData.data);
        setLocalMetrics({
          likeCount: blogData.data.likeCount || 0,
          isLiked: currentUserId && Array.isArray(blogData.data.likedBy) ? blogData.data.likedBy.includes(currentUserId) : false,
          saveCount: Array.isArray(blogData.data.savedBy) ? blogData.data.savedBy.length : 0,
          isSaved: currentUserId && Array.isArray(blogData.data.savedBy) ? blogData.data.savedBy.includes(currentUserId) : false,
          shareCount: blogData.data.shareCount || 0,
        });

        // Fetch related blogs from same category
        try {
          const relRes = await fetch(`/api/blogs?category=${blogData.data.category}&limit=4`, { cache: 'no-store' });
          if (relRes.ok) {
            const relData = await relRes.json();
            // Filter out the current blog
            setRelatedBlogs((relData.data || []).filter(b => b._id !== id).slice(0, 3));
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

    if (action === "like") {
      setLocalMetrics(p => ({ ...p, isLiked: !p.isLiked, likeCount: p.isLiked ? Math.max(0, p.likeCount - 1) : p.likeCount + 1 }));
    } else if (action === "save") {
      setLocalMetrics(p => ({ ...p, isSaved: !p.isSaved, saveCount: p.isSaved ? Math.max(0, p.saveCount - 1) : p.saveCount + 1 }));
    } else if (action === "share") {
      setIsShareModalOpen(true);
      setLocalMetrics(p => ({ ...p, shareCount: p.shareCount + 1 }));
    }

    try {
      await fetch(`/api/blogs/${id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-clerk-user-id": currentUserId },
        body: JSON.stringify({ action }),
      });
    } catch (err) {
      console.error("Interaction failed", err);
      // Revert on failure
      if (action === "like") {
        setLocalMetrics(p => ({ ...p, isLiked: !p.isLiked, likeCount: p.isLiked ? Math.max(0, p.likeCount - 1) : p.likeCount + 1 }));
      } else if (action === "save") {
        setLocalMetrics(p => ({ ...p, isSaved: !p.isSaved, saveCount: p.isSaved ? Math.max(0, p.saveCount - 1) : p.saveCount + 1 }));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={40} className="text-[#FF2D7A] animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h2>
        <button onClick={() => router.push("/about/blogs")} className="px-6 py-2 bg-[#FF2D7A] text-white rounded-full font-semibold">
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Top Background Pattern */}
      <div className="h-[250px] w-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 absolute top-0 left-0 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-[#FF2D7A] transition font-semibold mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column: Content */}
          <div className="lg:col-span-8">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#FFF0F5] text-[#FF2D7A] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {blog.category}
                </span>
                {blog.tags?.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-[11px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#111827] leading-[1.15] mb-6">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-[#4B5563] font-medium border-l-4 border-[#FF2D7A] pl-4">
                <div className="flex items-center gap-2">
                  {blog.authorPhoto ? (
                    <img src={blog.authorPhoto} className="w-8 h-8 rounded-full border border-gray-200" alt={blog.authorName} />
                  ) : (
                    <User size={18} className="text-[#6B7280]" />
                  )}
                  <span className="text-[#111827] font-bold">{blog.authorName}</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-80">
                  <Calendar size={15} />
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center gap-1.5 opacity-80">
                  <Clock size={15} />
                  {blog.readTime || "5 min read"}
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {blog.coverImage && (
              <div className="w-full h-[300px] sm:h-[500px] relative rounded-[40px] overflow-hidden shadow-xl mb-12 group">
                <SmartMedia 
                  src={blog.coverImage} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt={blog.title} 
                />
              </div>
            )}

            {/* Content Body */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-12">
              {blog.excerpt && (
                <p className="text-xl text-[#4B5563] leading-relaxed mb-10 font-medium italic border-b border-gray-100 pb-10">
                  {blog.excerpt}
                </p>
              )}

              <div className="prose prose-lg prose-pink max-w-none text-[#374151] leading-[1.9]">
                {blog.content.includes("<") ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                ) : (
                  <div className="whitespace-pre-wrap">{blog.content}</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
            {/* Author & Interactions Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">About the Author</h4>
              <div className="flex items-center gap-4 mb-8">
                {blog.authorPhoto ? (
                  <img src={blog.authorPhoto} className="w-14 h-14 rounded-2xl border-2 border-pink-50 shadow-sm" alt={blog.authorName} />
                ) : (
                  <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF2D7A]">
                    <User size={28} />
                  </div>
                )}
                <div>
                  <div className="font-black text-[#111827] text-lg">{blog.authorName}</div>
                  <div className="text-sm text-gray-500 font-medium">Content Strategy</div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <button 
                  onClick={() => handleInteract("like")} 
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${localMetrics.isLiked ? "bg-[#FFF0F5] text-[#FF2D7A]" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3 font-bold">
                    <Heart size={20} fill={localMetrics.isLiked ? "currentColor" : "none"} />
                    {localMetrics.isLiked ? "Liked" : "Like this story"}
                  </div>
                  <span className="text-sm font-black opacity-60">{localMetrics.likeCount}</span>
                </button>

                <button 
                  onClick={() => handleInteract("save")} 
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${localMetrics.isSaved ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-3 font-bold">
                    <Bookmark size={20} fill={localMetrics.isSaved ? "currentColor" : "none"} />
                    {localMetrics.isSaved ? "Saved" : "Save for later"}
                  </div>
                </button>

                <button 
                  onClick={() => handleInteract("share")} 
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all font-bold"
                >
                  <Share2 size={20} />
                  Share Story
                </button>
              </div>
            </div>

            {/* Related Stories */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Related Stories</h4>
                <div className="space-y-6">
                  {relatedBlogs.map((rel) => (
                    <div 
                      key={rel._id} 
                      onClick={() => router.push(`/about/blogs/${rel._id}`)}
                      className="group cursor-pointer flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <SmartMedia src={rel.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="font-bold text-[#111827] text-sm leading-snug group-hover:text-[#FF2D7A] transition-colors line-clamp-2">
                          {rel.title}
                        </h5>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          <Calendar size={10} />
                          {new Date(rel.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => router.push("/about/blogs")}
                  className="w-full mt-8 py-3 text-sm font-black text-gray-400 hover:text-[#FF2D7A] border-2 border-dashed border-gray-100 hover:border-pink-100 rounded-2xl transition-all"
                >
                  View All Stories
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        vendorName={blog.title} 
      />
    </div>
  );
}
