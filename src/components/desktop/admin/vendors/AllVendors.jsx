// components/admin/AllVendors.jsx

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Download,
  Plus,
  Building2,
  Camera,
  Paintbrush2,
  UserCheck,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Mail,
  Music,
  Scissors,
  FileText,
  Star,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import DropdownMenu from "../modals/DropdownMenu";
import ViewVendorModal from "../modals/vendors/ViewVendorModal";
import EditVendorModal from "../modals/vendors/EditVendorModal";
import DeleteVendorModal from "../modals/vendors/DeleteVendorModal";

const VENDORS_PER_PAGE = 10;

const categoryIcons = {
  venues: Building2,
  photographers: Camera,
  makeup: Paintbrush2,
  planners: UserCheck,
  catering: UtensilsCrossed,
  clothes: Shirt,
  mehendi: Hand,
  cakes: CakeSlice,
  jewellery: Gem,
  invitations: Mail,
  djs: Music,
  hairstyling: Scissors,
  other: FileText,
};

const categoryColors = {
  venues: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  photographers: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  makeup: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  planners: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  catering: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  clothes: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  mehendi: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  cakes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  jewellery: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  invitations: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  djs: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  hairstyling: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
};

const availabilityConfig = {
  Available: {
    color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    icon: CheckCircle,
  },
  Unavailable: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    icon: XCircle,
  },
  Busy: {
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    icon: Clock,
  },
  Closed: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
    icon: XCircle,
  },
};

// Skeleton Component
const VendorRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="ml-4 space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full inline-block" />
    </td>
  </tr>
);

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
      )}
    </div>
    <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

// Filter Dropdown Component
const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {Icon && <Icon size={16} className="text-gray-500" />}
        <span className="text-sm text-gray-700 dark:text-gray-300">{value || label}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    value === option.value
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AllVendors() {
  // State
  const [vendors, setVendors] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, categories: 0 });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modals
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  // Fetch vendors
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: VENDORS_PER_PAGE.toString(),
        sortBy,
        sortOrder,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (availabilityFilter !== "all") params.append("availability", availabilityFilter);

      const response = await fetch(`/api/vendor?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const result = await response.json();
      setVendors(result.data || []);
      setPaginationData(result.pagination);

      // Calculate stats
      if (result.pagination) {
        setStats({
          total: result.pagination.total,
          active: result.data?.filter((v) => v.availabilityStatus === "Available").length || 0,
          categories: new Set(result.data?.map((v) => v.category)).size || 0,
        });
      }
    } catch (err) {
      setError(err.message);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, availabilityFilter, sortBy, sortOrder]);

  useEffect(() => {
    const debounceTimer = setTimeout(
      () => {
        fetchVendors();
      },
      searchQuery ? 300 : 0
    );

    return () => clearTimeout(debounceTimer);
  }, [fetchVendors, triggerRefetch]);

  // Handlers
  const handleAction = (action, vendor) => {
    setSelectedVendor(vendor);
    if (action === "view") setViewModalOpen(true);
    if (action === "edit") setEditModalOpen(true);
    if (action === "delete") setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    setSelectedVendor(null);
    setTriggerRefetch((prev) => !prev);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setSelectedVendor(null);
    setTriggerRefetch((prev) => !prev);
  };

  const handleRefresh = () => {
    setTriggerRefetch((prev) => !prev);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setAvailabilityFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const actionItems = (vendor) => [
    { label: "View Details", icon: Eye, onClick: () => handleAction("view", vendor) },
    { label: "Edit Vendor", icon: Edit, onClick: () => handleAction("edit", vendor) },
    { label: "Delete Vendor", icon: Trash2, onClick: () => handleAction("delete", vendor), isDestructive: true },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "venues", label: "Venues" },
    { value: "photographers", label: "Photographers" },
    { value: "makeup", label: "Makeup" },
    { value: "planners", label: "Planners" },
    { value: "catering", label: "Catering" },
    { value: "clothes", label: "Clothes" },
    { value: "mehendi", label: "Mehendi" },
    { value: "cakes", label: "Cakes" },
    { value: "jewellery", label: "Jewellery" },
    { value: "invitations", label: "Invitations" },
    { value: "djs", label: "DJs" },
    { value: "hairstyling", label: "Hairstyling" },
    { value: "other", label: "Other" },
  ];

  const availabilityOptions = [
    { value: "all", label: "All Status" },
    { value: "Available", label: "Available" },
    { value: "Busy", label: "Busy" },
    { value: "Unavailable", label: "Unavailable" },
    { value: "Closed", label: "Closed" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Date Created" },
    { value: "name", label: "Name" },
    { value: "rating", label: "Rating" },
    { value: "basePrice", label: "Price" },
    { value: "bookings", label: "Bookings" },
  ];

  return (
    <div className="space-y-6 w-[99.9%]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Vendors</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all registered vendors</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total Vendors"
          value={stats.total}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatsCard
          icon={CheckCircle}
          label="Active Vendors"
          value={stats.active}
          trend={12}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatsCard
          icon={Building2}
          label="Categories"
          value={stats.categories}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <StatsCard
          icon={TrendingUp}
          label="This Month"
          value={
            vendors.filter((v) => {
              const date = new Date(v.createdAt);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length
          }
          trend={8}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name, email, or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={categoryFilter === "all" ? "" : categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
              icon={Filter}
            />
            <FilterDropdown
              label="Status"
              options={availabilityOptions}
              value={availabilityFilter === "all" ? "" : availabilityFilter}
              onChange={(val) => {
                setAvailabilityFilter(val);
                setCurrentPage(1);
              }}
              icon={Clock}
            />
            <FilterDropdown
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              icon={TrendingUp}
            />

            {(searchQuery || categoryFilter !== "all" || availabilityFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                Array.from({ length: VENDORS_PER_PAGE }).map((_, i) => <VendorRowSkeleton key={i} />)
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle size={40} className="text-red-400" />
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
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users size={40} className="text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No vendors found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {searchQuery || categoryFilter !== "all" || availabilityFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Add your first vendor to get started"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => {
                  const CategoryIcon = categoryIcons[vendor.category] || FileText;
                  const availability = availabilityConfig[vendor.availabilityStatus] || availabilityConfig.Available;
                  const AvailabilityIcon = availability.icon;

                  return (
                    <tr key={vendor._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            <Image
                              className="h-12 w-12 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                              src={vendor.defaultImage || vendor.images?.[0] || "/placeholder-vendor.jpg"}
                              alt={vendor.name}
                              width={48}
                              height={48}
                            />
                            {vendor.isVerified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                                <CheckCircle size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{vendor.name}</span>
                              {vendor.isFeatured && (
                                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-[10px] font-bold rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            categoryColors[vendor.category] || categoryColors.other
                          }`}
                        >
                          <CategoryIcon size={12} />
                          <span className="capitalize">{vendor.category}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin size={14} className="text-gray-400" />
                          {vendor.address?.city || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {vendor.rating?.toFixed(1) || "0.0"}
                          </span>
                          <span className="text-xs text-gray-400">({vendor.reviews || 0})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${availability.color}`}
                        >
                          <AvailabilityIcon size={12} />
                          {vendor.availabilityStatus || "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{vendor.basePrice?.toLocaleString("en-IN") || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">per {vendor.priceUnit || "day"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu
                          trigger={
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                              <MoreHorizontal size={18} />
                            </button>
                          }
                          items={actionItems(vendor)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {paginationData && paginationData.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationData.totalPages}
          total={paginationData.total}
          limit={VENDORS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      <AnimatePresence>
        {isViewModalOpen && selectedVendor && (
          <ViewVendorModal vendor={selectedVendor} onClose={() => setViewModalOpen(false)} />
        )}
        {isEditModalOpen && selectedVendor && (
          <EditVendorModal
            vendor={selectedVendor}
            onClose={() => setEditModalOpen(false)}
            onSuccess={handleEditSuccess}
          />
        )}
        {isDeleteModalOpen && selectedVendor && (
          <DeleteVendorModal
            vendor={selectedVendor}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Pagination Component
const Pagination = ({ currentPage, totalPages, total, limit, onPageChange }) => {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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
        Showing <span className="font-medium text-gray-900 dark:text-white">{startItem}</span> to{" "}
        <span className="font-medium text-gray-900 dark:text-white">{endItem}</span> of{" "}
        <span className="font-medium text-gray-900 dark:text-white">{total}</span> vendors
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
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
                    ? "bg-blue-600 text-white"
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
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
