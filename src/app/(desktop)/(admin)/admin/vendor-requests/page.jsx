"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { List, Eye, ArrowLeft, TrendingUp, RefreshCw, ChevronRight, Home, UserCheck } from "lucide-react";
import ViewVendorRequestTab from "@/components/desktop/admin/vendor-requests/viewVendorRequestTab";
import AllVendorRequests from "@/components/desktop/admin/vendor-requests/AllVendorRequests";

export default function VendorRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(searchParams.get("requestId") || null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const requestId = searchParams.get("requestId");
    const editMode = searchParams.get("edit") === "true";

    if (tab && ["all", "view"].includes(tab)) {
      setActiveTab(tab);
    }

    if (requestId && tab === "view") {
      fetchRequestById(requestId);
      setIsEditMode(editMode);
    }
  }, [searchParams]);

  const fetchRequestById = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/vendor/requests?id=${id}`);
      if (!response.ok) throw new Error("Vendor request not found");
      const result = await response.json();
      setSelectedRequest(result.data || result);
    } catch (error) {
      console.error("Error fetching vendor request:", error);
      updateURL("all");
      setSelectedRequest(null);
    }
  }, []);

  const updateURL = useCallback(
    (tab, requestId = null, editMode = false) => {
      const params = new URLSearchParams();
      params.set("tab", tab);

      if (requestId) {
        params.set("requestId", requestId);
      }

      if (editMode) {
        params.set("edit", "true");
      }

      if (tab === "view") {
        params.set("name", selectedRequest?.businessName || "vendor-request");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, selectedRequest]
  );

  const handleViewRequest = useCallback(
    (request) => {
      if (!request || !request._id) {
        console.error("Invalid vendor request data for view");
        return;
      }
      setSelectedRequest(request);
      setActiveTab("view");
      setIsEditMode(false);
      updateURL("view", request._id, false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL]
  );

  const handleEditRequest = useCallback(
    (request) => {
      if (!request || !request._id) {
        console.error("Invalid vendor request data for edit");
        return;
      }
      setSelectedRequest(request);
      setActiveTab("view");
      setIsEditMode(true);
      updateURL("view", request._id, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL]
  );

  const handleBackToList = useCallback(() => {
    setActiveTab("all");
    setSelectedRequest(null);
    setIsEditMode(false);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleEditSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    setIsEditMode(false);
    if (selectedRequest) {
      updateURL("view", selectedRequest._id, false);
    }
  }, [updateURL, selectedRequest]);

  const handleDeleteSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    setActiveTab("all");
    setSelectedRequest(null);
    setIsEditMode(false);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleSwitchToEdit = useCallback(() => {
    setIsEditMode(true);
    updateURL("view", selectedRequest?._id, true);
  }, [updateURL, selectedRequest]);

  const handleSwitchToView = useCallback(() => {
    setIsEditMode(false);
    updateURL("view", selectedRequest?._id, false);
  }, [updateURL, selectedRequest]);

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
        if (isEditMode) {
          setIsEditMode(false);
          updateURL("view", selectedRequest?._id, false);
        } else {
          handleBackToList();
        }
      }
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, isEditMode, handleBackToList, handleRefresh, updateURL, selectedRequest]);

  const tabs = [{ id: "all", label: "All Requests", icon: List, description: "View and manage all vendor requests" }];

  const getBreadcrumbs = () => {
    const crumbs = [{ label: "Dashboard", href: "/admin" }, { label: "Vendor Requests" }];

    if (activeTab === "view" && selectedRequest) {
      crumbs.push({ label: selectedRequest.businessName, isActive: !isEditMode });
      if (isEditMode) {
        crumbs.push({ label: "Edit", isActive: true });
      }
    }

    return crumbs;
  };

  const getPageTitle = () => {
    if (activeTab === "view" && selectedRequest) {
      return isEditMode ? `Editing: ${selectedRequest.businessName}` : `Viewing: ${selectedRequest.businessName}`;
    }
    return "Manage Vendor Requests";
  };

  const getCurrentTabInfo = () => {
    if (activeTab === "view" && selectedRequest) {
      return {
        id: "view",
        label: isEditMode ? "Edit Request" : "View Request",
        icon: Eye,
        description: isEditMode ? "Edit vendor request details" : "View vendor request details",
      };
    }
    return tabs[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto">
        <div className="">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm mb-4 overflow-x-auto">
            <Home size={14} className="text-gray-400 flex-shrink-0" />
            {getBreadcrumbs().map((crumb, index) => (
              <div key={index} className="flex items-center gap-1 flex-shrink-0">
                <ChevronRight size={14} className="text-gray-400" />
                {crumb.href ? (
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

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 md:p-4 mb-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                  <UserCheck size={24} className="text-white" />
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
                {activeTab === "view" && (
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

            {/* Tab Navigation */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                {/* All Requests Tab */}
                <TabButton
                  tab={tabs[0]}
                  isActive={activeTab === "all"}
                  onClick={() => {
                    setActiveTab("all");
                    setSelectedRequest(null);
                    setIsEditMode(false);
                    updateURL("all");
                  }}
                />

                {/* Dynamic View/Edit Tab */}
                {selectedRequest && activeTab === "view" && (
                  <TabButton tab={getCurrentTabInfo()} isActive={true} onClick={() => {}} />
                )}
              </div>
            </div>

            {/* Request Navigation when viewing/editing */}
            {selectedRequest && activeTab === "view" && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {selectedRequest.businessName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {selectedRequest.businessName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {selectedRequest.category} • {selectedRequest.city || "N/A"} • {selectedRequest.status}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleSwitchToView}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        !isEditMode
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={handleSwitchToEdit}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isEditMode
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <TrendingUp size={14} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedRequest?._id || "") + (isEditMode ? "-edit" : "-view")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeTab === "all" && (
                <AllVendorRequests
                  onViewRequest={handleViewRequest}
                  onEditRequest={handleEditRequest}
                  refreshTrigger={refreshTrigger}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              )}

              {activeTab === "view" && selectedRequest && (
                <ViewVendorRequestTab
                  request={selectedRequest}
                  isEditMode={isEditMode}
                  onBack={handleBackToList}
                  onSwitchToEdit={handleSwitchToEdit}
                  onSwitchToView={handleSwitchToView}
                  onEditSuccess={handleEditSuccess}
                  onDelete={handleDeleteSuccess}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
            <p>
              Vendor Requests Management System • Press{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to go back •{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+R</kbd> to refresh
            </p>
          </div>
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
    {isActive && (
      <motion.div
        layoutId="activeTabIndicator"
        className="ml-auto w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
);
