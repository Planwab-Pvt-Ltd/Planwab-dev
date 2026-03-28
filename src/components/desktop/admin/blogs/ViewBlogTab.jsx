"use client";

import { motion } from "framer-motion";
import { Clock, Tag, Eye, ThumbsUp, MapPin, User, FileText, Share2, Globe, Lock } from "lucide-react";
import DOMPurify from "dompurify";
import { useMemo } from "react";

export default function ViewBlogTab({ request, onBack, onDelete }) {
  if (!request) return null;

  const b = request;
  
  const formattedContent = useMemo(() => {
    return { __html: DOMPurify.sanitize(b.content || "") };
  }, [b.content]);

  return (
    <div className="space-y-6">
      {/* Overview Head */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
        {b.coverImage && (
          <div className="absolute inset-0 opacity-10">
            <img src={b.coverImage} className="w-full h-full object-cover" alt="" />
          </div>
        )}
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
              {b.isPublished ? "Published" : "Draft"}
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-xs font-semibold capitalize">
              {b.category}
            </span>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <Clock size={14} /> {new Date(b.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {b.title}
          </h2>
          {b.excerpt && <p className="text-gray-600 dark:text-gray-300 max-w-3xl">{b.excerpt}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="text-indigo-500" size={20} /> Content Preview
            </h3>
            <div className="prose prose-sm md:prose-base prose-indigo dark:prose-invert max-w-none max-h-[600px] overflow-y-auto pr-2 custom-scrollbar" dangerouslySetInnerHTML={formattedContent} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="text-indigo-500" size={20} /> Author Details
            </h3>
            <div className="flex items-center gap-4 mb-4">
              {b.authorPhoto ? (
                <img src={b.authorPhoto} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                  {b.authorName?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <p className="font-semibold">{b.authorName}</p>
                <p className="text-xs text-gray-500 font-mono" title="Clerk ID">{b.authorClerkId}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Engagement Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Eye size={12} /> Views</p>
                <p className="text-xl font-bold">{b.viewCount || 0}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><ThumbsUp size={12} /> Likes</p>
                <p className="text-xl font-bold">{b.likeCount || 0}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Share2 size={12} /> Shares</p>
                <p className="text-xl font-bold">{b.shareCount || 0}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock size={12} /> Read Time</p>
                <p className="text-xl font-bold">{b.readTime || "-"}</p>
              </div>
            </div>
          </div>

          {b.tags && b.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Tag className="text-indigo-500" size={16} /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {b.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
