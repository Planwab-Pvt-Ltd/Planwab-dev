'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Users, Briefcase, Settings, Star } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Vendors', href: '/admin/vendors', icon: Briefcase },
  { name: 'Users', href: '/admin/users', icon: Users },
];

const sidebarVariants = {
  open: { width: '260px' },
  closed: { width: '88px' },
};

const textVariants = {
  hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } },
};

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed top-0 left-0 flex flex-col z-40 shadow-lg"
    >
      <Link href={'/'} className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <Star className={`text-3xl text-indigo-500 transition-transform duration-500 ${isOpen ? "rotate-0" : "rotate-180"}`} />
          <AnimatePresence>
            {isOpen && (
                <motion.h1
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent ml-2"
                >
                  PlanWAB
                </motion.h1>
            )}
          </AnimatePresence>
      </Link>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative ${isActive ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
                >
                    {isActive && 
                        <motion.div 
                            layoutId="active-pill" 
                            className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    }
                    <item.icon className={`h-6 w-6 shrink-0 ${isOpen ? 'ml-3' : 'mx-auto'}`} />
                    <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="ml-4 whitespace-nowrap"
                        >
                        {item.name}
                        </motion.span>
                    )}
                    </AnimatePresence>
                </Link>
            );
        })}
      </nav>

       <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
             <Link
                href="/admin/settings"
                className={`flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${pathname === '/admin/settings' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
            >
                <Settings className={`h-6 w-6 shrink-0 ${isOpen ? 'ml-3' : 'mx-auto'}`} />
                <AnimatePresence>
                {isOpen && (
                    <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="ml-4 whitespace-nowrap"
                    >
                    Settings
                    </motion.span>
                )}
                </AnimatePresence>
            </Link>
       </div>
    </motion.aside>
  );
}