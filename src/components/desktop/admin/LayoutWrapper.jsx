"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/desktop/admin/Sidebar";
import Header from "@/components/desktop/admin/Header";

export default function AdminLayoutWrapper({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const mainVariants = {
    open: { marginLeft: "260px" },
    closed: { marginLeft: "88px" },
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} />
      <motion.div
        className="flex-1"
        variants={mainVariants}
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="p-6">{children}</main>
      </motion.div>
    </div>
  );
}
