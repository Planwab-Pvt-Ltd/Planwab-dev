// components/reviews/ReviewSection.jsx
"use client";

import React, { useState, useEffect, Fragment, useCallback } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Dialog, Transition, Menu } from "@headlessui/react";
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
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
        >
          <Star
            className={`${starSize} ${
              star <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            } transition-colors`}
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
    className={`flex items-center gap-2 w-full group hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors ${
      isActive ? "bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-100 dark:ring-blue-800" : ""
    }`}
  >
    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-3">{stars}</span>
    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${isActive ? "bg-blue-500" : "bg-yellow-400"}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
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
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
      {/* ... (Header: User Info & Options Menu - NO CHANGE HERE) ... */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-700">
            {review.userAvatar ? (
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs">
                {review.userName?.slice(0, 2).toUpperCase() || "US"}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{review.userName}</h4>
              {review.isVerified && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] font-bold border border-green-100 dark:border-green-800">
                  <CheckCircle2 size={8} /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-[10px] text-gray-400">• {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Options Menu (Same as before) */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreVertical size={16} />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-10 overflow-hidden focus:outline-none">
              {isOwnReview ? (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onEdit(review)}
                        className={`${
                          active ? "bg-gray-50 dark:bg-gray-700" : ""
                        } flex items-center w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-200 gap-2`}
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
                          active ? "bg-red-50 dark:bg-red-900/20" : ""
                        } flex items-center w-full px-3 py-2 text-xs text-red-600 gap-2`}
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
                        active ? "bg-gray-50 dark:bg-gray-700" : ""
                      } flex items-center w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-200 gap-2`}
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

      {/* Review Content (NO CHANGE) */}
      <div className="mb-3">
        {review.title && <h5 className="font-bold text-xs text-gray-900 dark:text-white mb-1">{review.title}</h5>}
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{review.text}</p>
      </div>

      {/* Images (NO CHANGE) */}
      {review.images?.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
          {review.images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800"
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

      {/* Actions Bar (Updated with Toggle Button) */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onVote(review._id, "helpful")}
            className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
              isHelpful ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <ThumbsUp size={12} className={isHelpful ? "fill-current" : ""} />
            <span>Helpful ({review?.helpful?.count || 0})</span>
          </button>
          <button
            onClick={() => onVote(review._id, "notHelpful")}
            className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
              isNotHelpful ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <ThumbsDown size={12} className={isNotHelpful ? "fill-current" : ""} />
          </button>
          <button
            onClick={() => onReply(review)}
            className="flex items-center gap-1 text-[10px] font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <MessageCircle size={12} />
            <span>Reply</span>
          </button>
        </div>

        {/* --- NEW: Toggle Replies Button --- */}
        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showReplies ? "Hide Replies" : `View ${replyCount} Repl${replyCount === 1 ? "y" : "ies"}`}
            <ChevronDown size={12} className={`transition-transform duration-200 ${showReplies ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* --- NEW: Collapsible Replies Section --- */}
      {replyCount > 0 && showReplies && (
        <div className="mt-3 space-y-2 pl-3 border-l-2 border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
          {review.replies.map((reply, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200">
                  {reply.userAvatar ? (
                    <img src={reply.userAvatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold">
                      {reply.userName?.slice(0, 1)}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-900 dark:text-white">{reply.userName}</span>
                {reply.isVendorReply && (
                  <span className="text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded font-bold">
                    Vendor
                  </span>
                )}
                <span className="text-[9px] text-gray-400 ml-auto">
                  {new Date(reply.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[10px] text-gray-600 dark:text-gray-300 pl-7">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SUB-COMPONENT: WRITE/EDIT MODAL
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl transition-all border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingReview ? "Edit Review" : "Write a Review"}
                </Dialog.Title>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {vendorName && <p className="text-xs text-gray-500 mb-4">For {vendorName}</p>}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <StarRating rating={rating} size="xl" interactive onChange={setRating} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Review Title</label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    placeholder="Short summary (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Review</label>
                  <textarea
                    rows={4}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white"
                    placeholder="Share your experience..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
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
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin" />
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
// SUB-COMPONENT: REPLY MODAL
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl transition-all">
              <Dialog.Title className="text-lg font-bold mb-4 dark:text-white">
                Reply to {review?.userName}
              </Dialog.Title>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-xs text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !replyText.trim()}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs flex justify-center items-center gap-2"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : "Post Reply"}
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Reviews & Ratings
            {stats && <span className="text-sm font-normal text-gray-500">({stats?.totalReviews})</span>}
          </h2>
        </div>

        <button
          onClick={handleWriteReview}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Edit2 size={14} />
          Write a Review
        </button>
      </div>

      {/* --- STATS BOARD (The Graph Section) --- */}
      {(stats || loading) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
          {/* Total Score */}
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 pb-4 md:pb-0">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900 dark:text-white">
                {stats?.averageRating ? stats?.averageRating?.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm text-gray-400">/5</span>
            </div>
            <div className="mt-2 mb-1">
              <StarRating rating={Math.round(stats?.averageRating || 0)} size="lg" />
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              Based on {stats?.totalReviews} reviews
            </p>
          </div>

          {/* Distribution Bars */}
          <div className="col-span-2 space-y-1.5 flex flex-col justify-center">
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

      {/* --- MODERN FILTER & SORT BAR --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Star Filters (Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilterRating("all")}
            className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
              filterRating === "all"
                ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300"
            }`}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(filterRating === String(star) ? "all" : String(star))}
              className={`px-3 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
                filterRating === String(star)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              {star} <Star size={10} className={filterRating === String(star) ? "fill-white" : "fill-gray-400"} />
            </button>
          ))}
        </div>

        {/* Modern Sort Dropdown */}
        <Menu as="div" className="relative flex-shrink-0">
          <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs font-bold text-gray-700 dark:text-gray-200">
            <span className="text-gray-400 font-normal">Sort by:</span>
            {sortBy === "recent" && "Most Recent"}
            {sortBy === "helpful" && "Most Helpful"}
            {sortBy === "rating_high" && "Highest Rated"}
            {sortBy === "rating_low" && "Lowest Rated"}
            <ChevronDown size={14} />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 focus:outline-none z-20 overflow-hidden p-1">
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
                        active ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-700 dark:text-gray-300"
                      } ${
                        sortBy === option.value ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : ""
                      } group flex w-full items-center rounded-lg px-3 py-2 text-xs font-bold transition-colors`}
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

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Loader2 className="animate-spin text-blue-600" />
            <p className="text-xs text-gray-400">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <MessageCircle size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-500">No reviews yet</p>
            <p className="text-[10px] text-gray-400">Be the first to create one!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review?._id}
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
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <button
          onClick={handleLoadMore} // <--- CHANGE THIS
          disabled={loadingMore}
          className="w-full py-3 mt-4 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
        >
          {loadingMore ? "Loading..." : "Load More Reviews"}
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
