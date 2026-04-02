"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Search,
  RefreshCw,
  Users,
  TrendingUp,
  X,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Building2,
  LayoutGrid,
  List as ListIcon,
  WifiOff,
  EyeOff,
  UserCheck,
  Crown,
  Calendar,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const USERS_PER_PAGE = 10;

const planConfig = {
  pro: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300", icon: Crown },
  free: { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", icon: CheckCircle },
};

const typeConfig = {
  regular: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", icon: UserCheck },
  vendor: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300", icon: Building2 },
};

export default function AllUsers({ onViewUser, onEditUser, onDeleteSuccess, refreshTrigger, onStatsUpdate }) {
  const [users, setUsers] = useState([]);
  const [allUsersData, setAllUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("table");

  const [apiStats, setApiStats] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/list");

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        const usersArray = result.data || [];
        setUsers(usersArray);
        setAllUsersData(usersArray);
        setApiStats(result.stats);
      } else {
        throw new Error(result.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
      setUsers([]);
      setAllUsersData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  // Notify parent of total count for tab badge
  useEffect(() => {
    if (onStatsUpdate) {
      onStatsUpdate({ total: allUsersData.length });
    }
  }, [allUsersData.length, onStatsUpdate]);

  const filteredUsers = useMemo(() => {
    let filtered = [...allUsersData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.personalInfo?.phone?.includes(query)
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((user) => (user.userType || "regular") === typeFilter);
    }

    if (planFilter !== "all") {
      const targetPlan = planFilter === "free" ? null : planFilter;
      filtered = filtered.filter((user) => (user.plan || "free") === (targetPlan || "free"));
    }

    filtered.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === "createdAt") {
        const timeA = a.createdAt?.$date ? new Date(a.createdAt.$date).getTime() : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.$date ? new Date(b.createdAt.$date).getTime() : new Date(b.createdAt || 0).getTime();
        aVal = isNaN(timeA) ? 0 : timeA;
        bVal = isNaN(timeB) ? 0 : timeB;
      } else if (sortBy === "name") {
        aVal = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase() || (a.username || "").toLowerCase();
        bVal = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase() || (b.username || "").toLowerCase();
      } else {
        aVal = a[sortBy] || "";
        bVal = b[sortBy] || "";
      }

      if (aVal === bVal) return 0;
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [allUsersData, searchQuery, typeFilter, planFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    if (apiStats) return apiStats;

    if (!allUsersData || allUsersData.length === 0) {
      return { total: 0, regular: 0, vendor: 0, pro: 0, admin: 0, thisMonth: 0, growthRate: 0 };
    }

    const total = allUsersData.length;
    const regular = allUsersData.filter((u) => u.userType === "regular" || !u.userType).length;
    const vendor = allUsersData.filter((u) => u.userType === "vendor").length;
    const pro = allUsersData.filter((u) => u.plan === "pro").length;
    const admin = allUsersData.filter((u) => u.role === "admin").length;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const thisMonth = allUsersData.filter((u) => {
      const dateStr = u.createdAt?.$date || u.createdAt;
      const userDate = dateStr ? new Date(dateStr) : new Date(0);
      return userDate >= thisMonthStart;
    }).length;

    const lastMonth = allUsersData.filter((u) => {
      const dateStr = u.createdAt?.$date || u.createdAt;
      const userDate = dateStr ? new Date(dateStr) : new Date(0);
      return userDate >= lastMonthStart && userDate <= lastMonthEnd;
    }).length;

    const growthRate = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : thisMonth > 0 ? 100 : 0;

    return { total, regular, vendor, pro, admin, thisMonth, growthRate };
  }, [allUsersData, apiStats]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleAction = useCallback(
    (action, user) => {
      setSelectedUser(user);
      if (action === "view") onViewUser?.(user);
      if (action === "edit") onEditUser?.(user);
      if (action === "delete") setDeleteModalOpen(true);
    },
    [onViewUser, onEditUser]
  );

  const handleDeleteConfirm = async () => {
    if (!deletePassword.trim()) {
      setDeleteError("Please enter admin password");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      // Typically /api/user?id=...
      const userId = selectedUser._id || selectedUser.id || selectedUser.clerkId;
      const response = await fetch(
        `/api/user?id=${userId}&password=${encodeURIComponent(deletePassword)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      setDeleteModalOpen(false);
      setSelectedUser(null);
      setDeletePassword("");
      setDeleteError("");
      toast.success("User deleted successfully");
      await fetchUsers();
      onDeleteSuccess?.();
    } catch (err) {
      setDeleteError(err.message);
      toast.error(`Error deleting user: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
    setDeletePassword("");
    setDeleteError("");
    setShowDeletePassword(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setPlanFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Username", "Email", "Phone", "Type", "Plan", "Joined Date"];
    const rows = filteredUsers.map((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.trim();
      const dateStr = u.createdAt?.$date || u.createdAt;
      return [
        name,
        u.username || "",
        u.email || "",
        u.personalInfo?.phone || "",
        u.userType || "regular",
        u.plan || "free",
        dateStr ? new Date(dateStr).toISOString().split("T")[0] : "N/A",
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    await fetchUsers();
  };

  const hasActiveFilters = !!(searchQuery || typeFilter !== "all" || planFilter !== "all");

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatsCard icon={Users} label="Total Users" value={stats.total || 0} color="bg-blue-500" lightBg="bg-blue-50 dark:bg-blue-900/20" />
        <StatsCard
          icon={UserCheck}
          label="Regular Users"
          value={stats.regular || 0}
          color="bg-indigo-500"
          lightBg="bg-indigo-50 dark:bg-indigo-900/20"
          onClick={() => {
            setTypeFilter(typeFilter === "regular" ? "all" : "regular");
            setCurrentPage(1);
          }}
          isActive={typeFilter === "regular"}
        />
        <StatsCard
          icon={Building2}
          label="Vendors"
          value={stats.vendor || 0}
          color="bg-orange-500"
          lightBg="bg-orange-50 dark:bg-orange-900/20"
          onClick={() => {
            setTypeFilter(typeFilter === "vendor" ? "all" : "vendor");
            setCurrentPage(1);
          }}
          isActive={typeFilter === "vendor"}
        />
        <StatsCard
          icon={Crown}
          label="Pro Plans"
          value={stats.pro || 0}
          color="bg-purple-500"
          lightBg="bg-purple-50 dark:bg-purple-900/20"
          onClick={() => {
            setPlanFilter(planFilter === "pro" ? "all" : "pro");
            setCurrentPage(1);
          }}
          isActive={planFilter === "pro"}
        />
        <StatsCard
          icon={TrendingUp}
          label="New This Month"
          value={stats.thisMonth || 0}
          trend={stats.growthRate}
          color="bg-green-500"
          lightBg="bg-green-50 dark:bg-green-900/20"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, username, email, or phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  sortOrder === "desc"
                    ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                }`}
                title={sortOrder === "asc" ? "Ascending" : "Descending"}
              >
                {sortOrder === "asc" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span className="hidden sm:inline">{sortOrder === "asc" ? "Asc" : "Desc"}</span>
              </button>

              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "table"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title="Table View"
                >
                  <ListIcon size={16} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>

              <button
                onClick={exportToCSV}
                disabled={filteredUsers.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export to CSV"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    onClick={() => {
                      if (sortBy === "name") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("name");
                        setSortOrder("asc");
                      }
                      setCurrentPage(1);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      User
                      <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortBy === "name" ? (
                          sortOrder === "asc" ? <ArrowUpRight size={14} className="text-indigo-500" /> : <ArrowDownRight size={14} className="text-indigo-500" />
                        ) : (
                          <ArrowUpRight size={14} />
                        )}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Contact Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Role & Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    onClick={() => {
                      if (sortBy === "createdAt") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("createdAt");
                        setSortOrder("desc");
                      }
                      setCurrentPage(1);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      Joined
                      <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortBy === "createdAt" ? (
                          sortOrder === "asc" ? <ArrowUpRight size={14} className="text-indigo-500" /> : <ArrowDownRight size={14} className="text-indigo-500" />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: USERS_PER_PAGE }).map((_, i) => <UserRowSkeleton key={i} />)
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <WifiOff size={36} className="text-red-400" />
                        <p className="text-red-500 font-medium">{error}</p>
                        <button
                          onClick={handleRefresh}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={36} className="text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {hasActiveFilters ? "Try adjusting your filters" : "There are currently no users"}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <UserTableRow
                      key={user._id || user.id || user.clerkId}
                      user={user}
                      onView={() => handleAction("view", user)}
                      onEdit={() => handleAction("edit", user)}
                      onDelete={() => handleAction("delete", user)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <UserCardSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-12">
              <WifiOff size={36} className="text-red-400" />
              <p className="text-red-500 font-medium">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-12">
              <Users size={36} className="text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {hasActiveFilters ? "Try adjusting your filters" : "There are currently no users"}
              </p>
            </div>
          ) : (
            paginatedUsers.map((user) => (
              <UserCard
                key={user._id || user.id || user.clerkId}
                user={user}
                onView={() => handleAction("view", user)}
                onEdit={() => handleAction("edit", user)}
                onDelete={() => handleAction("delete", user)}
              />
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={filteredUsers.length}
          limit={USERS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <AnimatePresence>
        {isDeleteModalOpen && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleDeleteModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trash2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Delete User</h2>
                    <p className="text-white/80 text-sm mt-0.5">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                    <AlertTriangle size={12} />
                    Admin Verification Required
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>ID:</strong> {(selectedUser._id || selectedUser.clerkId || "N/A").slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => {
                        setDeletePassword(e.target.value);
                        setDeleteError("");
                      }}
                      placeholder="Enter admin password"
                      className={`w-full pl-4 pr-12 py-3 rounded-xl border-2 outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                        deleteError
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                          : "border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                      }`}
                      disabled={deleteLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && deletePassword) {
                          handleDeleteConfirm();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {deleteError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1.5"
                      >
                        <AlertTriangle size={14} />
                        {deleteError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDeleteModalClose}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading || !deletePassword.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
                  >
                    {deleteLoading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Delete User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StatsCard = ({ icon: Icon, label, value, trend, color, lightBg, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`${lightBg} rounded-xl p-4 border ${
      isActive
        ? "border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20"
        : "border-gray-200 dark:border-gray-700"
    } ${onClick ? "cursor-pointer hover:shadow-md transition-all" : ""}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color} text-white`}>
        <Icon size={16} />
      </div>
      {trend !== undefined && trend !== 0 && (
        <div className={`flex items-center gap-0.5 text-xs font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{label}</p>
  </div>
);

const UserTableRow = ({ user, onView, onEdit, onDelete }) => {
  const planInfo = planConfig[user.plan] || planConfig.free;
  const PlanIcon = planInfo?.icon || CheckCircle;

  const typeInfo = typeConfig[user.userType] || typeConfig.regular;
  const TypeIcon = typeInfo?.icon || UserCheck;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Unknown User";
  const email = user.email || "N/A";
  const phone = user.personalInfo?.phone || "N/A";
  const role = user.role || "user";
  const dateStr = user.createdAt?.$date || user.createdAt;
  const joinedDate = dateStr ? new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
            {user.photo ? (
                <img src={user.photo} alt={fullName} className="w-full h-full object-cover" />
            ) : (
                fullName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
              {fullName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">@{user.username || 'unknown'}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">{email}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{phone}</div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-1.5 text-sm">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
                <TypeIcon size={12} />
                {user.userType ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1) : "Regular"}
            </span>
            {role === "admin" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                    <Shield size={12} /> Admin
                </span>
            )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${planInfo.color}`}>
          <PlanIcon size={12} />
          {user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "Free"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
          <Calendar size={14} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{joinedDate}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button onClick={onView} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="View">
            <Eye size={16} />
          </button>
          <button onClick={onEdit} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors" title="Edit">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const UserRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3 hidden md:table-cell">
      <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </td>
    <td className="px-4 py-3 hidden lg:table-cell">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="flex justify-end gap-1">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </td>
  </tr>
);

const UserCard = ({ user, onView, onEdit, onDelete }) => {
  const planInfo = planConfig[user.plan] || planConfig.free;
  const typeInfo = typeConfig[user.userType] || typeConfig.regular;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Unknown User";
  const dateStr = user.createdAt?.$date || user.createdAt;
  const joinedDate = dateStr ? new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="relative h-24 bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="absolute -bottom-8 left-4">
            <div className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 overflow-hidden shadow-sm">
                {user.photo ? (
                    <img src={user.photo} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                    fullName.charAt(0).toUpperCase()
                )}
            </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${planInfo.color}`}>
            {user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "Free"}
          </span>
          {user.role === "admin" && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
              Admin
            </span>
          )}
        </div>
      </div>
      <div className="p-4 pt-10">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{fullName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate">@{user.username || "unknown"}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className={`p-1 rounded ${typeInfo.color}`}>
                <typeInfo.icon size={12} />
            </span>
            <span className="truncate">{user.userType ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1) : "Regular"} User</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={14} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">Joined {joinedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <button onClick={onView} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
              <Eye size={14} />
            </button>
            <button onClick={onEdit} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
              <Edit size={14} />
            </button>
            <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UserCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-24 bg-gray-200 dark:bg-gray-700 relative">
        <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600" />
    </div>
    <div className="p-4 pt-10 space-y-3">
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
      <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-1">
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, total, limit, onPageChange }) => {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> users
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex flex-row p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          <ChevronLeft size={16} className="-ml-2" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex flex-row p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
          <ChevronRight size={16} className="-ml-2" />
        </button>
      </div>
    </div>
  );
};