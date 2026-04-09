"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
  Film,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AllReelSections({ onEditSection, refreshTrigger }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);
  
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/reels/reel-sections?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch sections");
      
      const result = await response.json();
      setSections(result.data || []);
      setPaginationData(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSections(), 300);
    return () => clearTimeout(timer);
  }, [fetchSections, refreshTrigger]);

  const handleDeleteClick = (section) => {
    setSectionToDelete(section);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sectionToDelete) return;
    try {
      await fetch(`/api/reels/reel-sections/${sectionToDelete._id}`, { method: "DELETE" });
      fetchSections();
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setDeleteModalOpen(false);
      setSectionToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sections by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
          />
        </div>
        <button
          onClick={fetchSections}
          className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-semibold">Title & Subtitle</th>
                <th className="px-4 py-3 font-semibold">Target Filters</th>
                <th className="px-4 py-3 font-semibold">Attached Reels</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading sections...</td></tr>
              ) : sections.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No sections found. Create one above!</td></tr>
              ) : (
                sections.map((section) => (
                  <tr key={section._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 dark:text-white">{section.title}</p>
                      {section.subtitle && <p className="text-xs text-gray-500">{section.subtitle}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs">
                        {section.category && <span className="text-violet-600 dark:text-violet-400 capitalize">• {section.category}</span>}
                        {section.type && <span className="text-indigo-600 dark:text-indigo-400 capitalize">• {section.type}</span>}
                        {!section.category && !section.type && <span className="text-gray-400">Global</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
                        <Film size={14} className="text-gray-500" />
                        <span className="font-medium">{section.linkedReels?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {section.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onEditSection(section._id)}
                        className="p-1.5 text-gray-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg mr-1"
                        title="Edit Section"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(section)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                        title="Delete Section"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {paginationData?.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
            <span className="text-gray-500">Page {currentPage} of {paginationData.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"><ChevronLeft size={16} /></button>
              <button disabled={currentPage === paginationData.totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-full"><AlertTriangle size={24} /></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Section</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm mb-6 text-gray-600 dark:text-gray-300">Are you sure you want to delete <span className="font-semibold">{sectionToDelete?.title}</span>?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-medium">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}