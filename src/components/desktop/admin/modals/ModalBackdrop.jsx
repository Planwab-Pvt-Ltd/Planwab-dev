import { motion } from 'framer-motion';

const ModalBackdrop = ({ children, onClick }) => (
    <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        {children}
    </motion.div>
);

export default ModalBackdrop;