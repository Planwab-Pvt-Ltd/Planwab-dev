'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MoreHorizontal, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import DropdownMenu from '../modals/DropdownMenu';
import ViewVendorModal from '../modals/vendors/ViewVendorModal';
import EditVendorModal from '../modals/vendors/EditVendorModal';
import DeleteVendorModal from '../modals/vendors/DeleteVendorModal';

const VENDORS_PER_PAGE = 5;

const VendorRowSkeleton = () => (
    <tr>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="ml-4 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td>
        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td>
        <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" /></td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse inline-block" />
        </td>
    </tr>
);

export default function AllVendors() {
    const [vendors, setVendors] = useState([]);
    const [paginationData, setPaginationData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [triggerRefetch, setTriggerRefetch] = useState(false);

    const fetchVendors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: VENDORS_PER_PAGE.toString(),
            });
            const response = await fetch(`/api/vendor?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch vendors. Please try again later.');
            }
            const result = await response.json();
            setVendors(result.data);
            setPaginationData(result.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors, triggerRefetch]);

    const handleAction = (action, vendor) => {
        setSelectedVendor(vendor);
        if (action === 'view') setViewModalOpen(true);
        if (action === 'edit') setEditModalOpen(true);
        if (action === 'delete') setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        setDeleteModalOpen(false);
        setTriggerRefetch(prev => !prev);
    };

    const actionItems = (vendor) => [
        { label: 'View Details', icon: Eye, onClick: () => handleAction('view', vendor) },
        { label: 'Edit Vendor', icon: Edit, onClick: () => handleAction('edit', vendor) },
        { label: 'Delete Vendor', icon: Trash2, onClick: () => handleAction('delete', vendor), isDestructive: true }
    ];

    const getAvailabilityBadge = (availability) => {
        switch (availability?.toLowerCase()) {
            case 'available':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'unavailable':
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vendor ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Availability</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                Array.from({ length: VENDORS_PER_PAGE }).map((_, i) => <VendorRowSkeleton key={i} />)
                            ) : error ? (
                                <tr><td colSpan="5" className="text-center py-10 text-red-500">{error}</td></tr>
                            ) : vendors.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">No vendors found.</td></tr>
                            ) : (
                                vendors.map((vendor) => (
                                    <tr key={vendor._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <Image className="h-10 w-10 rounded-full object-cover" src={vendor.defaultImage || vendor.images?.[0] || 'https://placehold.co/40x40/cccccc/FFFFFF?text=V'} alt={vendor.name} width={40} height={40} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendor.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{vendor._id}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-gray-200 capitalize">{vendor.category}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getAvailabilityBadge(vendor.availability)}`}>{vendor.availability || 'N/A'}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <DropdownMenu trigger={<button className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><MoreHorizontal className="h-5 w-5" /></button>} items={actionItems(vendor)} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {paginationData && paginationData.totalPages > 1 && <Pagination currentPage={currentPage} totalPages={paginationData.totalPages} onPageChange={setCurrentPage} />}
            <AnimatePresence>
                {isViewModalOpen && <ViewVendorModal vendor={selectedVendor} onClose={() => setViewModalOpen(false)} />}
                {isEditModalOpen && <EditVendorModal vendor={selectedVendor} onClose={() => setEditModalOpen(false)} />}
                {isDeleteModalOpen && <DeleteVendorModal vendor={selectedVendor} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} />}
            </AnimatePresence>
        </>
    );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-between items-center mt-4">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4 mr-2" />Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Next<ChevronRight className="w-4 h-4 ml-2" />
        </button>
    </div>
);