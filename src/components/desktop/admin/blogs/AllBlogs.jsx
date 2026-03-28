"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List as ListIcon,
  LayoutGrid,
  Search,
  X,
  SlidersHorizontal,
  Eye,
  Trash2,
  Calendar,
  ThumbsUp,
  Share2,
  Lock,
  Globe,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

export default function AllBlogs({
  onViewRequest,
  refreshTrigger,
  onDeleteSuccess,
  onStatsUpdate,
}) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { user } = useUser();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/blogs?limit=5000");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const result = await response.json();
      
      if (result.success) {
        setBlogs(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs, refreshTrigger]);

  const filteredBlogs = useMemo(() => {
    let filtered = [...blogs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title?.toLowerCase().includes(query) ||
          b.authorName?.toLowerCase().includes(query) ||
          b.category?.toLowerCase().includes(query) ||
          b.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== "all") {
      const isPub = statusFilter === "published";
      filtered = filtered.filter((b) => b.isPublished === isPub);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((b) => b.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy] || 0;
      let bVal = b[sortBy] || 0;
      
      if (sortBy === "createdAt") {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      } else if (sortBy === "title" || sortBy === "authorName") {
        aVal = (a[sortBy] || "").toLowerCase();
        bVal = (b[sortBy] || "").toLowerCase();
      }

      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [blogs, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    return {
      total: blogs.length,
      published: blogs.filter((b) => b.isPublished).length,
      drafts: blogs.filter((b) => !b.isPublished).length,
    };
  }, [blogs]);

  useEffect(() => {
    if (onStatsUpdate) onStatsUpdate(stats);
  }, [stats, onStatsUpdate]);

  const closeAllModals = () => {
    setDeleteModalOpen(false);
    setPasswordModalOpen(false);
    setSelectedBlog(null);
    setAdminPassword("");
    setPasswordError("");
    setPendingAction(null);
  };

  const handleAction = useCallback((action, blog) => {
    setSelectedBlog(blog);
    if (action === "view") onViewRequest?.(blog);
    if (action === "delete") {
      setPendingAction("delete");
      setDeleteModalOpen(true);
    }
    if (action === "togglePublish") {
      setPendingAction("togglePublish");
      setPasswordModalOpen(true);
    }
  }, [onViewRequest]);

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    setPasswordModalOpen(true);
  };

  const handlePasswordVerification = async () => {
    if (!adminPassword.trim()) {
      setPasswordError("Password required");
      return;
    }

    setActionLoading(true);
    setPasswordError("");

    try {
      const qs = `?id=${selectedBlog._id}&adminPassword=${encodeURIComponent(adminPassword)}`;
      let res;
      
      if (pendingAction === "delete") {
        res = await fetch(`/api/admin/blogs${qs}`, { method: "DELETE" });
      } else if (pendingAction === "togglePublish") {
        res = await fetch(`/api/admin/blogs${qs}`, { method: "PATCH" });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      closeAllModals();
      await fetchBlogs();
      if (pendingAction === "delete") onDeleteSuccess?.();
      
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Title", "Author", "Category", "Status", "Views", "Likes", "Date"];
    const rows = filteredBlogs.map((b) => [
      b.title,
      b.authorName,
      b.category,
      b.isPublished ? "Published" : "Draft",
      b.viewCount,
      b.likeCount,
      new Date(b.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blogs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || categoryFilter !== "all";

  const categories = useMemo(() => {
    const cats = new Set(blogs.map((b) => b.category));
    return ["all", ...Array.from(cats)];
  }, [blogs]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <X size={14} />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${
                  showFilters || hasActiveFilters ? "bg-indigo-50 text-indigo-700" : "bg-white text-gray-700"
                }`}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                <button onClick={() => setViewMode("table")} className={`p-2.5 ${viewMode === "table" ? "bg-indigo-100 text-indigo-600" : "text-gray-500"}`}>
                  <ListIcon size={16} />
                </button>
                <button onClick={() => setViewMode("grid")} className={`p-2.5 ${viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-500"}`}>
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mt-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 text-sm border rounded-lg dark:bg-gray-800">
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft (Unpublished)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Category</label>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full p-2 text-sm border rounded-lg dark:bg-gray-800 capitalize">
                      {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Sort By</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 text-sm border rounded-lg dark:bg-gray-800">
                      <option value="createdAt">Date Created</option>
                      <option value="title">Title</option>
                      <option value="viewCount">Views</option>
                      <option value="likeCount">Likes</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <button onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")} className="p-2 border rounded-lg bg-white dark:bg-gray-800">
                      {sortOrder === "desc" ? "Desc" : "Asc"}
                    </button>
                    <button onClick={exportToCSV} className="p-2 border rounded-lg bg-white dark:bg-gray-800 text-indigo-600 flex-1">Export CSV</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin text-gray-400" size={24} /></div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <LayoutGrid size={48} className="mb-4 opacity-20" />
            <p>No blogs found matching your criteria</p>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 text-xs">
                <tr>
                  <th className="px-4 py-3">Blog</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Stats</th>
                  <th className="px-4 py-3 text-right">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBlogs.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {b.coverImage ? (
                          <img src={b.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-xs text-gray-400">No img</div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{b.title}</p>
                          <p className="text-xs text-gray-500">By {b.authorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 capitalize">{b.category}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${b.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {b.isPublished ? <Globe size={10} /> : <Lock size={10} />}
                        {b.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1" title="Views"><Eye size={12} /> {b.viewCount}</span>
                        <span className="flex items-center gap-1" title="Likes"><ThumbsUp size={12} /> {b.likeCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleAction("view", b)} className="p-1.5 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-lg"><Eye size={16} /></button>
                        <button onClick={() => handleAction("togglePublish", b)} className="p-1.5 text-gray-400 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 rounded-lg" title={b.isPublished ? "Unpublish" : "Publish"}>
                          {b.isPublished ? <Lock size={16} /> : <Globe size={16} />}
                        </button>
                        <button onClick={() => handleAction("delete", b)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlogs.map((b) => (
              <div key={b._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-100 dark:bg-gray-800 relative">
                  {b.coverImage && <img src={b.coverImage} className="w-full h-full object-cover" alt="" />}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${b.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {b.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">{b.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 block capitalize">{b.category} • By {b.authorName}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye size={12} /> {b.viewCount}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={12} /> {b.likeCount}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleAction("view", b)} className="p-1.5 text-gray-400 hover:text-indigo-600"><Eye size={16} /></button>
                      <button onClick={() => handleAction("delete", b)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4"><Trash2 size={24} /></div>
              <h3 className="text-xl font-bold mb-2">Delete Blog?</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={closeAllModals} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                <button onClick={handleDeleteConfirm} className="px-6 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </div>
        )}

        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6">
              <h3 className="text-xl font-bold mb-4">Admin Verification</h3>
              <p className="text-gray-500 mb-4 text-sm">Please enter the admin password to {pendingAction === "delete" ? "delete" : "update status of"} this blog.</p>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 text-sm"
                placeholder="Admin Password"
              />
              {passwordError && <p className="text-red-500 text-xs mb-4">{passwordError}</p>}
              <div className="flex gap-3 justify-end">
                <button onClick={closeAllModals} className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100">Cancel</button>
                <button onClick={handlePasswordVerification} disabled={actionLoading} className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                  {actionLoading ? "Verifying..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
