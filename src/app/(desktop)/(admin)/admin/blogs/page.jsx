"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { List, Eye, ArrowLeft, RefreshCw, ChevronRight, Home, BookOpen } from "lucide-react";
import AllBlogs from "@/components/desktop/admin/blogs/AllBlogs";
import ViewBlogTab from "@/components/desktop/admin/blogs/ViewBlogTab";

export default function BlogsAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["all", "view"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const updateURL = useCallback(
    (tab) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      if (tab === "view") {
        const title = selectedBlog?.title || "blog";
        params.set("title", title);
      } else {
        params.delete("title");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, selectedBlog, searchParams]
  );

  const handleViewRequest = useCallback(
    (blog) => {
      if (!blog || !blog._id) return;
      setSelectedBlog(blog);
      setActiveTab("view");
      updateURL("view");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL]
  );

  const handleBackToList = useCallback(() => {
    setActiveTab("all");
    setSelectedBlog(null);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleDeleteSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    setActiveTab("all");
    setSelectedBlog(null);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeTab === "view") {
        handleBackToList();
      }
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        handleRefresh();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, handleBackToList, handleRefresh]);

  const handleStatsUpdate = useCallback((newStats) => {
    setStats(newStats);
  }, []);

  const tabs = [
    {
      id: "all",
      label: "All Blogs",
      icon: List,
      description: "Manage published and draft blogs",
      badge: stats?.total,
    },
  ];

  const getBreadcrumbs = () => {
    const crumbs = [
      { label: "Dashboard", href: "/admin" },
      { label: "Blogs" },
    ];
    if (activeTab === "view" && selectedBlog) {
      crumbs.push({ label: selectedBlog.title || "Blog Details", isActive: true });
    }
    return crumbs;
  };

  const getPageTitle = () => {
    if (activeTab === "view" && selectedBlog) return `Viewing: ${selectedBlog.title}`;
    return "Manage Blogs";
  };

  const getCurrentTabInfo = () => {
    if (activeTab === "view" && selectedBlog) {
      return { id: "view", label: "View Blog", icon: Eye, description: "View blog details" };
    }
    return tabs[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm mb-4 overflow-x-auto">
            <Home size={14} className="text-gray-400 flex-shrink-0" />
            {getBreadcrumbs().map((crumb, index) => (
              <div key={index} className="flex items-center gap-1 flex-shrink-0">
                <ChevronRight size={14} className="text-gray-400" />
                {crumb.href ? (
                  <a href={crumb.href} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className={crumb.isActive ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}>
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 md:p-4 mb-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                    {getPageTitle()}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <RefreshCw size={10} /> Last updated: {mounted ? lastRefresh.toLocaleTimeString() : "--:--:--"}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Press Ctrl+R to refresh</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {activeTab === "view" && (
                  <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={handleBackToList} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors text-sm font-medium text-gray-700 dark:text-gray-200">
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back to List</span>
                    <span className="sm:hidden">Back</span>
                  </motion.button>
                )}
                <button onClick={handleRefresh} disabled={isRefreshing} className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50" title="Refresh (Ctrl+R)">
                  <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <TabButton tab={tabs[0]} isActive={activeTab === "all"} onClick={() => { setActiveTab("all"); setSelectedBlog(null); updateURL("all"); }} />
                {selectedBlog && activeTab === "view" && <TabButton tab={getCurrentTabInfo()} isActive={true} onClick={() => {}} />}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + (selectedBlog?._id || "")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
              {activeTab === "all" && <AllBlogs onViewRequest={handleViewRequest} refreshTrigger={refreshTrigger} onDeleteSuccess={handleDeleteSuccess} onStatsUpdate={handleStatsUpdate} />}
              {activeTab === "view" && selectedBlog && <ViewBlogTab request={selectedBlog} onBack={handleBackToList} onDelete={handleDeleteSuccess} />}
            </motion.div>
          </AnimatePresence>

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
            <p>Blogs Management System • Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to go back • <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+R</kbd> to refresh</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ tab, isActive, onClick }) => (
  <button onClick={onClick} className={`group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"}`}>
    <tab.icon size={18} className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
    <div className="text-left">
      <span className="block">{tab.label}</span>
      <span className={`text-xs font-normal hidden md:block ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`}>{tab.description}</span>
    </div>
    {tab.badge !== undefined && (
      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"}`}>{tab.badge}</span>
    )}
    {isActive && (
      <motion.div layoutId="activeTabIndicator" className="ml-auto w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    )}
  </button>
);
