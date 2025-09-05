'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { MoreHorizontal, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import DropdownMenu from '../modals/DropdownMenu';
import ViewVendorModal from '../modals/vendors/ViewVendorModal';
import EditVendorModal from '../modals/vendors/EditVendorModal';
import DeleteVendorModal from '../modals/vendors/DeleteVendorModal';

const VENDORS_PER_PAGE = 5;
const vendorsData = [{ id: 'ven-001', name: 'Royal Catering', email: 'contact@royalcatering.com', category: 'Catering', location: 'Indore', status: 'Active', image: 'https://placehold.co/40x40/A78BFA/FFFFFF?text=R', phone: '+91 98765 43210', registered: '2023-01-15' },{ id: 'ven-002', name: 'Dream Decor', email: 'info@dreamdecor.in', category: 'Decoration', location: 'Bhopal', status: 'Active', image: 'https://placehold.co/40x40/F472B6/FFFFFF?text=D', phone: '+91 98765 43211', registered: '2023-02-20' },{ id: 'ven-003', name: 'Pixel Perfect', email: 'bookings@pixel.com', category: 'Photography', location: 'Indore', status: 'Inactive', image: 'https://placehold.co/40x40/60A5FA/FFFFFF?text=P', phone: '+91 98765 43212', registered: '2023-03-10' },{ id: 'ven-004', name: 'Grand Palace', email: 'events@grandpalace.com', category: 'Venue', location: 'Mumbai', status: 'Active', image: 'https://placehold.co/40x40/34D399/FFFFFF?text=G', phone: '+91 98765 43213', registered: '2023-04-05' },{ id: 'ven-005', name: 'Sweet Treats', email: 'orders@sweettreats.com', category: 'Catering', location: 'Indore', status: 'Pending', image: 'https://placehold.co/40x40/FBBF24/FFFFFF?text=S', phone: '+91 98765 43214', registered: '2023-05-25' },{ id: 'ven-006', name: 'Moment Makers', email: 'contact@momentmakers.com', category: 'Photography', location: 'Delhi', status: 'Active', image: 'https://placehold.co/40x40/EC4899/FFFFFF?text=M', phone: '+91 98765 43215', registered: '2023-06-18' },{ id: 'ven-007', name: 'Elegant Venues', email: 'contact@elegantvenues.com', category: 'Venue', location: 'Bangalore', status: 'Active', image: 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=E', phone: '+91 98765 43216', registered: '2023-07-22' }];

export default function AllVendors() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const totalPages = Math.ceil(vendorsData.length / VENDORS_PER_PAGE);
    const paginatedVendors = useMemo(() => { const startIndex = (currentPage - 1) * VENDORS_PER_PAGE; const endIndex = startIndex + VENDORS_PER_PAGE; return vendorsData.slice(startIndex, endIndex); }, [currentPage]);
    const handleAction = (action, vendor) => { setSelectedVendor(vendor); if (action === 'view') setViewModalOpen(true); if (action === 'edit') setEditModalOpen(true); if (action === 'delete') setDeleteModalOpen(true); };
    const actionItems = (vendor) => [{ label: 'View Details', icon: Eye, onClick: () => handleAction('view', vendor) },{ label: 'Edit Vendor', icon: Edit, onClick: () => handleAction('edit', vendor) },{ label: 'Delete Vendor', icon: Trash2, onClick: () => handleAction('delete', vendor), isDestructive: true }];

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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10"><Image className="h-10 w-10 rounded-full object-cover" src={vendor.image} alt={vendor.name} width={40} height={40} /></div>
                                            <div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendor.name}</div><div className="text-sm text-gray-500 dark:text-gray-400">{vendor.email}</div></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{vendor.id}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-gray-200">{vendor.category}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : vendor.status === 'Inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{vendor.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><DropdownMenu trigger={<button className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><MoreHorizontal className="h-5 w-5" /></button>} items={actionItems(vendor)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            <AnimatePresence>{isViewModalOpen && <ViewVendorModal vendor={selectedVendor} onClose={() => setViewModalOpen(false)} />}{isEditModalOpen && <EditVendorModal vendor={selectedVendor} onClose={() => setEditModalOpen(false)} />}{isDeleteModalOpen && <DeleteVendorModal vendor={selectedVendor} onClose={() => setDeleteModalOpen(false)} onConfirm={() => { console.log('Deleting', selectedVendor.id); setDeleteModalOpen(false); }} />}</AnimatePresence>
        </>
    );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-between items-center mt-4">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4 mr-2" />Previous</button>
        <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Next<ChevronRight className="w-4 h-4 ml-2" /></button>
    </div>
);