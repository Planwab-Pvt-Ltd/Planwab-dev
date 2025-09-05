'use client';

import { FileText, User, Calendar, MapPin, DollarSign, Tag } from 'lucide-react';

export default function AddEvent() {
    return (
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">New Event Details</h2>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><InputField label="Event Name" id="event-name" icon={FileText} placeholder="e.g., Sharma Wedding" /><InputField label="Client Name" id="client-name" icon={User} placeholder="e.g., Rohan Sharma" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><InputField label="Event Date" id="event-date" type="date" icon={Calendar} /><SelectField label="Event Type" id="event-type" icon={Tag}><option>Select a type...</option><option>Wedding</option><option>Anniversary</option><option>Birthday</option><option>Corporate</option><option>Other</option></SelectField></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><InputField label="Venue / Location" id="venue" icon={MapPin} placeholder="e.g., Grand Palace, Mumbai" /><InputField label="Budget (INR)" id="budget" type="number" icon={DollarSign} placeholder="e.g., 500000" /></div>
                <div className="flex justify-end pt-4"><button type="button" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-lg font-semibold mr-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button><button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">Add Event</button></div>
            </form>
        </div>
    );
}

const InputField = ({ label, id, icon: Icon, ...props }) => (
    <div><label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" /></div><input id={id} {...props} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow" /></div></div>
);

const SelectField = ({ label, id, icon: Icon, children }) => (
     <div><label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" /></div><select id={id} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow appearance-none">{children}</select></div></div>
);