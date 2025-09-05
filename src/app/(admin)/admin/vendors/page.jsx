'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, PlusCircle } from 'lucide-react';
import AddVendor from '@/components/admin/vendors/addVendor';
import AllVendors from '@/components/admin/vendors/AllVendors';

export default function VendorsPage() {
    const [activeTab, setActiveTab] = useState('all');

    return (
       <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manage Vendors</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Add new vendors or view existing ones in your marketplace.</p>
            </div>
            
            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
                <TabButton label="All Vendors" icon={List} isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                <TabButton label="Add Vendor" icon={PlusCircle} isActive={activeTab === 'add'} onClick={() => setActiveTab('add')} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'all' ? <AllVendors /> : <AddVendor />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

const TabButton = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold transition-colors relative focus:outline-none ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
        {isActive && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" layoutId="underline" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />}
    </button>
);