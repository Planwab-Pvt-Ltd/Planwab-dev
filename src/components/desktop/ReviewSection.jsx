// components/reviews/ReviewSection.jsx
"use client";

import React, { useState, useEffect, Fragment, useCallback } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Flag,
  MoreVertical,
  X,
  ChevronDown,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  Share2,
  User,
  CheckCircle2,
  Reply,
} from "lucide-react";

// =============================================================================
// HELPER: STAR RATING DISPLAY/INPUT
// =============================================================================
const StarRating = ({ rating, size = "md", interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-8 h-8",
  };

  const starSize = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-all duration-200" : "cursor-default"}`}
        >
          <Star
            className={`${starSize} ${
              star <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            } transition-all duration-200`}
          />
        </button>
      ))}
    </div>
  );
};

// =============================================================================
// HELPER: RATING BAR
// =============================================================================
const RatingBar = ({ stars, percentage, count, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 p-2 rounded-xl transition-all duration-300 ${
      isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 ring-2 ring-blue-200 dark:ring-blue-700 shadow-sm" : ""
    }`}
  >
    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 w-3">{stars}</span>
    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          isActive ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm" : "bg-gradient-to-r from-yellow-400 to-amber-400"
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8 text-right">{count}</span>
  </button>
);

// =============================================================================
// SUB-COMPONENT: REVIEW CARD (Updated with Collapsible Replies)
// =============================================================================
const ReviewCard = ({ review, currentUserId, onVote, onReply, onFlag, onEdit, onDelete }) => {
  // --- NEW: State for collapsing replies ---
  const [showReplies, setShowReplies] = useState(false);

  const isOwnReview = review?.clerkUserId === currentUserId;
  const helpfulUsers = review?.helpful?.users || [];
  const notHelpfulUsers = review?.notHelpful?.users || [];

  const isHelpful = helpfulUsers.includes(currentUserId);
  const isNotHelpful = notHelpfulUsers.includes(currentUserId);
  const replyCount = review.replies?.length || 0;

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group">
      {/* ... (Header: User Info & Options Menu - ENHANCED) ... */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0 border-2 border-white dark:border-gray-700 shadow-md group-hover:shadow-lg transition-all duration-300">
            {review.userAvatar ? (
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-inner">
                {review.userName?.slice(0, 2).toUpperCase() || "US"}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{review.userName}</h4>
              {review.isVerified && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold border border-green-200 dark:border-green-800 shadow-sm">
                  <CheckCircle2 size={10} /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-[10px] text-gray-400">• {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Options Menu (Enhanced) */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105">
            <MoreVertical size={16} />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-10 overflow-hidden focus:outline-none backdrop-blur-sm">
              {isOwnReview ? (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onEdit(review)}
                        className={`${
                          active ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" : ""
                        } flex items-center w-full px-4 py-3 text-xs text-gray-700 dark:text-gray-200 gap-2 transition-all duration-200`}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onDelete(review._id)}
                        className={`${
                          active ? "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20" : ""
                        } flex items-center w-full px-4 py-3 text-xs text-red-600 gap-2 transition-all duration-200`}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onFlag(review._id)}
                      className={`${
                        active ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800" : ""
                      } flex items-center w-full px-4 py-3 text-xs text-gray-700 dark:text-gray-200 gap-2 transition-all duration-200`}
                    >
                      <Flag size={12} /> Report
                    </button>
                  )}
                </Menu.Item>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Review Content (Enhanced) */}
      <div className="mb-4">
        {review.title && <h5 className="font-bold text-sm text-gray-900 dark:text-white mb-2">{review.title}</h5>}
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{review.text}</p>
      </div>

      {/* Images (Enhanced) */}
      {review.images?.length > 0 && (
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {review.images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <img
                src={typeof img === "string" ? img : img.url}
                className="w-full h-full object-cover"
                alt="Review"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Actions Bar (Enhanced with Toggle Button) */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onVote(review._id, "helpful")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-200 px-3 py-1.5 rounded-lg ${
              isHelpful 
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            }`}
          >
            <ThumbsUp size={14} className={isHelpful ? "fill-current" : ""} />
            <span>Helpful ({review?.helpful?.count || 0})</span>
          </button>
          <button
            onClick={() => onVote(review._id, "notHelpful")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-200 px-3 py-1.5 rounded-lg ${
              isNotHelpful 
                ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
                : "text-gray-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20"
            }`}
          >
            <ThumbsDown size={14} className={isNotHelpful ? "fill-current" : ""} />
          </button>
          <button
            onClick={() => onReply(review)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MessageCircle size={14} />
            <span>Reply</span>
          </button>
        </div>

        {/* --- ENHANCED: Toggle Replies Button --- */}
        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            {showReplies ? "Hide Replies" : `View ${replyCount} Repl${replyCount === 1 ? "y" : "ies"}`}
            <ChevronDown size={14} className={`transition-transform duration-300 ${showReplies ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* --- ENHANCED: Collapsible Replies Section --- */}
      {replyCount > 0 && showReplies && (
        <div className="mt-4 space-y-3 pl-4 border-l-2 border-gradient-to-b from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 animate-in slide-in-from-top-2 duration-300">
          {review.replies.map((reply, idx) => (
            <div key={idx} className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border border-white dark:border-gray-600 shadow-sm">
                  {reply.userAvatar ? (
                    <img src={reply.userAvatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                      {reply.userName?.slice(0, 1)}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{reply.userName}</span>
                {reply.isVendorReply && (
                  <span className="text-[9px] bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg font-bold border border-blue-200 dark:border-blue-700">
                    Vendor
                  </span>
                )}
                <span className="text-[10px] text-gray-400 ml-auto">
                  {new Date(reply.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 pl-8 leading-relaxed">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SUB-COMPONENT: WRITE/EDIT MODAL - ENHANCED
// =============================================================================
const WriteReviewModal = ({ isOpen, onClose, onSubmit, submitting, vendorName, editingReview }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRating(editingReview?.rating || 0);
      setTitle(editingReview?.title || "");
      setText(editingReview?.text || "");
      setEventType(editingReview?.eventType || "");
    }
  }, [isOpen, editingReview]);

  const handleSubmit = () => {
    onSubmit({ rating, title, text, eventType });
  };

  const eventTypes = ["Wedding", "Corporate", "Birthday", "Other"];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 shadow-2xl transition-all border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-black text-gray-900 dark:text-white">
                  {editingReview ? "Edit Review" : "Write a Review"}
                </Dialog.Title>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {vendorName && (
                <p className="text-sm text-gray-500 mb-6 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg text-center">
                  For {vendorName}
                </p>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Rating</label>
                  <div className="flex justify-center">
                    <StarRating rating={rating} size="xl" interactive onChange={setRating} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Review Title</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all duration-200"
                    placeholder="Short summary (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Review</label>
                  <textarea
                    rows={4}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white transition-all duration-200"
                    placeholder="Share your experience..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all duration-200"
                  >
                    <option value="">Select Event Type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || rating === 0 || !text.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transform"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : editingReview ? (
                    "Update Review"
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// =============================================================================
// SUB-COMPONENT: REPLY MODAL - ENHANCED
// =============================================================================
const ReplyModal = ({ isOpen, onClose, onSubmit, submitting, review }) => {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    onSubmit(review._id, replyText);
    setReplyText("");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 shadow-2xl transition-all border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
              <Dialog.Title className="text-xl font-black mb-6 dark:text-white">
                Reply to {review?.userName}
              </Dialog.Title>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-6 dark:text-white transition-all duration-200"
              />
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !replyText.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm flex justify-center items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] transform"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : "Post Reply"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ReviewSection({ vendorId, vendorName }) {
  const { user, isLoaded: isAuthLoaded } = useUser();

  // State
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");

  // Modals
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  // Action Loading States
  const [submitting, setSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const currentUserId = user?.id;

  // --- FETCH REVIEWS ---
  const fetchReviews = useCallback(
    async (pageParam, isReset) => {
      if (!vendorId) return;

      if (isReset) setLoading(true);
      else setLoadingMore(true);

      try {
        const query = new URLSearchParams({
          page: pageParam, // Use the passed parameter, not state
          limit: 5,
          sortBy,
          rating: filterRating && filterRating !== "all" ? filterRating : "",
        });

        const res = await fetch(`/api/vendor/${vendorId}/reviews?${query}`);
        const data = await res.json();

        if (data.success) {
          if (isReset) {
            setReviews(data.data.reviews);
            setPage(1); // Reset page state here
          } else {
            setReviews((prev) => [...prev, ...data.data.reviews]);
            setPage(pageParam); // Update page state here
          }
          setStats(data.data.stats);
          setHasMore(data.data.pagination.hasNext);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [vendorId, sortBy, filterRating]
  );

  // Initial Load & Filter Changes
  useEffect(() => {
    fetchReviews(1, true);
  }, [fetchReviews]);

  // --- ACTIONS ---

  const handleWriteReview = () => {
    if (!user) return toast.error("Please login to review");
    setEditingReview(null);
    setShowWriteModal(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchReviews(page + 1, false);
    }
  };

  const handleSubmitReview = async (data) => {
    setSubmitting(true);
    try {
      const isEdit = !!editingReview;
      const url = isEdit ? `/api/vendor/${vendorId}/reviews/${editingReview._id}` : `/api/vendor/${vendorId}/reviews`;

      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit ? { ...data, action: "edit" } : data;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setShowWriteModal(false);
        // Refresh reviews to show new one
        fetchReviews(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (reviewId, type) => {
    if (!user) return toast.error("Please login to vote");

    // Optimistic Update
    setReviews((prev) =>
      prev.map((r) => {
        if (r._id === reviewId) {
          const isHelpful = r.helpful?.users?.includes(currentUserId);
          const isNotHelpful = r.notHelpful?.users?.includes(currentUserId);

          let newHelpful = { ...r.helpful, users: [...(r.helpful?.users || [])] };
          let newNotHelpful = { ...r.notHelpful, users: [...(r.notHelpful?.users || [])] };

          if (type === "helpful") {
            if (isHelpful) {
              newHelpful.users = newHelpful.users.filter((id) => id !== currentUserId);
              newHelpful.count--;
            } else {
              newHelpful.users.push(currentUserId);
              newHelpful.count++;
              if (isNotHelpful) {
                newNotHelpful.users = newNotHelpful.users.filter((id) => id !== currentUserId);
                newNotHelpful.count--;
              }
            }
          } else {
            // Logic for notHelpful toggling... (Simplified for brevity, API handles truth)
            if (isNotHelpful) {
              newNotHelpful.users = newNotHelpful.users.filter((id) => id !== currentUserId);
            } else {
              newNotHelpful.users.push(currentUserId);
              if (isHelpful) {
                newHelpful.users = newHelpful.users.filter((id) => id !== currentUserId);
                newHelpful.count--;
              }
            }
          }
          return { ...r, helpful: newHelpful, notHelpful: newNotHelpful };
        }
        return r;
      })
    );

    try {
      await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: type }),
      });
    } catch (error) {
      // Revert if failed (omitted for brevity, ideally refetch)
      console.error("Vote failed");
    }
  };

  const handleReply = (review) => {
    if (!user) return toast.error("Please login to reply");
    setReplyingTo(review);
    setShowReplyModal(true);
  };

  const handleSubmitReply = async (reviewId, text) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", text }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Reply posted");
        setShowReplyModal(false);
        // Optimistically add reply
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, replies: [...(r.replies || []), result.data.reply] } : r))
        );
      }
    } catch (error) {
      toast.error("Failed to reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Review deleted");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        // Update stats roughly or refetch
        fetchReviews(true);
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleFlag = async (reviewId) => {
    if (!user) return toast.error("Please login to report");
    const reason = prompt("Reason for reporting:");
    if (!reason) return;

    try {
      const res = await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "flag", reason }),
      });
      if (res.ok) toast.success("Review reported");
    } catch (error) {
      toast.error("Failed to report");
    }
  };

  // --- RENDER ---
  return (
    <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
      {/* Header Section - Enhanced */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            Reviews & Ratings
            {stats && (
              <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                ({stats?.totalReviews})
              </span>
            )}
          </h2>
        </div>

        <button
          onClick={handleWriteReview}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2 hover:scale-105 transform"
        >
          <Edit2 size={16} />
          Write a Review
        </button>
      </div>

      {/* --- ENHANCED STATS BOARD --- */}
      {(stats || loading) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-800/50 dark:via-gray-900 dark:to-blue-900/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg">
          {/* Total Score - Enhanced */}
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-600 pb-6 md:pb-0">
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-6xl font-black text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stats?.averageRating ? stats?.averageRating?.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm text-gray-400 font-medium">/5</span>
            </div>
            <div className="mb-3">
              <StarRating rating={Math.round(stats?.averageRating || 0)} size="lg" />
            </div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider text-center">
              Based on {stats?.totalReviews} reviews
            </p>
          </div>

          {/* Distribution Bars - Enhanced */}
          <div className="col-span-2 space-y-2 flex flex-col justify-center">
            {[5, 4, 3, 2, 1]?.map((star) => (
              <RatingBar
                key={star}
                stars={star}
                percentage={stats?.distribution?.[star] || 0}
                count={stats?.counts?.[star] || 0}
                isActive={filterRating === String(star)}
                onClick={() => setFilterRating(filterRating === String(star) ? "all" : String(star))}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- ENHANCED FILTER & SORT BAR --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Star Filters (Enhanced Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilterRating("all")}
            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border shadow-sm hover:shadow-md ${
              filterRating === "all"
                ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white border-gray-900 dark:from-white dark:to-gray-100 dark:text-black dark:border-white shadow-lg"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(filterRating === String(star) ? "all" : String(star))}
              className={`px-3 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border shadow-sm hover:shadow-md flex items-center gap-1.5 ${
                filterRating === String(star)
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {star} <Star size={11} className={filterRating === String(star) ? "fill-white" : "fill-gray-400"} />
            </button>
          ))}
        </div>

        {/* Enhanced Sort Dropdown */}
        <Menu as="div" className="relative flex-shrink-0">
          <Menu.Button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md">
            <span className="text-gray-400 font-normal">Sort by:</span>
            {sortBy === "recent" && "Most Recent"}
            {sortBy === "helpful" && "Most Helpful"}
            {sortBy === "rating_high" && "Highest Rated"}
            {sortBy === "rating_low" && "Lowest Rated"}
            <ChevronDown size={14} />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 focus:outline-none z-20 overflow-hidden p-1 backdrop-blur-sm">
              {[
                { label: "Most Recent", value: "recent" },
                { label: "Most Helpful", value: "helpful" },
                { label: "Highest Rated", value: "rating_high" },
                { label: "Lowest Rated", value: "rating_low" },
              ].map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() => setSortBy(option.value)}
                      className={`${
                        active ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600" : "text-gray-700 dark:text-gray-300"
                      } ${
                        sortBy === option.value ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600" : ""
                      } group flex w-full items-center rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200`}
                    >
                      {option.label}
                      {sortBy === option.value && <CheckCircle2 size={12} className="ml-auto" />}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Reviews List - Enhanced */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="relative">
              <Loader2 className="animate-spin text-blue-600 text-3xl" />
              <div className="absolute inset-0 animate-ping">
                <Loader2 className="text-blue-400 text-3xl opacity-20" />
              </div>
            </div>
            <p className="text-sm text-gray-400 font-medium">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-800/50 dark:via-gray-900 dark:to-blue-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-bold text-gray-500 mb-1">No reviews yet</p>
            <p className="text-sm text-gray-400">Be the first to create one!</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ReviewCard
                review={review}
                currentUserId={currentUserId}
                onVote={handleVote}
                onReply={handleReply}
                onFlag={handleFlag}
                onEdit={() => {
                  setEditingReview(review);
                  setShowWriteModal(true);
                }}
                onDelete={handleDelete}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Enhanced Load More */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="w-full py-4 mt-6 text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md hover:scale-[1.02] transform"
        >
          {loadingMore ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Loading...
            </span>
          ) : (
            "Load More Reviews"
          )}
        </button>
      )}

      {/* Modals */}
      <WriteReviewModal
        isOpen={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onSubmit={handleSubmitReview}
        submitting={submitting}
        vendorName={vendorName}
        editingReview={editingReview}
      />

      <ReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        onSubmit={handleSubmitReply}
        submitting={submitting}
        review={replyingTo}
      />
    </div>
  );
}
