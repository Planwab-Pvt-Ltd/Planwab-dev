'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { MoreHorizontal, ChevronLeft, ChevronRight, Trash2, Eye } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import DropdownMenu from '../modals/DropdownMenu';
import ViewUserModal from '../modals/users/ViewUserModal';
import DeleteUserModal from '../modals/users/DeleteUserModal';

const USERS_PER_PAGE = 6;
const usersData = [{ id: 'usr-001', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', location: 'Delhi', status: 'Active', image: 'https://placehold.co/40x40/34D399/FFFFFF?text=A', registered: '2023-01-10', lastLogin: '2025-09-05' },{ id: 'usr-002', name: 'Diya Patel', email: 'diya.patel@example.com', location: 'Mumbai', status: 'Active', image: 'https://placehold.co/40x40/F472B6/FFFFFF?text=D', registered: '2023-02-15', lastLogin: '2025-09-04' },{ id: 'usr-003', name: 'Rohan Gupta', email: 'rohan.gupta@example.com', location: 'Bangalore', status: 'Banned', image: 'https://placehold.co/40x40/60A5FA/FFFFFF?text=R', registered: '2023-03-20', lastLogin: '2025-08-20' },{ id: 'usr-004', name: 'Priya Singh', email: 'priya.singh@example.com', location: 'Kolkata', status: 'Active', image: 'https://placehold.co/40x40/A78BFA/FFFFFF?text=P', registered: '2023-04-05', lastLogin: '2025-09-02' },{ id: 'usr-005', name: 'Vikram Reddy', email: 'vikram.reddy@example.com', location: 'Hyderabad', status: 'Inactive', image: 'https://placehold.co/40x40/FBBF24/FFFFFF?text=V', registered: '2023-05-12', lastLogin: '2025-07-15' },{ id: 'usr-006', name: 'Ananya Rao', email: 'ananya.rao@example.com', location: 'Chennai', status: 'Active', image: 'https://placehold.co/40x40/EC4899/FFFFFF?text=A', registered: '2023-06-18', lastLogin: '2025-09-05' },{ id: 'usr-007', name: 'Aditya Kumar', email: 'aditya.kumar@example.com', location: 'Pune', status: 'Active', image: 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=A', registered: '2023-07-22', lastLogin: '2025-09-01' }];

export default function AllUsers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const totalPages = Math.ceil(usersData.length / USERS_PER_PAGE);
    const paginatedUsers = useMemo(() => { const startIndex = (currentPage - 1) * USERS_PER_PAGE; const endIndex = startIndex + USERS_PER_PAGE; return usersData.slice(startIndex, endIndex); }, [currentPage]);
    const handleAction = (action, user) => { setSelectedUser(user); if (action === 'view') setViewModalOpen(true); if (action === 'delete') setDeleteModalOpen(true); };
    const actionItems = (user) => [{ label: 'View Details', icon: Eye, onClick: () => handleAction('view', user) },{ label: 'Delete User', icon: Trash2, onClick: () => handleAction('delete', user), isDestructive: true }];

    return (
        <>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                         <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10"><Image className="h-10 w-10 rounded-full object-cover" src={user.image} alt={user.name} width={40} height={40} /></div><div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div><div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div></div></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{user.id}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-gray-200">{user.location}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : user.status === 'Banned' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>{user.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><DropdownMenu trigger={<button className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><MoreHorizontal className="h-5 w-5" /></button>} items={actionItems(user)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            <AnimatePresence>{isViewModalOpen && <ViewUserModal user={selectedUser} onClose={() => setViewModalOpen(false)} />}{isDeleteModalOpen && <DeleteUserModal user={selectedUser} onClose={() => setDeleteModalOpen(false)} onConfirm={() => { console.log('Deleting', selectedUser.id); setDeleteModalOpen(false); }} />}</AnimatePresence>
        </>
    );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-between items-center mt-4"><button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4 mr-2" />Previous</button><span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span><button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Next<ChevronRight className="w-4 h-4 ml-2" /></button></div>
);