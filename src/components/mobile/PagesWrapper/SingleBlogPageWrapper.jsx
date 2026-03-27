"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { 
  ArrowLeft, Heart, Bookmark, Share2, 
  Calendar, Clock, User, Loader2, Star,
  MessageCircle, ChevronLeft
} from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import { ShareModal } from "../../desktop/PagesWrapper/VendorProfilePageWrapper";

export default function MobileSingleBlogPageWrapper() {
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

        // Fetch related blogs
        try {
          const relRes = await fetch(`/api/blogs?category=${blogData.data.category}&limit=4`, { cache: 'no-store' });
          if (relRes.ok) {
            const relData = await relRes.json();
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
      // Simple revert
      if (action === "like") setLocalMetrics(p => ({ ...p, isLiked: !p.isLiked, likeCount: p.isLiked ? Math.max(0, p.likeCount - 1) : p.likeCount + 1 }));
      if (action === "save") setLocalMetrics(p => ({ ...p, isSaved: !p.isSaved, saveCount: p.isSaved ? Math.max(0, p.saveCount - 1) : p.saveCount + 1 }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={32} className="text-[#FF2D7A] animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Story not found</h2>
        <button onClick={() => router.push("/m/about/blogs")} className="px-8 py-3 bg-[#FF2D7A] text-white rounded-full font-bold shadow-lg">
          Back to Stories
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 h-16 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 active:scale-90 transition-transform">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <span className="font-extrabold text-sm tracking-tight truncate flex-1">
          {blog.title}
        </span>
      </div>

      <div className="pb-32">
        {blog.coverImage && (
          <div className="w-full aspect-[4/3] relative">
            <SmartMedia src={blog.coverImage} className="w-full h-full object-cover" alt={blog.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-[#FF2D7A] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block">
                {blog.category}
              </span>
            </div>
          </div>
        )}

        <div className="px-6 pt-8">
          <h1 className="text-3xl font-black text-[#111827] leading-[1.2] mb-6">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 mb-10 p-4 bg-gray-50 rounded-[24px]">
            {blog.authorPhoto ? (
              <img src={blog.authorPhoto} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt={blog.authorName} />
            ) : (
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-[#FF2D7A]">
                <User size={24} />
              </div>
            )}
            <div>
              <div className="font-black text-[#111827] text-sm">{blog.authorName}</div>
              <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{blog.readTime || "5 min read"}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-pink max-w-none text-gray-700 leading-relaxed text-lg">
            {blog.excerpt && (
              <p className="font-bold text-gray-900 mb-8 text-xl leading-relaxed italic border-l-4 border-[#FF2D7A] pl-5">
                {blog.excerpt}
              </p>
            )}
            
            <div className="whitespace-pre-wrap break-words">
              {blog.content}
            </div>
          </div>

          <div className="mt-16 pb-6">
            <div className="bg-gray-50/50 backdrop-blur-xl border border-gray-100 rounded-[32px] p-2 flex items-center justify-between shadow-sm">
              <button 
                onClick={() => handleInteract("like")}
                className={`flex items-center gap-2 px-6 py-4 rounded-[26px] transition-all active:scale-90 ${localMetrics.isLiked ? "bg-pink-50 text-pink-500 shadow-sm" : "text-gray-600"}`}
              >
                <Heart size={20} fill={localMetrics.isLiked ? "currentColor" : "none"} />
                <span className="text-sm font-black">{localMetrics.likeCount}</span>
              </button>

              <div className="h-8 w-px bg-gray-200/50" />

              <button 
                onClick={() => handleInteract("save")}
                className={`flex items-center gap-2 px-6 py-4 rounded-[26px] transition-all active:scale-90 ${localMetrics.isSaved ? "bg-amber-50 text-amber-500 shadow-sm" : "text-gray-600"}`}
              >
                <Bookmark size={20} fill={localMetrics.isSaved ? "currentColor" : "none"} />
              </button>

              <div className="h-8 w-px bg-gray-200/50" />

              <button 
                onClick={() => handleInteract("share")}
                className="flex items-center gap-2 px-6 py-4 text-gray-600 active:scale-90 transition-transform rounded-[26px] hover:bg-gray-100/50"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {relatedBlogs.length > 0 && (
            <div className="mt-20">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Continue Reading</h4>
              <div className="space-y-6">
                {relatedBlogs.map((rel) => (
                  <div 
                    key={rel._id} 
                    onClick={() => router.push(`/m/about/blogs/${rel._id}`)}
                    className="flex gap-4 active:scale-95 transition-transform"
                  >
                    <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 shadow-sm">
                      <SmartMedia src={rel.coverImage} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h5 className="font-bold text-[#111827] text-sm leading-snug line-clamp-2">
                        {rel.title}
                      </h5>
                      <span className="text-[10px] text-pink-500 font-black uppercase tracking-widest mt-2">{rel.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
