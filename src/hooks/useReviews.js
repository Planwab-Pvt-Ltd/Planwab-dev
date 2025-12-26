// hooks/useReviews.js

"use client";

import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const getEmptyStats = () => ({
  averageRating: 0,
  totalReviews: 0,
  distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
});

export function useReviews(vendorId) {
  const { user, isSignedIn, isLoaded } = useUser();

  // State
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(getEmptyStats());
  const [userReview, setUserReview] = useState(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Filters
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");

  // Error state
  const [error, setError] = useState(null);

  // ===================
  // FETCH REVIEWS
  // ===================
  const fetchReviews = useCallback(
    async (pageNum = 1, reset = false) => {
      if (!vendorId) return;

      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "10",
          sortBy,
        });

        if (filterRating && filterRating !== "all") {
          params.append("rating", filterRating);
        }

        const response = await fetch(`/api/vendor/${vendorId}/reviews?${params}`);
        const data = await response.json();

        if (data.success) {
          const {
            reviews: newReviews,
            stats: newStats,
            pagination,
            userReview: existingReview,
            hasUserReviewed: reviewed,
          } = data.data;

          setReviews((prev) => (reset ? newReviews : [...prev, ...newReviews]));
          setStats(newStats);
          setPage(pagination.page);
          setHasMore(pagination.hasNext);
          setTotal(pagination.total);
          setUserReview(existingReview);
          setHasUserReviewed(reviewed);
          setError(null);
        } else {
          setError(data.message || "Failed to load reviews");
          if (reset) {
            setReviews([]);
            setStats(getEmptyStats());
          }
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Unable to load reviews. Please try again.");
        if (reset) {
          setReviews([]);
          setStats(getEmptyStats());
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [vendorId, sortBy, filterRating]
  );

  // Fetch on mount and when filters change
  useEffect(() => {
    if (vendorId) {
      fetchReviews(1, true);
    }
  }, [vendorId, sortBy, filterRating, fetchReviews]);

  // ===================
  // LOAD MORE
  // ===================
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchReviews(page + 1, false);
    }
  }, [loadingMore, hasMore, page, fetchReviews]);

  // ===================
  // SUBMIT REVIEW
  // ===================
  const submitReview = useCallback(
    async ({ rating, title, text, eventType, eventDate, images }) => {
      if (!isSignedIn) {
        toast.error("Please sign in to write a review");
        return { success: false };
      }

      if (!rating || rating < 1 || rating > 5) {
        toast.error("Please select a rating");
        return { success: false };
      }

      if (!text || !text.trim()) {
        toast.error("Please write your review");
        return { success: false };
      }

      setSubmitting(true);

      try {
        const response = await fetch(`/api/vendor/${vendorId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            title: title?.trim() || "",
            text: text.trim(),
            eventType: eventType || "",
            eventDate: eventDate || null,
            images: images || [],
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success(data.message || "Review posted successfully!");
          setReviews((prev) => [data.data.review, ...prev]);
          setStats(data.data.updatedStats);
          setHasUserReviewed(true);
          setUserReview(data.data.review);
          return { success: true, review: data.data.review };
        } else {
          toast.error(data.message || "Failed to post review");
          return { success: false, message: data.message };
        }
      } catch (err) {
        console.error("Error submitting review:", err);
        toast.error("Something went wrong. Please try again.");
        return { success: false };
      } finally {
        setSubmitting(false);
      }
    },
    [vendorId, isSignedIn]
  );

  // ===================
  // UPDATE REVIEW
  // ===================
  const updateReview = useCallback(
    async (reviewId, { rating, title, text, eventType }) => {
      if (!isSignedIn) {
        toast.error("Please sign in to edit your review");
        return { success: false };
      }

      setSubmitting(true);

      try {
        const response = await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "edit",
            rating,
            title,
            text,
            eventType,
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success(data.message || "Review updated!");
          setReviews((prev) => prev.map((r) => (r.id === reviewId ? data.data.review : r)));
          setStats(data.data.updatedStats);
          setUserReview(data.data.review);
          return { success: true, review: data.data.review };
        } else {
          toast.error(data.message || "Failed to update review");
          return { success: false };
        }
      } catch (err) {
        console.error("Error updating review:", err);
        toast.error("Something went wrong. Please try again.");
        return { success: false };
      } finally {
        setSubmitting(false);
      }
    },
    [vendorId, isSignedIn]
  );

  // ===================
  // DELETE REVIEW
  // ===================
  const deleteReview = useCallback(
    async (reviewId) => {
      if (!isSignedIn) {
        toast.error("Please sign in to delete your review");
        return { success: false };
      }

      try {
        const response = await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          toast.success(data.message || "Review deleted");
          setReviews((prev) => prev.filter((r) => r.id !== reviewId));
          setStats(data.data.updatedStats);
          setHasUserReviewed(false);
          setUserReview(null);
          return { success: true };
        } else {
          toast.error(data.message || "Failed to delete review");
          return { success: false };
        }
      } catch (err) {
        console.error("Error deleting review:", err);
        toast.error("Something went wrong. Please try again.");
        return { success: false };
      }
    },
    [vendorId, isSignedIn]
  );

  // ===================
  // VOTE ON REVIEW
  // ===================
  const voteReview = useCallback(
    async (reviewId, voteType) => {
      if (!isSignedIn) {
        toast.error("Please sign in to vote");
        return { success: false };
      }

      try {
        const response = await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: voteType }),
        });

        const data = await response.json();

        if (data.success) {
          setReviews((prev) =>
            prev.map((r) =>
              r.id === reviewId
                ? {
                    ...r,
                    helpful: data.data.helpful,
                    notHelpful: data.data.notHelpful,
                    helpfulUsers: data.data.helpfulUsers,
                    notHelpfulUsers: data.data.notHelpfulUsers,
                  }
                : r
            )
          );
          return { success: true };
        } else {
          toast.error(data.message || "Failed to record vote");
          return { success: false };
        }
      } catch (err) {
        console.error("Error voting:", err);
        toast.error("Something went wrong");
        return { success: false };
      }
    },
    [vendorId, isSignedIn]
  );

  // ===================
  // ADD REPLY
  // ===================
  const addReply = useCallback(
    async (reviewId, text, isVendorReply = false) => {
      if (!isSignedIn) {
        toast.error("Please sign in to reply");
        return { success: false };
      }

      if (!text || !text.trim()) {
        toast.error("Please write your reply");
        return { success: false };
      }

      try {
        const response = await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "reply",
            text: text.trim(),
            isVendorReply,
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Reply posted!");
          setReviews((prev) =>
            prev.map((r) => (r.id === reviewId ? { ...r, replies: [...(r.replies || []), data.data.reply] } : r))
          );
          return { success: true, reply: data.data.reply };
        } else {
          toast.error(data.message || "Failed to post reply");
          return { success: false };
        }
      } catch (err) {
        console.error("Error adding reply:", err);
        toast.error("Something went wrong");
        return { success: false };
      }
    },
    [vendorId, isSignedIn]
  );

  // ===================
  // FLAG REVIEW
  // ===================
  const flagReview = useCallback(
    async (reviewId, reason) => {
      if (!isSignedIn) {
        toast.error("Please sign in to report");
        return { success: false };
      }

      try {
        const response = await fetch(`/api/vendor/${vendorId}/reviews/${reviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "flag",
            reason: reason || "Inappropriate content",
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success(data.message || "Review reported");
          return { success: true };
        } else {
          toast.error(data.message || "Failed to report review");
          return { success: false };
        }
      } catch (err) {
        console.error("Error flagging review:", err);
        toast.error("Something went wrong");
        return { success: false };
      }
    },
    [vendorId, isSignedIn]
  );

  // ===================
  // CHANGE FILTERS
  // ===================
  const changeSortBy = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setPage(1);
  }, []);

  const changeFilterRating = useCallback((newFilter) => {
    setFilterRating(newFilter);
    setPage(1);
  }, []);

  // ===================
  // REFRESH
  // ===================
  const refresh = useCallback(() => {
    fetchReviews(1, true);
  }, [fetchReviews]);

  // ===================
  // CURRENT USER INFO
  // ===================
  const currentUser = {
    id: user?.id || null,
    name: user?.fullName || user?.firstName || user?.username || "",
    avatar: user?.imageUrl || "",
    isSignedIn: isSignedIn || false,
    isLoaded: isLoaded || false,
  };

  return {
    // Data
    reviews,
    stats,
    userReview,
    hasUserReviewed,
    currentUser,

    // Loading states
    loading,
    submitting,
    loadingMore,

    // Pagination
    page,
    hasMore,
    total,
    loadMore,

    // Filters
    sortBy,
    filterRating,
    changeSortBy,
    changeFilterRating,

    // Actions
    submitReview,
    updateReview,
    deleteReview,
    voteReview,
    addReply,
    flagReview,
    refresh,

    // Error
    error,
  };
}
