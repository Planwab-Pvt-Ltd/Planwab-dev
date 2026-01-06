"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  Eye,
  MessageCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const BlogPageWrapper = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

  const categories = [
    { id: "all", name: "All", count: 24 },
    { id: "wedding", name: "Wedding", count: 12 },
    { id: "birthday", name: "Birthday", count: 6 },
    { id: "corporate", name: "Corporate", count: 4 },
    { id: "tips", name: "Planning Tips", count: 8 },
  ];

  const featuredPost = {
    id: "featured-1",
    title: "10 Wedding Planning Mistakes to Avoid in 2026",
    excerpt:
      "Planning a wedding can be overwhelming. Here are the most common mistakes couples make and how to avoid them for your perfect day.",
    image: "/blog/wedding-planning.jpg", // Placeholder
    author: "Priya Sharma",
    authorRole: "Senior Wedding Planner",
    date: "January 5, 2026",
    readTime: "8 min read",
    category: "Wedding",
    tags: ["Wedding Planning", "Tips", "Budget"],
    views: 2840,
    likes: 156,
    comments: 24,
    featured: true,
  };

  const blogPosts = [
    {
      id: "1",
      title: "Budget-Friendly Birthday Party Ideas That Kids Will Love",
      excerpt:
        "Create magical birthday memories without breaking the bank. 15 creative ideas for unforgettable celebrations.",
      image: "/blog/birthday-party.jpg",
      author: "Rajesh Kumar",
      date: "January 4, 2026",
      readTime: "6 min read",
      category: "Birthday",
      tags: ["Budget", "Kids", "DIY"],
      views: 1520,
      likes: 89,
      comments: 12,
    },
    {
      id: "2",
      title: "Corporate Event Trends 2026: What's Hot This Year",
      excerpt:
        "Stay ahead of the curve with the latest corporate event trends that will impress your team and clients.",
      image: "/blog/corporate-event.jpg",
      author: "Anita Gupta",
      date: "January 3, 2026",
      readTime: "5 min read",
      category: "Corporate",
      tags: ["Corporate", "Trends", "2026"],
      views: 980,
      likes: 67,
      comments: 8,
    },
    {
      id: "3",
      title: "How to Choose the Perfect Wedding Photographer",
      excerpt:
        "Your wedding photos will last forever. Here's your complete guide to finding the photographer of your dreams.",
      image: "/blog/wedding-photo.jpg",
      author: "Kavya Reddy",
      date: "January 2, 2026",
      readTime: "7 min read",
      category: "Wedding",
      tags: ["Photography", "Wedding", "Vendors"],
      views: 2100,
      likes: 134,
      comments: 19,
    },
    {
      id: "4",
      title: "Seasonal Decoration Ideas for Every Celebration",
      excerpt: "Transform any space with seasonal decorations that match the mood and theme of your special event.",
      image: "/blog/decorations.jpg",
      author: "Meera Joshi",
      date: "December 30, 2025",
      readTime: "4 min read",
      category: "Tips",
      tags: ["Decoration", "Seasonal", "DIY"],
      views: 1350,
      likes: 92,
      comments: 15,
    },
    {
      id: "5",
      title: "Catering Menu Planning: A Complete Guide",
      excerpt: "From guest dietary preferences to budget considerations, plan the perfect menu for your event.",
      image: "/blog/catering.jpg",
      author: "Chef Arjun Singh",
      date: "December 28, 2025",
      readTime: "9 min read",
      category: "Tips",
      tags: ["Catering", "Menu", "Food"],
      views: 1750,
      likes: 110,
      comments: 22,
    },
    {
      id: "6",
      title: "Vendor Spotlight: Success Stories from PlanWAB",
      excerpt:
        "Meet the vendors who transformed their businesses and created countless magical moments through our platform.",
      image: "/blog/vendor-success.jpg",
      author: "PlanWAB Team",
      date: "December 26, 2025",
      readTime: "6 min read",
      category: "Success Stories",
      tags: ["Vendors", "Success", "Stories"],
      views: 890,
      likes: 78,
      comments: 11,
    },
  ];

  const trendingTopics = [
    { name: "Wedding Planning 2026", posts: 15 },
    { name: "Budget Events", posts: 12 },
    { name: "Vendor Tips", posts: 9 },
    { name: "DIY Decorations", posts: 8 },
    { name: "Photography Guide", posts: 7 },
  ];

  const toggleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const toggleBookmark = (postId) => {
    const newBookmarkedPosts = new Set(bookmarkedPosts);
    if (newBookmarkedPosts.has(postId)) {
      newBookmarkedPosts.delete(postId);
    } else {
      newBookmarkedPosts.add(postId);
    }
    setBookmarkedPosts(newBookmarkedPosts);
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const BlogCard = ({ post, isLarge = false }) => (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${isLarge ? "mb-6" : ""}`}
    >
      {/* Image */}
      <div className={`relative ${isLarge ? "h-48" : "h-32"} bg-gray-200`}>
        {post.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            Featured
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {post.readTime}
        </div>
        {/* Placeholder for image */}
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <span className="text-gray-600 text-sm">Blog Image</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">{post.category}</span>
          {post.featured && <Star size={12} className="text-yellow-400 fill-current" />}
        </div>

        <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${isLarge ? "text-lg" : "text-sm"}`}>{post.title}</h3>

        <p className={`text-gray-600 mb-3 line-clamp-2 ${isLarge ? "text-sm" : "text-xs"}`}>{post.excerpt}</p>

        {/* Author & Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{post.author}</p>
              {post.authorRole && <p className="text-xs text-gray-500">{post.authorRole}</p>}
            </div>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={10} />
            {post.date}
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye size={12} />
              {post.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={12} />
              {post.comments}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(post.id);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart
                size={14}
                className={`${likedPosts.has(post.id) ? "text-red-500 fill-current" : "text-gray-500"}`}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(post.id);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bookmark
                size={14}
                className={`${bookmarkedPosts.has(post.id) ? "text-blue-500 fill-current" : "text-gray-500"}`}
              />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <Share2 size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">PlanWAB Blog</h1>
          <button onClick={() => setShowFilters(!showFilters)} className="p-2 rounded-full hover:bg-gray-100">
            <Filter size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-gray-200 px-4 py-3"
          >
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 space-y-6">
        {/* Featured Post */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-pink-600" />
            <h2 className="text-lg font-bold text-gray-900">Featured Article</h2>
          </div>
          <BlogCard post={featuredPost} isLarge={true} />
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Trending Topics</h3>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-pink-600" />
                  <span className="text-sm font-medium text-gray-900">{topic.name}</span>
                </div>
                <span className="text-xs text-gray-500">{topic.posts} posts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedCategory === "all"
                ? "Recent Articles"
                : `${categories.find((c) => c.id === selectedCategory)?.name} Articles`}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center pt-6">
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 mx-auto">
              Load More Articles
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-5 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
          <p className="text-pink-100 text-sm mb-4">
            Get the latest event planning tips and trends delivered to your inbox
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 text-sm"
            />
            <button className="bg-pink-400 text-white px-4 py-2 rounded-lg font-medium text-sm">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPageWrapper;
