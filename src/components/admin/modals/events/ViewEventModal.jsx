import { motion } from 'framer-motion';
import ModalBackdrop from '../ModalBackdrop';
import { X, FileText, User, Calendar, MapPin, DollarSign, Tag } from 'lucide-react';

const dropIn = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { duration: 0.1, type: "spring", damping: 25, stiffness: 500 } },
    exit: { y: "100vh", opacity: 0 },
};

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start py-3"><Icon className="w-5 h-5 text-indigo-500 mr-4 mt-1" /><div><p className="text-xs text-gray-500">{label}</p><p className="text-sm font-medium text-gray-800">{value}</p></div></div>
);

const ViewEventModal = ({ event, onClose }) => (
    <ModalBackdrop onClick={onClose}>
        <motion.div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 relative mx-auto" variants={dropIn} initial="hidden" animate="visible" exit="exit">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200"><h2 className="text-xl font-bold text-gray-900">Event Details</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
            <div className="mt-6">
                <div className="mb-6"><h3 className="text-lg font-bold text-gray-900">{event.name}</h3><p className="text-sm text-gray-500 font-mono">{event.id}</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <div className="pr-0 sm:pr-6"><DetailItem icon={User} label="Client Name" value={event.client} /><DetailItem icon={Calendar} label="Event Date" value={new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} /> <DetailItem icon={Tag} label="Event Type" value={event.type} /></div>
                     <div className="pl-0 sm:pl-6"><DetailItem icon={MapPin} label="Venue" value={event.venue} /><DetailItem icon={DollarSign} label="Budget" value={`₹ ${event.budget.toLocaleString('en-IN')}`} /><DetailItem icon={FileText} label="Status" value={event.status} /></div>
                </div>
            </div>
        </motion.div>
    </ModalBackdrop>
);

export default ViewEventModal;
