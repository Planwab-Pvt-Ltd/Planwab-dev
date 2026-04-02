"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { List, Eye, Edit, ArrowLeft, Users, RefreshCw, ChevronRight, Home } from "lucide-react";
import AllUsers from "@/components/desktop/admin/users/AllUsers";
import ViewUserTab from "@/components/desktop/admin/users/ViewUserTab";
import EditUserTab from "@/components/desktop/admin/users/EditUserTab";

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(searchParams.get("userId") || null);
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
    const userId = searchParams.get("userId");

    if (tab && ["all", "view", "edit"].includes(tab)) {
      setActiveTab(tab);
    }

    if (userId && (tab === "view" || tab === "edit")) {
      // Check against selectedUserId to prevent the microsecond overwrite bug
      if (selectedUserId !== userId) {
        setSelectedUserId(userId);
        fetchUserById(userId);
      }
    }
  }, [searchParams, selectedUserId]);

  const fetchUserById = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/user/list?userId=${id}`);
      const result = await response.json();
      setSelectedUser(result?.data?.[0] || null); // Assuming API returns data array
    } catch (error) {
      console.error("Error fetching user:", error);
      updateURL("all");
      setSelectedUser(null);
    }
  }, []);

  const updateURL = useCallback(
    (tab, userId = null) => {
      const params = new URLSearchParams();
      params.set("tab", tab);

      if (userId) {
        params.set("userId", userId);
      }

      if (tab === "view" || tab === "edit") {
        const userName = selectedUser?.firstName 
          ? `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim() 
          : selectedUser?.username || "user";
        params.set("name", userName);
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, selectedUser]
  );

 const handleViewUser = useCallback(
    (user) => {
      if (!user || (!user._id && !user.id)) {
        console.error("Invalid user data for view");
        return;
      }
      const id = user._id || user.id;
      setSelectedUser(user);
      setSelectedUserId(id); // Lock ID to prevent redundant fetch
      setActiveTab("view");
      updateURL("view", id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL]
  );

  const handleEditUser = useCallback(
    (user) => {
      if (!user || (!user._id && !user.id)) {
        console.error("Invalid user data for edit");
        return;
      }
      const id = user._id || user.id;
      setSelectedUser(user);
      setSelectedUserId(id); // Lock ID to prevent redundant fetch
      setActiveTab("edit");
      updateURL("edit", id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL]
  );

  const handleBackToList = useCallback(() => {
    setActiveTab("all");
    setSelectedUser(null);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleEditSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    setActiveTab("all");
    setSelectedUser(null);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleDeleteSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    setActiveTab("all");
    setSelectedUser(null);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleSwitchToEdit = useCallback(() => {
    setActiveTab("edit");
    updateURL("edit", selectedUser?._id || selectedUser?.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL, selectedUser]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
  }, []);

  const handleStatsUpdate = useCallback((newStats) => {
    setStats(newStats);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && (activeTab === "view" || activeTab === "edit")) {
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

  const tabs = [
    { id: "all", label: "All Users", icon: List, description: "View and manage platform users", badge: stats?.total },
  ];

  const getBreadcrumbs = () => {
    const crumbs = [{ label: "Dashboard", href: "/admin" }, { label: "Users" }];

    if ((activeTab === "view" || activeTab === "edit") && selectedUser) {
      const userName = selectedUser.firstName 
        ? `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim() 
        : selectedUser.username || "User";
        
      if (activeTab === "edit") {
        crumbs.push({
          label: userName,
          onClick: () => {
            setActiveTab("view");
            updateURL("view", selectedUser._id || selectedUser.id);
          },
        });
        crumbs.push({ label: "Edit", isActive: true });
      } else {
        crumbs.push({ label: userName, isActive: true });
      }
    }

    return crumbs;
  };

  const getPageTitle = () => {
    if (activeTab === "view" && selectedUser) {
      const userName = selectedUser.firstName 
        ? `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim() 
        : selectedUser.username || "User";
      return `Viewing: ${userName}`;
    }
    if (activeTab === "edit" && selectedUser) {
      const userName = selectedUser.firstName 
        ? `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim() 
        : selectedUser.username || "User";
      return `Editing: ${userName}`;
    }
    return "Manage Users";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto">
        <nav className="flex items-center gap-1 text-sm mb-4 overflow-x-auto">
          <Home size={14} className="text-gray-400 flex-shrink-0" />
          {getBreadcrumbs().map((crumb, index) => (
            <div key={index} className="flex items-center gap-1 flex-shrink-0">
              <ChevronRight size={14} className="text-gray-400" />
              {crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                >
                  {crumb.label}
                </button>
              ) : crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  className={
                    crumb.isActive ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"
                  }
                >
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 md:p-4 mb-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                <Users size={24} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {getPageTitle()}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <RefreshCw size={10} />
                    Last updated: {mounted ? lastRefresh.toLocaleTimeString() : "--:--:--"}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Press Ctrl+R to refresh</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {(activeTab === "view" || activeTab === "edit") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleBackToList}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Back to List</span>
                  <span className="sm:hidden">Back</span>
                </motion.button>
              )}

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                title="Refresh (Ctrl+R)"
              >
                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {!selectedUser && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      updateURL(tab.id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedUser && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {selectedUser.photo ? (
                        <img src={selectedUser.photo} alt={selectedUser.firstName} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white font-bold">
                            {(selectedUser.firstName || selectedUser.username || "U").charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {selectedUser.firstName 
                        ? `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim() 
                        : selectedUser.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {selectedUser.email} • {selectedUser.userType} • {selectedUser.plan || "Free"} Plan
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setActiveTab("view");
                      updateURL("view", selectedUser._id || selectedUser.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === "view"
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("edit");
                      updateURL("edit", selectedUser._id || selectedUser.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === "edit"
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Edit size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedUser?._id || selectedUser?.id || "")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {activeTab === "all" && (
              <AllUsers
                onViewUser={handleViewUser}
                onEditUser={handleEditUser}
                onDeleteSuccess={handleDeleteSuccess}
                refreshTrigger={refreshTrigger}
                onStatsUpdate={handleStatsUpdate}
              />
            )}

            {activeTab === "view" && selectedUser && (
              <ViewUserTab
                user={selectedUser}
                onBack={handleBackToList}
                onEdit={handleSwitchToEdit}
                onDelete={handleDeleteSuccess}
              />
            )}

            {activeTab === "edit" && selectedUser && (
              <EditUserTab 
                user={selectedUser} 
                onBack={handleBackToList} 
                onSuccess={handleEditSuccess} 
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>
            User Management System • Press{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to go back •{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+R</kbd> to refresh
          </p>
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ tab, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
    }`}
  >
    <tab.icon
      size={18}
      className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
        isActive ? "text-indigo-600 dark:text-indigo-400" : ""
      }`}
    />
    <div className="text-left">
      <span className="block">{tab.label}</span>
      <span
        className={`text-xs font-normal hidden md:block ${
          isActive ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
        }`}
      >
        {tab.description}
      </span>
    </div>
    {tab.badge !== undefined && (
      <span
        className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          isActive
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
        }`}
      >
        {tab.badge}
      </span>
    )}
    {isActive && (
      <motion.div
        layoutId="activeTabIndicator"
        className="ml-auto w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
);