import { motion } from 'framer-motion';
import ModalBackdrop from '../ModalBackdrop';
import { X, Mail, MapPin, Calendar, Clock } from 'lucide-react';

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

const ViewUserModal = ({ user, onClose }) => (
    <ModalBackdrop onClick={onClose}>
        <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 relative mx-auto"
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="mt-6">
                <div className="flex items-center mb-6">
                    <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                    <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{user.id}</p>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    <DetailItem icon={Mail} label="Email Address" value={user.email} />
                    <DetailItem icon={MapPin} label="Location" value={user.location} />
                    <DetailItem icon={Calendar} label="Date Registered" value={new Date(user.registered).toLocaleDateString('en-IN')} />
                    <DetailItem icon={Clock} label="Last Login" value={new Date(user.lastLogin).toLocaleDateString('en-IN')} />
                </div>
            </div>
        </motion.div>
    </ModalBackdrop>
);

export default ViewUserModal;
