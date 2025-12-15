"use client";

import AllUsers from "@/components/desktop/admin/users/AllUsers";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage all registered users on the platform.</p>
      </div>
      <AllUsers />
    </div>
  );
}
