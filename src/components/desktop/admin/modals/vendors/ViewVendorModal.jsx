import { motion } from 'framer-motion';
import ModalBackdrop from '../ModalBackdrop';
import { X, Building, Mail, Phone, MapPin, Tag, Calendar } from 'lucide-react';

const dropIn = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { duration: 0.1, type: "spring", damping: 25, stiffness: 500 } },
    exit: { y: "100vh", opacity: 0 },
};

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start py-3">
        <Icon className="w-5 h-5 text-indigo-500 mr-4 mt-1" />
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
    </div>
);

const ViewVendorModal = ({ vendor, onClose }) => (
    <ModalBackdrop onClick={onClose}>
        <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 relative mx-auto"
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Vendor Details</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="mt-6">
                <div className="flex items-center mb-6">
                    <img src={vendor.image} alt={vendor.name} className="w-16 h-16 rounded-full object-cover" />
                    <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">{vendor.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{vendor.id}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                    <div className="pr-0 sm:pr-6">
                         <DetailItem icon={Building} label="Business Name" value={vendor.name} />
                         <DetailItem icon={Mail} label="Contact Email" value={vendor.email} />
                         <DetailItem icon={Phone} label="Phone Number" value={vendor.phone} />
                    </div>
                     <div className="pl-0 sm:pl-6">
                        <DetailItem icon={Tag} label="Category" value={vendor.category} />
                        <DetailItem icon={MapPin} label="Location" value={vendor.location} />
                        <DetailItem icon={Calendar} label="Registered On" value={new Date(vendor.registered).toLocaleDateString('en-IN')} />
                    </div>
                </div>
            </div>
        </motion.div>
    </ModalBackdrop>
);

export default ViewVendorModal;
