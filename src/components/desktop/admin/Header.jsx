"use client";

import { Sun, User, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { SignedIn, UserButton, UserProfile, useUser } from "@clerk/clerk-react";

const textVariants = {
  hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } },
};

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-30">
      <div className="flex items-center justify-between h-20 px-6">
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent ml-2"
        >
          PlanWAB
        </motion.h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 pt-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme === "dark" ? "moon" : "sun"}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? (
                  <Sun className="h-6 w-6 text-gray-300" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-700" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
          <div className="flex items-center justify-center space-x-3">
            <SignedIn>
              <div className="rounded-full pt-1">
                <UserButton />
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-gray-800 dark:text-gray-100">{user?.firstName}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
