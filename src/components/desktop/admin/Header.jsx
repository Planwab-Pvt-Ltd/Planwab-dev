'use client';

import { Sun, User, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const AnimatedMenuIcon = () => (
    <svg width="23" height="23" viewBox="0 0 23 23">
        <Path variants={{ closed: { d: "M 2 2.5 L 20 2.5" }, open: { d: "M 3 16.5 L 17 2.5" } }} />
        <Path d="M 2 9.423 L 20 9.423" variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} transition={{ duration: 0.1 }} />
        <Path variants={{ closed: { d: "M 2 16.346 L 20 16.346" }, open: { d: "M 3 2.5 L 17 16.346" } }} />
    </svg>
);

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-30">
      <div className="flex items-center justify-between h-20 px-6">
        <motion.button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          whileTap={{ scale: 0.9 }}
          animate={isSidebarOpen ? "open" : "closed"}
        >
          <AnimatedMenuIcon />
        </motion.button>

        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme === 'dark' ? 'moon' : 'sun'}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-6 w-6 text-gray-300" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-700" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-gray-800 dark:text-gray-100">Admin</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Event Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}