'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import DropdownMenu from '../modals/DropdownMenu';
import ViewEventModal from '../modals/events/ViewEventModal';
import EditEventModal from '../modals/events/EditEventModal';
import DeleteEventModal from '../modals/events/DeleteEventModal';

const EVENTS_PER_PAGE = 5;
const eventsData = [{ id: 'evt-001', name: 'Sharma & Gupta Wedding', client: 'Rohan Sharma', date: '2025-10-15', venue: 'Grand Palace, Mumbai', budget: 500000, status: 'Upcoming', type: 'Wedding' },{ id: 'evt-002', name: 'TechCorp Annual Meet', client: 'TechCorp Inc.', date: '2025-09-20', venue: 'Hyatt Regency, Delhi', budget: 1200000, status: 'Upcoming', type: 'Corporate' },{ id: 'evt-003', name: "Aisha's 5th Birthday", client: 'Sunita Singh', date: '2025-08-30', venue: 'Fun Zone, Indore', budget: 75000, status: 'Completed', type: 'Birthday' },{ id: 'evt-004', name: 'Golden Anniversary Gala', client: 'Mr. & Mrs. Khanna', date: '2025-11-05', venue: 'Taj Lake Palace, Udaipur', budget: 850000, status: 'Planning', type: 'Anniversary' },{ id: 'evt-005', name: 'Startup Pitch Day', client: 'Innovate Hub', date: '2025-08-15', venue: 'WeWork, Bangalore', budget: 300000, status: 'Completed', type: 'Corporate' },{ id: 'evt-006', name: 'Sangeet Ceremony', client: 'Priya Patel', date: '2025-12-01', venue: 'Patel Farmhouse, Gujarat', budget: 250000, status: 'Upcoming', type: 'Wedding' }];

export default function AllEvents() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const totalPages = Math.ceil(eventsData.length / EVENTS_PER_PAGE);
    const paginatedEvents = useMemo(() => { const startIndex = (currentPage - 1) * EVENTS_PER_PAGE; const endIndex = startIndex + EVENTS_PER_PAGE; return eventsData.slice(startIndex, endIndex); }, [currentPage]);
    const handleAction = (action, event) => { setSelectedEvent(event); if (action === 'view') setViewModalOpen(true); if (action === 'edit') setEditModalOpen(true); if (action === 'delete') setDeleteModalOpen(true); };
    const actionItems = (event) => [{ label: 'View Details', icon: Eye, onClick: () => handleAction('view', event) },{ label: 'Edit Event', icon: Edit, onClick: () => handleAction('edit', event) },{ label: 'Delete Event', icon: Trash2, onClick: () => handleAction('delete', event), isDestructive: true }];

    return (
         <>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                         <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event / Client</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Venue</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.name}</div><div className="text-sm text-gray-500 dark:text-gray-400">{event.client}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-gray-200">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500 dark:text-gray-400">{event.venue}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : event.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{event.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><DropdownMenu trigger={<button className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><MoreHorizontal className="h-5 w-5" /></button>} items={actionItems(event)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            <AnimatePresence>{isViewModalOpen && <ViewEventModal event={selectedEvent} onClose={() => setViewModalOpen(false)} />}{isEditModalOpen && <EditEventModal event={selectedEvent} onClose={() => setEditModalOpen(false)} />}{isDeleteModalOpen && <DeleteEventModal event={selectedEvent} onClose={() => setDeleteModalOpen(false)} onConfirm={() => { console.log('Deleting', selectedEvent.id); setDeleteModalOpen(false); }} />}</AnimatePresence>
        </>
    );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-between items-center mt-4"><button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4 mr-2" />Previous</button><span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span><button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Next<ChevronRight className="w-4 h-4 ml-2" /></button></div>
);