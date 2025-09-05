'use client';

import { UploadCloud, Building, Mail, Phone, MapPin, Tag } from 'lucide-react';

export default function AddVendor() {
    return (
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">New Vendor Details</h2>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Business Name" id="business-name" icon={Building} placeholder="e.g., Elegant Decorators" />
                    <InputField label="Contact Email" id="contact-email" type="email" icon={Mail} placeholder="e.g., contact@elegant.com" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Phone Number" id="phone-number" type="tel" icon={Phone} placeholder="e.g., +91 98765 43210" />
                    <SelectField label="Vendor Category" id="vendor-category" icon={Tag}>
                        <option>Select a category...</option><option>Catering</option><option>Decoration</option><option>Photography</option><option>Venue</option>
                    </SelectField>
                </div>
                <InputField label="Location / City" id="location" icon={MapPin} placeholder="e.g., Indore, Madhya Pradesh" />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vendor Images</label>
                    <div className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800/50 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload files</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="button" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-lg font-semibold mr-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                    <button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">Add Vendor</button>
                </div>
            </form>
        </div>
    );
}

const InputField = ({ label, id, icon: Icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" /></div>
            <input id={id} {...props} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow" />
        </div>
    </div>
);

const SelectField = ({ label, id, icon: Icon, children }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" /></div>
            <select id={id} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow appearance-none">{children}</select>
        </div>
    </div>
);