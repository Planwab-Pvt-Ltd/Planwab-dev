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
  Mail,
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
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
        isLarge ? "lg:flex-row lg:h-[400px]" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative bg-gray-200 overflow-hidden ${isLarge ? "lg:w-3/5 h-64 lg:h-full" : "h-56"}`}>
        {post.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
            Featured
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full z-10">
          {post.readTime}
        </div>
        {/* Placeholder for image - Replace with actual Image component */}
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center group">
          <span className="text-gray-600 text-sm font-medium group-hover:scale-105 transition-transform">
            Blog Image
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 flex flex-col justify-between ${isLarge ? "lg:w-2/5 lg:p-8" : ""}`}>
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-pink-50 text-pink-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {post.category}
            </span>
            {post.featured && <Star size={14} className="text-yellow-400 fill-current" />}
          </div>

          <h3
            className={`font-bold text-gray-900 mb-3 hover:text-pink-600 transition-colors cursor-pointer ${
              isLarge ? "text-2xl lg:text-3xl leading-tight" : "text-xl leading-snug"
            }`}
          >
            {post.title}
          </h3>

          <p className={`text-gray-600 mb-6 leading-relaxed ${isLarge ? "text-base lg:text-lg" : "text-sm line-clamp-3"}`}>
            {post.excerpt}
          </p>
        </div>

        <div>
          {/* Author & Date */}
          <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                <User size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{post.author}</p>
                {post.authorRole && <p className="text-xs text-gray-500">{post.authorRole}</p>}
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
              <Calendar size={12} />
              {post.date}
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1.5" title="Views">
                <Eye size={14} />
                {post.views.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5" title="Comments">
                <MessageCircle size={14} />
                {post.comments}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(post.id);
                }}
                className={`p-2 rounded-full hover:bg-red-50 transition-colors ${
                  likedPosts.has(post.id) ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500"
                }`}
                title="Like"
              >
                <Heart size={18} className={likedPosts.has(post.id) ? "fill-current" : ""} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(post.id);
                }}
                className={`p-2 rounded-full hover:bg-blue-50 transition-colors ${
                  bookmarkedPosts.has(post.id) ? "text-blue-500 bg-blue-50" : "text-gray-400 hover:text-blue-500"
                }`}
                title="Bookmark"
              >
                <Bookmark size={18} className={bookmarkedPosts.has(post.id) ? "fill-current" : ""} />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                title="Share"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Desktop Header / Breadcrumb Area */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium hidden sm:inline">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">PlanWAB Blog</h1>
          </div>

          <div className="relative w-96 hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, guides, and tips..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-transparent focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="lg:w-2/3 space-y-10">
            {/* Featured Post */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <TrendingUp size={20} className="text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
              </div>
              <BlogCard post={featuredPost} isLarge={true} />
            </section>

            {/* Recent Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all"
                    ? "Recent Articles"
                    : `${categories.find((c) => c.id === selectedCategory)?.name} Articles`}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  <span className="font-medium text-gray-900">{filteredPosts.length}</span>
                  <span>article{filteredPosts.length !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid gap-8">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    We couldn't find any articles matching your search. Try adjusting your keywords or filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="bg-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Load More */}
              {filteredPosts.length > 0 && (
                <div className="text-center pt-12">
                  <button className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 mx-auto hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                    Load More Articles
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Categories Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter size={18} className="text-pink-600" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {category.name} <span className="opacity-60 ml-1">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Topics Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-pink-600" />
                Trending Topics
              </h3>
              <div className="space-y-1">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Tag size={16} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{topic.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all">
                      {topic.posts}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                  <Mail size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
                <p className="text-pink-100 text-sm mb-6 leading-relaxed">
                  Get the latest event planning tips, trends, and exclusive vendor offers delivered directly to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 outline-none border-none shadow-inner"
                  />
                  <button className="w-full bg-white text-pink-600 px-4 py-3 rounded-xl font-bold text-sm hover:bg-pink-50 transition-colors shadow-lg">
                    Subscribe to Newsletter
                  </button>
                </div>
                <p className="text-xs text-pink-200/80 mt-4 text-center">No spam, unsubscribe anytime.</p>
              </div>

              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPageWrapper;