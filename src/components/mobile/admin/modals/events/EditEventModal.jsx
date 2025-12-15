import { motion } from 'framer-motion';
import ModalBackdrop from '../ModalBackdrop';
import { X, FileText, User, Calendar, MapPin, DollarSign, Tag } from 'lucide-react';

const dropIn = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { duration: 0.1, type: "spring", damping: 25, stiffness: 500 } },
    exit: { y: "100vh", opacity: 0 },
};

const EditEventModal = ({ event, onClose }) => (
    <ModalBackdrop onClick={onClose}>
        <motion.div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 relative mx-auto" variants={dropIn} initial="hidden" animate="visible" exit="exit">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Edit Event</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <form className="mt-6 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Event Name" id="event-name" icon={FileText} defaultValue={event.name} />
                    <InputField label="Client Name" id="client-name" icon={User} defaultValue={event.client} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Event Date" id="event-date" type="date" icon={Calendar} defaultValue={event.date} />
                    <SelectField label="Event Type" id="event-type" icon={Tag} defaultValue={event.type}>
                        <option>Wedding</option>
                        <option>Anniversary</option>
                        <option>Birthday</option>
                        <option>Corporate</option>
                        <option>Other</option>
                    </SelectField>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Venue / Location" id="venue" icon={MapPin} defaultValue={event.venue} />
                    <InputField label="Budget (INR)" id="budget" type="number" icon={DollarSign} defaultValue={event.budget} />
                </div>
                <div className="flex justify-end pt-4 space-x-3">
                    <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200">
                        Cancel
                    </button>
                    <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </motion.div>
    </ModalBackdrop>
);

const InputField = ({ label, id, icon: Icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <input id={id} {...props} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
        </div>
    </div>
);
const SelectField = ({ label, id, icon: Icon, children, ...props }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <select id={id} {...props} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none">
                {children}
            </select>
        </div>
    </div>
);

export default EditEventModal;

