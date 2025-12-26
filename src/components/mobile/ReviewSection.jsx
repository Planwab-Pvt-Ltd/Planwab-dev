// components/reviews/ReviewSection.jsx

"use client";

import React, { useState, Fragment } from "react";
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
  Camera,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useReviews } from "@/hooks/useReviews";

// =============================================================================
// STAR RATING COMPONENT
// =============================================================================
const StarRating = ({ rating, size = "md", interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
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
              star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

// =============================================================================
// RATING DISTRIBUTION BAR
// =============================================================================
const RatingBar = ({ stars, percentage, count, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full group hover:bg-gray-50 p-1 rounded transition-colors ${
      isActive ? "bg-pink-50" : ""
    }`}
  >
    <span className="text-sm text-gray-600 w-6">{stars}</span>
    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${isActive ? "bg-pink-500" : "bg-yellow-400"}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
  </button>
);

// =============================================================================
// AVATAR COMPONENT
// =============================================================================
const Avatar = ({ src, initials, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  if (src) {
    return <img src={src} alt="User avatar" className={`${sizes[size]} rounded-full object-cover`} />;
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-medium`}
    >
      {initials}
    </div>
  );
};

// =============================================================================
// REVIEW CARD COMPONENT
// =============================================================================
const ReviewCard = ({ review, currentUserId, onVote, onReply, onFlag, onEdit, onDelete }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const isOwner = currentUserId === review.clerkUserId;
  const hasVotedHelpful = review.helpfulUsers?.includes(currentUserId);
  const hasVotedNotHelpful = review.notHelpfulUsers?.includes(currentUserId);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    const result = await onReply(review.id, replyText);
    setSubmittingReply(false);

    if (result.success) {
      setReplyText("");
      setShowReplyInput(false);
      setShowReplies(true);
    }
  };

  return (
    <div className="border-b border-gray-100 pb-6 last:border-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={review.userAvatar} initials={review.userInitials} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{review.userName}</span>
              {review.isVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
              )}
              {review.isBookingVerified && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Booked</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-500">{review.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
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
            <Menu.Items className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
              {isOwner && (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onEdit(review)}
                        className={`${
                          active ? "bg-gray-50" : ""
                        } flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit review
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onDelete(review.id)}
                        className={`${
                          active ? "bg-gray-50" : ""
                        } flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete review
                      </button>
                    )}
                  </Menu.Item>
                </>
              )}
              {!isOwner && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onFlag(review.id)}
                      className={`${
                        active ? "bg-gray-50" : ""
                      } flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <Flag className="w-4 h-4" />
                      Report review
                    </button>
                  )}
                </Menu.Item>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Title */}
      {review.title && <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>}

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed mb-3">{review.text}</p>

      {/* Event Info */}
      {review.eventType && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{review.eventType}</span>
          {review.eventDate && (
            <>
              <span>·</span>
              <span>{new Date(review.eventDate).toLocaleDateString()}</span>
            </>
          )}
        </div>
      )}

      {/* Images */}
      {review.images?.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={img.caption || `Review image ${idx + 1}`}
              className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            />
          ))}
        </div>
      )}

      {/* Vendor Response */}
      {review.vendorResponse && (
        <div className="bg-gray-50 rounded-lg p-4 mb-3 ml-6 border-l-2 border-pink-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-pink-600">Vendor Response</span>
            <span className="text-xs text-gray-500">{review.vendorResponse.timeAgo}</span>
          </div>
          <p className="text-sm text-gray-700">{review.vendorResponse.text}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => onVote(review.id, "helpful")}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            hasVotedHelpful ? "text-pink-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasVotedHelpful ? "fill-current" : ""}`} />
          <span>Helpful ({review.helpful})</span>
        </button>

        <button
          onClick={() => onVote(review.id, "notHelpful")}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            hasVotedNotHelpful ? "text-gray-700" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ThumbsDown className={`w-4 h-4 ${hasVotedNotHelpful ? "fill-current" : ""}`} />
          <span>({review.notHelpful})</span>
        </button>

        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Reply</span>
        </button>

        {review.replies?.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-pink-600 hover:text-pink-700 transition-colors"
          >
            {showReplies ? "Hide" : "Show"} {review.replies.length} repl
            {review.replies.length === 1 ? "y" : "ies"}
          </button>
        )}
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="mt-4 ml-6">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setShowReplyInput(false);
                setReplyText("");
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReplySubmit}
              disabled={!replyText.trim() || submittingReply}
              className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submittingReply && <Loader2 className="w-4 h-4 animate-spin" />}
              Post Reply
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {showReplies && review.replies?.length > 0 && (
        <div className="mt-4 ml-6 space-y-4">
          {review.replies.map((reply) => (
            <div
              key={reply.id}
              className={`p-4 rounded-lg ${
                reply.isVendorReply ? "bg-pink-50 border-l-2 border-pink-500" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar src={reply.userAvatar} initials={reply.userInitials} size="sm" />
                <span className="font-medium text-sm text-gray-900">{reply.userName}</span>
                {reply.isVendorReply && (
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Vendor</span>
                )}
                <span className="text-xs text-gray-500">{reply.timeAgo}</span>
              </div>
              <p className="text-sm text-gray-700">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// WRITE REVIEW MODAL
// =============================================================================
const WriteReviewModal = ({ isOpen, onClose, onSubmit, submitting, vendorName, editingReview = null }) => {
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [title, setTitle] = useState(editingReview?.title || "");
  const [text, setText] = useState(editingReview?.text || "");
  const [eventType, setEventType] = useState(editingReview?.eventType || "");

  const eventTypes = [
    "Wedding",
    "Corporate",
    "Birthday",
    "Conference",
    "Reception",
    "Engagement",
    "Anniversary",
    "Party",
    "Other",
  ];

  const handleSubmit = async () => {
    const result = await onSubmit({ rating, title, text, eventType });
    if (result.success) {
      onClose();
      setRating(0);
      setTitle("");
      setText("");
      setEventType("");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    {editingReview ? "Edit Your Review" : "Write a Review"}
                  </Dialog.Title>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {vendorName && (
                  <p className="text-gray-600 mb-4">
                    Share your experience with <span className="font-medium">{vendorName}</span>
                  </p>
                )}

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <StarRating rating={rating} size="xl" interactive onChange={setRating} />
                    <span className="text-sm text-gray-500 ml-2">
                      {rating > 0 && (
                        <>
                          {rating === 5 && "Excellent!"}
                          {rating === 4 && "Very Good"}
                          {rating === 3 && "Good"}
                          {rating === 2 && "Fair"}
                          {rating === 1 && "Poor"}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={200}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Review Text */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tell others about your experience..."
                    rows={5}
                    maxLength={5000}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">{text.length}/5000</p>
                </div>

                {/* Event Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="">Select event type (optional)</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!rating || !text.trim() || submitting}
                    className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {editingReview ? "Update Review" : "Post Review"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// =============================================================================
// MAIN REVIEW SECTION COMPONENT
// =============================================================================
export default function ReviewSection({ vendorId, vendorName }) {
  const { isSignedIn } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const {
    reviews,
    stats,
    userReview,
    hasUserReviewed,
    currentUser,
    loading,
    submitting,
    loadingMore,
    hasMore,
    sortBy,
    filterRating,
    changeSortBy,
    changeFilterRating,
    submitReview,
    updateReview,
    deleteReview,
    voteReview,
    addReply,
    flagReview,
    loadMore,
    error,
  } = useReviews(vendorId);

  const handleSubmitReview = async (data) => {
    if (editingReview) {
      return await updateReview(editingReview.id, data);
    }
    return await submitReview(data);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowModal(true);
  };

  const handleDelete = async (reviewId) => {
    const result = await deleteReview(reviewId);
    if (result.success) {
      setShowDeleteConfirm(null);
    }
  };

  const handleFlag = async (reviewId) => {
    const reason = prompt("Please provide a reason for reporting this review:");
    if (reason) {
      await flagReview(reviewId, reason);
    }
  };

  const handleWriteReview = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to write a review");
      return;
    }
    setEditingReview(null);
    setShowModal(true);
  };

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "helpful", label: "Most Helpful" },
    { value: "rating_high", label: "Highest Rated" },
    { value: "rating_low", label: "Lowest Rated" },
    { value: "oldest", label: "Oldest First" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
          <p className="text-gray-600 mt-1">
            {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
          </p>
        </div>

        {isSignedIn ? (
          hasUserReviewed ? (
            <button
              onClick={() => handleEdit(userReview)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors font-medium"
            >
              <Edit2 className="w-5 h-5" />
              Edit Your Review
            </button>
          ) : (
            <button
              onClick={handleWriteReview}
              className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              <Star className="w-5 h-5" />
              Write a Review
            </button>
          )
        ) : (
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
              <Star className="w-5 h-5" />
              Sign in to Review
            </button>
          </SignInButton>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
        {/* Overall Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(stats.averageRating)} size="md" />
            <p className="text-sm text-gray-500 mt-1">
              {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBar
              key={star}
              stars={star}
              percentage={stats.distribution[star]}
              count={stats.counts?.[star] || 0}
              isActive={filterRating === star.toString()}
              onClick={() => changeFilterRating(filterRating === star.toString() ? "all" : star.toString())}
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Sort */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            {sortOptions.find((o) => o.value === sortBy)?.label || "Sort by"}
            <ChevronDown className="w-4 h-4" />
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
            <Menu.Items className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
              {sortOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() => changeSortBy(option.value)}
                      className={`${active ? "bg-gray-50" : ""} ${
                        sortBy === option.value ? "text-pink-600 font-medium" : "text-gray-700"
                      } w-full px-4 py-2 text-sm text-left`}
                    >
                      {option.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Clear Filter */}
        {filterRating !== "all" && (
          <button
            onClick={() => changeFilterRating("all")}
            className="flex items-center gap-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200 transition-colors"
          >
            {filterRating} star{filterRating !== "1" ? "s" : ""} only
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && (
        <>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
              {isSignedIn ? (
                <button
                  onClick={handleWriteReview}
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                >
                  Write the First Review
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
                    Sign in to Review
                  </button>
                </SignInButton>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={currentUser.id}
                  onVote={voteReview}
                  onReply={addReply}
                  onFlag={handleFlag}
                  onEdit={handleEdit}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loadingMore && <Loader2 className="w-5 h-5 animate-spin" />}
                Load More Reviews
              </button>
            </div>
          )}
        </>
      )}

      {/* Write/Edit Review Modal */}
      <WriteReviewModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingReview(null);
        }}
        onSubmit={handleSubmitReview}
        submitting={submitting}
        vendorName={vendorName}
        editingReview={editingReview}
      />

      {/* Delete Confirmation Dialog */}
      <Transition appear show={!!showDeleteConfirm} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteConfirm(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">Delete Review</Dialog.Title>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete your review? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(showDeleteConfirm)}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
