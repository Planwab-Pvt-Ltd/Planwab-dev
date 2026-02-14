"use client";

import { useState, useEffect } from "react";
import LeadCaptureModal from "../desktop/LeadCaptureModal";

const ClientModalWrapper = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <LeadCaptureModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      actionType="auto-popup"
      title="Plan Your Perfect Event"
      subtitle="Get started with India's most affordable event planning marketplace"
    />
  );
};

export default ClientModalWrapper;